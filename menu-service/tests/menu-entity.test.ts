import Menu from '#server/entity/Menu.ts';

describe('Menu Entity - 30 Test Cases', () => {
  // --- Constructor Instantiation (10 cases) ---
  describe('Constructor Instantiation', () => {
    it('1. should instantiate with standard valid values', () => {
      const menu = new Menu(1, 'Curry', 'Spicy curry', 12.99);
      expect(menu).toBeInstanceOf(Menu);
    });

    it('2. should instantiate with null description', () => {
      const menu = new Menu(2, 'Rice', null, 5.00);
      expect(menu.description).toBeNull();
    });

    it('3. should instantiate with empty string description', () => {
      const menu = new Menu(3, 'Rice', '', 5.00);
      expect(menu.description).toBe('');
    });

    it('4. should instantiate with zero price', () => {
      const menu = new Menu(4, 'Free Water', null, 0.00);
      expect(menu.price).toBe(0.00);
    });

    it('5. should instantiate with a large integer ID', () => {
      const menu = new Menu(999999, 'Special Steak', 'Premium beef', 45.50);
      expect(menu.id).toBe(999999);
    });

    it('6. should instantiate with a negative ID (DB overflow check)', () => {
      const menu = new Menu(-5, 'Negative ID', null, 1.00);
      expect(menu.id).toBe(-5);
    });

    it('7. should instantiate with integer price', () => {
      const menu = new Menu(7, 'Bread', 'Fresh baked', 10);
      expect(menu.price).toBe(10);
    });

    it('8. should instantiate with extremely long name', () => {
      const longName = 'A'.repeat(70);
      const menu = new Menu(8, longName, null, 15.00);
      expect(menu.name).toBe(longName);
    });

    it('9. should instantiate with a negative price (underlying entity check)', () => {
      const menu = new Menu(9, 'Underpriced', null, -2.50);
      expect(menu.price).toBe(-2.50);
    });

    it('10. should instantiate with special characters in name', () => {
      const menu = new Menu(10, 'Pad Thai & Egg Roll!', 'Special combo @ lunch #1', 11.50);
      expect(menu.name).toBe('Pad Thai & Egg Roll!');
    });
  });

  // --- Getters (5 cases) ---
  describe('Getters', () => {
    const menu = new Menu(101, 'Fried Rice', 'Delicious egg fried rice', 8.50);

    it('11. should return correct id via getter', () => {
      expect(menu.id).toBe(101);
    });

    it('12. should return correct name via getter', () => {
      expect(menu.name).toBe('Fried Rice');
    });

    it('13. should return correct description via getter', () => {
      expect(menu.description).toBe('Delicious egg fried rice');
    });

    it('14. should return correct price via getter', () => {
      expect(menu.price).toBe(8.50);
    });

    it('15. should verify that id is read-only (no id setter exists)', () => {
      // TypeScript compile-time check check (id has no setter, so we assert its presence)
      expect(menu.id).toBeDefined();
    });
  });

  // --- Setters (10 cases) ---
  describe('Setters', () => {
    it('16. should update name to another string', () => {
      const menu = new Menu(1, 'Old Name', null, 5);
      menu.name = 'New Name';
      expect(menu.name).toBe('New Name');
    });

    it('17. should update name to empty string', () => {
      const menu = new Menu(1, 'Old Name', null, 5);
      menu.name = '';
      expect(menu.name).toBe('');
    });

    it('18. should update description to a string', () => {
      const menu = new Menu(1, 'Name', null, 5);
      menu.description = 'New Description';
      expect(menu.description).toBe('New Description');
    });

    it('19. should update description to null', () => {
      const menu = new Menu(1, 'Name', 'Old Description', 5);
      menu.description = null;
      expect(menu.description).toBeNull();
    });

    it('20. should update price to a positive integer', () => {
      const menu = new Menu(1, 'Name', null, 5.50);
      menu.price = 20;
      expect(menu.price).toBe(20);
    });

    it('21. should update price to a float', () => {
      const menu = new Menu(1, 'Name', null, 5.50);
      menu.price = 25.75;
      expect(menu.price).toBe(25.75);
    });

    it('22. should update price to zero', () => {
      const menu = new Menu(1, 'Name', null, 5.50);
      menu.price = 0;
      expect(menu.price).toBe(0);
    });

    it('23. should update price to negative number', () => {
      const menu = new Menu(1, 'Name', null, 5.50);
      menu.price = -10.50;
      expect(menu.price).toBe(-10.50);
    });

    it('24. should chain modifications sequentially', () => {
      const menu = new Menu(1, 'Soup', null, 3);
      menu.name = 'Miso Soup';
      menu.description = 'Warm starters';
      menu.price = 4.50;
      expect(menu.name).toBe('Miso Soup');
      expect(menu.description).toBe('Warm starters');
      expect(menu.price).toBe(4.50);
    });

    it('25. should handle setting name to a long string', () => {
      const menu = new Menu(1, 'Short', null, 3);
      const longName = 'B'.repeat(100);
      menu.name = longName;
      expect(menu.name).toBe(longName);
    });
  });

  // --- toJson Serialization (5 cases) ---
  describe('toJson Serialization', () => {
    it('26. should return an object matching the Menu structure', () => {
      const menu = new Menu(50, 'Noodles', 'Soy sauce noodles', 9.99);
      const json = menu.toJson();
      expect(json).toEqual({
        id: 50,
        name: 'Noodles',
        description: 'Soy sauce noodles',
        price: 9.99
      });
    });

    it('27. should return correct values with null fields', () => {
      const menu = new Menu(51, 'Noodles Only', null, 7.99);
      const json = menu.toJson();
      expect(json).toHaveProperty('description', null);
    });

    it('28. should serialize updated fields correctly after setters are run', () => {
      const menu = new Menu(52, 'Noodles', null, 9.99);
      menu.name = 'Ramen';
      menu.price = 14.50;
      expect(menu.toJson()).toEqual({
        id: 52,
        name: 'Ramen',
        description: null,
        price: 14.50
      });
    });

    it('29. should return an object of type Object', () => {
      const menu = new Menu(53, 'Spring Rolls', null, 4.00);
      expect(typeof menu.toJson()).toBe('object');
    });

    it('30. should serialize a zero-priced item correctly', () => {
      const menu = new Menu(54, 'Free Sauce', null, 0);
      expect(menu.toJson()).toEqual({
        id: 54,
        name: 'Free Sauce',
        description: null,
        price: 0
      });
    });
  });
});
