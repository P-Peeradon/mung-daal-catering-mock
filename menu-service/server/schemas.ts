import { z } from "zod";

const MenuBaseSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(70, { message: "Name cannot exceed 70 characters" }),
    description: z.string().max(500, { message: "Description cannot exceed 500 characters" }).nullable(),
    price: z.number().nonnegative({ message: "Price cannot be negative" }),
});

export default MenuBaseSchema;