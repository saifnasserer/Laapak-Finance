require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve HTML files from the 'views' directory
app.use(express.static(path.join(__dirname, 'views')));

// Simple route for the root to redirect to the dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// API Routes
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/expenses', expenseRoutes);

const receivableRoutes = require('./routes/receivableRoutes');
app.use('/api/receivables', receivableRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
