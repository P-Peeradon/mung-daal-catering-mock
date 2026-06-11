import Ingredient from '#server/entity/Ingredient.ts';

describe('Ingredient Entity - 30 Test Cases', () => {
  // --- Constructor Instantiation (10 cases) ---
  describe('Constructor Instantiation', () => {
    it('1. should instantiate with standard valid values', () => {
      const ing = new Ingredient(1, 'Sugar', 5.5, 'kg', 'Baking');
      expect(ing).toBeInstanceOf(Ingredient);
    });

    it('2. should instantiate with null unit', () => {
      const ing = new Ingredient(2, 'Eggs', 12, null, 'Dairy');
      expect(ing.unit).toBeNull();
    });

    it('3. should instantiate with empty string unit', () => {
      const ing = new Ingredient(3, 'Eggs', 6, '', 'Dairy');
      expect(ing.unit).toBe('');
    });

    it('4. should instantiate with zero quantity', () => {
      const ing = new Ingredient(4, 'Salt', 0, 'g', 'Spices');
      expect(ing.quantity).toBe(0);
    });

    it('5. should instantiate with large ID', () => {
      const ing = new Ingredient(999999, 'Pepper', 1, 'tbsp', 'Spices');
      expect(ing.id).toBe(999999);
    });

    it('6. should instantiate with negative ID', () => {
      const ing = new Ingredient(-10, 'Garlic', 2, 'pieces', 'Vegetables');
      expect(ing.id).toBe(-10);
    });

    it('7. should instantiate with negative quantity', () => {
      const ing = new Ingredient(7, 'Onions', -5, 'pieces', 'Vegetables');
      expect(ing.quantity).toBe(-5);
    });

    it('8. should instantiate with name containing special characters', () => {
      const ing = new Ingredient(8, 'Soy Sauce (Dark & Rich!)', 200, 'ml', 'Condiments');
      expect(ing.name).toBe('Soy Sauce (Dark & Rich!)');
    });

    it('9. should instantiate with category containing special characters', () => {
      const ing = new Ingredient(9, 'Ginger', 50, 'g', 'Spices/Roots & Herbs');
      expect(ing.category).toBe('Spices/Roots & Herbs');
    });

    it('10. should instantiate with a float quantity value', () => {
      const ing = new Ingredient(10, 'Flour', 2.345, 'kg', 'Baking');
      expect(ing.quantity).toBe(2.345);
    });
  });

  // --- Getters (10 cases) ---
  describe('Getters', () => {
    const ing = new Ingredient(101, 'Milk', 2, 'L', 'Dairy');

    it('11. should return correct id', () => {
      expect(ing.id).toBe(101);
    });

    it('12. should return correct name', () => {
      expect(ing.name).toBe('Milk');
    });

    it('13. should return correct quantity', () => {
      expect(ing.quantity).toBe(2);
    });

    it('14. should return correct unit', () => {
      expect(ing.unit).toBe('L');
    });

    it('15. should return correct category', () => {
      expect(ing.category).toBe('Dairy');
    });

    it('16. should return null unit via getter if set to null', () => {
      const nullUnitIng = new Ingredient(102, 'Apples', 5, null, 'Fruits');
      expect(nullUnitIng.unit).toBeNull();
    });

    it('17. should return correct values for custom entity 1', () => {
      const custom = new Ingredient(50, 'Butter', 500, 'g', 'Dairy');
      expect(custom.name).toBe('Butter');
      expect(custom.quantity).toBe(500);
    });

    it('18. should return correct values for custom entity 2', () => {
      const custom = new Ingredient(51, 'Carrot', 10, null, 'Vegetables');
      expect(custom.category).toBe('Vegetables');
      expect(custom.unit).toBeNull();
    });

    it('19. should return correct values for custom entity 3', () => {
      const custom = new Ingredient(52, 'Olive Oil', 1.5, 'L', 'Oils');
      expect(custom.id).toBe(52);
    });

    it('20. should return correct values for custom entity 4', () => {
      const custom = new Ingredient(53, 'Water', 100, 'ml', 'Liquids');
      expect(custom.quantity).toBe(100);
    });
  });

  // --- Setters (10 cases) ---
  describe('Setters', () => {
    it('21. should update id', () => {
      const ing = new Ingredient(1, 'Sugar', 5, 'kg', 'Baking');
      ing.id = 99;
      expect(ing.id).toBe(99);
    });

    it('22. should update name', () => {
      const ing = new Ingredient(1, 'Sugar', 5, 'kg', 'Baking');
      ing.name = 'Brown Sugar';
      expect(ing.name).toBe('Brown Sugar');
    });

    it('23. should update quantity to integer', () => {
      const ing = new Ingredient(1, 'Sugar', 5, 'kg', 'Baking');
      ing.quantity = 10;
      expect(ing.quantity).toBe(10);
    });

    it('24. should update quantity to float', () => {
      const ing = new Ingredient(1, 'Sugar', 5, 'kg', 'Baking');
      ing.quantity = 12.5;
      expect(ing.quantity).toBe(12.5);
    });

    it('25. should update quantity to zero', () => {
      const ing = new Ingredient(1, 'Sugar', 5, 'kg', 'Baking');
      ing.quantity = 0;
      expect(ing.quantity).toBe(0);
    });

    it('26. should update unit to string', () => {
      const ing = new Ingredient(1, 'Sugar', 5, null, 'Baking');
      ing.unit = 'bags';
      expect(ing.unit).toBe('bags');
    });

    it('27. should update unit to null', () => {
      const ing = new Ingredient(1, 'Sugar', 5, 'kg', 'Baking');
      ing.unit = null;
      expect(ing.unit).toBeNull();
    });

    it('28. should update category', () => {
      const ing = new Ingredient(1, 'Sugar', 5, 'kg', 'Baking');
      ing.category = 'Sweeteners';
      expect(ing.category).toBe('Sweeteners');
    });

    it('29. should perform chained updates successfully', () => {
      const ing = new Ingredient(1, 'Salt', 10, 'g', 'Spices');
      ing.name = 'Sea Salt';
      ing.quantity = 250;
      ing.unit = 'g';
      ing.category = 'Seasoning';
      expect(ing.name).toBe('Sea Salt');
      expect(ing.quantity).toBe(250);
      expect(ing.category).toBe('Seasoning');
    });

    it('30. should update quantity to negative number', () => {
      const ing = new Ingredient(1, 'Sugar', 5, 'kg', 'Baking');
      ing.quantity = -1.5;
      expect(ing.quantity).toBe(-1.5);
    });
  });
});
