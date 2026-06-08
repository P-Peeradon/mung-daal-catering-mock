import { defineHandler, type H3Event } from 'nitro';

export default defineHandler(async (event: H3Event) => {
    const id = event.context.params?.id;

    if (!id) {
        event.res.status = 400
        return { error: 'Ingredient ID is required' }
    }

    const ingredient = await findIngredientById(id)

    if (!ingredient) {
        event.res.status = 404
        return { error: 'Ingredient not found' }
    }

    return ingredient
});