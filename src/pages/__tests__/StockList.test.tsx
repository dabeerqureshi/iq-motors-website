import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StockList from '../StockList';

// Mock the hooks
vi.mock('@/hooks/useStockList', () => ({
  useStockList: vi.fn(),
}));

import { useStockList } from '@/hooks/useStockList';

const mockUseStockList = useStockList as unknown as ReturnType<typeof vi.fn>;

const mockStockItems = [
  {
    id: 1,
    title: 'Mercedes-Benz C-Class',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2019,
    price: 25000,
    description: 'Excellent condition C-Class',
    imageUrl: ['https://example.com/c-class.jpg'],
    mileage: 45000,
    features: ['Leather Seats'],
  },
  {
    id: 2,
    title: 'Mercedes-Benz E-Class',
    make: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2020,
    price: 35000,
    description: 'Low mileage E-Class',
    imageUrl: ['https://example.com/e-class.jpg'],
    mileage: 30000,
    features: ['Panoramic Roof'],
  },
];

describe('StockList Page', () => {
  it('renders page title', () => {
    mockUseStockList.mockReturnValue({
      stockItems: [],
      soldCars: [],
      loading: true,
      error: null,
      soldLoading: true,
      soldError: null,
      refetchStock: vi.fn(),
      refetchSold: vi.fn(),
    });

    render(
      <BrowserRouter>
        <StockList />
      </BrowserRouter>
    );

    expect(screen.getByText(/mercedes-benz inventory/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseStockList.mockReturnValue({
      stockItems: [],
      soldCars: [],
      loading: true,
      error: null,
      soldLoading: true,
      soldError: null,
      refetchStock: vi.fn(),
      refetchSold: vi.fn(),
    });

    render(
      <BrowserRouter>
        <StockList />
      </BrowserRouter>
    );

    // Loading state shows skeleton cards
    expect(screen.getByText(/mercedes-benz inventory/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseStockList.mockReturnValue({
      stockItems: [],
      soldCars: [],
      loading: false,
      error: 'Failed to load inventory',
      soldLoading: false,
      soldError: null,
      refetchStock: vi.fn(),
      refetchSold: vi.fn(),
    });

    render(
      <BrowserRouter>
        <StockList />
      </BrowserRouter>
    );

    expect(screen.getByText(/trouble loading our inventory/i)).toBeInTheDocument();
  });

  it('renders car cards when data is loaded', () => {
    mockUseStockList.mockReturnValue({
      stockItems: mockStockItems,
      soldCars: [],
      loading: false,
      error: null,
      soldLoading: false,
      soldError: null,
      refetchStock: vi.fn(),
      refetchSold: vi.fn(),
    });

    render(
      <BrowserRouter>
        <StockList />
      </BrowserRouter>
    );

    expect(screen.getByText('Mercedes-Benz C-Class')).toBeInTheDocument();
    expect(screen.getByText('Mercedes-Benz E-Class')).toBeInTheDocument();
  });

  it('shows empty state when no cars available', () => {
    mockUseStockList.mockReturnValue({
      stockItems: [],
      soldCars: [],
      loading: false,
      error: null,
      soldLoading: false,
      soldError: null,
      refetchStock: vi.fn(),
      refetchSold: vi.fn(),
    });

    render(
      <BrowserRouter>
        <StockList />
      </BrowserRouter>
    );

    expect(screen.getByText(/no vehicles match/i)).toBeInTheDocument();
  });

  it('renders search input', () => {
    mockUseStockList.mockReturnValue({
      stockItems: mockStockItems,
      soldCars: [],
      loading: false,
      error: null,
      soldLoading: false,
      soldError: null,
      refetchStock: vi.fn(),
      refetchSold: vi.fn(),
    });

    render(
      <BrowserRouter>
        <StockList />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/search by model or keyword/i)).toBeInTheDocument();
  });

  it('renders sort dropdown', () => {
    mockUseStockList.mockReturnValue({
      stockItems: mockStockItems,
      soldCars: [],
      loading: false,
      error: null,
      soldLoading: false,
      soldError: null,
      refetchStock: vi.fn(),
      refetchSold: vi.fn(),
    });

    render(
      <BrowserRouter>
        <StockList />
      </BrowserRouter>
    );

    // The select shows "Sort: Newest first" by default
    expect(screen.getByText(/sort: newest first/i)).toBeInTheDocument();
  });
});
