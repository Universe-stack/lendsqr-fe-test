'use client'
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import styles from './layout.module.scss';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.mainContent}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className={styles.layoutBody}>
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={styles.pageContent}>{children}</main>
        </div>
      </div>
    </div>
  );
} 