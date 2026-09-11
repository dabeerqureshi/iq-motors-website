import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CarImageGallery from '../CarImageGallery';

// Mock window.addEventListener for keyboard tests
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

describe('CarImageGallery', () => {
  beforeAll(() => {
    window.addEventListener = mockAddEventListener;
    window.removeEventListener = mockRemoveEventListener;
  });

  it('renders single image directly', () => {
    render(
      <CarImageGallery
        images={['https://example.com/image1.jpg']}
        carTitle="Mercedes C-Class"
      />
    );

    const img = screen.getByAltText('Mercedes C-Class');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image1.jpg');
  });

  it('renders "Image Unavailable" when images array is empty', () => {
    render(
      <CarImageGallery
        images={[]}
        carTitle="Mercedes C-Class"
      />
    );

    expect(screen.getByText('Image Unavailable')).toBeInTheDocument();
  });

  it('renders navigation buttons for multiple images', () => {
    render(
      <CarImageGallery
        images={[
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg',
        ]}
        carTitle="Mercedes C-Class"
      />
    );

    expect(screen.getByRole('button', { name: /previous image/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next image/i })).toBeInTheDocument();
  });

  it('does not render navigation for single image', () => {
    render(
      <CarImageGallery
        images={['https://example.com/image1.jpg']}
        carTitle="Mercedes C-Class"
      />
    );

    expect(screen.queryByRole('button', { name: /previous image/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /next image/i })).not.toBeInTheDocument();
  });

  it('shows dot indicators for multiple images', () => {
    render(
      <CarImageGallery
        images={[
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg',
          'https://example.com/image3.jpg',
        ]}
        carTitle="Mercedes C-Class"
      />
    );

    const dots = screen.getAllByRole('button', { name: /go to slide/i });
    expect(dots).toHaveLength(3);
  });

  it('navigates to next image on next button click', () => {
    render(
      <CarImageGallery
        images={[
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg',
        ]}
        carTitle="Mercedes C-Class"
      />
    );

    const nextButton = screen.getByRole('button', { name: /next image/i });
    fireEvent.click(nextButton);

    const img = screen.getByAltText(/Mercedes C-Class - Slide 2/i);
    expect(img).toHaveAttribute('src', 'https://example.com/image2.jpg');
  });

  it('navigates to previous image on previous button click', () => {
    render(
      <CarImageGallery
        images={[
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg',
        ]}
        carTitle="Mercedes C-Class"
      />
    );

    const prevButton = screen.getByRole('button', { name: /previous image/i });
    fireEvent.click(prevButton);

    const img = screen.getByAltText(/Mercedes C-Class - Slide 2/i);
    expect(img).toHaveAttribute('src', 'https://example.com/image2.jpg');
  });

  it('wraps around to first image when clicking next on last image', () => {
    render(
      <CarImageGallery
        images={[
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg',
        ]}
        carTitle="Mercedes C-Class"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /next image/i }));
    expect(screen.getByAltText(/Mercedes C-Class - Slide 2/i)).toHaveAttribute('src', 'https://example.com/image2.jpg');

    fireEvent.click(screen.getByRole('button', { name: /next image/i }));
    expect(screen.getByAltText(/Mercedes C-Class - Slide 1/i)).toHaveAttribute('src', 'https://example.com/image1.jpg');
  });

  it('wraps around to last image when clicking previous on first image', () => {
    render(
      <CarImageGallery
        images={[
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg',
        ]}
        carTitle="Mercedes C-Class"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /previous image/i }));
    expect(screen.getByAltText(/Mercedes C-Class - Slide 2/i)).toHaveAttribute('src', 'https://example.com/image2.jpg');
  });

  it('navigates to specific image on dot click', () => {
    render(
      <CarImageGallery
        images={[
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg',
          'https://example.com/image3.jpg',
        ]}
        carTitle="Mercedes C-Class"
      />
    );

    const dots = screen.getAllByRole('button', { name: /go to slide/i });
    fireEvent.click(dots[2]);

    expect(screen.getByAltText(/Mercedes C-Class - Slide 3/i)).toHaveAttribute('src', 'https://example.com/image3.jpg');
  });

  it('uses mainImage as first image when provided', () => {
    render(
      <CarImageGallery
        images={['https://example.com/image2.jpg']}
        mainImage="https://example.com/main.jpg"
        carTitle="Mercedes C-Class"
      />
    );

    const img = screen.getByAltText(/Mercedes C-Class - Slide 1/i);
    expect(img).toHaveAttribute('src', 'https://example.com/main.jpg');
  });

  it('registers keyboard event listener for navigation', () => {
    render(
      <CarImageGallery
        images={[
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg',
        ]}
        carTitle="Mercedes C-Class"
      />
    );

    expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
