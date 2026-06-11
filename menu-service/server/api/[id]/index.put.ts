import { defineHandler, type H3Event } from 'nitro';
import pool from '#server/database.ts';
import type { ResultSetHeader } from 'mysql2/promise';
import MenuBaseSchema from '#server/schemas.ts';
import Menu from '#server/entity/Menu.ts';

const MenuUpdateSchema = MenuBaseSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one menu attribute is required for update' }
);

function updateMenu(id: string, updateData: Partial<Menu>): Promise<void> {
    return new Promise((resolve, reject) => {
        const assignments = Object.entries(updateData).map(([key]) => `\`${key}\` = ?`).join(', ');
        const values = Object.values(updateData);
        const updateQuery = `UPDATE menu SET ${assignments} WHERE id = ?`;

        pool.execute<ResultSetHeader>(updateQuery, [...values, id] as any)
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

    const body = await event.req.json();
    const parsedBody = MenuUpdateSchema.safeParse(body);

    if (!parsedBody.success) {
        event.res.status = 422;
        return { message: 'Invalid update payload', errors: parsedBody.error };
    }

    await updateMenu(id, parsedBody.data);

    event.res.status = 204;
    return;
});
