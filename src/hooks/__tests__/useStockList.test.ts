import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useStockList } from '../useStockList';

// Mock the supabase module
vi.mock('@/supabase/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import { supabase } from '@/supabase/supabase';

const mockSupabase = supabase as unknown as {
  from: ReturnType<typeof vi.fn>;
};

describe('useStockList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with loading state', () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    const { result } = renderHook(() => useStockList());

    expect(result.current.loading).toBe(true);
    expect(result.current.stockItems).toEqual([]);
    expect(result.current.soldCars).toEqual([]);
  });

  it('fetches stock items successfully', async () => {
    const mockData = [
      {
        id: 1,
        title: 'Mercedes-Benz C-Class',
        price: 25000,
        year: '2019',
        miles_driven: '45,000',
        description: 'Excellent condition',
        attributes: ['Leather Seats'],
        is_available: true,
        image_url: ['https://example.com/image.jpg'],
        created_at: '2024-01-01T00:00:00Z',
      },
    ];

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const { result } = renderHook(() => useStockList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stockItems).toHaveLength(1);
    expect(result.current.stockItems[0].title).toBe('Mercedes-Benz C-Class');
    expect(result.current.stockItems[0].price).toBe(25000);
  });

  it('fetches sold cars successfully', async () => {
    const mockSoldData = [
      {
        id: 10,
        title: 'Mercedes-Benz A-Class',
        price: 20000,
        year: '2018',
        miles_driven: '60,000',
        description: 'Well maintained',
        attributes: ['Parking Sensors'],
        is_available: false,
        image_url: ['https://example.com/a-class.jpg'],
        created_at: '2024-01-04T00:00:00Z',
      },
    ];

    mockSupabase.from.mockImplementation((table: string) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: table === 'stock_list' ? mockSoldData : [],
        error: null,
      }),
    }));

    const { result } = renderHook(() => useStockList());

    await waitFor(() => {
      expect(result.current.soldLoading).toBe(false);
    });

    expect(result.current.soldCars).toHaveLength(1);
    expect(result.current.soldCars[0].isSold).toBe(true);
  });

  it('handles fetch error gracefully', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Connection failed' },
      }),
    });

    const { result } = renderHook(() => useStockList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Error message is passed through from Supabase
    expect(result.current.error).toBeTruthy();
    expect(result.current.stockItems).toEqual([]);
  });

  it('normalizes year from string to number', async () => {
    const mockData = [
      {
        id: 1,
        title: 'Mercedes-Benz C-Class',
        price: 25000,
        year: '2019',
        miles_driven: '45,000',
        description: 'Test',
        attributes: [],
        is_available: true,
        image_url: [],
        created_at: '2024-01-01T00:00:00Z',
      },
    ];

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const { result } = renderHook(() => useStockList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stockItems[0].year).toBe(2019);
    expect(typeof result.current.stockItems[0].year).toBe('number');
  });

  it('parses mileage with commas correctly', async () => {
    const mockData = [
      {
        id: 1,
        title: 'Mercedes-Benz C-Class',
        price: 25000,
        year: '2019',
        miles_driven: '100,000',
        description: 'Test',
        attributes: [],
        is_available: true,
        image_url: [],
        created_at: '2024-01-01T00:00:00Z',
      },
    ];

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const { result } = renderHook(() => useStockList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stockItems[0].mileage).toBe(100000);
  });

  it('handles null miles_driven', async () => {
    const mockData = [
      {
        id: 1,
        title: 'Mercedes-Benz C-Class',
        price: 25000,
        year: '2019',
        miles_driven: null,
        description: 'Test',
        attributes: null,
        is_available: true,
        image_url: null,
        created_at: '2024-01-01T00:00:00Z',
      },
    ];

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const { result } = renderHook(() => useStockList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stockItems[0].mileage).toBe(0);
    expect(result.current.stockItems[0].features).toEqual([]);
    expect(result.current.stockItems[0].imageUrl).toEqual([]);
  });

  it('provides refetch functions', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    const { result } = renderHook(() => useStockList());

    expect(typeof result.current.refetchStock).toBe('function');
    expect(typeof result.current.refetchSold).toBe('function');
  });
});
