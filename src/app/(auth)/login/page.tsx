"use client";
import styles from './login.module.scss';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check credentials
    if (email === 'admin@gmail.com' && password === 'admin') {
      // authentication in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/users');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.leftSection}>
        <div className={styles.logoWrapper}>
          <Image 
            src="/Group.svg" 
            alt="Lendsqr Logo" 
            width={173.76} 
            height={36} 
            quality={100}
            priority
          />
        </div>
        <div className={styles.illustrationWrapper}>
          <Image 
            src="/pablo-sign-in.svg" 
            alt="Sign in illustration" 
            width={600} 
            height={337.57} 
            quality={100}
          />
        </div>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.formWrapper}>
          <h1>Welcome!</h1>
          <p>Enter details to login.</p>
          <form onSubmit={handleSubmit}>
            <div>
              <input 
                type="email" 
                placeholder="Email" 
                className={`${styles.input} ${error ? styles.error : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              {error && <p className={styles.errorHint} style={{fontSize:'12px'}}>Use: admin@gmail.com</p>}
            </div>
            <div className={styles.passwordWrapper}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                className={`${styles.input} ${error ? styles.error : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button 
                type="button" 
                className={styles.showBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
              {error && <p className={styles.errorHint} style={{fontSize:'12px'}}>Use: admin</p>}
            </div>
            <a href="#" className={styles.forgotPassword}>FORGOT PASSWORD?</a>
            <button type="submit" className={styles.loginBtn}>LOG IN</button>
          </form>
        </div>
      </div>
    </div>
  );
}
