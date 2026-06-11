import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockExecute = jest.fn();
const mockDb = {
  __esModule: true,
  default: {
    execute: mockExecute
  }
};

// 1. Mock the database pool module before importing handlers
jest.mock('#server/database.ts', () => mockDb);

// Mock the nitro package to avoid ESM runtime issues when importing handlers
jest.mock('nitro', () => {
  return {
    defineHandler: (handler: any) => handler
  };
});

// Import handlers after mocking
import getMenusHandler from '#server/api/index.get.ts';
import createMenuHandler from '#server/api/index.post.ts';
import getMenuByIdHandler from '#server/api/[id]/index.get.ts';
import updateMenuHandler from '#server/api/[id]/index.put.ts';
import deleteMenuHandler from '#server/api/[id]/index.delete.ts';

describe('Menu API Handlers - 20 Test Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- GET /api ---
  describe('GET /api (4 cases)', () => {
    it('1. should return a list of menus with status 200', async () => {
      const mockRows = [
        { id: 1, name: 'Curry', description: 'Spicy', price: 10.0 },
        { id: 2, name: 'Naan', description: 'Butter', price: 3.5 }
      ];
      mockExecute.mockResolvedValueOnce([mockRows, []]);

      const event = {} as any;
      const response = await getMenusHandler(event);

      expect(mockExecute).toHaveBeenCalledWith('SELECT * FROM menu');
      expect(response).toEqual({
        data: [
          { _id: 1, _name: 'Curry', _description: 'Spicy', _price: 10.0 },
          { _id: 2, _name: 'Naan', _description: 'Butter', _price: 3.5 }
        ]
      });
    });

    it('2. should return empty list if no menus in DB', async () => {
      mockExecute.mockResolvedValueOnce([[], []]);

      const event = {} as any;
      const response = await getMenusHandler(event);

      expect(response).toEqual({ data: [] });
    });

    it('3. should throw error if DB query fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('DB connection failed'));

      const event = {} as any;
      await expect(getMenusHandler(event)).rejects.toThrow('DB connection failed');
    });

    it('4. should verify response shape has data array', async () => {
      mockExecute.mockResolvedValueOnce([[ { id: 5, name: 'Lassi', description: null, price: 4.0 } ], []]);
      const response = await getMenusHandler({} as any);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data[0]._name).toBe('Lassi');
    });
  });

  // --- POST /api ---
  describe('POST /api (5 cases)', () => {
    it('5. should create menu successfully and return 201', async () => {
      mockExecute.mockResolvedValueOnce([{}, []]);
      const event = {
        req: {
          json: jest.fn().mockResolvedValue({ name: 'Egg Roll', description: 'Appetizer', price: 5.0 })
        },
        res: { status: 200 }
      } as any;

      const response = await createMenuHandler(event);

      expect(mockExecute).toHaveBeenCalled();
      expect(event.res.status).toBe(201);
      expect(response.message).toBe('Menu created successfully!');
      expect(response.data._name).toBe('Egg Roll');
      expect(response.data._price).toBe(5.0);
    });

    it('6. should return 422 if body name validation fails (too short)', async () => {
      const event = {
        req: {
          json: jest.fn().mockResolvedValue({ name: 'A', description: 'Valid desc', price: 5.0 })
        },
        res: { status: 200 }
      } as any;

      const response = await createMenuHandler(event);

      expect(event.res.status).toBe(422);
      expect(response.message).toBe('Invalid menu data');
      expect(response).toHaveProperty('errors');
    });

    it('7. should return 422 if price is negative', async () => {
      const event = {
        req: {
          json: jest.fn().mockResolvedValue({ name: 'Salad', description: null, price: -2.5 })
        },
        res: { status: 200 }
      } as any;

      const response = await createMenuHandler(event);

      expect(event.res.status).toBe(422);
      expect(response.message).toBe('Invalid menu data');
    });

    it('8. should propagate error if DB insert fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('Insert error'));
      const event = {
        req: {
          json: jest.fn().mockResolvedValue({ name: 'Spring Roll', description: null, price: 4.0 })
        },
        res: { status: 200 }
      } as any;

      await expect(createMenuHandler(event)).rejects.toThrow('Insert error');
    });

    it('9. should ensure createMenu inserts fields into DB', async () => {
      mockExecute.mockResolvedValueOnce([{}, []]);
      const event = {
        req: {
          json: jest.fn().mockResolvedValue({ name: 'Soup', description: 'Veg soup', price: 6.50 })
        },
        res: { status: 200 }
      } as any;

      const response = await createMenuHandler(event);
      expect(mockExecute).toHaveBeenCalledWith(
        'INSERT INTO menu (id, name, description, price) VALUES (?, ?, ?, ?)',
        [expect.any(Number), 'Soup', 'Veg soup', 6.50]
      );
    });
  });

  // --- GET /api/:id ---
  describe('GET /api/:id (4 cases)', () => {
    it('10. should return menu data if found in DB', async () => {
      const mockMenu = { id: 123, name: 'Burger', description: 'Beef patty', price: 12.00 };
      mockExecute.mockResolvedValueOnce([[mockMenu], []]);
      const event = {
        context: { params: { id: '123' } },
        res: { status: 200 }
      } as any;

      const response = await getMenuByIdHandler(event);

      expect(mockExecute).toHaveBeenCalledWith('SELECT * FROM menu WHERE id = ?', ['123']);
      expect(response.data._name).toBe('Burger');
      expect(response.data._price).toBe(12.00);
    });

    it('11. should return 404 error if menu not found', async () => {
      mockExecute.mockResolvedValueOnce([[], []]);
      const event = {
        context: { params: { id: '999' } },
        res: { status: 200 }
      } as any;

      const response = await getMenuByIdHandler(event);

      expect(event.res.status).toBe(404);
      expect(response).toEqual({ error: 'Menu not found' });
    });

    it('12. should return 400 error if ID parameter is missing', async () => {
      const event = {
        context: { params: {} },
        res: { status: 200 }
      } as any;

      const response = await getMenuByIdHandler(event);

      expect(event.res.status).toBe(400);
      expect(response).toEqual({ error: 'Menu ID is required' });
    });

    it('13. should throw error if select query fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('Select failed'));
      const event = {
        context: { params: { id: '123' } },
        res: { status: 200 }
      } as any;

      await expect(getMenuByIdHandler(event)).rejects.toThrow('Select failed');
    });
  });

  // --- PUT /api/:id ---
  describe('PUT /api/:id (4 cases)', () => {
    it('14. should update menu and return status 204 on success', async () => {
      mockExecute.mockResolvedValueOnce([{}, []]);
      const event = {
        context: { params: { id: '123' } },
        req: {
          json: jest.fn().mockResolvedValue({ name: 'Cheeseburger', price: 13.50 })
        },
        res: { status: 200 }
      } as any;

      const response = await updateMenuHandler(event);

      expect(mockExecute).toHaveBeenCalledWith(
        'UPDATE menu SET `name` = ?, `price` = ? WHERE id = ?',
        ['Cheeseburger', 13.50, '123']
      );
      expect(event.res.status).toBe(204);
      expect(response).toBeUndefined();
    });

    it('15. should return 422 if update body has invalid attributes', async () => {
      const event = {
        context: { params: { id: '123' } },
        req: {
          json: jest.fn().mockResolvedValue({ price: -5 }) // negative price
        },
        res: { status: 200 }
      } as any;

      const response = await updateMenuHandler(event);

      expect(event.res.status).toBe(422);
      expect(response.message).toBe('Invalid update payload');
    });

    it('16. should return 400 if ID is missing during update', async () => {
      const event = {
        context: { params: {} },
        res: { status: 200 }
      } as any;

      const response = await updateMenuHandler(event);

      expect(event.res.status).toBe(400);
      expect(response).toEqual({ error: 'Menu ID is required' });
    });

    it('17. should propagate error if update query fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('Update failed'));
      const event = {
        context: { params: { id: '123' } },
        req: {
          json: jest.fn().mockResolvedValue({ name: 'New Hotdog' })
        },
        res: { status: 200 }
      } as any;

      await expect(updateMenuHandler(event)).rejects.toThrow('Update failed');
    });
  });

  // --- DELETE /api/:id ---
  describe('DELETE /api/:id (3 cases)', () => {
    it('18. should delete menu and return 204 on success', async () => {
      mockExecute.mockResolvedValueOnce([{}, []]);
      const event = {
        context: { params: { id: '123' } },
        res: { status: 200 }
      } as any;

      const response = await deleteMenuHandler(event);

      expect(mockExecute).toHaveBeenCalledWith('DELETE FROM menu WHERE id = ?', ['123']);
      expect(event.res.status).toBe(204);
      expect(response).toBeUndefined();
    });

    it('19. should return 400 if ID is missing during delete', async () => {
      const event = {
        context: { params: {} },
        res: { status: 200 }
      } as any;

      const response = await deleteMenuHandler(event);

      expect(event.res.status).toBe(400);
      expect(response).toEqual({ error: 'Menu ID is required' });
    });

    it('20. should propagate error if delete query fails', async () => {
      mockExecute.mockRejectedValueOnce(new Error('Delete failed'));
      const event = {
        context: { params: { id: '123' } },
        res: { status: 200 }
      } as any;

      await expect(deleteMenuHandler(event)).rejects.toThrow('Delete failed');
    });
  });
});
