import { vi } from 'vitest';

/**
 * Creates a mock Supabase client for testing.
 * Returns chainable mock methods that mirror the Supabase JS API.
 */
export const createMockSupabaseClient = (options?: {
  stockData?: Record<string, unknown>[];
  soldData?: Record<string, unknown>[];
  customerData?: Record<string, unknown>[];
  shouldFail?: boolean;
}) => {
  const {
    stockData = [],
    soldData = [],
    customerData = [],
    shouldFail = false,
  } = options || {};

  const mockError = shouldFail
    ? { message: 'Database connection failed', code: 'CONNECTION_ERROR' }
    : null;

  // Build chainable query mock
  const createQueryMock = (data: Record<string, unknown>[]) => {
    const queryMock: Record<string, unknown> = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      insert: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      single: vi.fn().mockReturnThis(),
    };

    // Terminal methods that resolve the promise
    (queryMock.select as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      ...queryMock,
      then: (resolve: (value: { data: unknown; error: unknown }) => void) =>
        resolve({ data, error: mockError }),
    }));

    return queryMock;
  };

  return {
    from: vi.fn().mockImplementation((table: string) => {
      if (table === 'stock_list') {
        return createQueryMock(stockData);
      }
      if (table === 'happy_customers') {
        return createQueryMock(customerData);
      }
      return createQueryMock([]);
    }),
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user', email: 'test@example.com' } },
        error: mockError,
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  };
};

/**
 * Mock data factories for consistent test data
 */
export const createMockStockItem = (overrides?: Partial<Record<string, unknown>>) => ({
  id: 1,
  title: 'Mercedes-Benz C-Class',
  price: 25000,
  year: '2019',
  miles_driven: '45,000',
  description: 'Excellent condition Mercedes C-Class',
  attributes: ['Leather Seats', 'Navigation', 'Bluetooth'],
  is_available: true,
  image_url: ['https://example.com/image1.jpg'],
  created_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockCustomer = (overrides?: Partial<Record<string, unknown>>) => ({
  id: 1,
  image_url: 'https://example.com/customer1.jpg',
  created_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

// Sample data sets for tests
export const sampleStockData = [
  {
    id: 1,
    title: 'Mercedes-Benz C-Class',
    price: 25000,
    year: '2019',
    miles_driven: '45,000',
    description: 'Excellent condition C-Class',
    attributes: ['Leather Seats', 'Navigation'],
    is_available: true,
    image_url: ['https://example.com/c-class.jpg'],
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Mercedes-Benz E-Class',
    price: 35000,
    year: '2020',
    miles_driven: '30,000',
    description: 'Low mileage E-Class',
    attributes: ['Panoramic Roof', 'Heated Seats'],
    is_available: true,
    image_url: ['https://example.com/e-class.jpg'],
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    title: 'Mercedes-Benz S-Class',
    price: 55000,
    year: '2021',
    miles_driven: '15,000',
    description: 'Flagship S-Class',
    attributes: ['Massage Seats', 'Air Suspension'],
    is_available: true,
    image_url: ['https://example.com/s-class.jpg'],
    created_at: '2024-01-03T00:00:00Z',
  },
];

export const sampleSoldData = [
  {
    id: 10,
    title: 'Mercedes-Benz A-Class',
    price: 20000,
    year: '2018',
    miles_driven: '60,000',
    description: 'Well maintained A-Class',
    attributes: ['Parking Sensors'],
    is_available: false,
    image_url: ['https://example.com/a-class.jpg'],
    created_at: '2024-01-04T00:00:00Z',
  },
];

export const sampleCustomerData = [
  {
    id: 1,
    image_url: 'https://example.com/customer1.jpg',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    image_url: 'https://example.com/customer2.jpg',
    created_at: '2024-01-02T00:00:00Z',
  },
];
