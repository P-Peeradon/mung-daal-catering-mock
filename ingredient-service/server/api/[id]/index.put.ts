import { defineHandler, type H3Event } from 'nitro';
import pool from '../../database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import IngredientBaseSchema from '#server/schemas.ts';
import Ingredient from '#server/entity/Ingredient.ts';

const IngredientUpdateSchema = IngredientBaseSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one ingredient attribute is required for update' }
);

function updateIngredient(id: string, updateData: Partial<Ingredient>): Promise<void> {
    return new Promise((resolve, reject) => {
        const assignments = Object.entries(updateData).map(([key]) => `\`${key}\` = ?`).join(', ');
        const values = Object.values(updateData); 
        const updateQuery = `UPDATE ingredients SET ${assignments} WHERE id = ?`;

        pool.execute<ResultSetHeader>(updateQuery, [...values, id])
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

    const body = await event.req.json();
    const parsedBody = IngredientUpdateSchema.safeParse(body);

    if (!parsedBody.success) {
        event.res.status = 422;
        return { message: 'Invalid update payload', errors: parsedBody.error };
    }

    await updateIngredient(id, parsedBody.data);

    event.res.status = 204;
    return;
});
