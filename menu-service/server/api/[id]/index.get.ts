import { defineHandler, type H3Event } from 'nitro';
import pool from '#server/database.ts';
import type { RowDataPacket, FieldPacket } from 'mysql2/promise';
import Menu from '#server/entity/Menu.ts';

function findMenuById(id: string): Promise<RowDataPacket | null> {
    return new Promise((resolve, reject) => {
        pool.execute<RowDataPacket[]>('SELECT * FROM menu WHERE id = ?', [id])
            .then(([rows, _fields]: [RowDataPacket[], FieldPacket[]]) => resolve(rows[0] ?? null))
            .catch((error) => reject(error));
    });
}

export default defineHandler(async (event: H3Event) => {
    const id: string | undefined = event.context.params?.id;

    if (!id) {
        event.res.status = 400
        return { error: 'Menu ID is required' }
    }

    const menu: RowDataPacket | null = await findMenuById(id);

    if (!menu) {
        event.res.status = 404
        return { error: 'Menu not found' }
    }

    return { data: new Menu(menu.id, menu.name, menu.description, menu.price) };
});