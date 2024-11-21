CREATE DATABASE IF NOT EXISTS event_management;
USE event_management;

CREATE TABLE IF NOT EXISTS EventDetails (
    EventID INT AUTO_INCREMENT PRIMARY KEY,
    eventName VARCHAR(255) NOT NULL,
    eventDescription TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    requiredSkills VARCHAR(255),
    urgency ENUM('Low', 'Medium', 'High') NOT NULL,
    eventDate DATE NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    repeatEvent ENUM('None', 'Daily', 'Weekly', 'Monthly') NOT NULL
);

-- Sample data to test the setup
INSERT INTO EventDetails (eventName, eventDescription, location, requiredSkills, urgency, eventDate, startTime, endTime, repeatEvent)
VALUES 
    ('Community Clean-up', 'Clean up local parks', 'City Park', 'Teamwork, Physical Fitness', 'High', '2024-12-01', '09:00:00', '12:00:00', 'None'),
    ('Food Drive', 'Collect food donations', 'Food Bank', 'Organizing, Communication', 'Medium', '2024-11-15', '10:00:00', '16:00:00', 'Weekly');
