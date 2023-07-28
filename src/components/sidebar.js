import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../firebase'; 
import Sidebar from "react-sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faSignOutAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import Logo from '../images/PMAILogo.png';
import '../styling/sidebar.css';

const mql = window.matchMedia(`(min-width: 800px)`);

function SideBar() {
  const [sidebarDocked, setSidebarDocked] = React.useState(mql.matches); // set default state based on media query
  const [sidebarOpen] = React.useState(true);

  React.useEffect(() => {
    mql.addListener(mediaQueryChanged);
    return () => mql.removeListener(mediaQueryChanged);
  });

  const mediaQueryChanged = () => {
    setSidebarDocked(mql.matches);
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log("User Signed Out")
    }).catch((error) => {
      console.log("Error Signing Out: ", error)
    });
  };

  return (
    <Sidebar
    sidebar={
      <div className="sidebar-content">
       <div className="sidebar-content">
  <div className="spaced">
    <img src={Logo} alt="Logo" className="sidebar-logo" />
  <div className="spaced">
  <Link className="sidebar-link" to="/ListOfFeatures">
  <FontAwesomeIcon icon={faList} size="lg" /> List of Features
</Link>
  </div>
  <div className="spaced">
  <Link className="sidebar-link" to="/problem">
  <FontAwesomeIcon icon={faPlus} size="lg" /> Create Feature
</Link>
  </div>
  </div>
</div>
<div className="sidebar-link" onClick={handleSignOut}>
  <FontAwesomeIcon icon={faSignOutAlt} size="lg" /> Sign Out
</div>
      </div>
    }
    open={sidebarOpen}
    docked={sidebarDocked}
    onSetOpen={setSidebarDocked}
    styles={{ sidebar: { background: "white", width: "250px" } }}
  />
  );
}

export default SideBar
