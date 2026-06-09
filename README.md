# Mung Daal Catering Mock Restaurant

A mock catering management project inspired by the animated series *Chowder*. This repository models the ingredient inventory and prepares the foundation for a catering restaurant order and menu management system.

## Project Overview

This workspace contains:

- `ingredient-service/` — a Nitro-based TypeScript API service for managing catering ingredients.
- `database-layer/` — SQL files for creating the MySQL database and ingredient table.
- `menu-service/` — a placeholder folder for the future menu management service.

## Stack

- Node.js + TypeScript
- Nitro server framework
- MySQL database (`mysql2` driver)
- `zod` for request validation

## Architecture

The current implementation centers on the `ingredient-service`, which exposes a simple ingredients CRUD API backed by a MySQL connection pool. Ingredient data is stored in a `Ingredient` table inside the `MungDaalCateringInventory` database.

## Getting Started

### 1. Create the MySQL database

Run the SQL scripts from `database-layer/` in a MySQL client:

```sql
CREATE DATABASE IF NOT EXISTS MungDaalCateringInventory;
USE MungDaalCateringInventory;

CREATE TABLE IF NOT EXISTS Ingredient (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  unit VARCHAR(20) NOT NULL,
  category VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 2. Configure environment variables

Create an environment file inside `ingredient-service/` (for example, `.env`) or set these variables in your shell:

```bash
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=MungDaalCateringInventory
```

### 3. Install dependencies

```bash
cd ingredient-service
npm install
```

### 4. Run the service

```bash
npm run dev
```

The API will start on the Nitro development server, typically at `http://localhost:3000`.

## Ingredient Service API

The ingredient service exposes the following endpoints:

### GET `/api`

Retrieve all ingredients.

Response:

```json
{
  "data": [
    {
      "id": 123,
      "name": "Carrot",
      "quantity": 10,
      "unit": "pcs",
      "category": "Vegetable"
    }
  ]
}
```

### POST `/api`

Create a new ingredient.

Request body:

```json
{
  "name": "Tomato",
  "quantity": 20,
  "unit": "pcs",
  "category": "Vegetable"
}
```

Success response:

- Status: `201 Created`
- Body contains created ingredient data.

### PUT `/api/:id`

Update an existing ingredient by ID.

Request body may include one or more fields:

```json
{
  "quantity": 15,
  "unit": "kg"
}
```

Success response:

- Status: `204 No Content`

### DELETE `/api/:id`

Delete an ingredient by ID.

Success response:

- Status: `204 No Content`

## Data Model

The ingredient model includes:

- `id` — numeric identifier
- `name` — ingredient name
- `quantity` — numeric inventory amount
- `unit` — optional measurement unit or countable descriptor
- `category` — ingredient category

## Notes

- The service uses `zod` validation to enforce ingredient payloads on create and update operations.
- `ingredient-service/` is built as a Nitro app with server code under `server/`.
- `menu-service/` is currently empty and reserved for future menu management functionality.

## Future Work

Potential next steps for the project include:

- adding menu and order management APIs
- building a frontend for catering staff
- adding authentication and user roles
- improving inventory transaction handling

---

For more details, open `ingredient-service/README.md` and explore the `server/` folder.

