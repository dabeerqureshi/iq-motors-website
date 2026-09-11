import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CarCard from '../CarCard';
import { Car } from '../CarCard';

const mockCar: Car = {
  id: 1,
  title: 'Mercedes-Benz C-Class',
  make: 'Mercedes-Benz',
  model: 'C-Class',
  year: 2019,
  price: 25000,
  description: 'Excellent condition Mercedes C-Class sedan with low mileage',
  imageUrl: ['https://example.com/c-class.jpg'],
  mileage: 45000,
  features: ['Leather Seats', 'Navigation', 'Bluetooth'],
};

const renderCarCard = (car: Car, linkTo?: string) => {
  return render(
    <BrowserRouter>
      <CarCard car={car} linkTo={linkTo} />
    </BrowserRouter>
  );
};

describe('CarCard', () => {
  it('renders car title', () => {
    renderCarCard(mockCar);
    expect(screen.getByText('Mercedes-Benz C-Class')).toBeInTheDocument();
  });

  it('formats price correctly in GBP', () => {
    renderCarCard(mockCar);
    expect(screen.getByText('£25,000')).toBeInTheDocument();
  });

  it('formats mileage correctly', () => {
    renderCarCard(mockCar);
    expect(screen.getByText('45,000 miles')).toBeInTheDocument();
  });

  it('displays year badge', () => {
    renderCarCard(mockCar);
    expect(screen.getByText('2019')).toBeInTheDocument();
  });

  it('displays car description', () => {
    renderCarCard(mockCar);
    expect(screen.getByText(/Excellent condition Mercedes C-Class sedan/)).toBeInTheDocument();
  });

  it('displays first 3 features', () => {
    renderCarCard(mockCar);
    expect(screen.getByText('Leather Seats')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Bluetooth')).toBeInTheDocument();
  });

  it('shows "Available" badge for unsold cars', () => {
    renderCarCard(mockCar);
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('shows "SOLD" badge for sold cars', () => {
    const soldCar = { ...mockCar, isSold: true };
    renderCarCard(soldCar);
    expect(screen.getByText('SOLD')).toBeInTheDocument();
  });

  it('does not show "Available" badge for sold cars', () => {
    const soldCar = { ...mockCar, isSold: true };
    renderCarCard(soldCar);
    expect(screen.queryByText('Available')).not.toBeInTheDocument();
  });

  it('renders as a link when linkTo is provided', () => {
    renderCarCard(mockCar, '/car/1');
    const link = screen.getByRole('link', { name: /View details of Mercedes-Benz C-Class/ });
    expect(link).toHaveAttribute('href', '/car/1');
  });

  it('does not render as a link when linkTo is not provided', () => {
    renderCarCard(mockCar);
    expect(screen.queryByRole('link', { name: /View details/ })).not.toBeInTheDocument();
  });

  it('handles empty features array', () => {
    const carNoFeatures = { ...mockCar, features: [] };
    renderCarCard(carNoFeatures);
    expect(screen.getByText('Mercedes-Benz C-Class')).toBeInTheDocument();
  });

  it('handles empty image array', () => {
    const carNoImages = { ...mockCar, imageUrl: [] };
    renderCarCard(carNoImages);
    expect(screen.getByText('No Image Available')).toBeInTheDocument();
  });

  it('formats large prices correctly', () => {
    const expensiveCar = { ...mockCar, price: 150000 };
    renderCarCard(expensiveCar);
    expect(screen.getByText('£150,000')).toBeInTheDocument();
  });

  it('formats large mileage correctly', () => {
    const highMileageCar = { ...mockCar, mileage: 150000 };
    renderCarCard(highMileageCar);
    expect(screen.getByText('150,000 miles')).toBeInTheDocument();
  });
});
