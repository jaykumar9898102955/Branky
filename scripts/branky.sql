-- Branky-Stem MySQL schema
-- Run this once in phpMyAdmin (hPanel) or via:
--   mysql -u <user> -p <db_name> < scripts/init-db.sql

CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studentName VARCHAR(255) NOT NULL,
  parentName VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  age VARCHAR(50) NOT NULL,
  program VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  source VARCHAR(100) NOT NULL DEFAULT 'Website',
  message TEXT,
  status ENUM('new','reviewed','confirmed','waitlist') NOT NULL DEFAULT 'new',
  notes TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_email_program (email, program),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
