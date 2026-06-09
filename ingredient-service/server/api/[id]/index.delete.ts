import { defineHandler, type H3Event } from 'nitro';
import type { FieldPacket, ResultSetHeader } from 'mysql2';
import Ingredient from '#server/entity/Ingredient.ts';
import pool from '#server/database.ts';

function deleteIngredient(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        pool.execute<ResultSetHeader>('DELETE FROM ingredients WHERE id = ?', [id])
            .then(() => resolve())
            .catch((error) => reject(error));
    });
}

export default defineHandler(async (event: H3Event) => {
    const id: string | undefined = event.context.params?.id;

    if (!id) {
        event.res.status = 400;
        return { error: 'Ingredient ID is required' };
    }

    await deleteIngredient(id);

    event.res.status = 204; // No Content
    return;
});