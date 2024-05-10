import React, { useEffect } from 'react';
import { createBrowserHistory } from 'history';

const Logout = () => {
  useEffect(() => {
    const history = createBrowserHistory();

    // Clear the session storage
    sessionStorage.removeItem('fullName');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user_type');
    sessionStorage.removeItem('tshid');
    console.log('Logged out');

    // Clear the token cookie
    document.cookie = 'token=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; HttpOnly; SameSite=Strict';

    // Redirect to the login page
    history.push('/login');
  }, []);

  return <></>;
};

export default Logout;
