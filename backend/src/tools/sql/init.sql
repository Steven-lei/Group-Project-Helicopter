-- init.sql
DROP TABLE IF EXISTS groupmember;

CREATE TABLE IF NOT EXISTS groupmember (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender ENUM('male', 'female') DEFAULT 'male',
    role VARCHAR(32) DEFAULT 'member',
    avatar_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO groupmember (name, gender, role) VALUES
('Pengfei Ye', 'male', 'Team Leader'),
('Fanfan', 'female', 'Java Specialist'),
('Steven_Lei', 'male', 'member'),
('Shu', 'male', 'member'),
('Zhurui Yang', 'male', 'member'),
('Haonan Luo', 'male', 'member');