import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UsersPage from '../page';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />;
  },
}));

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  key: jest.fn(),
  length: 0
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('UsersPage', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockUsers = [
    {
      id: '1',
      organization: 'Test Org',
      username: 'testuser',
      email: 'test@example.com',
      phoneNumber: '1234567890',
      dateJoined: '2024-01-01',
      status: 'Active',
      accountBalance: '₦1000',
      educationAndEmployment: {
        loanRepayment: '₦500'
      }
    },
    {
      id: '2',
      organization: 'Another Org',
      username: 'anotheruser',
      email: 'another@example.com',
      phoneNumber: '0987654321',
      dateJoined: '2024-01-02',
      status: 'Inactive',
      accountBalance: '₦0',
      educationAndEmployment: {
        loanRepayment: null
      }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockLocalStorage.clear();
    (global.fetch as jest.Mock).mockClear();
  });

  // Positive Test Scenarios
  describe('Positive Scenarios', () => {
    it('renders users page with all elements', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve({ users: mockUsers, total: mockUsers.length })
      });
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUsers));

      render(<UsersPage />);

      // Check for main elements
      expect(screen.getByText('Users')).toBeInTheDocument();
      
      // Check for stat cards
      expect(screen.getByText('USERS')).toBeInTheDocument();
      expect(screen.getByText('ACTIVE USERS')).toBeInTheDocument();
      expect(screen.getByText('USERS WITH LOANS')).toBeInTheDocument();
      expect(screen.getByText('USERS WITH SAVINGS')).toBeInTheDocument();

      // Check for table headers
      expect(screen.getByText('ORGANIZATION')).toBeInTheDocument();
      expect(screen.getByText('USERNAME')).toBeInTheDocument();
      expect(screen.getByText('EMAIL')).toBeInTheDocument();
      expect(screen.getByText('PHONE NUMBER')).toBeInTheDocument();
      expect(screen.getByText('DATE JOINED')).toBeInTheDocument();
    });

    it('loads and displays user data correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve({ users: mockUsers, total: mockUsers.length })
      });
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUsers));

      render(<UsersPage />);

      // Wait for the data to load
      await waitFor(() => {
        expect(screen.getByText('testuser')).toBeInTheDocument();
        expect(screen.getByText('anotheruser')).toBeInTheDocument();
      });

      // Check if stats are calculated correctly
      expect(screen.getByText('2')).toBeInTheDocument(); // Total users
      expect(screen.getByText('1')).toBeInTheDocument(); // Active users
      expect(screen.getByText('1')).toBeInTheDocument(); // Users with loans
      expect(screen.getByText('1')).toBeInTheDocument(); // Users with savings
    });

    it('handles pagination correctly', async () => {
      const paginatedUsers = Array(15).fill(null).map((_, index) => ({
        ...mockUsers[0],
        id: String(index + 1),
        username: `user${index + 1}`
      }));

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ users: paginatedUsers.slice(0, 10), total: paginatedUsers.length })
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ users: paginatedUsers.slice(10), total: paginatedUsers.length })
        });

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(paginatedUsers));

      render(<UsersPage />);

      // Check first page
      await waitFor(() => {
        expect(screen.getByText('user1')).toBeInTheDocument();
        expect(screen.getByText('user10')).toBeInTheDocument();
      });

      // Click next page
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      // Check second page
      await waitFor(() => {
        expect(screen.getByText('user11')).toBeInTheDocument();
        expect(screen.getByText('user15')).toBeInTheDocument();
      });
    });

    it('opens filter modal when clicking filter icon', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve({ users: mockUsers, total: mockUsers.length })
      });
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUsers));

      render(<UsersPage />);

      // Click filter icon
      const filterIcon = screen.getAllByAltText('Dropdown icon')[0];
      fireEvent.click(filterIcon);

      // Check if filter modal is opened
      await waitFor(() => {
        expect(screen.getByText('Filter')).toBeInTheDocument();
      });
    });
  });

  // Negative Test Scenarios
  describe('Negative Scenarios', () => {
    it('handles empty user data gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve({ users: [], total: 0 })
      });
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([]));

      render(<UsersPage />);

      // Check if stats show zero values
      await waitFor(() => {
        expect(screen.getByText('0')).toBeInTheDocument(); // Total users
        expect(screen.getByText('0')).toBeInTheDocument(); // Active users
        expect(screen.getByText('0')).toBeInTheDocument(); // Users with loans
        expect(screen.getByText('0')).toBeInTheDocument(); // Users with savings
      });
    });

    it('handles API error gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUsers));

      render(<UsersPage />);

      // Check if loading state is handled
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });

    it('handles invalid localStorage data gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve({ users: [], total: 0 })
      });
      mockLocalStorage.getItem.mockReturnValue('invalid-json');

      render(<UsersPage />);

      // Check if stats show zero values
      await waitFor(() => {
        expect(screen.getByText('0')).toBeInTheDocument(); // Total users
      });
    });

    it('handles filter with no results', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve({ users: mockUsers, total: mockUsers.length })
      }).mockResolvedValueOnce({
        json: () => Promise.resolve({ users: [], total: 0 })
      });
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUsers));

      render(<UsersPage />);

      // Wait for initial data load
      await waitFor(() => {
        expect(screen.getByText('testuser')).toBeInTheDocument();
      });

      // Click filter icon
      const filterIcon = screen.getAllByAltText('Dropdown icon')[0];
      fireEvent.click(filterIcon);

      // Apply filter with no matching results
      await waitFor(() => {
        const filterInput = screen.getByPlaceholderText('Organization');
        userEvent.type(filterInput, 'NonExistentOrg');
        const filterButton = screen.getByText('Filter');
        fireEvent.click(filterButton);
      });

      // Check if table shows no results
      await waitFor(() => {
        expect(screen.queryByText('testuser')).not.toBeInTheDocument();
        expect(screen.queryByText('anotheruser')).not.toBeInTheDocument();
      });
    });
  });
}); 