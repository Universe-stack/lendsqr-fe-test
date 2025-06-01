import React, { useEffect, useRef } from 'react';
import type { User } from '@/lib/types';
import styles from '../../app/(dashboard)/users/users.module.scss';
import Image from 'next/image';

interface UserMenuModalProps {
  user: User;
  anchor: { left: number; top: number };
  onClose: () => void;
  onViewDetails: () => void;
}

const UserMenuModal: React.FC<UserMenuModalProps> = ({ user, anchor, onClose, onViewDetails }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={styles.userMenuModal}
      style={{ left: anchor.left, top: anchor.top }}
    >
      <button
        className={styles.userMenuItem}
        onClick={() => { onViewDetails(); onClose(); }}
      >
        <span className={styles.userMenuIcon}>
          {/* Eye SVG */}
          <Image 
              src="/np-view.svg" 
              alt="Dropdown icon" 
              width={16} 
              height={16} 
              quality={100}
            />
        </span>
        <span style={{fontSize:'14px', fontWeight:'500', color:'#545F7D'}}>View Details</span>
      </button>
      <button
        className={styles.userMenuItem}
        onClick={() => { /* TODO: Blacklist action logic */ onClose(); }}
      >
        <span className={styles.userMenuIcon}>
          {/* User Remove*/}
          <Image 
              src="/np-delete-friend.svg" 
              alt="Dropdown icon" 
              width={16} 
              height={16} 
              quality={100}
            />
        </span>
        <span style={{fontSize:'14px', fontWeight:'500', color:'#545F7D'}}>Blacklist User </span>
      </button>
      <button
        className={styles.userMenuItem}
        onClick={() => { /* TODO: Add Activate action logic */ onClose(); }}
      >
        <span className={styles.userMenuIcon}>
          {/* User Add */}
          <Image 
              src="/np-user.svg" 
              alt="Dropdown icon" 
              width={16} 
              height={16} 
              quality={100}
            />
          
        </span>
        <span style={{fontSize:'14px', fontWeight:'500', color:'#545F7D'}}>Activate User </span>
      </button>
    </div>
  );
};

export default UserMenuModal; 