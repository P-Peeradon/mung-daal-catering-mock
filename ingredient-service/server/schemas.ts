import { z } from "zod";

const IngredientBaseSchema = z.object({
    name: z.string().min(2).max(70),
    quantity: z.number().nonnegative(),
    unit: z.string().max(20).nullable(), // null means "countable like 2 eggs, 3 tomatoes, etc."
    category: z.string().max(20)
});

export default IngredientBaseSchema;