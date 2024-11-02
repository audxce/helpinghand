CREATE DATABASE IF NOT EXISTS UserDatabase;
USE UserDatabase;

CREATE TABLE IF NOT EXISTS VolunteerHistory (
    volunteer_history_id INT AUTO_INCREMENT PRIMARY KEY,
    volunteer_name VARCHAR(50) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    participation_status ENUM('Pending', 'Completed', 'Cancelled') NOT NULL,
    duration_hours DECIMAL(4, 2) CHECK (duration_hours >= 0),
    location VARCHAR(100),
    required_skills JSON,
    urgency ENUM('Low', 'Medium', 'High') NOT NULL,
    event_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
