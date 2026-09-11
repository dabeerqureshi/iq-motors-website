import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStockFiltering } from '../useStockFiltering';
import { Car } from '@/components/CarCard';

const mockCars: Car[] = [
  {
    id: 1,
    title: 'Mercedes-Benz C-Class',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2019,
    price: 25000,
    description: 'Excellent condition C-Class sedan',
    imageUrl: [],
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
    imageUrl: [],
    mileage: 30000,
    features: ['Panoramic Roof'],
  },
  {
    id: 3,
    title: 'Mercedes-Benz S-Class',
    make: 'Mercedes-Benz',
    model: 'S-Class',
    year: 2021,
    price: 55000,
    description: 'Flagship luxury sedan',
    imageUrl: [],
    mileage: 15000,
    features: ['Massage Seats'],
  },
  {
    id: 4,
    title: 'Mercedes-Benz A-Class',
    make: 'Mercedes-Benz',
    model: 'A-Class',
    year: 2018,
    price: 20000,
    description: 'Compact A-Class hatchback',
    imageUrl: [],
    mileage: 60000,
    features: ['Parking Sensors'],
  },
  {
    id: 5,
    title: 'Mercedes-Benz GLE',
    make: 'Mercedes-Benz',
    model: 'GLE',
    year: 2022,
    price: 65000,
    description: 'Luxury SUV with all features',
    imageUrl: [],
    mileage: 10000,
    features: ['Air Suspension'],
  },
  {
    id: 6,
    title: 'Mercedes-Benz CLA',
    make: 'Mercedes-Benz',
    model: 'CLA',
    year: 2020,
    price: 28000,
    description: 'Sporty four-door coupe',
    imageUrl: [],
    mileage: 35000,
    features: ['AMG Line'],
  },
  {
    id: 7,
    title: 'Mercedes-Benz GLC',
    make: 'Mercedes-Benz',
    model: 'GLC',
    year: 2021,
    price: 42000,
    description: 'Mid-size luxury SUV',
    imageUrl: [],
    mileage: 25000,
    features: ['4MATIC'],
  },
];

describe('useStockFiltering', () => {
  describe('search functionality', () => {
    it('returns all cars when search is empty', () => {
      const { result } = renderHook(() => useStockFiltering(mockCars));
      expect(result.current.filteredCars).toHaveLength(7);
    });

    it('filters by model name', () => {
      const { result } = renderHook(() => useStockFiltering(mockCars));
      
      act(() => {
        result.current.setSearchTerm('C-Class');
      });

      expect(result.current.filteredCars).toHaveLength(1);
      expect(result.current.filteredCars[0].model).toBe('C-Class');
    });

    it('filters by title', () => {
      const { result } = renderHook(() => useStockFiltering(mockCars));
      
      act(() => {
        result.current.setSearchTerm('GLE');
      });

      expect(result.current.filteredCars).toHaveLength(1);
      expect(result.current.filteredCars[0].title).toContain('GLE');
    });

    it('filters by description', () => {
      const { result } = renderHook(() => useStockFiltering(mockCars));
      
      act(() => {
        result.current.setSearchTerm('luxury');
      });

      expect(result.current.filteredCars).toHaveLength(3);
    });

    it('search is case insensitive', () => {
      const { result } = renderHook(() => useStockFiltering(mockCars));
      
      act(() => {
        result.current.setSearchTerm('c-class');
      });

      expect(result.current.filteredCars).toHaveLength(1);
    });

    it('returns empty array when no match', () => {
      const { result } = renderHook(() => useStockFiltering(mockCars));
      
      act(() => {
        result.current.setSearchTerm('BMW');
      });

      expect(result.current.filteredCars).toHaveLength(0);
    });
  });

  describe('sorting functionality', () => {
    it('sorts by price low to high', () => {
      const { result } = renderHook(() => useStockFiltering(mockCars));
      
      act(() => {
        result.current.setPriceSort('low-to-high');
      });

      const prices = result.current.filteredCars.map(c => c.price);
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
      expect(prices[0]).toBe(20000);
    });

    it('sorts by price high to low', () => {
      const { result } = renderHook(() => useStockFiltering(mockCars));
      
      act(() => {
        result.current.setPriceSort('high-to-low');
      });

      const prices = result.current.filteredCars.map(c => c.price);
      expect(prices).toEqual([...prices].sort((a, b) => b - a));
      expect(prices[0]).toBe(65000);
    });

    it('maintains original order when sort is none', () => {
      const { result } = renderHook(() => useStockFiltering(mockCars));
      
      act(() => {
        result.current.setPriceSort('none');
      });

      expect(result.current.filteredCars[0].id).toBe(1);
      expect(result.current.filteredCars[6].id).toBe(7);
    });
  });

  describe('pagination functionality', () => {
    it('returns correct items per page', () => {
      const { result } = renderHook(() => useStockFiltering(mockCars, 3));
      
      expect(result.current.currentItems).toHaveLength(3);
      expect(result.current.totalPages).toBe(3);
    });

    it('returns correct page items', () => {
      const { result } = renderHook(() => useStockFiltering(mockCars, 3));
      
      act(() => {
        result.current.setCurrentPage(2);
      });

      expect(result.current.currentItems).toHaveLength(3);
      expect(result.current.currentItems[0].id).toBe(4);
    });

    it('handles last page with fewer items', () => {
      const { result } = renderHook(() => useStockFiltering(mockCars, 3));
      
      act(() => {
        result.current.setCurrentPage(3);
      });

      expect(result.current.currentItems).toHaveLength(1);
    });

    it('resets to page 1 when search changes', () => {
      const { result } = renderHook(() => useStockFiltering(mockCars, 3));
      
      act(() => {
        result.current.setCurrentPage(2);
      });
      
      act(() => {
        result.current.setSearchTerm('C-Class');
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('handles empty car list', () => {
      const { result } = renderHook(() => useStockFiltering([], 6));
      
      expect(result.current.filteredCars).toHaveLength(0);
      expect(result.current.currentItems).toHaveLength(0);
      expect(result.current.totalPages).toBe(0);
    });
  });

  describe('reset functionality', () => {
    it('resets all filters', () => {
      const { result } = renderHook(() => useStockFiltering(mockCars));
      
      act(() => {
        result.current.setSearchTerm('C-Class');
        result.current.setPriceSort('low-to-high');
        result.current.setCurrentPage(2);
      });

      act(() => {
        result.current.resetFilters();
      });

      expect(result.current.searchTerm).toBe('');
      expect(result.current.priceSort).toBe('none');
      expect(result.current.currentPage).toBe(1);
      expect(result.current.filteredCars).toHaveLength(7);
    });
  });

  describe('combined search and sort', () => {
    it('applies search then sort', () => {
      const { result } = renderHook(() => useStockFiltering(mockCars));
      
      act(() => {
        result.current.setSearchTerm('Mercedes');
        result.current.setPriceSort('high-to-low');
      });

      expect(result.current.filteredCars).toHaveLength(7);
      expect(result.current.filteredCars[0].price).toBe(65000);
    });
  });
});
