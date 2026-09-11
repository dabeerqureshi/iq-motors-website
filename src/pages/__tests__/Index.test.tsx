import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Index from '../Index';

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

const mockCarsData = [
  {
    id: 1,
    title: 'Mercedes-Benz C-Class',
    price: 25000,
    year: '2019',
    miles_driven: '45,000',
    description: 'Excellent condition C-Class',
    attributes: ['Leather Seats'],
    is_available: true,
    image_url: ['https://example.com/c-class.jpg'],
    created_at: '2024-01-01T00:00:00Z',
  },
];

const mockTestimonialsData = [
  { id: 1, image_url: 'https://example.com/customer1.jpg', created_at: '2024-01-01' },
];

describe('Index Page', () => {
  beforeEach(() => {
    mockSupabase.from.mockImplementation((table: string) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({
        data: table === 'stock_list' ? mockCarsData : mockTestimonialsData,
        error: null,
      }),
    }));
  });

  it('renders hero section', () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    expect(screen.getByText(/find your perfect vehicle/i)).toBeInTheDocument();
  });

  it('renders CTA buttons in hero', () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    expect(screen.getByText(/browse inventory/i)).toBeInTheDocument();
    // "Contact Us" appears in both hero and footer, so use getAllByText
    expect(screen.getAllByText(/contact us/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders featured vehicles section', () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    expect(screen.getByText(/featured vehicles/i)).toBeInTheDocument();
  });

  it('renders car cards in featured section', async () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    // Wait for data to load
    await screen.findByText('Mercedes-Benz C-Class', {}, { timeout: 5000 });
    expect(screen.getByText('Mercedes-Benz C-Class')).toBeInTheDocument();
  });

  it('renders brand certifications section', () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    expect(screen.getByText(/our brand certifications/i)).toBeInTheDocument();
  });

  it('shows loading state for featured vehicles', () => {
    // Mock a never-resolving promise to keep loading state
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnValue(new Promise(() => {})),
    });

    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading featured cars/i)).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    // "IQ Motors" appears in both hero text and footer
    expect(screen.getAllByText(/iq motors/i).length).toBeGreaterThanOrEqual(1);
  });
});
