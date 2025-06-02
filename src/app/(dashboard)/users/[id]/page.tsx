"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import usersData from "@/data/clients_mock.json";
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.scss';
import { FaStar, FaRegStar } from 'react-icons/fa';

// Define a type for the user data to ensure type safety
interface User {
  userId: string;
  fullName: string;
  organization: string;
  status: string;
  username: string;
  email: string;
  phoneNumber: string;
  bvn: string;
  gender: string;
  maritalStatus: string;
  children: string;
  residenceType: string;
  tier: string;
  accountBalance: string;
  dateJoined: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
  };
  educationAndEmployment: {
    levelOfEducation: string;
    employmentStatus: string;
    sector: string;
    duration: string;
    officeEmail: string;
    monthlyIncome: string[];
    loanRepayment: string;
  };
  socials: {
    twitter: string;
    facebook: string;
    instagram: string;
  };
  guarantors: {
    fullName: string;
    phoneNumber: string;
    email: string;
    relationship: string;
  }[];
}

const UserDetailsPage = () => {
  const params = useParams();
  const userId = params?.id;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("General Details");

  useEffect(() => {
    setLoading(true);
    // Attempt to retrieve user data from Local Storage
    const storedUsers = localStorage.getItem('allUsersData');
    let foundUser: User | null = null;

    if (storedUsers) {
      try {
        const users: User[] = JSON.parse(storedUsers);
        foundUser = users.find((user) => user.userId === userId) || null;
      } catch (error) {
        console.error("Error parsing user data from Local Storage:", error);
        // If parsing fails, fall back to reading the JSON file
        console.warn("Falling back to reading clients_mock.json due to Local Storage error.");
        foundUser = usersData.find((user) => user.userId === userId) || null;
      }
    }

    // If user not found in Local Storage (or Local Storage was empty/errored), read from the JSON file
    if (!foundUser) {
      console.warn("User not found in Local Storage or Local Storage empty. Reading from clients_mock.json.");
      foundUser = usersData.find((user) => user.userId === userId) || null;
    }

    setUser(foundUser);
    setLoading(false);
  }, [userId]); // Re-run effect if userId changes

  if (loading) {
    return <div className={styles.loading}>Loading user details...</div>;
  }

  if (!user) {
    return <div className={styles.notFound}>User not found.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.backLink}>
        <Link href={'/users'} style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
          <Image 
            src="/np-back-arrow.svg" 
            alt="Back arrow" 
            width={16} 
            height={16} 
            quality={100}
          />
        </Link>
        <span>Back to Users</span>
      </div>

      <div className={styles.header}>
        <h1>User Details</h1>
        <div className={styles.buttonGroup}>
          <button className={styles.blacklist}>BLACKLIST USER</button>
          <button className={styles.activate}>ACTIVATE USER</button>
        </div>
      </div>

      <div className={styles.userInfoCard}>
        <div className={styles.userHeader}>
          <div className={styles.avatar}>
            <Image 
              src="/np-user-avatar.svg" 
              alt="User avatar" 
              width={50} 
              height={50} 
              quality={100}
            />
          </div>
          <div className={styles.userDetails}>
            <h2>{user.fullName}</h2>
            <p>{user.userId}</p>
          </div>
          <div className={styles.tierInfo}>
            <p>User&apos;s Tier</p>
            <div>
              {[...Array(3)].map((_, index) => {
                const tierLevel = parseInt(user.tier.replace('Tier ', ''), 10);
                return index < tierLevel ? (
                  <FaStar key={index} color="gold" />
                ) : (
                  <FaRegStar key={index} color="gold" />
                );
              })}
            </div>
          </div>
          <div className={styles.accountInfo}>
            <h2>{user.accountBalance}</h2>
            <p>{user.bankDetails.accountNumber}/{user.bankDetails.bankName}</p>
          </div>
        </div>

        <div className={styles.tabs}>
          {['General Details', "Documents", "Bank Details", "Loans", "Savings", "App and System"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? styles.active : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "General Details" && user && (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <h3>Personal Information</h3>
            <div className={styles.grid}>
              <div className={styles.infoItem}><span>FULL NAME</span> {user.fullName}</div>
              <div className={styles.infoItem}><span>PHONE NUMBER</span> {user.phoneNumber}</div>
              <div className={styles.infoItem}><span>EMAIL ADDRESS</span> {user.email}</div>
              <div className={styles.infoItem}><span>BVN</span> {user.bvn}</div>
              <div className={styles.infoItem}><span>GENDER</span> {user.gender}</div>
              <div className={styles.infoItem}><span>MARITAL STATUS</span> {user.maritalStatus}</div>
              <div className={styles.infoItem}><span>CHILDREN</span> {user.children}</div>
              <div className={styles.infoItem}><span>TYPE OF RESIDENCE</span> {user.residenceType}</div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 style={{marginTop:'30px'}}>Education and Employment</h3>
            <div className={styles.grid}>
              <div className={styles.infoItem}><span>LEVEL OF EDUCATION</span> {user.educationAndEmployment.levelOfEducation}</div>
              <div className={styles.infoItem}><span>EMPLOYMENT STATUS</span> {user.educationAndEmployment.employmentStatus}</div>
              <div className={styles.infoItem}><span>SECTOR OF EMPLOYMENT</span> {user.educationAndEmployment.sector}</div>
              <div className={styles.infoItem}><span>DURATION OF EMPLOYMENT</span> {user.educationAndEmployment.duration}</div>
              <div className={styles.infoItem}><span>OFFICE EMAIL</span> {user.educationAndEmployment.officeEmail}</div>
              <div className={styles.infoItem}><span>MONTHLY INCOME</span> {user.educationAndEmployment.monthlyIncome.join(" - ")}</div>
              <div className={styles.infoItem}><span>MONTHLY INCOME</span> {user.educationAndEmployment.loanRepayment}</div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 style={{marginTop:'30px'}}>Socials</h3>
            <div className={styles.socialsGrid}>
              <div className={styles.infoItem}><span>TWITTER</span> {user.socials.twitter}</div>
              <div className={styles.infoItem}><span>FACEBOOK</span> {user.socials.facebook}</div>
              <div className={styles.infoItem}><span>INSTAGRAM</span> {user.socials.instagram}</div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 style={{marginTop:'30px'}} >Guarantors</h3>
            <div className={styles.guarantorsList}>
              {user.guarantors.map((guarantor, index) => (
                <div key={index} className={styles.guarantorItem}>
                  <div className={styles.infoItem}><span>FULL NAME</span> {guarantor.fullName}</div>
                  <div className={styles.infoItem}><span>PHONE NUMBER</span> {guarantor.phoneNumber}</div>
                  <div className={styles.infoItem}><span>EMAIL</span> {guarantor.email}</div>
                  <div className={styles.infoItem}><span>RELATIONSHIP</span> {guarantor.relationship}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "Documents" && user && (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <h3>Documents</h3>
            <p>No document data available in the mock.</p>
          </div>
        </div>
      )}

      {activeTab === "Bank Details" && user && (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <h3>Bank Account Details</h3>
            <div className={styles.grid}>
              <div className={styles.infoItem}><span>Bank Name</span> {user.bankDetails.bankName}</div>
              <div className={styles.infoItem}><span>Account Number</span> {user.bankDetails.accountNumber}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Loans" && user && (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <h3>Loan Information</h3>
            <div className={styles.grid}>
              <div className={styles.infoItem}><span>Loan Repayment</span> {user.educationAndEmployment.loanRepayment}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Savings" && user && (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <h3>Savings Information</h3>
            <div className={styles.grid}>
              <div className={styles.infoItem}><span>Account Balance</span> {user.accountBalance}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "App and System" && user && (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <h3>App and System Information</h3>
            <p>No specific app and system data available in the mock.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailsPage; 