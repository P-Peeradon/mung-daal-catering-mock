import { defineHandler } from "nitro";
import pool from '#server/database.ts';
import type { RowDataPacket, FieldPacket } from "mysql2/promise";
import Menu from "#server/entity/Menu.ts";

export default defineHandler(async (event) => {

    const [rows, _fields]: [RowDataPacket[], FieldPacket[]] = await pool.execute('SELECT * FROM menu');
    const menus = rows.map((row: RowDataPacket) => new Menu(row.id, row.name, row.description, row.price));

    return { data: menus };
});
