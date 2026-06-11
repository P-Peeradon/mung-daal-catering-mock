-- Ingredient table DDL
-- Adjust data types as needed for your target SQL database.

USE MungDaalCateringInventory;
CREATE TABLE IF NOT EXISTS Menu (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(70) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    description VARCHAR(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;