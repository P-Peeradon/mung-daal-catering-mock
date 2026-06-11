import { defineHandler } from "nitro";
import pool from '../database';
import type { RowDataPacket, FieldPacket } from "mysql2/promise";
import Ingredient from "#server/entity/Ingredient.ts";

export default defineHandler(async (event) => {

    const [rows, _fields]: [RowDataPacket[], FieldPacket[]] = await pool.execute('SELECT * FROM ingredients');
    const ingredients = rows.map((row: RowDataPacket) => new Ingredient(row.id, row.name, row.quantity, row.unit, row.category));

    return { data: ingredients };
});
