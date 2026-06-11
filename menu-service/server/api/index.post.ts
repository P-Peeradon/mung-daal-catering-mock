import pool from '#server/database.ts';
import Ingredient from '#server/entity/Ingredient.ts';
import IngredientBaseSchema from '#server/schemas.ts';
import { defineHandler, type H3Event } from 'nitro';
import { z, type ZodSafeParseResult } from 'zod';

function generateBigIntId(): number {
  const uuidHex = crypto.randomUUID().replace(/-/g, "").substring(0, 12); // Clean hex portion
  return Number("0x" + uuidHex); 
}

function createIngredient(ingredient: Ingredient): Promise<void> {
    return new Promise((resolve, reject) => {
        pool.execute(
            'INSERT INTO ingredients (id, name, quantity, unit, category) VALUES (?, ?, ?, ?, ?)',
            [ingredient.id, ingredient.name, ingredient.quantity, ingredient.unit, ingredient.category]
        )
        .then(() => resolve())
        .catch((error) => reject(error));
    });
}

export default defineHandler(async (event: H3Event) => {
    const body = await event.req.json();
    const parsedBody: ZodSafeParseResult<z.infer<typeof IngredientBaseSchema>> = IngredientBaseSchema.safeParse(body);

    if (!parsedBody.success) {
        event.res.status = 422; // Set status code to 422 Unprocessable Entity
        return { message: 'Invalid ingredient data', errors: parsedBody.error };
    }

    const newIngredient = { id: generateBigIntId(), ...parsedBody.data};
    const ingredientObject: Ingredient = new Ingredient(newIngredient.id, newIngredient.name, newIngredient.quantity, newIngredient.unit, newIngredient.category);

    await createIngredient(ingredientObject);

    event.res.status = 201; // Set status code to 201 Created
    return { 
        message: 'Ingredient created successfully!', 
        data: ingredientObject 
    };
});