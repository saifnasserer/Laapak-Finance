/* public/js/dashboard.js */
document.addEventListener('DOMContentLoaded', function () {

    // --- 1. Dynamic Welcome Message & Live Clock ---
    const welcomeMessageEl = document.getElementById('welcome-message');
    const dateTimeEl = document.getElementById('date-time');

    function updateWelcome() {
        const now = new Date();
        const hour = now.getHours();
        let greeting;

        if (hour < 12) {
            greeting = "صباح الفل، يا مدير الحسابات!"; // Good morning, accounts manager!
        } else if (hour < 18) {
            greeting = "نهارك سعيد، يلا نشوف الفلوس عملت إيه."; // Happy day, let's see what the money did.
        } else {
            greeting = "مساء العظمة، استعرض خزائنك يا نجم."; // Evening of greatness, review your treasures, star.
        }
        welcomeMessageEl.textContent = greeting;

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        dateTimeEl.textContent = now.toLocaleDateString('ar-EG', options);
    }

    updateWelcome();
    setInterval(updateWelcome, 60000);

    // --- Chart.js Global Config ---
    Chart.defaults.font.family = "'Cairo', 'Tajawal', sans-serif";
    Chart.defaults.color = '#6c757d';

    const laapakColors = {
        primary: 'rgba(14, 175, 84, 0.8)',
        primary_light: 'rgba(14, 175, 84, 0.2)',
        danger: 'rgba(220, 53, 69, 0.8)',
        warning: 'rgba(255, 193, 7, 0.8)',
        info: 'rgba(13, 202, 240, 0.8)',
        secondary: 'rgba(108, 117, 125, 0.8)',
        pie: ['#0eaf54', '#ffc107', '#dc3545', '#0dcaf0', '#6c757d']
    };

    // --- Utility Functions ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount || 0);
    };

    // --- Chart Instances ---
    let monthlyRevenueChart, expenseBreakdownChart, projectMarginsChart, receivablesTimelineChart, recurringPaymentsChart;

    // --- Main Data Fetch and Render Function ---
    async function initializeDashboard() {
        try {
            const response = await fetch('/api/dashboard');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            // 1. Update Key Metrics Cards
            document.getElementById('total-revenue').textContent = formatCurrency(data.keyMetrics.totalRevenue);
            document.getElementById('total-expenses').textContent = formatCurrency(data.keyMetrics.totalExpenses);
            document.getElementById('net-profit').textContent = formatCurrency(data.keyMetrics.netProfit);
            document.getElementById('upcoming-receivables').textContent = formatCurrency(data.keyMetrics.upcomingReceivables);

            // 2. Update Charts with Live Data
            updateMonthlyRevenueChart(data.monthlyProfitability);
            // Future: update other charts when their data is available in the API

        } catch (error) {
            console.error('Failed to fetch and update dashboard data:', error);
        }
    }

    // --- Chart Initialization and Update Functions ---

    function updateMonthlyRevenueChart(monthlyData) {
        const monthlyRevenueCtx = document.getElementById('monthlyRevenueChart')?.getContext('2d');
        if (!monthlyRevenueCtx) return;

        const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        const labels = monthlyData.map(d => monthNames[d.month - 1]);
        const revenues = monthlyData.map(d => d.monthly_revenue);

        monthlyRevenueChart = new Chart(monthlyRevenueCtx, {
            type: 'line',
            data: { labels, datasets: [{ label: 'الإيرادات', data: revenues, backgroundColor: laapakColors.primary_light, borderColor: laapakColors.primary, borderWidth: 3, fill: true, tension: 0.4 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
    }

    function initializePlaceholderCharts() {
        const expenseBreakdownCtx = document.getElementById('expenseBreakdownChart')?.getContext('2d');
        if (expenseBreakdownCtx) {
            expenseBreakdownChart = new Chart(expenseBreakdownCtx, {
                type: 'doughnut',
                data: { labels: ['مصاريف مكتب', 'رواتب', 'تسويق'], datasets: [{ data: [40, 35, 25], backgroundColor: laapakColors.pie, borderColor: '#fff' }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
            });
        }

        const projectMarginsCtx = document.getElementById('projectMarginsChart')?.getContext('2d');
        if (projectMarginsCtx) {
            projectMarginsChart = new Chart(projectMarginsCtx, {
                type: 'bar',
                data: { labels: ['مشروع أ', 'مشروع ب', 'مشروع ج'], datasets: [{ label: 'هامش الربح (%)', data: [45, 60, 30], backgroundColor: [laapakColors.primary, laapakColors.warning, laapakColors.danger] }] },
                options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } } }
            });
        }

        const receivablesTimelineCtx = document.getElementById('receivablesTimelineChart')?.getContext('2d');
        if (receivablesTimelineCtx) {
            receivablesTimelineChart = new Chart(receivablesTimelineCtx, {
                type: 'bar',
                data: { labels: ['العميل س', 'العميل ص'], datasets: [{ label: 'أيام حتى الاستحقاق', data: [10, 25], backgroundColor: laapakColors.info }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
            });
        }

        const recurringPaymentsCtx = document.getElementById('recurringPaymentsChart')?.getContext('2d');
        if (recurringPaymentsCtx) {
            recurringPaymentsChart = new Chart(recurringPaymentsCtx, {
                type: 'polarArea',
                data: { labels: ['اشتراكات', 'إيجار', 'خدمات'], datasets: [{ data: [5000, 12000, 2500], backgroundColor: [laapakColors.primary, laapakColors.secondary, laapakColors.warning] }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
            });
        }
    }

    // --- Run Everything ---
    initializePlaceholderCharts(); // Draw charts immediately with placeholders
    initializeDashboard(); // Then, fetch live data and update them
});
