import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navSections = [
  {
    title: 'CUSTOMERS',
    links: [
      { label: 'Users', href: '/users', icon: '/user-friends.png', active: true },
      { label: 'Guarantors', href: '/guarantors', icon: '/usersside.png' },
      { label: 'Loans', href: '/loans', icon: '/sack.png' },
      { label: 'Decision Models', href: '/decision-models', icon: '/handshake.png' },
      { label: 'Savings', href: '/savings', icon: '/piggy-bank.png' },
      { label: 'Loan Requests', href: '/loan-requests', icon: '/loan.png' },
      { label: 'Whitelist', href: '/whitelist', icon: '/user-check.png' },
      { label: 'Karma', href: '/karma', icon: '/user-X.png' },
    ],
  },
  {
    title: 'BUSINESSES',
    links: [
      { label: 'Organization', href: '/organization', icon: '/briefcase.png' },
      { label: 'Loan Products', href: '/loan-products', icon: '/loan.png' },
      { label: 'Savings Products', href: '/savings-products', icon: '/loanbank.png' },
      { label: 'Fees and Charges', href: '/fees-charges', icon: '/coins-solid.png' },
      { label: 'Transactions', href: '/transactions', icon: '/icon-phone.png' },
      { label: 'Services', href: '/services', icon: '/galaxy.png' },
      { label: 'Service Account', href: '/service-account', icon: '/user-cog.png' },
      { label: 'Settlements', href: '/settlements', icon: '/scroll.png' },
      { label: 'Reports', href: '/reports', icon: '/chat-bar.png' },
    ],
  },
  {
    title: 'SETTINGS',
    links: [
      { label: 'Preferences', href: '/preferences', icon: '/sliders.png' },
      { label: 'Fees and Pricing', href: '/fees-pricing', icon: '/badge-percent.png' },
      { label: 'Audit Logs', href: '/audit-logs', icon: '/clipboard-list.png' },
    ],
  },

];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={onClose} />
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.mobileSearch}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search for anything"
              className={styles.searchInput}
            />
            <div className={styles.searchButton}>
              <Image 
                src="/search.png" 
                alt="Search Icon" 
                width={14} 
                height={14} 
                quality={100}
                priority 
              />
            </div>
          </div>
        </div>

        <Link href={'#'} className={styles.switchOrgLink}>
          <span className={styles.iconWrapper}>
            <Image 
              src="/briefcase.png" 
              alt="Briefcase icon" 
              width={16} 
              height={16} 
              quality={100} 
            />
          </span>
          <span className={styles.switchOrgText}>
            Switch Organization
          </span>
          <span className={styles.iconWrapper}>
            <Image 
              src="/drop-down.png" 
              alt="Dropdown icon" 
              width={16} 
              height={16} 
              quality={100}
            />
          </span>
        </Link>

        <Link href={'#'} className={styles.dashboardLink}>
          <span className={styles.iconWrapper}>
            <Image 
              src="/home.png" 
              alt="Briefcase icon" 
              width={16} 
              height={16} 
              quality={100} 
            />
          </span>
          <span className={styles.switchOrgText}>
            Dashboard
          </span>
        </Link>

        {navSections.map((section) => (
          <div key={section.title} className={styles.navSection}>
            <div className={styles.sectionTitle}>{section.title}</div>
            {section.links.map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                className={`${styles.navLink} ${link.active ? styles.active : ''}`}
                onClick={onClose}
              >
                <span className={styles.iconWrapper}>
                  <Image 
                    src={link.icon} 
                    alt="Briefcase icon" 
                    width={16} 
                    height={16} 
                    quality={100} 
                  />
                </span>
                <span className={styles.linkText}>{link.label}</span>
              </Link>
            ))}
          </div>
        ))}

        <div className={styles.sectionTitle} style={{padding:'0px'}}>
              <Link 
                href={'#'}
                className={`${styles.navLink}`}
                style={{paddingRight: '0', marginTop:'46px', borderTop:'1px solid #213F7D25'}} 
              >
                <span className={styles.iconWrapper}>
                  <Image 
                    src={'/sign-out.svg'} 
                    alt="Logout icon" 
                    width={16} 
                    height={16} 
                    quality={100} 
                  />
                </span>
                <span className={styles.linkText}>Logout</span>
              </Link>
          </div>
      </aside>
    </>
  );
} 