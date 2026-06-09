import { defineHandler, type H3Event } from 'nitro';
import pool from '../../database';
import type { RowDataPacket, FieldPacket } from 'mysql2';
import Ingredient from '#server/entity/Ingredient.ts';

function findIngredientById(id: string): Promise<RowDataPacket | null> {
    return new Promise((resolve, reject) => {
        pool.execute<RowDataPacket[]>('SELECT * FROM ingredients WHERE id = ?', [id])
            .then(([rows, _fields]: [RowDataPacket[], FieldPacket[]]) => resolve(rows[0] ?? null))
            .catch((error) => reject(error));
    });
}

export default defineHandler(async (event: H3Event) => {
    const id: string | undefined = event.context.params?.id;

    if (!id) {
        event.res.status = 400
        return { error: 'Ingredient ID is required' }
    }

    const ingredient: RowDataPacket | null = await findIngredientById(id);

    if (!ingredient) {
        event.res.status = 404
        return { error: 'Ingredient not found' }
    }

    return { data: new Ingredient(ingredient.id, ingredient.name, ingredient.quantity, ingredient.unit, ingredient.category) };
});