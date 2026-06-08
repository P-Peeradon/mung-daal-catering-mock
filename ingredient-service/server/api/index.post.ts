import IngredientBaseSchema from '#server/schemas.ts';
import { defineHandler, type H3Event } from 'nitro';
import { z, type ZodSafeParseResult } from 'zod';

export default defineHandler(async (event: H3Event) => {
    const body = await event.req.json();
    const parsedBody: ZodSafeParseResult<z.infer<typeof IngredientBaseSchema>> = IngredientBaseSchema.safeParse(body);

    if (!parsedBody.success) {
        event.res.status = 400; // Set status code to 400 Bad Request
        return { message: 'Invalid ingredient data', errors: parsedBody.error };
    }

    const newIngredient = { id: crypto.randomUUID(), ...parsedBody.data};

    event.res.status = 201; // Set status code to 201 Created
    return { 
        message: 'Ingredient created successfully!', 
        data: newIngredient 
    };
});