CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE,
  base_cost DECIMAL(10,2) NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  extra_cost DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  expense_name VARCHAR(100),
  amount DECIMAL(10,2),
  category VARCHAR(50),
  date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_name VARCHAR(100),
  base_cost DECIMAL(10,2) NOT NULL,
  total_expenses DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  item_name VARCHAR(100),
  item_price DECIMAL(10,2),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

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
