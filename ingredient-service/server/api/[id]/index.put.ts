import { defineHandler, type H3Event } from 'nitro';
import pool from '../../database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import IngredientBaseSchema from '#server/schemas.ts';
import Ingredient from '#server/entity/Ingredient.ts';

const IngredientUpdateSchema = IngredientBaseSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one ingredient attribute is required for update' }
);

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

    const updateData = Object.entries(parsedBody.data).filter(([, value]) => value !== undefined);

    if (updateData.length === 0) {
        event.res.status = 422;
        return { message: 'Invalid update payload', errors: 'No valid update attributes provided' };
    }

    const assignments = updateData.map(([key]) => `\`${key}\` = ?`).join(', ');
    const values = updateData.map(([, value]) => value as string | number | null);

    const updateQuery = `UPDATE ingredients SET ${assignments} WHERE id = ?`;
    const [result] = await pool.execute<ResultSetHeader>(updateQuery, [...values, id]);

    if (result.affectedRows === 0) {
        event.res.status = 404;
        return { error: 'Ingredient not found' };
    }

    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM ingredients WHERE id = ?', [id]);
    const updatedRow = rows[0];

    if (!updatedRow) {
        event.res.status = 404;
        return { error: 'Ingredient not found after update' };
    }

    return {
        message: 'Ingredient updated successfully',
        data: new Ingredient(updatedRow.id, updatedRow.name, updatedRow.quantity, updatedRow.unit, updatedRow.category)
    };
});
