import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserDetailsPage from '../page';
import { useParams } from 'next/navigation';
import usersData from '@/data/clients_mock.json';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { src: string; alt: string; width: number; height: number; quality?: number }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('UserDetailsPage', () => {
  const mockUser = usersData[0];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: mockUser.userId });
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(usersData));
  });

  it('shows loading state initially', async () => {
    render(<UserDetailsPage />);
    
    // Loading state should be visible immediately
    expect(screen.getByText('Loading user details...')).toBeInTheDocument();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading user details...')).not.toBeInTheDocument();
    });
  });

  it('shows user not found when user does not exist', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: 'non-existent-id' });
    render(<UserDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('User not found.')).toBeInTheDocument();
    });
  });

  it('renders user details correctly', async () => {
    render(<UserDetailsPage />);

    await waitFor(() => {
      // Check if user name is displayed in the header
      const userHeader = screen.getByTestId('user-header');
      expect(userHeader).toHaveTextContent(mockUser.fullName);
      // Check if user ID is displayed
      expect(screen.getByText(mockUser.userId)).toBeInTheDocument();
      // Check if account balance is displayed
      expect(screen.getByText(mockUser.accountBalance)).toBeInTheDocument();
    });
  });

  it('switches tabs correctly', async () => {
    render(<UserDetailsPage />);

    await waitFor(() => {
      // Initially General Details tab should be active
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
    });

    // Click on Bank Details tab
    fireEvent.click(screen.getByText('Bank Details'));

    await waitFor(() => {
      expect(screen.getByText('Bank Account Details')).toBeInTheDocument();
      expect(screen.getByText(mockUser.bankDetails.bankName)).toBeInTheDocument();
      expect(screen.getByText(mockUser.bankDetails.accountNumber)).toBeInTheDocument();
    });
  });

  it('displays personal information correctly', async () => {
    render(<UserDetailsPage />);

    await waitFor(() => {
      // Check personal information fields within the Personal Information section
      const personalInfoSection = screen.getByText('Personal Information').closest('div');
      expect(personalInfoSection).toBeInTheDocument();
      expect(personalInfoSection).toHaveTextContent(mockUser.fullName);
      expect(personalInfoSection).toHaveTextContent(mockUser.phoneNumber);
      expect(personalInfoSection).toHaveTextContent(mockUser.email);
    });
  });

  it('displays education and employment information correctly', async () => {
    render(<UserDetailsPage />);

    await waitFor(() => {
      // Check education and employment fields
      expect(screen.getByText('LEVEL OF EDUCATION')).toBeInTheDocument();
      expect(screen.getByText(mockUser.educationAndEmployment.levelOfEducation)).toBeInTheDocument();
      expect(screen.getByText('EMPLOYMENT STATUS')).toBeInTheDocument();
      expect(screen.getByText(mockUser.educationAndEmployment.employmentStatus)).toBeInTheDocument();
    });
  });

  it('displays guarantors information correctly', async () => {
    render(<UserDetailsPage />);

    await waitFor(() => {
      // Check guarantors information
      expect(screen.getByText('Guarantors')).toBeInTheDocument();
      mockUser.guarantors.forEach((guarantor, index) => {
        const guarantorElement = screen.getByTestId(`guarantor-${index}`);
        expect(guarantorElement).toHaveTextContent(guarantor.fullName);
        expect(guarantorElement).toHaveTextContent(guarantor.phoneNumber);
      });
    });
  });

  it('handles localStorage error gracefully', async () => {
    // Mock localStorage error
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('Storage error');
    });

    render(<UserDetailsPage />);

    await waitFor(() => {
      // Should still render user data from mock data
      const userHeader = screen.getByTestId('user-header');
      expect(userHeader).toHaveTextContent(mockUser.fullName);
      expect(screen.getByText(mockUser.userId)).toBeInTheDocument();
      expect(screen.getByText(mockUser.accountBalance)).toBeInTheDocument();
    });
  });
}); 