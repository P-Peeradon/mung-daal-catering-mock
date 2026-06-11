import { defineHandler, type H3Event } from 'nitro';
import type { FieldPacket, ResultSetHeader } from 'mysql2/promise';
import Menu from '#server/entity/Menu.ts';
import pool from '#server/database.ts';

function deleteMenu(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        pool.execute<ResultSetHeader>('DELETE FROM menu WHERE id = ?', [id])
            .then(() => resolve())
            .catch((error) => reject(error));
    });
}

export default defineHandler(async (event: H3Event) => {
    const id: string | undefined = event.context.params?.id;

    if (!id) {
        event.res.status = 400;
        return { error: 'Menu ID is required' };
    }

    await deleteMenu(id);

    event.res.status = 204; // No Content
    return;
});