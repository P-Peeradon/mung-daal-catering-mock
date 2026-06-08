-- Ingredient table DDL
-- Adjust data types as needed for your target SQL database.

USE MungDaalCateringInventory;
CREATE TABLE IF NOT EXISTS Ingredient (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    unit VARCHAR(20) NOT NULL,
    category VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;