import React from 'react';
import Image from 'next/image';
import styles from './Header.module.scss';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className={styles.header}>
      <button className={styles.hamburgerButton} onClick={onMenuClick}>
        <Image 
          src="/menu.png" 
          alt="Menu" 
          width={24} 
          height={24} 
          quality={100}
        />
      </button>
      <div>
        <Image 
          src="/Group.svg" 
          alt="Lendsqr Logo" 
          width={144.8} 
          height={30} 
          quality={100}
          priority 
        />
      </div>
      <div className={styles.searchContainer}>
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
      <div className={styles.rightSection}>
        <a href="#" className={styles.docsLink}>Docs</a>
        <span className={styles.notificationIcon}>
          <Image
            src="/vector.png"
            alt="avatar"
            width={48}
            height={48}
            quality={100}
            priority
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            }}
          />
        </span>
        <div className={styles.userSection}>
          <span className={styles.avatarContainer}>
            <Image
              src="/avatar.png"
              alt="avatar"
              width={48}
              height={48}
              quality={100}
              priority
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
            />
          </span>
          <span className={styles.userName}>Adedeji</span>
          <span className={styles.dropdownButton}>
            <Image
              src="/dropdownvec.png"
              alt="dropdown"
              width={55}
              height={55}
              quality={100}
              priority
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
            />
          </span>
        </div>
      </div>
    </header>
  );
} 