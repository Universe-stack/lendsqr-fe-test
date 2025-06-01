"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import type { JSX } from 'react';
// Re-import usersData for the fallback
import usersData from "@/data/clients_mock.json"; // Import mock data
import Image from 'next/image';
import Link from 'next/link';
// import { FaStar, FaRegStar } from 'react-icons/fa'; // Removed react-icons import

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

  // Define content for each tab
  const tabContent: Record<string, JSX.Element | null> = {
    "General Details": user ? (
      <div style={{ border: '1px solid #213F7D0F', paddingTop: 30, paddingBottom:30, paddingLeft:30, paddingRight:96, borderRadius: 4, boxShadow:'3px 5px 20px 0px rgba(0, 0, 0, 0.04)' }}>
        {/* Personal Information */}
        <div style={{ marginBottom: 0 }}>
          <h3 style={{ marginBottom: 30, fontSize:'16px', color:'#213F7D', fontWeight:'500' }}>Personal Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', paddingBottom:'30px', borderBottom:'1px solid #213F7D24' }}>
            <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>FULL NAME</span> {user.fullName}</div>
            <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>PHONE NUMBER</span> {user.phoneNumber}</div>
            <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>EMAIL ADDRESS</span> {user.email}</div>
            <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>BVN</span> {user.bvn}</div>
            <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>GENDER</span> {user.gender}</div>
            <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>MARITAL STATUS</span> {user.maritalStatus}</div>
            <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>CHILDREN</span> {user.children}</div>
            <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>TYPE OF RESIDENCE</span> {user.residenceType}</div>
          </div>
        </div>

        {/* Education and Employment */}
        <div style={{ marginBottom: 0, marginTop:30 }}>
          <h3 style={{ marginBottom: 30, fontSize:'16px', color:'#213F7D', fontWeight:'500'  }}>Education and Employment</h3>
          <div style={{  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', paddingBottom:'30px', borderBottom:'1px solid #213F7D24'}}>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>LEVEL OF EDUCATION</span> {user.educationAndEmployment.levelOfEducation}</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>EMPLOYMENT STATUS</span> {user.educationAndEmployment.employmentStatus}</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>SECTOR OF EMPLOYMENT</span> {user.educationAndEmployment.sector}</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>DURATION OF EMPLOYMENT</span> {user.educationAndEmployment.duration}</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>OFFICE EMAIL</span> {user.educationAndEmployment.officeEmail}</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>MONTHLY INCOME</span> {user.educationAndEmployment.monthlyIncome.join(" - ")}</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>MONTHLY INCOME</span> {user.educationAndEmployment.loanRepayment}</div>
          </div>
        </div>

        {/* Socials */}
        <div style={{ marginBottom: 0, marginTop:30 }}>
          <h3 style={{ marginBottom: 30, fontSize:'16px', color:'#213F7D', fontWeight:'500'}}>Socials</h3>
          <div style={{  display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '30px', paddingBottom:'30px', borderBottom:'1px solid #213F7D24', justifyContent:'start'}}>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>TWITTER</span> {user.socials.twitter}</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>FACEBOOK</span> {user.socials.facebook}</div>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>INSTAGRAM</span> {user.socials.instagram}</div>
          </div>
        </div>

        {/* Guarantors */}
        <div style={{ marginBottom: 0, marginTop:30 }}>
          <h3 style={{ marginBottom: 30, fontSize:'16px', color:'#213F7D', fontWeight:'500' }}>Guarantors</h3>
          <div style={{ display: 'flex', flexDirection:'column',  gap:'20px' }}>
            {user.guarantors.map((guarantor, index) => (
              <div key={index} style={{  paddingBottom:'30px', borderBottom:'1px solid #213F7D24',  display:'grid', gridTemplateColumns: 'repeat(5, 1fr)'}}>
                <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>FULL NAME</span> {guarantor.fullName}</div>
                <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>PHONE NUMBER</span> {guarantor.phoneNumber}</div>
                <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>EMAIL</span> {guarantor.email}</div>
                <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'8px', fontSize:'16px', fontWeight:'500', color:'#545F7D'}}><span style={{fontSize:'14px',color:'#545F7D', fontWeight:'400'}}>RELATIONSHIP</span> {guarantor.relationship}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : null,
    "Documents": user ? (
      <div style={{ border: '1px solid #ccc', padding: 20, borderRadius: 8 }}>
        {/* Documents Content (Placeholder) */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 10 }}>Documents</h3>
          <p>No document data available in the mock.</p>
        </div>
      </div>
    ) : null,
    "Bank Details": user ? (
      <div style={{ border: '1px solid #ccc', padding: 20, borderRadius: 8 }}>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 10 }}>Bank Account Details</h3>
          <div style={{  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', paddingBottom:'30px'}}>
            <div><strong>Bank Name:</strong> {user.bankDetails.bankName}</div>
            <div><strong>Account Number:</strong> {user.bankDetails.accountNumber}</div>
          </div>
        </div>
      </div>
    ) : null,
    "Loans": user ? (
      <div style={{ border: '1px solid #ccc', padding: 20, borderRadius: 8 }}>
         {/* Loans Content (Placeholder) */}
         <div style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 10 }}>Loan Information</h3>
          {/* Assuming only loanRepayment is available */} 
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
             <div><strong>Loan Repayment:</strong> {user.educationAndEmployment.loanRepayment}</div>
          </div>
         </div>
      </div>
    ) : null,
    "Savings": user ? (
      <div style={{ border: '1px solid #ccc', padding: 20, borderRadius: 8 }}>
        {/* Savings Content (Placeholder) */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 10 }}>Savings Information</h3>
           {/* Assuming accountBalance is the main savings info */} 
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
             <div><strong>Account Balance:</strong> {user.accountBalance}</div>
          </div>
        </div>
      </div>
    ) : null,
    "App and System": user ? (
      <div style={{ border: '1px solid #ccc', padding: 20, borderRadius: 8 }}>
         {/* App and System Content (Placeholder) */}
         <div style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 10 }}>App and System Information</h3>
          <p>No specific app and system data available in the mock.</p>
         </div>
      </div>
    ) : null,
  };

  const renderTabContent = () => {
    return tabContent[activeTab] || null;
  };

  // Function to render tier as text
  const renderTier = (tier: string) => {
    return tier;
  };

  if (loading) {
    return <div style={{ padding: 32 }}>Loading user details...</div>;
  }

  if (!user) {
    return <div style={{ padding: 32 }}>User not found.</div>;
  }

  return (
    <div style={{ padding: 0}}>
      <div style={{display:'flex', justifyContent:'flexStart', alignItems:'center', gap:'13px', marginBottom:'32px', cursor:'pointer'}}>
        <Link href={'/users'} style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
        <Image 
          src="/np-back-arrow.svg" 
          alt="Back arrow" 
          width={16} 
          height={16} 
          quality={100}
        />
        </Link>
        <span style={{fontSize:'16px', color:'#545F7D'}}>Back to Users</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '46px' }}>
        <h1 style={{ fontSize: 24, fontWeight:'500', color:'#213F7D' }}>User Details</h1>
        <div>
          <button style={{ marginRight: 20, padding: '12px 16px', border: '1px solid #E4033B', borderRadius: '8px', color: '#E4033B', backgroundColor: 'transparent', cursor: 'pointer', fontWeight:'600' }}>BLACKLIST USER</button>
          <button style={{ padding: '12px 16px', border: '1px solid #39CDCC', borderRadius: '8px', color: '#39CDCC', backgroundColor: '#FFFFFF', cursor: 'pointer', fontWeight:'600' }}>ACTIVATE USER</button>
        </div>
      </div>

      <div style={{ border: '1px solid #213F7D0F', paddingTop: 30, paddingLeft: 30,paddingRight: 30, paddingBottom: 0, borderRadius: 4, marginBottom: 30, boxShadow: "3px 5px 20px 0px rgba(0, 0, 0, 0.04)" }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom:'51px' }}>
          {/* Placeholder for user image */}
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#213F7D29', marginRight: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 30 }}>
          <Image 
          src="/np-user-avatar.svg" 
          alt="User avatar" 
          width={50} 
          height={50} 
          quality={100}
          />
          </div>
          <div style={{marginRight:'30px'}}>
            <h2 style={{ marginBottom: '8px', fontSize:'22px', fontWeight:'500', color:'#213F7D' }}>{user.fullName}</h2>
            <p style={{ color: '#545F7D' }}>{user.userId}</p>
          </div>
          <div style={{ margin: '0 30px', padding: '0 20px', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>
            <p style={{ marginBottom: 11, color:'#545F7D', fontSize:'14px' }}>User&apos;s Tier</p>
            <div>{renderTier(user.tier)}</div>
          </div>
          <div>
            <h2 style={{ marginBottom: 12, color:'#213F7D', fontSize:'22px' }}>{user.accountBalance}</h2>
            <p style={{ color: '#213F7D', fontSize:'12px' }}>{user.bankDetails.accountNumber}/{user.bankDetails.bankName}</p>
          </div>
        </div>

        <div style={{ display: 'flex', marginBottom: 0, width:'100', padding: '0px' }}>
        {['General Details', "Documents", "Bank Details", "Loans", "Savings", "App and System"].map((tab) => (
          <button
            key={tab}
            style={{
              width:'100%',
              marginRight: 10,
              padding: '10px 25px',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #39CDCC' : 'none',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              fontSize: '16px',
              color: activeTab === tab ? '#39CDCC' : '#333',
              fontWeight: activeTab === tab ? '500' : '400',
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      </div>


      {renderTabContent()}
    </div>
  );
};

export default UserDetailsPage; 