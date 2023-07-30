import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../firebase'; 
import Sidebar from "react-sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faSignOutAlt, faPlus, faPause } from '@fortawesome/free-solid-svg-icons'
import logo from '../images/PMAILogo.png';
import '../styling/sidebar.css';

const mql = window.matchMedia(`(min-width: 800px)`);

function AppSidebar({ children }) { // Add the 'children' prop here
  const [sidebarDocked, setSidebarDocked] = React.useState(mql.matches);
  const [sidebarOpen] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    mql.addListener(mediaQueryChanged);
    return () => mql.removeListener(mediaQueryChanged);
  });

  const mediaQueryChanged = () => {
    setSidebarDocked(mql.matches);
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log("User Signed Out");
      navigate('/');
    }).catch((error) => {
      console.log("Error Signing Out: ", error);
    });
  };

  return (
    <Sidebar
      sidebar={
        <div className="sidebar-content">
          <div className="top-links">
            <div className="spaced">
              <Link to="/">
                <img src={logo} alt="Logo" className="navbar-logo" />
              </Link>
            </div>
            <div className={`spaced ${location.pathname === "/ListOfFeatures" ? "active" : ""}`}>
  <Link className="sidebar-link" to="/ListOfFeatures">
    <div className="link-content">
      <FontAwesomeIcon icon={faList} size="lg" />
      <span>List</span>
    </div>
  </Link>
</div>
<div className={`spaced ${location.pathname === "/board" ? "active" : ""}`}>
  <Link className="sidebar-link" to="/board">
    <div className="link-content">
      <FontAwesomeIcon icon={faPause} size="lg" />
      <span>Board</span>
    </div>
  </Link>
</div>
<div className={`spaced ${location.pathname === "/createFeature" ? "active" : ""}`}>
  <Link className="sidebar-link" to="/createFeature">
    <div className="link-content">
      <FontAwesomeIcon icon={faPlus} size="lg" />
      <span>Create Feature</span>
    </div>
  </Link>
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
      styles={{ sidebar: { background: "white", width: "250px", borderRadius: "0 20px 20px 0" } }}
    >
      {children} {/* Render children components here */}
    </Sidebar>
  );
}

export default AppSidebar;
