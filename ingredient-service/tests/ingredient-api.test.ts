import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// 1. Mock the database pool module for all relative and path-mapped import forms
const mockExecute = jest.fn();
const mockDb = {
  __esModule: true,
  default: {
    execute: mockExecute
  }
};

jest.mock('#server/database.ts', () => mockDb);
jest.mock('../server/database.ts', () => mockDb);

// Mock the nitro package to avoid ESM runtime issues when importing handlers
jest.mock('nitro', () => {
  return {
    defineHandler: (handler: any) => handler
  };
});

// Import handlers after mocking
import getIngredientsHandler from '#server/api/index.get.ts';
import createIngredientHandler from '#server/api/index.post.ts';
import getIngredientByIdHandler from '#server/api/[id]/index.get.ts';
import updateIngredientHandler from '#server/api/[id]/index.put.ts';
import deleteIngredientHandler from '#server/api/[id]/index.delete.ts';

describe('Ingredient API Handlers - 20 Test Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- GET /api ---
  describe('GET /api (4 cases)', () => {
    it('1. should return a list of ingredients with status 200', async () => {
      const mockRows = [
        { id: 1, name: 'Sugar', quantity: 50, unit: 'kg', category: 'Baking' },
        { id: 2, name: 'Salt', quantity: 10, unit: 'g', category: 'Spices' }
      ];
      mockExecute.mockResolvedValueOnce([mockRows, []]);

      const event = {} as any;
      const response = await getIngredientsHandler(event);

      expect(mockExecute).toHaveBeenCalledWith('SELECT * FROM ingredients');
      expect(response).toEqual({
        data: [
          { _id: 1, _name: 'Sugar', _quantity: 50, _unit: 'kg', _category: 'Baking' },
          { _id: 2, _name: 'Salt', _quantity: 10, _unit: 'g', _category: 'Spices' }
        ]
      });
    });

    it('2. should return empty list if no ingredients in DB', async () => {
      mockExecute.mockResolvedValueOnce([[], []]);

      const event = {} as any;
      const response = await getIngredientsHandler(event);

      expect(response).toEqual({ data: [] });
    });

    it('3. should throw error if DB query fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('DB read error'));

      const event = {} as any;
      await expect(getIngredientsHandler(event)).rejects.toThrow('DB read error');
    });

    it('4. should verify response data structure is correct', async () => {
      mockExecute.mockResolvedValueOnce([[ { id: 5, name: 'Eggs', quantity: 6, unit: null, category: 'Dairy' } ], []]);
      const response = await getIngredientsHandler({} as any);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data[0]._name).toBe('Eggs');
    });
  });

  // --- POST /api ---
  describe('POST /api (5 cases)', () => {
    it('5. should create ingredient successfully and return 201', async () => {
      mockExecute.mockResolvedValueOnce([{}, []]);
      const event = {
        req: {
          json: jest.fn().mockResolvedValue({ name: 'Pepper', quantity: 15, unit: 'g', category: 'Spices' })
        },
        res: { status: 200 }
      } as any;

      const response = await createIngredientHandler(event);

      expect(mockExecute).toHaveBeenCalled();
      expect(event.res.status).toBe(201);
      expect(response.message).toBe('Ingredient created successfully!');
      expect(response.data._name).toBe('Pepper');
      expect(response.data._quantity).toBe(15);
    });

    it('6. should return 422 if body name validation fails (too short)', async () => {
      const event = {
        req: {
          json: jest.fn().mockResolvedValue({ name: 'A', quantity: 5, unit: 'kg', category: 'Baking' })
        },
        res: { status: 200 }
      } as any;

      const response = await createIngredientHandler(event);

      expect(event.res.status).toBe(422);
      expect(response.message).toBe('Invalid ingredient data');
      expect(response).toHaveProperty('errors');
    });

    it('7. should return 422 if quantity is negative', async () => {
      const event = {
        req: {
          json: jest.fn().mockResolvedValue({ name: 'Flour', quantity: -2, unit: 'kg', category: 'Baking' })
        },
        res: { status: 200 }
      } as any;

      const response = await createIngredientHandler(event);

      expect(event.res.status).toBe(422);
      expect(response.message).toBe('Invalid ingredient data');
    });

    it('8. should propagate error if DB insert fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('Insert error'));
      const event = {
        req: {
          json: jest.fn().mockResolvedValue({ name: 'Sugar', quantity: 10, unit: 'kg', category: 'Baking' })
        },
        res: { status: 200 }
      } as any;

      await expect(createIngredientHandler(event)).rejects.toThrow('Insert error');
    });

    it('9. should ensure createIngredient query matches values', async () => {
      mockExecute.mockResolvedValueOnce([{}, []]);
      const event = {
        req: {
          json: jest.fn().mockResolvedValue({ name: 'Milk', quantity: 10, unit: 'L', category: 'Dairy' })
        },
        res: { status: 200 }
      } as any;

      const response = await createIngredientHandler(event);
      expect(mockExecute).toHaveBeenCalledWith(
        'INSERT INTO ingredients (id, name, quantity, unit, category) VALUES (?, ?, ?, ?, ?)',
        [expect.any(Number), 'Milk', 10, 'L', 'Dairy']
      );
    });
  });

  // --- GET /api/:id ---
  describe('GET /api/:id (4 cases)', () => {
    it('10. should return ingredient data if found in DB', async () => {
      const mockIng = { id: 123, name: 'Salt', quantity: 5, unit: 'kg', category: 'Spices' };
      mockExecute.mockResolvedValueOnce([[mockIng], []]);
      const event = {
        context: { params: { id: '123' } },
        res: { status: 200 }
      } as any;

      const response = await getIngredientByIdHandler(event);

      expect(mockExecute).toHaveBeenCalledWith('SELECT * FROM ingredients WHERE id = ?', ['123']);
      expect(response.data._name).toBe('Salt');
      expect(response.data._quantity).toBe(5);
    });

    it('11. should return 404 error if ingredient not found', async () => {
      mockExecute.mockResolvedValueOnce([[], []]);
      const event = {
        context: { params: { id: '999' } },
        res: { status: 200 }
      } as any;

      const response = await getIngredientByIdHandler(event);

      expect(event.res.status).toBe(404);
      expect(response).toEqual({ error: 'Ingredient not found' });
    });

    it('12. should return 400 error if ID parameter is missing', async () => {
      const event = {
        context: { params: {} },
        res: { status: 200 }
      } as any;

      const response = await getIngredientByIdHandler(event);

      expect(event.res.status).toBe(400);
      expect(response).toEqual({ error: 'Ingredient ID is required' });
    });

    it('13. should throw error if select query fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('Select failed'));
      const event = {
        context: { params: { id: '123' } },
        res: { status: 200 }
      } as any;

      await expect(getIngredientByIdHandler(event)).rejects.toThrow('Select failed');
    });
  });

  // --- PUT /api/:id ---
  describe('PUT /api/:id (4 cases)', () => {
    it('14. should update ingredient and return status 204 on success', async () => {
      mockExecute.mockResolvedValueOnce([{}, []]);
      const event = {
        context: { params: { id: '123' } },
        req: {
          json: jest.fn().mockResolvedValue({ name: 'Brown Sugar', quantity: 20 })
        },
        res: { status: 200 }
      } as any;

      const response = await updateIngredientHandler(event);

      expect(mockExecute).toHaveBeenCalledWith(
        'UPDATE ingredients SET `name` = ?, `quantity` = ? WHERE id = ?',
        ['Brown Sugar', 20, '123']
      );
      expect(event.res.status).toBe(204);
      expect(response).toBeUndefined();
    });

    it('15. should return 422 if update body has invalid attributes', async () => {
      const event = {
        context: { params: { id: '123' } },
        req: {
          json: jest.fn().mockResolvedValue({ quantity: -5 }) // negative quantity
        },
        res: { status: 200 }
      } as any;

      const response = await updateIngredientHandler(event);

      expect(event.res.status).toBe(422);
      expect(response.message).toBe('Invalid update payload');
    });

    it('16. should return 400 if ID is missing during update', async () => {
      const event = {
        context: { params: {} },
        res: { status: 200 }
      } as any;

      const response = await updateIngredientHandler(event);

      expect(event.res.status).toBe(400);
      expect(response).toEqual({ error: 'Ingredient ID is required' });
    });

    it('17. should propagate error if update query fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('Update failed'));
      const event = {
        context: { params: { id: '123' } },
        req: {
          json: jest.fn().mockResolvedValue({ name: 'New Ingredient' })
        },
        res: { status: 200 }
      } as any;

      await expect(updateIngredientHandler(event)).rejects.toThrow('Update failed');
    });
  });

  // --- DELETE /api/:id ---
  describe('DELETE /api/:id (3 cases)', () => {
    it('18. should delete ingredient and return 204 on success', async () => {
      mockExecute.mockResolvedValueOnce([{}, []]);
      const event = {
        context: { params: { id: '123' } },
        res: { status: 200 }
      } as any;

      const response = await deleteIngredientHandler(event);

      expect(mockExecute).toHaveBeenCalledWith('DELETE FROM ingredients WHERE id = ?', ['123']);
      expect(event.res.status).toBe(204);
      expect(response).toBeUndefined();
    });

    it('19. should return 400 if ID is missing during delete', async () => {
      const event = {
        context: { params: {} },
        res: { status: 200 }
      } as any;

      const response = await deleteIngredientHandler(event);

      expect(event.res.status).toBe(400);
      expect(response).toEqual({ error: 'Ingredient ID is required' });
    });

    it('20. should propagate error if delete query fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('Delete failed'));
      const event = {
        context: { params: { id: '123' } },
        res: { status: 200 }
      } as any;

      await expect(deleteIngredientHandler(event)).rejects.toThrow('Delete failed');
    });
  });
});
