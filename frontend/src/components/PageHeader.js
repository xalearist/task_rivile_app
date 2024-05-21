import React from 'react';
import { useLocation } from 'react-router-dom';

const PageHeader = () => {
  const location = useLocation();
  const pageTitleMap = {
    '/home': 'Home',
    '/tasks': 'Tasks',
    '/calendar': 'Calendar',

  };

  const getPageTitle = (pathname) => {
    return pageTitleMap[pathname] || 'Page Not Found';
  };

  return (
    <div className="page-header">
      <h1>{getPageTitle(location.pathname)}</h1>
    </div>
  );
};

export default PageHeader;