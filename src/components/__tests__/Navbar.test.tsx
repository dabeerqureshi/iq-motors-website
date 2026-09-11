import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe('Navbar', () => {
  it('renders the logo', () => {
    renderNavbar();
    expect(screen.getByAltText('iQ Motors Logo')).toBeInTheDocument();
  });

  it('renders all navigation links on desktop', () => {
    renderNavbar();
    
    const expectedLinks = [
      'Home',
      'Stock List',
      'Sold Cars',
      'Happy Customers',
      'Finance',
      'Servicing',
      'About',
      'Contact',
    ];

    expectedLinks.forEach((link) => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  it('renders mobile menu button', () => {
    renderNavbar();
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  });

  it('toggles mobile menu on button click', () => {
    renderNavbar();
    
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    
    // Open menu
    fireEvent.click(menuButton);
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
    
    // Close menu
    fireEvent.click(screen.getByRole('button', { name: /close menu/i }));
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  });

  it('shows mobile navigation links when menu is open', () => {
    renderNavbar();
    
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    
    const expectedLinks = [
      'Home',
      'Stock List',
      'Sold Cars',
      'Happy Customers',
      'Finance',
      'Servicing',
      'About',
      'Contact',
    ];

    expectedLinks.forEach((link) => {
      const links = screen.getAllByText(link);
      expect(links.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('has correct href for navigation links', () => {
    renderNavbar();
    
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Stock List').closest('a')).toHaveAttribute('href', '/stock');
    expect(screen.getByText('Sold Cars').closest('a')).toHaveAttribute('href', '/sold');
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact');
  });

  it('logo links to home page', () => {
    renderNavbar();
    const logo = screen.getByAltText('iQ Motors Logo').closest('a');
    expect(logo).toHaveAttribute('href', '/');
  });
});
