import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../other/AuthContext';
import { useTranslation } from 'react-i18next';

function NavBar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
    setShowLanguageDropdown(false); 
  };

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
    setShowUserDropdown(false); 
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLanguageDropdown(false); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {auth.isLoggedIn && (
          <>
            <Link to="/dashboard" className="nav-item">{t('dashboard')}</Link>
            <Link to="/list" className="nav-item">{t('list')}</Link>
            <Link to="/tasks" className="nav-item">{t('tasks')}</Link>
            <Link to="/calendar" className="nav-item">{t('calendar')}</Link>
            <Link to="/history" className="nav-item">{t('history')}</Link>
          </>
        )}
      </div>
      <div className="navbar-right">
        <div className="language-switcher">
          <button onClick={toggleLanguageDropdown}>
            {i18n.language.toUpperCase()}
          </button>
          {showLanguageDropdown && (
            <div className="language-options">
              {i18n.language === 'en' ? (
                <button onClick={() => changeLanguage('lt')}>LT</button>
              ) : (
                <button onClick={() => changeLanguage('en')}>EN</button>
              )}
            </div>
          )}
        </div>
        {auth.isLoggedIn ? (
          <div className="user-section">
            <span onClick={toggleUserDropdown} className="nav-item user-name">
              {auth.user ? `${auth.user.firstName}` : 'User'}
            </span>
            {showUserDropdown && (
              <div className="dropdown-menu-logout">
                <button onClick={handleLogout} className="dropdown-item-logout">{t('logout')}</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-item">{t('login')}</Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
