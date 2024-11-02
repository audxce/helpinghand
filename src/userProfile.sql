CREATE DATABASE IF NOT EXISTS UserDatabase;

CREATE TABLE IF NOT EXISTS UserProfile (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(50) NOT NULL,
    address VARCHAR(100),
    address_two VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(2),
    zipcode VARCHAR(10),
    skills JSON,
    availability JSON,
    preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);