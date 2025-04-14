import React from 'react';
import Nav from './Nav';
import ActionMenu from '../ui/ActionMenu';
import duoLogo from '../../assets/images/logo/duo-logo-v2-solo.png';

function TopNav() {
  return (
    <div className="top-nav-wrapper">
      {/* <h1>--TopNav--</h1> */}
      <div className="top-nav-left-container">
        <div className="logo-wrapper">
          <img src={duoLogo} alt="Duo" />
          <h1 className="logo-text">Duo</h1>
        </div>
      </div>
      <Nav />
      <ActionMenu />
    </div>
  );
}

export default TopNav;
