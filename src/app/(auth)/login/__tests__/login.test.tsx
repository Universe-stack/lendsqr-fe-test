import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../page';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';
import type { ImageProps } from 'next/image';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Omit<ImageProps, 'src'> & { src: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />;
  },
}));

describe('LoginPage', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    // Clear localStorage before each test
    localStorage.clear();
  });

  // Positive Test Scenarios
  describe('Positive Scenarios', () => {
    it('renders login page with all elements', () => {
      render(<LoginPage />);
      
      // Check for main elements
      expect(screen.getByText('Welcome!')).toBeInTheDocument();
      expect(screen.getByText('Enter details to login.')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByText('FORGOT PASSWORD?')).toBeInTheDocument();
      expect(screen.getByText('LOG IN')).toBeInTheDocument();
    });

    it('successfully logs in with correct credentials', async () => {
      render(<LoginPage />);
      
      // Fill in the form
      await userEvent.type(screen.getByPlaceholderText('Email'), 'admin@gmail.com');
      await userEvent.type(screen.getByPlaceholderText('Password'), 'admin');
      
      // Submit the form
      fireEvent.click(screen.getByText('LOG IN'));
      
      // Check if authentication is set in localStorage
      expect(localStorage.getItem('isAuthenticated')).toBe('true');
      
      // Check if router.push was called with correct path
      expect(mockRouter.push).toHaveBeenCalledWith('/users');
    });

    it('toggles password visibility when show/hide button is clicked', async () => {
      render(<LoginPage />);
      
      const passwordInput = screen.getByPlaceholderText('Password');
      const toggleButton = screen.getByText('SHOW');
      
      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click show button
      await userEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(screen.getByText('HIDE')).toBeInTheDocument();
      
      // Click hide button
      await userEvent.click(screen.getByText('HIDE'));
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(screen.getByText('SHOW')).toBeInTheDocument();
    });
  });

  // Negative Test Scenarios
  describe('Negative Scenarios', () => {
    it('shows error message with incorrect credentials', async () => {
      render(<LoginPage />);
      
      // Fill in the form with incorrect credentials
      await userEvent.type(screen.getByPlaceholderText('Email'), 'wrong@email.com');
      await userEvent.type(screen.getByPlaceholderText('Password'), 'wrongpass');
      
      // Submit the form
      fireEvent.click(screen.getByText('LOG IN'));
      
      // Check for error hints
      expect(screen.getByText('Use: admin@gmail.com')).toBeInTheDocument();
      expect(screen.getByText('Use: admin')).toBeInTheDocument();
      
      // Check that authentication is not set
      expect(localStorage.getItem('isAuthenticated')).toBeNull();
      
      // Check that router.push was not called
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('shows error hints for incorrect credentials', async () => {
      render(<LoginPage />);
      
      // Fill in the form with incorrect credentials
      await userEvent.type(screen.getByPlaceholderText('Email'), 'wrong@email.com');
      await userEvent.type(screen.getByPlaceholderText('Password'), 'wrongpass');
      
      // Submit the form
      fireEvent.click(screen.getByText('LOG IN'));
      
      // Check for error hints
      expect(screen.getByText('Use: admin@gmail.com')).toBeInTheDocument();
      expect(screen.getByText('Use: admin')).toBeInTheDocument();
    });

    it('requires both email and password fields', async () => {
      render(<LoginPage />);
      
      // Try to submit without filling any fields
      fireEvent.click(screen.getByText('LOG IN'));
      
      // Check that the form validation prevents submission
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
      expect(localStorage.getItem('isAuthenticated')).toBeNull();
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('requires valid email format', async () => {
      render(<LoginPage />);
      
      // Fill in the form with invalid email format
      await userEvent.type(screen.getByPlaceholderText('Email'), 'invalid-email');
      await userEvent.type(screen.getByPlaceholderText('Password'), 'admin');
      
      // Submit the form
      fireEvent.click(screen.getByText('LOG IN'));
      
      // Check that the form validation prevents submission
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
      expect(localStorage.getItem('isAuthenticated')).toBeNull();
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
}); 