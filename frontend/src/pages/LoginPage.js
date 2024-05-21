import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../other/AuthContext';
import { useTranslation } from 'react-i18next';

function LoginPage() {
  const { t } = useTranslation(); 
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 
    const response = await fetch(`${process.env.REACT_APP_AUTH_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      login(data.user, data.token);
      navigate('/dashboard'); 
    } else {
      const errorData = await response.json(); 
      setErrorMessage(t(errorData.msg) || t('Failed to login')); 
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h1>{t('Login')}</h1>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            className="form-input" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder={t('Email')} 
          />
          <input 
            type="password" 
            className="form-input" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder={t('Password')} 
          />
          <button type="submit" className="form-button">{t('Login')}</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <p className="link-text">
          {t("Don't have an account?")} <Link to="/signup">{t('Sign up here')}</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
