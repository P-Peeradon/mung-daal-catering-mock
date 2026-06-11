import IngredientBaseSchema from '#server/schemas.ts';

describe('Ingredient Schema Validation - 50 Test Cases', () => {
  // 25 Valid Cases
  describe('Valid Payloads (25 Cases)', () => {
    const validCases = [
      { id: 1, payload: { name: 'Sugar', quantity: 10, unit: 'kg', category: 'Baking' }, name: 'standard valid payload' },
      { id: 2, payload: { name: 'Salt', quantity: 5.5, unit: 'g', category: 'Spices' }, name: 'float quantity' },
      { id: 3, payload: { name: 'Eggs', quantity: 12, unit: null, category: 'Dairy' }, name: 'null unit' },
      { id: 4, payload: { name: 'Water', quantity: 0, unit: 'L', category: 'Liquids' }, name: 'zero quantity' },
      { id: 5, payload: { name: 'Pepper', quantity: 1000000, unit: 'g', category: 'Spices' }, name: 'large quantity' },
      { id: 6, payload: { name: 'A'.repeat(70), quantity: 1, unit: 'unit', category: 'Baking' }, name: 'longest valid name (70 chars)' },
      { id: 7, payload: { name: 'Yo', quantity: 1, unit: 'unit', category: 'Baking' }, name: 'shortest valid name (2 chars)' },
      { id: 8, payload: { name: 'Sugar', quantity: 1, unit: 'A'.repeat(20), category: 'Baking' }, name: 'longest valid unit (20 chars)' },
      { id: 9, payload: { name: 'Sugar', quantity: 1, unit: '', category: 'Baking' }, name: 'empty unit' },
      { id: 10, payload: { name: 'Sugar', quantity: 1, unit: 'kg', category: 'A'.repeat(20) }, name: 'longest valid category (20 chars)' },
      { id: 11, payload: { name: 'Flour', quantity: 0.0001, unit: 'kg', category: 'Baking' }, name: 'tiny float quantity' },
      { id: 12, payload: { name: 'Olive Oil', quantity: 3, unit: 'liters', category: 'Cooking Oils' }, name: 'category and unit with spaces' },
      { id: 13, payload: { name: 'Milk & Cream', quantity: 2, unit: 'bottles', category: 'Dairy/Liquids' }, name: 'special chars in fields' },
      { id: 14, payload: { name: 'Butter', quantity: 250, unit: 'g', category: 'Dry Goods' }, name: 'dry goods category' },
      { id: 15, payload: { name: 'Garlic', quantity: 5, unit: 'cloves', category: 'Vegetables' }, name: 'countable items' },
      { id: 16, payload: { name: 'Onions', quantity: 10, unit: 'pcs', category: 'Produce' }, name: 'produce category' },
      { id: 17, payload: { name: 'Carrots', quantity: 1.5, unit: 'lb', category: 'Veg' }, name: 'pound unit' },
      { id: 18, payload: { name: 'Pork', quantity: 2, unit: 'kg', category: 'Meat' }, name: 'meat category' },
      { id: 19, payload: { name: 'Salmon', quantity: 500, unit: 'g', category: 'Seafood' }, name: 'seafood category' },
      { id: 20, payload: { name: 'Rice', quantity: 20, unit: 'bags', category: 'Grains' }, name: 'grains category' },
      { id: 21, payload: { name: 'Yeast', quantity: 50, unit: 'packets', category: 'Baking' }, name: 'packets unit' },
      { id: 22, payload: { name: 'Vanilla', quantity: 50, unit: 'ml', category: 'Extracts' }, name: 'extracts category' },
      { id: 23, payload: { name: 'Cheese', quantity: 1, unit: 'block', category: 'Dairy' }, name: 'block unit' },
      { id: 24, payload: { name: 'Basil', quantity: 1, unit: 'bunch', category: 'Herbs' }, name: 'herbs category' },
      { id: 25, payload: { name: 'Lemon Juice', quantity: 150, unit: 'ml', category: 'Juice' }, name: 'juice category' },
    ];

    validCases.forEach((tc, idx) => {
      it(`${idx + 1}. should validate: ${tc.name}`, () => {
        const result = IngredientBaseSchema.safeParse(tc.payload);
        expect(result.success).toBe(true);
      });
    });
  });

  // 25 Invalid Cases
  describe('Invalid Payloads (25 Cases)', () => {
    const invalidCases = [
      { payload: {}, name: 'empty object' },
      { payload: { quantity: 10, unit: 'kg', category: 'Baking' }, name: 'missing name' },
      { payload: { name: 'Sugar', unit: 'kg', category: 'Baking' }, name: 'missing quantity' },
      { payload: { name: 'Sugar', quantity: 10, unit: 'kg' }, name: 'missing category' },
      { payload: { name: 'A', quantity: 10, unit: 'kg', category: 'Baking' }, name: 'name too short (1 char)' },
      { payload: { name: '', quantity: 10, unit: 'kg', category: 'Baking' }, name: 'name too short (0 chars)' },
      { payload: { name: 'A'.repeat(71), quantity: 10, unit: 'kg', category: 'Baking' }, name: 'name too long (71 chars)' },
      { payload: { name: 123, quantity: 10, unit: 'kg', category: 'Baking' }, name: 'name is number' },
      { payload: { name: true, quantity: 10, unit: 'kg', category: 'Baking' }, name: 'name is boolean' },
      { payload: { name: ['Sugar'], quantity: 10, unit: 'kg', category: 'Baking' }, name: 'name is array' },
      { payload: { name: { val: 'Sugar' }, quantity: 10, unit: 'kg', category: 'Baking' }, name: 'name is object' },
      { payload: { name: null, quantity: 10, unit: 'kg', category: 'Baking' }, name: 'name is null' },
      { payload: { name: 'Sugar', quantity: -0.01, unit: 'kg', category: 'Baking' }, name: 'quantity is negative float' },
      { payload: { name: 'Sugar', quantity: -10, unit: 'kg', category: 'Baking' }, name: 'quantity is negative integer' },
      { payload: { name: 'Sugar', quantity: '10', unit: 'kg', category: 'Baking' }, name: 'quantity is string' },
      { payload: { name: 'Sugar', quantity: true, unit: 'kg', category: 'Baking' }, name: 'quantity is boolean' },
      { payload: { name: 'Sugar', quantity: null, unit: 'kg', category: 'Baking' }, name: 'quantity is null' },
      { payload: { name: 'Sugar', quantity: 10, unit: 'A'.repeat(21), category: 'Baking' }, name: 'unit too long (21 chars)' },
      { payload: { name: 'Sugar', quantity: 10, unit: 123, category: 'Baking' }, name: 'unit is number' },
      { payload: { name: 'Sugar', quantity: 10, unit: {}, category: 'Baking' }, name: 'unit is object' },
      { payload: { name: 'Sugar', quantity: 10, unit: 'kg', category: 'A'.repeat(21) }, name: 'category too long (21 chars)' },
      { payload: { name: 'Sugar', quantity: 10, unit: 'kg', category: 123 }, name: 'category is number' },
      { payload: { name: 'Sugar', quantity: 10, unit: 'kg', category: true }, name: 'category is boolean' },
      { payload: { name: 'Sugar', quantity: 10, unit: 'kg', category: null }, name: 'category is null' },
      { payload: { name: 'S', quantity: -5, unit: 'A'.repeat(21), category: 'A'.repeat(21) }, name: 'all fields invalid' },
    ];

    invalidCases.forEach((tc, idx) => {
      it(`${idx + 26}. should fail validation: ${tc.name}`, () => {
        const result = IngredientBaseSchema.safeParse(tc.payload);
        expect(result.success).toBe(false);
      });
    });
  });
});
