"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from './users.module.scss';
import Image from "next/image";
import FilterModal, { FilterValues } from "@/components/ui/FilterModal";
import UserMenuModal from '@/components/ui/UserMenuModal';
import { useRouter } from "next/navigation";
import type { User, UserStatus } from '@/lib/types';
import usersMockData from "@/data/clients_mock.json"; // Import mock data

const STATUS_COLORS: Record<string, string> = {
  Inactive: "#545F7D",
  Pending: "#E9B200",
  Blacklisted: "#DF0404",
  Active: "#39CD62",
};

const PAGE_SIZE = 10;

// Helper for pagination numbers and ellipsis
function getPagination(current: number, total: number) {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let l: number | undefined = undefined;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }
  for (const i of range) {
    if (l !== undefined) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    organization: '',
    username: '',
    email: '',
    date: '',
    phoneNumber: '',
    status: '',
  });
  const [filterAnchor, setFilterAnchor] = useState<{ left: number; top: number } | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ left: number; top: number } | null>(null);
  const [menuUser, setMenuUser] = useState<User | null>(null);
  const [rawUsers, setRawUsers] = useState<User[]>([]);
  const router = useRouter();

  // Initialize localStorage with mock data
  const initializeLocalStorage = () => {
    try {
      const storedUsers = localStorage.getItem('allUsersData');
      if (!storedUsers) {
        // Add accountBalance to each user if it doesn't exist
        const usersWithBalance = usersMockData.map(user => ({
          ...user,
          accountBalance: user.accountBalance || "₦0"
        }));
        localStorage.setItem('allUsersData', JSON.stringify(usersWithBalance));
        console.log("Mock user data loaded into Local Storage.");
        return usersWithBalance;
      }
      try {
        const parsedUsers = JSON.parse(storedUsers);
        console.log("Mock user data already exists in Local Storage.");
        return Array.isArray(parsedUsers) ? parsedUsers : [];
      } catch (parseError) {
        console.error("Error parsing Local Storage data:", parseError);
        // If parsing fails, return empty array and reinitialize with mock data
        const usersWithBalance = usersMockData.map(user => ({
          ...user,
          accountBalance: user.accountBalance || "₦0"
        }));
        localStorage.setItem('allUsersData', JSON.stringify(usersWithBalance));
        return usersWithBalance;
      }
    } catch (error) {
      console.error("Error initializing Local Storage:", error);
      return [];
    }
  };

  // Refs for each header cell
  const headerRefs = {
    organization: useRef<HTMLDivElement>(null),
    username: useRef<HTMLDivElement>(null),
    email: useRef<HTMLDivElement>(null),
    phoneNumber: useRef<HTMLDivElement>(null),
    date: useRef<HTMLDivElement>(null),
    status: useRef<HTMLDivElement>(null),
  };

  // Extract unique organizations from users for the filter dropdown
  const organizations = Array.from(new Set(users.map(u => u.organization)));

  // Effect to load data into Local Storage on initial mount
  useEffect(() => {
    const initialData = initializeLocalStorage();
    setRawUsers(initialData);
  }, []); // Empty dependency array means this effect runs only once on mount

  // Effect to fetch paginated and filtered data
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
      ...(filterValues.organization && { organization: filterValues.organization }),
      ...(filterValues.username && { username: filterValues.username }),
      ...(filterValues.email && { email: filterValues.email }),
      ...(filterValues.date && { date: filterValues.date }),
      ...(filterValues.phoneNumber && { phoneNumber: filterValues.phoneNumber }),
      ...(filterValues.status && { status: filterValues.status }),
    });
    fetch(`/api/users?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setTotal(data.total || 0);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setUsers([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [page, filterValues]);

  // Function to fetch unfiltered data from Local Storage and call it
  const fetchUnfilteredData = () => {
    try {
      const storedUsers = localStorage.getItem('allUsersData');
      if (storedUsers) {
        try {
          const parsedUsers = JSON.parse(storedUsers);
          setRawUsers(Array.isArray(parsedUsers) ? parsedUsers : []);
        } catch (parseError) {
          console.error("Error parsing user data from Local Storage:", parseError);
          setRawUsers([]);
        }
      } else {
        setRawUsers([]);
      }
    } catch (error) {
      console.error("Error accessing Local Storage:", error);
      setRawUsers([]);
    }
  };

  // Calculate user statistics
  const calculateUserStats = (users: User[]) => {
    // Helper function to parse currency string to number
    const parseCurrency = (value: string): number => {
      const numericValue = parseFloat(value.replace(/[\u20a6,]/g, ''));
      return isNaN(numericValue) ? 0 : numericValue;
    };

    // Get users with loans
    const getUsersWithLoans = (users: User[]): number => {
      return users.filter(user => 
        user.educationAndEmployment?.loanRepayment !== undefined && 
        user.educationAndEmployment?.loanRepayment !== null
      ).length;
    };

    // Get users with savings
    const getUsersWithSavings = (users: User[]): number => {
      return users.filter(user => {
        if (!user.accountBalance) return false;
        const balance = parseCurrency(user.accountBalance);
        return balance > 0;
      }).length;
    };

    // Get active users
    const getActiveUsers = (users: User[]): number => {
      return users.filter(user => user.status === "Active").length;
    };

    return [
      { 
        label: "USERS", 
        value: users.length, 
        icon: "/pink-users.svg", 
        bg: "#DF18FF33",
        testId: "total-users"
      },
      { 
        label: "ACTIVE USERS", 
        value: getActiveUsers(users), 
        icon: "/purple-users.svg", 
        bg: "#5718FF33",
        testId: "active-users"
      },
      { 
        label: "USERS WITH LOANS", 
        value: getUsersWithLoans(users), 
        icon: "/loan-orange.svg", 
        bg: "#F55F4433",
        testId: "users-with-loans"
      },
      { 
        label: "USERS WITH SAVINGS", 
        value: getUsersWithSavings(users), 
        icon: "/coins-colored.svg", 
        bg: "#FF336633",
        testId: "users-with-savings"
      },
    ];
  };

  //call the function to fetch unnpaginated data
  useEffect(() => {
    fetchUnfilteredData();
  }, []);

  const stats = calculateUserStats(rawUsers);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className={styles.usersPage}>
      <h1 className={styles.pageTitle}>Users</h1>
      <div className={styles.statsRow}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard} data-testid={stat.testId}>
            <span className={styles.statIcon} style={{ backgroundColor: `${stat.bg}` }}>
              <Image 
                src={stat.icon} 
                alt="Dropdown icon" 
                width={16} 
                height={16} 
                quality={100}
              />
            </span>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{stat.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className={styles.tableContainer}>
        {filterModalOpen && filterAnchor && (
          <FilterModal
            isOpen={filterModalOpen}
            onClose={() => setFilterModalOpen(false)}
            onFilter={(values) => {
              setFilterValues(values);
              setPage(1);
            }}
            onReset={() => {
              setFilterValues({
                organization: '',
                username: '',
                email: '',
                date: '',
                phoneNumber: '',
                status: '',
              });
              setPage(1);
            }}
            initialValues={filterValues}
            organizations={organizations}
            className={styles.filterDropdown}
            style={{
              width:270,
              paddingTop:30,
              paddingBottom:28,
              paddingLeft:20,
              paddingRight:20,
              position: 'absolute',
              left: filterAnchor.left,
              top: filterAnchor.top,
              zIndex: 10,
            }}
            data-testid="filter-modal"
          />
        )}
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
          </div>
        )}
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.tableHeaderCell}>
                <div
                  ref={headerRefs.organization}
                  style={{display: 'flex', justifyContent:'flex-start', gap:'10px', alignItems: 'center', cursor:'pointer'}}
                  onClick={e => {
                    const rect = headerRefs.organization.current?.getBoundingClientRect();
                    const containerRect = (e.currentTarget.closest('.' + styles.tableContainer) as HTMLElement)?.getBoundingClientRect();
                    if (rect && containerRect) {
                      setFilterAnchor({ left: rect.left - containerRect.left, top: rect.bottom - containerRect.top });
                    } else {
                      setFilterAnchor({ left: 0, top: 56 });
                    }
                    setFilterModalOpen(true);
                  }}
                >
                  ORGANIZATION
                  <Image 
                    src="/filter-results-button.png" 
                    alt="Dropdown icon" 
                    width={16} 
                    height={16} 
                    quality={100}
                  />
                </div>
              </th>
              <th className={styles.tableHeaderCell}>
                <div
                  ref={headerRefs.username}
                  style={{display: 'flex', justifyContent:'flex-start', gap:'10px', alignItems: 'center', cursor:'pointer'}}
                  onClick={e => {
                    const rect = headerRefs.username.current?.getBoundingClientRect();
                    const containerRect = (e.currentTarget.closest('.' + styles.tableContainer) as HTMLElement)?.getBoundingClientRect();
                    if (rect && containerRect) {
                      setFilterAnchor({ left: rect.left - containerRect.left, top: rect.bottom - containerRect.top });
                    } else {
                      setFilterAnchor({ left: 0, top: 56 });
                    }
                    setFilterModalOpen(true);
                  }}
                >
                  USERNAME
                  <Image 
                    src="/filter-results-button.png" 
                    alt="Dropdown icon" 
                    width={16} 
                    height={16} 
                    quality={100}
                  />
                </div>
              </th>
              <th className={styles.tableHeaderCell}>
                <div
                  ref={headerRefs.email}
                  style={{display: 'flex', justifyContent:'flex-start', gap:'10px', alignItems: 'center', cursor:'pointer'}}
                  onClick={e => {
                    const rect = headerRefs.email.current?.getBoundingClientRect();
                    const containerRect = (e.currentTarget.closest('.' + styles.tableContainer) as HTMLElement)?.getBoundingClientRect();
                    if (rect && containerRect) {
                      setFilterAnchor({ left: rect.left - containerRect.left, top: rect.bottom - containerRect.top });
                    } else {
                      setFilterAnchor({ left: 0, top: 56 });
                    }
                    setFilterModalOpen(true);
                  }}
                >
                  EMAIL
                  <Image 
                    src="/filter-results-button.png" 
                    alt="Dropdown icon" 
                    width={16} 
                    height={16} 
                    quality={100}
                  />
                </div>
              </th>
              <th className={styles.tableHeaderCell}>
                <div
                  ref={headerRefs.phoneNumber}
                  style={{display: 'flex', justifyContent:'flex-start', gap:'10px', alignItems: 'center', cursor:'pointer'}}
                  onClick={e => {
                    const rect = headerRefs.phoneNumber.current?.getBoundingClientRect();
                    const containerRect = (e.currentTarget.closest('.' + styles.tableContainer) as HTMLElement)?.getBoundingClientRect();
                    if (rect && containerRect) {
                      setFilterAnchor({ left: rect.left - containerRect.left, top: rect.bottom - containerRect.top });
                    } else {
                      setFilterAnchor({ left: 0, top: 56 });
                    }
                    setFilterModalOpen(true);
                  }}
                >
                  PHONE NUMBER
                  <Image 
                    src="/filter-results-button.png" 
                    alt="Dropdown icon" 
                    width={16} 
                    height={16} 
                    quality={100}
                  />
                </div>
              </th>
              <th className={styles.tableHeaderCell}>
                <div
                  ref={headerRefs.date}
                  style={{display: 'flex', justifyContent:'flex-start', gap:'10px', alignItems: 'center', cursor:'pointer'}}
                  onClick={e => {
                    const rect = headerRefs.date.current?.getBoundingClientRect();
                    const containerRect = (e.currentTarget.closest('.' + styles.tableContainer) as HTMLElement)?.getBoundingClientRect();
                    if (rect && containerRect) {
                      setFilterAnchor({ left: rect.left - containerRect.left, top: rect.bottom - containerRect.top });
                    } else {
                      setFilterAnchor({ left: 0, top: 56 });
                    }
                    setFilterModalOpen(true);
                  }}
                >
                  DATE JOINED
                  <Image 
                    src="/filter-results-button.png" 
                    alt="Dropdown icon" 
                    width={16} 
                    height={16} 
                    quality={100}
                  />
                </div>
              </th>
              <th className={styles.tableHeaderCell}>
                <div
                  ref={headerRefs.status}
                  style={{display: 'flex', justifyContent:'flex-start', gap:'10px', alignItems: 'center', cursor:'pointer'}}
                  onClick={e => {
                    const rect = headerRefs.status.current?.getBoundingClientRect();
                    const containerRect = (e.currentTarget.closest('.' + styles.tableContainer) as HTMLElement)?.getBoundingClientRect();
                    if (rect && containerRect) {
                      setFilterAnchor({ left: rect.left - containerRect.left, top: rect.bottom - containerRect.top });
                    } else {
                      setFilterAnchor({ left: 0, top: 56 });
                    }
                    setFilterModalOpen(true);
                  }}
                >
                  STATUS
                  <Image 
                    src="/filter-results-button.png" 
                    alt="Dropdown icon" 
                    width={16} 
                    height={16} 
                    quality={100}
                  />
                </div>
              </th>
              <th className={styles.tableHeaderCell}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 32 }}>
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 32 }} data-testid="no-users-message">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.email} className={styles.tableRow} data-testid={`user-row-${user.username}`}>
                  <td className={styles.tableCell}>{user.organization}</td>
                  <td className={styles.tableCell}>{user.username}</td>
                  <td className={styles.tableCell}>{user.email}</td>
                  <td className={styles.tableCell}>{user.phoneNumber}</td>
                  <td className={styles.tableCell}>{new Date(user.dateJoined).toLocaleString()}</td>
                  <td className={styles.tableCell}>
                    <span
                      className={styles.statusBadge}
                      style={{
                        background: STATUS_COLORS[user.status] + "22",
                        color: STATUS_COLORS[user.status],
                      }}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className={styles.tableCell} style={{ position: 'relative' }}>
                    <span
                      className={styles.menuButton}
                      onClick={e => {
                        const target = e.target as HTMLElement;
                        const rect = target.getBoundingClientRect();
                        const containerRect = (target.closest('.' + styles.tableContainer) as HTMLElement)?.getBoundingClientRect();
                        if (rect && containerRect) {
                          setMenuAnchor({
                            left: rect.left - containerRect.left + rect.width / 2 - 90,
                            top: rect.bottom - containerRect.top + 6
                          });
                        } else {
                          setMenuAnchor({ left: 0, top: 0 });
                        }
                        setMenuUser({
                          userId: user.userId,
                          organization: user.organization,
                          username: user.username,
                          email: user.email,
                          phoneNumber: user.phoneNumber,
                          dateJoined: user.dateJoined,
                          status: user.status as UserStatus,
                          accountBalance: user.accountBalance || "₦0",
                          fullName: user.fullName,
                          bvn: user.bvn,
                          gender: user.gender,
                          maritalStatus: user.maritalStatus,
                          children: user.children,
                          residenceType: user.residenceType,
                          tier: user.tier,
                          bankDetails: user.bankDetails,
                          educationAndEmployment: user.educationAndEmployment,
                          socials: user.socials,
                          guarantors: user.guarantors
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      ⋮
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {menuAnchor && menuUser && (
          <UserMenuModal
            user={menuUser}
            anchor={menuAnchor}
            onClose={() => { setMenuAnchor(null); setMenuUser(null); }}
            onViewDetails={() => {
              router.push(`/users/${menuUser.userId}`);
            }}
          />
        )}
        <div className={styles.paginationContainer}>
          <span className={styles.paginationInfo}>
            Showing 
            <div className={styles.pageSizeSelector}>
              {users.length}
              <Image 
                src="/drop-down.png" 
                alt="Dropdown icon" 
                width={16} 
                height={16} 
                quality={100}
              />
            </div> 
            out of {total}
          </span>
          <div className={styles.paginationControls}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={styles.paginationButton}
            >
              <Image 
                src="/previous-icon.png" 
                alt="Previous icon" 
                width={16} 
                height={16} 
                quality={100}
              />
            </button>
            {getPagination(page, totalPages).map((p, idx) =>
              p === '...'
                ? <span key={idx} className={styles.ellipsis}>...</span>
                : <button
                    key={p}
                    onClick={() => setPage(Number(p))}
                    className={`${styles.pageNumber} ${page === p ? styles.active : ''}`}
                    disabled={page === p}
                  >
                    {p}
                  </button>
            )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={styles.paginationButton}
            >
              <Image 
                src="/next-pag.png" 
                alt="Next icon" 
                width={16} 
                height={16} 
                quality={100}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
