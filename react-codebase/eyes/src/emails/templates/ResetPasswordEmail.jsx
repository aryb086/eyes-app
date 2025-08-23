import React from 'react';

const ResetPasswordEmail = ({ username, resetLink, appName }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>{appName}</h1>
      </div>
      
      <div style={styles.content}>
        <h2 style={styles.title}>Reset Your Password</h2>
        
        <p style={styles.text}>Hello {username},</p>
        
        <p style={styles.text}>
          We received a request to reset your password for your {appName} account. 
          Click the button below to set a new password:
        </p>
        
        <div style={styles.buttonContainer}>
          <a 
            href={resetLink} 
            style={styles.button}
            target="_blank" 
            rel="noopener noreferrer"
          >
            Reset Password
          </a>
        </div>
        
        <p style={styles.text}>
          If you didn't request this, you can safely ignore this email. 
          Your password will remain unchanged.
        </p>
        
        <p style={styles.text}>
          <small style={styles.smallText}>
            This password reset link will expire in 1 hour.
          </small>
        </p>
      </div>
      
      <div style={styles.footer}>
        <p style={styles.footerText}>
          &copy; {new Date().getFullYear()} {appName}. All rights reserved.
        </p>
        <p style={styles.footerText}>
          {appName}, 1234 App Street, Tech City, TC 12345
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    color: '#333',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#1a1a1a',
    padding: '20px',
    textAlign: 'center',
  },
  logo: {
    color: '#9fe7ff',
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
  },
  content: {
    padding: '30px',
  },
  title: {
    color: '#1a1a1a',
    marginTop: 0,
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  text: {
    margin: '0 0 20px',
    fontSize: '16px',
    color: '#333333',
  },
  smallText: {
    fontSize: '14px',
    color: '#666666',
  },
  buttonContainer: {
    margin: '30px 0',
    textAlign: 'center',
  },
  button: {
    display: 'inline-block',
    padding: '12px 30px',
    backgroundColor: '#9fe7ff',
    color: '#1a1a1a',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '16px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  footer: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#666666',
    borderTop: '1px solid #e0e0e0',
  },
  footerText: {
    margin: '5px 0',
    fontSize: '12px',
    color: '#999999',
  },
};

export default ResetPasswordEmail;
