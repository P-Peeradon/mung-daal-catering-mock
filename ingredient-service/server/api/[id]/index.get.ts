import { defineHandler, type H3Event } from 'nitro';
import pool from '../../database';
import type { RowDataPacket, FieldPacket } from 'mysql2';
import Ingredient from '#server/entity/Ingredient.ts';

async function findIngredientById(id: string) {
    const [rows, _fields]: [RowDataPacket[], FieldPacket[]] = await pool.execute<RowDataPacket[]>('SELECT * FROM ingredients WHERE id = ?', [id]);
    return rows[0] ?? null;
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