-- Drop existing tables if they exist
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS stores;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400),
    role ENUM('admin', 'user', 'store_owner') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create stores table
CREATE TABLE stores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400),
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create ratings table
CREATE TABLE ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_store_rating (user_id, store_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user
-- Password: Admin@123
INSERT INTO users (name, email, password, address, role) VALUES 
('System Administrator', 'admin@admin.com', '$2a$10$NSNnFZ7jogOEgdb0n3GdTeAY0tGIseyJnwdcuWvEEYQoWiRGq/AFW', '123 Admin Street', 'admin');

-- Insert sample stores for testing
INSERT INTO stores (name, email, address) VALUES 
('Pizza Palace Downtown Branch', 'contact@pizzapalace.com', '123 Main Street, Downtown City'),
('Tech Gadgets Electronics Store', 'info@techgadgets.com', '456 Technology Avenue, Tech District'),
('Fresh Mart Grocery Supermarket', 'support@freshmart.com', '789 Market Road, Green Valley'),
('Ranchors Das Coffee Store', 'ranchor@gmail.com', 'Sewagram Road Wardha, Ward No.6');

-- Insert a sample store owner user
INSERT INTO users (name, email, password, address, role) VALUES 
('John Store Owner Manager', 'owner@pizzapalace.com', '$2a$10$K8BNJrNn7pWzZnHcqD8.7.dWcvZhJiP3HiFp8n6FKtWLXmcKxPGdS', '123 Main Street, Downtown City', 'store_owner'),
('Ranjhor das sharma Junior 1', 'ranchor@gmail.com', '$2a$10$sMlrPMoC5rZ0zQTL6dPaf.cJt28zNYDyGiByxdCOEzuvI0jMn/iAq', 'Sewagram Road Wardha', 'store_owner');

-- Link the store owner to Pizza Palace
UPDATE stores SET owner_id = (SELECT id FROM users WHERE email = 'owner@pizzapalace.com') WHERE email = 'contact@pizzapalace.com';
UPDATE stores SET owner_id = (SELECT id FROM users WHERE email = 'ranchor@gmail.com') WHERE email = 'ranchor@gmail.com';

-- Insert sample normal users for testing
INSERT INTO users (name, email, password, address, role) VALUES 
('Alice Johnson Customer User', 'alice@example.com', '$2a$10$K8BNJrNn7pWzZnHcqD8.7.dWcvZhJiP3HiFp8n6FKtWLXmcKxPGdS', '321 Residential Street, Suburb Area', 'user'),
('Bob Smith Regular Customer', 'bob@example.com', '$2a$10$K8BNJrNn7pWzZnHcqD8.7.dWcvZhJiP3HiFp8n6FKtWLXmcKxPGdS', '654 Customer Lane, City Center', 'user'),
('Mayur Rajurao Kalbande', 'mayur@gmail.com', '$2a$10$YPMpKWmm8AW9jq9WtAplg.ITV0jGpiwkB3KJBLSdDD6cmlbrjtR6K', 'Sewagram Road Wardha, Ward No.6', 'user');

-- Insert sample ratings for testing
INSERT INTO ratings (user_id, store_id, rating) VALUES 
(4, 1, 5),  -- Alice rates Pizza Palace 5 stars
(5, 1, 4),  -- Bob rates Pizza Palace 4 stars
(4, 2, 3),  -- Alice rates Tech Gadgets 3 stars
(5, 3, 5);  -- Bob rates Fresh Mart 5 stars

-- Verify the setup
SELECT 'Setup completed successfully!' as Status;
SELECT 'Admin Login: admin@admin.com / Admin@123' as AdminCredentials;
SELECT 'Store Owner Login: owner@pizzapalace.com / Admin@123' as StoreOwnerCredentials;
SELECT 'User Login: alice@example.com / Admin@123' as UserCredentials;