import { defineHandler, type H3Event } from 'nitro';
import type { FieldPacket, ResultSetHeader } from 'mysql2';
import Ingredient from '#server/entity/Ingredient.ts';
import pool from '#server/database.ts';

export default defineHandler(async (event: H3Event) => {
    const id: string | undefined = event.context.params?.id;

    if (!id) {
        event.res.status = 400;
        return { error: 'Ingredient ID is required' };
    }

    const [result, _fields]: [ResultSetHeader, FieldPacket[]] = await pool.execute<ResultSetHeader>('DELETE FROM ingredients WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
        event.res.status = 404;
        return { error: 'Ingredient not found' };
    }

    event.res.status = 204; // No Content
    return;
});