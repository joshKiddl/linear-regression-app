import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faList,
  faSignOutAlt,
  faBars,
  faThumbsUp,
  faCog,
  faColumns,
  faTh,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
// import logo from "../images/white-logo.png";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { styled } from "@mui/system";
import "../styling/sidebar.css";
import { NavLink } from "react-router-dom";

const DrawerStyled = styled(Drawer)(({ theme }) => ({
  width: "0px",
  backgroundColor: "#fff",
  alignItems: "center",
  "& .MuiDrawer-paper": {
    backgroundColor: "#fff",
    alignItems: "center",
    width: (props) => (props.expanded ? 240 : 52), // Dynamically set the width
    [theme.breakpoints.down("sm")]: {
      width: (props) => (props.expanded ? 240 : 52), // Dynamically set the width
    },
  },
}));

const NavLinkStyled = styled(NavLink)({
  textDecoration: "none",
  color: "inherit",
  "&.MuiButtonBase-root": {
    "&.active": {
      backgroundColor: "lightgrey",
      // borderRadius: '12px',
    },
    "&:hover": {
      backgroundColor: "lightgrey",
      // borderRadius: '12px',
    },
  },
});

function AppSidebar({ children, expanded, setExpanded }) {
  const navigate = useNavigate();
  const matches = useMediaQuery("(max-width:768px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(!matches);

  const handleDrawerToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User Signed Out");
        navigate("/");
      })
      .catch((error) => {
        console.log("Error Signing Out: ", error);
      });
  };

  const drawer = (
    <div className="sidebar-content">
      <List className="top-links">
        
        {/* <img
          src={logo}
          alt="Logo"
          style={{ width: "auto", height: "auto" }}
          className="sidebar-logo"
        /> */}
        <ListItem
          button
          component={NavLinkStyled}
          to="/ListOfFeatures"
          className="sidebar-item-icon-text-wrapper"
        >
          <div className="sidebar-item-icon">
            <FontAwesomeIcon icon={faList} size="lg" color="#111827" />
          </div>
          {expanded && <div className="sidebar-item-text">Features</div>}
        </ListItem>
        <ListItem
          button
          component={NavLinkStyled}
          to="/board"
          className="sidebar-item-icon-text-wrapper"
        >
          <div className="sidebar-item-icon">
            <FontAwesomeIcon icon={faColumns} size="lg" color="#111827" />
          </div>
          {expanded && <div className="sidebar-item-text">Board</div>}
        </ListItem>
        <ListItem
          button
          component={NavLinkStyled}
          to="/problem"
          className="sidebar-item-icon-text-wrapper"
        >
          <div className="sidebar-item-icon">
            <FontAwesomeIcon icon={faPlus} size="lg" color="#111827" />
          </div>
          {expanded && <div className="sidebar-item-text">New</div>}
        </ListItem>
        <ListItem
          button
          component={NavLinkStyled}
          to="/feedback"
          className="sidebar-item-icon-text-wrapper"
        >
          <div className="sidebar-item-icon">
            <FontAwesomeIcon icon={faThumbsUp} size="lg" color="#111827" />
          </div>
          {expanded && <div className="sidebar-item-text">Feedback</div>}
        </ListItem>
        <ListItem
          button
          component={NavLinkStyled}
          to="/integrations"
          className="sidebar-item-icon-text-wrapper"
        >
          <div className="sidebar-item-icon">
            <FontAwesomeIcon icon={faTh} size="lg" color="#111827" />
          </div>
          {expanded && <div className="sidebar-item-text">Integrations</div>}
        </ListItem>
      </List>
      <List className="bottom-links">
        
        <ListItem
          button
          component={NavLinkStyled}
          to="/settings"
          className="sidebar-item-icon-text-wrapper"
        >
          <div className="sidebar-item-icon">
            <FontAwesomeIcon icon={faCog} size="lg" color="#111827" />
          </div>
          {expanded && <div className="sidebar-item-text">Settings</div>}
        </ListItem>
        <ListItem
          button
          onClick={handleSignOut}
          className="sidebar-item-icon-text-wrapper"
        >
          <div className="sidebar-item-icon">
            <FontAwesomeIcon icon={faSignOutAlt} size="lg" color="#111827" />
          </div>
          {expanded && <div className="sidebar-item-text">Sign out</div>}
        </ListItem>
        <IconButton onClick={toggleExpansion} className="sidebar-toggle-btn">
          {expanded ? (
            <FontAwesomeIcon icon={faChevronLeft} size="xs" color="#111827" />
          ) : (
            <FontAwesomeIcon icon={faChevronRight} size="xs" color="#111827" />
          )}
        </IconButton>
      </List>
    </div>
  );

  return (
    <div className="App">
      {matches && (
        <IconButton
          onClick={handleDrawerToggle}
          color="inherit"
          aria-label="open drawer"
        >
          <FontAwesomeIcon icon={faBars} size="lg" color="#111827" />
        </IconButton>
      )}
        <DrawerStyled
          variant={matches ? "temporary" : "permanent"}
          open={isSidebarOpen}
          onClose={handleDrawerToggle}
          className="draw-styled"
          expanded={expanded}
        >
          {drawer}
        </DrawerStyled>
      <main>{children}</main>
    </div>
  );
}

export default AppSidebar;
