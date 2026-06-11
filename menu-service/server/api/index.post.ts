import pool from '#server/database.ts';
import Menu from '#server/entity/Menu.ts';
import MenuBaseSchema from '#server/schemas.ts';
import { defineHandler, type H3Event } from 'nitro';
import { z, type ZodSafeParseResult } from 'zod';

function generateBigIntId(): number {
    const uuidHex = crypto.randomUUID().replace(/-/g, "").substring(0, 12); // Clean hex portion
    return Number("0x" + uuidHex);
}

function createMenu(menu: Menu): Promise<void> {
    return new Promise((resolve, reject) => {
        pool.execute(
            'INSERT INTO menu (id, name, description, price) VALUES (?, ?, ?, ?)',
            [menu.id, menu.name, menu.description, menu.price]
        )
            .then(() => resolve())
            .catch((error) => reject(error));
    });
}

export default defineHandler(async (event: H3Event) => {
    const body = await event.req.json();
    const parsedBody: ZodSafeParseResult<z.infer<typeof MenuBaseSchema>> = MenuBaseSchema.safeParse(body);

    if (!parsedBody.success) {
        event.res.status = 422; // Set status code to 422 Unprocessable Entity
        return { message: 'Invalid menu data', errors: parsedBody.error };
    }

    const newMenu = { id: generateBigIntId(), ...parsedBody.data };
    const menuObject: Menu = new Menu(newMenu.id, newMenu.name, newMenu.description, newMenu.price);

    await createMenu(menuObject);

    event.res.status = 201; // Set status code to 201 Created
    return {
        message: 'Menu created successfully!',
        data: menuObject
    };
});