import MenuBaseSchema from '#server/schemas.ts';

describe('Menu Schema Validation - 50 Test Cases', () => {
  // 25 Valid Cases
  describe('Valid Payloads (25 Cases)', () => {
    const validCases = [
      { id: 1, payload: { name: 'Fried Rice', description: 'Egg fried rice', price: 9.99 }, name: 'standard valid payload' },
      { id: 2, payload: { name: 'Yo', description: 'Shortest valid name', price: 1.50 }, name: 'shortest valid name (2 chars)' },
      { id: 3, payload: { name: 'A'.repeat(70), description: 'Longest valid name', price: 20.00 }, name: 'longest valid name (70 chars)' },
      { id: 4, payload: { name: 'Pizza', description: null, price: 15.00 }, name: 'null description' },
      { id: 5, payload: { name: 'Burger', description: '', price: 8.00 }, name: 'empty description' },
      { id: 6, payload: { name: 'Soup', description: 'A'.repeat(500), price: 5.50 }, name: 'longest valid description (500 chars)' },
      { id: 7, payload: { name: 'Free Water', description: null, price: 0 }, name: 'zero price' },
      { id: 8, payload: { name: 'Caviar', description: 'Expensive dish', price: 1000000 }, name: 'large price' },
      { id: 9, payload: { name: 'Tiny Price', description: null, price: 0.01 }, name: 'smallest positive price' },
      { id: 10, payload: { name: 'Spaghetti', description: 'With meatballs', price: 12.3456 }, name: 'price with multiple decimal points' },
      { id: 11, payload: { name: 'Tacos', description: 'Beef tacos', price: 9 }, name: 'integer price' },
      { id: 12, payload: { name: 'Chicken tikka', description: 'Medium spicy', price: 14.99 }, name: 'name with spaces' },
      { id: 13, payload: { name: 'Dim Sum #123', description: 'Special combinations (3 pieces)', price: 7.50 }, name: 'name and desc with special chars' },
      { id: 14, payload: { name: 'Ice Cream', description: '🍦 cold desert', price: 3.50 }, name: 'emoji in description' },
      { id: 15, payload: { name: '🍣 Sushi Roll', description: 'Raw fish with rice', price: 18.00 }, name: 'emoji in name' },
      { id: 16, payload: { name: 'Hot Dog', description: 'A'.repeat(250), price: 4.50 }, name: 'medium length description' },
      { id: 17, payload: { name: 'A B', description: null, price: 1.00 }, name: 'name with intermediate space and length 3' },
      { id: 18, payload: { name: 'Fries', description: 'French fries', price: 3.99 }, name: 'standard meal' },
      { id: 19, payload: { name: 'Coke', description: 'Soft drink', price: 2.50 }, name: 'drink item' },
      { id: 20, payload: { name: 'Mocktail', description: 'Alcohol-free', price: 6.00 }, name: 'beverage item' },
      { id: 21, payload: { name: 'Buffet', description: 'All you can eat', price: 29.99 }, name: 'buffet item' },
      { id: 22, payload: { name: 'Extra Sauce', description: 'Garlic mayo', price: 0.50 }, name: 'extra option' },
      { id: 23, payload: { name: 'A'.repeat(50), description: 'B'.repeat(300), price: 125.50 }, name: 'large name and large description' },
      { id: 24, payload: { name: 'Salad', description: 'Healthy salad', price: 7.95 }, name: 'salad item' },
      { id: 25, payload: { name: 'Coffee', description: 'Espresso', price: 3.00 }, name: 'hot drink' },
    ];

    validCases.forEach((tc, idx) => {
      it(`${idx + 1}. should validate: ${tc.name}`, () => {
        const result = MenuBaseSchema.safeParse(tc.payload);
        expect(result.success).toBe(true);
      });
    });
  });

  // 25 Invalid Cases
  describe('Invalid Payloads (25 Cases)', () => {
    const invalidCases = [
      { payload: {}, name: 'empty object' },
      { payload: { description: 'No name', price: 10 }, name: 'missing name' },
      { payload: { name: 'Pizza', description: 'No price' }, name: 'missing price' },
      { payload: { name: 'A', description: null, price: 10 }, name: 'name too short (1 char)' },
      { payload: { name: '', description: null, price: 10 }, name: 'name too short (0 chars)' },
      { payload: { name: 'A'.repeat(71), description: null, price: 10 }, name: 'name too long (71 chars)' },
      { payload: { name: 123, description: null, price: 10 }, name: 'name is number' },
      { payload: { name: true, description: null, price: 10 }, name: 'name is boolean' },
      { payload: { name: ['Pizza'], description: null, price: 10 }, name: 'name is array' },
      { payload: { name: { val: 'Pizza' }, description: null, price: 10 }, name: 'name is object' },
      { payload: { name: null, description: null, price: 10 }, name: 'name is null' },
      { payload: { name: 'Pizza', description: 'A'.repeat(501), price: 10 }, name: 'description too long (501 chars)' },
      { payload: { name: 'Pizza', description: 123, price: 10 }, name: 'description is number' },
      { payload: { name: 'Pizza', description: true, price: 10 }, name: 'description is boolean' },
      { payload: { name: 'Pizza', description: [], price: 10 }, name: 'description is array' },
      { payload: { name: 'Pizza', description: {}, price: 10 }, name: 'description is object' },
      { payload: { name: 'Pizza', description: null, price: -0.01 }, name: 'price is slightly negative' },
      { payload: { name: 'Pizza', description: null, price: -100 }, name: 'price is negative integer' },
      { payload: { name: 'Pizza', description: null, price: '10' }, name: 'price is string' },
      { payload: { name: 'Pizza', description: null, price: true }, name: 'price is boolean' },
      { payload: { name: 'Pizza', description: null, price: [] }, name: 'price is array' },
      { payload: { name: 'Pizza', description: null, price: {} }, name: 'price is object' },
      { payload: { name: 'Pizza', description: null, price: null }, name: 'price is null' },
      { payload: { name: 'Pizza', description: undefined, price: undefined }, name: 'price and description undefined' },
      { payload: { name: 'P', description: 'A'.repeat(501), price: -1 }, name: 'all fields invalid' },
    ];

    invalidCases.forEach((tc, idx) => {
      it(`${idx + 26}. should fail validation: ${tc.name}`, () => {
        const result = MenuBaseSchema.safeParse(tc.payload);
        expect(result.success).toBe(false);
      });
    });
  });
});
