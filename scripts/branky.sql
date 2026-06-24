-- Branky-Stem MySQL schema
-- Run this once in phpMyAdmin (hPanel) or via:
--   mysql -u <user> -p <db_name> < scripts/init-db.sql

CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studentName VARCHAR(255) NOT NULL,
  parentName VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  age VARCHAR(50) NOT NULL,
  program VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  source VARCHAR(100) NOT NULL DEFAULT 'Website',
  message TEXT,
  status ENUM('new','reviewed','confirmed','waitlist') NOT NULL DEFAULT 'new',
  notes TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS fees (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  registrationId INT NOT NULL,
  label         VARCHAR(255) NOT NULL DEFAULT 'Program Fee',
  amount        DECIMAL(10,2) NOT NULL,
  dueDate       DATE NOT NULL,
  paidDate      DATE NULL,
  status        ENUM('pending','paid','partial') NOT NULL DEFAULT 'pending',
  paidAmount    DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  notes         TEXT NULL,
  reminderSent  TINYINT(1) NOT NULL DEFAULT 0,
  createdAt     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_fees_registration
    FOREIGN KEY (registrationId) REFERENCES registrations(id) ON DELETE CASCADE,
  INDEX idx_fees_registrationId (registrationId),
  INDEX idx_fees_status (status),
  INDEX idx_fees_dueDate (dueDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
