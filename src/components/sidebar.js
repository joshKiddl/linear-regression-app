import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPause, faList, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from '../images/PMAILogo.png'; 
import { signOut } from "firebase/auth";
import { auth } from '../firebase'; 
import { styled } from '@mui/system';
import '../styling/sidebar.css';


const DrawerStyled = styled(Drawer)({
  width: 175,
  backgroundColor: '#182a4d',
  alignItems: 'center',
  '& .MuiDrawer-paper': {
    width: 175,
    backgroundColor: '#182a4d',
    alignItems: 'center',
  },
});

function AppSidebar({ children }) {
  const navigate = useNavigate();
  
  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log("User Signed Out");
      navigate('/');
    }).catch((error) => {
      console.log("Error Signing Out: ", error);
    });
  };
  
  const drawer = (
    <div className='sidebar-content'>
      <List className='top-links'>
      <img src={logo} alt="Logo" style={{width: "50px", height: "50px"}} className="sidebar-logo" />
        <ListItem button component={Link} to="/ListOfFeatures" className="sidebar-item-icon-text-wrapper">
          <div className="sidebar-item-icon">
            <FontAwesomeIcon icon={faList} size="2x" color="white" />
          </div>
          <div className="sidebar-item-text">
            Features
          </div>
        </ListItem>
        <ListItem button component={Link} to="/board" className="sidebar-item-icon-text-wrapper">
          <div className="sidebar-item-icon">
            <FontAwesomeIcon icon={faPause} size="2x" color="white" />
          </div>
          <div className="sidebar-item-text">
            Board
          </div>
        </ListItem>
        <ListItem button component={Link} to="/createFeature" className="sidebar-item-icon-text-wrapper">
          <div className="sidebar-item-icon">
            <FontAwesomeIcon icon={faPlus} size="2x" color="white" />
          </div>
          <div className="sidebar-item-text">
            New
          </div>
        </ListItem>
      </List>
      <List className='bottom-links'>
        <ListItem button onClick={handleSignOut} className="sidebar-item-icon-text-wrapper">
          <div className="sidebar-item-icon">
            <FontAwesomeIcon icon={faSignOutAlt} size="2x" color="white" />
          </div>
          <div className="sidebar-item-text">
            Sign Out
          </div>
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className="App">
      <DrawerStyled variant="permanent">
        {drawer}
      </DrawerStyled>
      <main>
        {children}
      </main>
    </div>
  );
}

export default AppSidebar;
