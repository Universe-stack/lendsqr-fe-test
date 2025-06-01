import styles from './login.module.scss';
import Image from 'next/image';

export default function LoginPage() {
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
          <form>
            <input type="email" placeholder="Email" className={styles.input} required />
            <div className={styles.passwordWrapper}>
              <input type="password" placeholder="Password" className={styles.input} required />
              <button type="button" className={styles.showBtn}>SHOW</button>
            </div>
            <a href="#" className={styles.forgotPassword}>FORGOT PASSWORD?</a>
            <button type="submit" className={styles.loginBtn}>LOG IN</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Login | Lendsqr Admin',
}; 