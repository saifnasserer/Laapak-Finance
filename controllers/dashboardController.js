const db = require('../config/db');

exports.getDashboardData = async (req, res) => {
    try {
        // 1. Key Financial Metrics
        const [[revenueData]] = await db.query('SELECT SUM(selling_price) as totalRevenue FROM orders');
        const [[expensesData]] = await db.query('SELECT SUM(amount) as totalExpenses FROM expenses');
        const [[receivablesData]] = await db.query("SELECT SUM(amount) as upcomingReceivables FROM receivables WHERE status = 'Due'");

        const totalRevenue = revenueData.totalRevenue || 0;
        const totalExpenses = expensesData.totalExpenses || 0;
        const netProfit = totalRevenue - totalExpenses;
        const upcomingReceivables = receivablesData.upcomingReceivables || 0;



        // 3. Revenue vs. Expenses for the Last 30 Days
        const [dailyFinancials] = await db.query(`
            WITH RECURSIVE dates AS (
                SELECT CURDATE() - INTERVAL 29 DAY as day
                UNION ALL
                SELECT day + INTERVAL 1 DAY
                FROM dates
                WHERE day < CURDATE()
            )
            SELECT 
                d.day,
                COALESCE(SUM(o.selling_price), 0) AS daily_revenue,
                COALESCE(SUM(e.amount), 0) AS daily_expenses
            FROM dates d
            LEFT JOIN orders o ON DATE(o.created_at) = d.day
            LEFT JOIN expenses e ON DATE(e.expense_date) = d.day
            GROUP BY d.day
            ORDER BY d.day;
        `);

        // 4. Monthly Profitability for the Current Year
        const [monthlyRevenues] = await db.query(`
            SELECT MONTH(created_at) as month, SUM(selling_price) as total
            FROM orders
            WHERE YEAR(created_at) = YEAR(CURDATE())
            GROUP BY MONTH(created_at)
        `);

        const [monthlyExpenses] = await db.query(`
            SELECT MONTH(expense_date) as month, SUM(amount) as total
            FROM expenses
            WHERE YEAR(expense_date) = YEAR(CURDATE())
            GROUP BY MONTH(expense_date)
        `);

        const monthlyProfitability = Array.from({ length: 12 }, (_, i) => {
            const month = i + 1;
            const revenueData = monthlyRevenues.find(r => r.month === month);
            const expenseData = monthlyExpenses.find(e => e.month === month);
            return {
                month: month,
                monthly_revenue: parseFloat(revenueData?.total || 0),
                monthly_expenses: parseFloat(expenseData?.total || 0),
            };
        });

        res.json({
            keyMetrics: {
                totalRevenue,
                totalExpenses,
                netProfit,
                upcomingReceivables
            },

            dailyFinancials,
            monthlyProfitability
        });

    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        res.status(500).json({ error: 'Server error while fetching dashboard data.' });
    }
};
