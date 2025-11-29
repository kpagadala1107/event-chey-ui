import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../UI/Button';

describe('Button Component', () => {
  test('renders button with children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies primary variant by default', () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass('bg-indigo-600');
  });

  test('applies secondary variant when specified', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByText('Secondary Button');
    expect(button).toHaveClass('bg-gray-200');
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByText('Disabled Button');
    expect(button).toBeDisabled();
  });

  test('shows loading state', () => {
    render(<Button loading>Loading Button</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('applies fullWidth class when fullWidth is true', () => {
    render(<Button fullWidth>Full Width Button</Button>);
    const button = screen.getByText('Full Width Button');
    expect(button).toHaveClass('w-full');
  });
});
