-- Run in MySQL SQL editor on the PMarketplace database.
-- Adds plugin ownership so authenticated users can publish their own plugins.

SET @db := DATABASE();

SET @owner_col_sql := (
  SELECT IF(
    EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = @db
        AND table_name = 'plugins'
        AND column_name = 'owner_user_id'
    ),
    'SELECT 1',
    'ALTER TABLE plugins ADD COLUMN owner_user_id INT NULL AFTER featured'
  )
);
PREPARE owner_col_stmt FROM @owner_col_sql;
EXECUTE owner_col_stmt;
DEALLOCATE PREPARE owner_col_stmt;

SET @owner_idx_sql := (
  SELECT IF(
    EXISTS (
      SELECT 1
      FROM information_schema.statistics
      WHERE table_schema = @db
        AND table_name = 'plugins'
        AND index_name = 'idx_plugins_owner_user_id'
    ),
    'SELECT 1',
    'ALTER TABLE plugins ADD INDEX idx_plugins_owner_user_id (owner_user_id)'
  )
);
PREPARE owner_idx_stmt FROM @owner_idx_sql;
EXECUTE owner_idx_stmt;
DEALLOCATE PREPARE owner_idx_stmt;

SET @owner_fk_sql := (
  SELECT IF(
    EXISTS (
      SELECT 1
      FROM information_schema.table_constraints
      WHERE table_schema = @db
        AND table_name = 'plugins'
        AND constraint_name = 'fk_plugins_owner_user'
    ),
    'SELECT 1',
    'ALTER TABLE plugins ADD CONSTRAINT fk_plugins_owner_user FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE'
  )
);
PREPARE owner_fk_stmt FROM @owner_fk_sql;
EXECUTE owner_fk_stmt;
DEALLOCATE PREPARE owner_fk_stmt;
