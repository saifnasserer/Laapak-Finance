You are an AI developer building the full version of Laapak Finance, a financial management system focused on cash flow, profitability, and financial visibility for a growing tech business.

🟢 Project Overview:
The system's goal is to track every pound that enters or leaves the company.
It’s divided into key financial sections to cover:

Orders

Expenses

Future receivables

Recurring payments

Project profitability

Dashboard analytics

Basic smart alerts (optional)

No need for multi-user accounts or authentication at this stage.
Also, do not include any sections for Payables, Attachments, or Notes management.

5. Dashboard Analytics
Visualize financial health with dynamic charts and key metrics.

- **Key Metrics Cards:**
  - **Total Revenue:** Sum of `selling_price` from all orders.
  - **Total Expenses:** Sum of `amount` from all expenses.
  - **Net Profit:** Total Revenue - Total Expenses.
  - **Upcoming Receivables:** Sum of `amount` from receivables where `status` is 'Due' or 'Overdue'.

- **Revenue vs. Expenses Chart (Line Chart):**
  - **X-Axis:** Last 30 days.
  - **Y-Axis:** Amount in EGP.
  - **Series 1 (Revenue):** Daily sum of `selling_price` from `orders`.
  - **Series 2 (Expenses):** Daily sum of `amount` from `expenses`.

- **Expense Breakdown (Donut Chart):**
  - Shows the percentage distribution of expenses across different `category` fields.

- **Monthly Profitability (Bar Chart):**
  - **X-Axis:** Months of the current year.
  - **Y-Axis:** Net Profit in EGP.
  - **Bars:** Calculated as (Total Monthly Revenue - Total Monthly Expenses).

✅ PHASE 1: Generate To-Do List First
Before coding, generate a clear To-Do List for the following modules.

1. Orders
Track each order with full cost structure and profit calculation.

Database Table: orders

sql
Copy
Edit
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE,
  base_cost DECIMAL(10,2) NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  extra_cost DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);
Derived field: net_profit = selling_price - (base_cost + extra_cost)

2. General Expenses
For non-order-related company expenses.

Database Table: expenses

sql
Copy
Edit
CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  expense_name VARCHAR(100),
  amount DECIMAL(10,2),
  category VARCHAR(50),
  date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
3. Projects
Track income and cost items per project to analyze profitability.

Database Table: projects

sql
Copy
Edit
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_name VARCHAR(100),
  base_cost DECIMAL(10,2) NOT NULL,
  total_expenses DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Database Table: project_items

sql
Copy
Edit
CREATE TABLE project_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  item_name VARCHAR(100),
  item_price DECIMAL(10,2),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
4. Receivables
Track future income from clients (invoices, cheques, contracts, etc.)

Database Table: receivables

sql
Copy
Edit
CREATE TABLE receivables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(100),
  amount DECIMAL(10,2),
  due_date DATE,
  payment_method VARCHAR(50),
  status ENUM('pending', 'late', 'paid') DEFAULT 'pending',
  contact_person VARCHAR(100),
  contact_phone VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
5. Recurring Payments
Track fixed, repeatable payments like rent or subscriptions.

Database Table: recurring_payments

sql
Copy
Edit
CREATE TABLE recurring_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  amount DECIMAL(10,2),
  frequency VARCHAR(20), -- e.g., 'monthly', 'quarterly'
  next_due_date DATE,
  paid_this_cycle BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
6. Dashboard
Displays metrics from above modules:

Monthly totals (orders, expenses, receivables)

Net profit

Expense categories pie chart

Upcoming receivables

Recurring payments due this month

No separate table required.

🧱 Project Structure Guidelines
Structure the code into clean, maintainable components:

markdown
Copy
Edit
/public
  /css
    - styles.css
  /js
    - main.js
/views
  - dashboard.html
  - orders.html
  - expenses.html
  - receivables.html
  - recurring.html
  - projects.html
/routes
  - api endpoints (Node.js)
  - organized by module
/controllers
/models
Use Bootstrap 5 + custom CSS

Use modular HTML (one file per view/component)

Backend is Node.js with Express

Database is MySQL, use .env config for connection

🧪 Deliverables
MySQL-compatible schema

Working backend APIs (CRUD for each module)

HTML pages per module

Separate CSS and JS files

Responsive design

Clean code structure

