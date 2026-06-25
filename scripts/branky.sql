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

-- ─── Students (promoted from confirmed registrations) ──────────────────────
CREATE TABLE IF NOT EXISTS students (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  registration_id INT NOT NULL UNIQUE,
  status          ENUM('current','past') NOT NULL DEFAULT 'current',
  join_date       DATE NOT NULL,
  end_date        DATE NULL,
  notes           TEXT,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_students_registration
    FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE,
  INDEX idx_students_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Fee Plans (monthly instalment groups) ────────────────────────────────
CREATE TABLE IF NOT EXISTS fee_plans (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  student_id      INT NOT NULL,
  registration_id INT NOT NULL,
  course_name     VARCHAR(255) NOT NULL DEFAULT 'Program Fee',
  total_fee       DECIMAL(10,2) NOT NULL,
  duration_months INT NOT NULL,
  monthly_amount  DECIMAL(10,2) NOT NULL,
  start_date      DATE NOT NULL,
  notes           TEXT,
  status          ENUM('active','completed','cancelled') NOT NULL DEFAULT 'active',
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_feeplans_student
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_feeplans_registration
    FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE,
  INDEX idx_feeplans_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Extend fees table with instalment columns (safe re-run) ─────────────
SET @c1 := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fees' AND COLUMN_NAME = 'fee_plan_id');
SET @s1 := IF(@c1 = 0, 'ALTER TABLE fees ADD COLUMN fee_plan_id INT NULL AFTER registrationId', 'SELECT 1');
PREPARE stmt FROM @s1; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @c2 := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fees' AND COLUMN_NAME = 'installment_number');
SET @s2 := IF(@c2 = 0, 'ALTER TABLE fees ADD COLUMN installment_number INT NULL AFTER fee_plan_id', 'SELECT 1');
PREPARE stmt FROM @s2; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @fk := (
  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'fees'
    AND CONSTRAINT_NAME = 'fk_fees_feeplan'
);
SET @sql := IF(@fk = 0,
  'ALTER TABLE fees ADD CONSTRAINT fk_fees_feeplan FOREIGN KEY (fee_plan_id) REFERENCES fee_plans(id) ON DELETE CASCADE',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ─── Add discount column to fee_plans (safe re-run) ──────────────────────
SET @dc := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fee_plans' AND COLUMN_NAME = 'discount');
SET @sd := IF(@dc = 0, 'ALTER TABLE fee_plans ADD COLUMN discount DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER total_fee', 'SELECT 1');
PREPARE stmt FROM @sd; EXECUTE stmt; DEALLOCATE PREPARE stmt;
