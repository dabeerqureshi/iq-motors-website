import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CarDetail from '../CarDetail';

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

const mockCarData = {
  id: 1,
  title: 'Mercedes-Benz C-Class',
  price: 25000,
  year: '2019',
  miles_driven: '45,000',
  description: 'Excellent condition C-Class',
  attributes: ['Leather Seats', 'Navigation'],
  is_available: true,
  image_url: ['https://example.com/c-class1.jpg', 'https://example.com/c-class2.jpg'],
  created_at: '2024-01-01T00:00:00Z',
};

const renderCarDetail = (carId = '1') => {
  return render(
    <MemoryRouter initialEntries={[`/car/${carId}`]}>
      <Routes>
        <Route path="/car/:id" element={<CarDetail />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('CarDetail Page', () => {
  it('shows loading state initially', () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockReturnValue(new Promise(() => {})),
    });

    renderCarDetail();

    expect(screen.getByText(/loading vehicle/i)).toBeInTheDocument();
  });

  it('renders car details when loaded', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: mockCarData, error: null }),
    });

    renderCarDetail();

    await waitFor(() => {
      expect(screen.getByText('Mercedes-Benz C-Class')).toBeInTheDocument();
    });

    expect(screen.getByText('£25,000')).toBeInTheDocument();
    // Year appears in multiple places, use getAllByText
    expect(screen.getAllByText('2019').length).toBeGreaterThanOrEqual(1);
    // Mileage appears in multiple places, use getAllByText
    expect(screen.getAllByText('45,000 miles').length).toBeGreaterThanOrEqual(1);
  });

  it('shows not found message when car does not exist', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    });

    renderCarDetail();

    await waitFor(() => {
      expect(screen.getByText(/vehicle not found/i)).toBeInTheDocument();
    });
  });

  it('shows not found message on fetch failure', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      }),
    });

    renderCarDetail();

    await waitFor(() => {
      expect(screen.getByText(/vehicle not found/i)).toBeInTheDocument();
    });
  });

  it('renders contact button', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: mockCarData, error: null }),
    });

    renderCarDetail();

    await waitFor(() => {
      expect(screen.getByText(/contact about this car/i)).toBeInTheDocument();
    });
  });

  it('renders features list', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: mockCarData, error: null }),
    });

    renderCarDetail();

    await waitFor(() => {
      expect(screen.getByText('Leather Seats')).toBeInTheDocument();
      expect(screen.getByText('Navigation')).toBeInTheDocument();
    });
  });

  it('renders browse inventory link', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    });

    renderCarDetail();

    await waitFor(() => {
      expect(screen.getByText(/browse our inventory/i)).toBeInTheDocument();
    });
  });
});
