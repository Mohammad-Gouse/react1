import "./Header.css";
import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../src/images/360one_.png";
// import Button from '@mui/material/Button';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
// import { MenuContext } from "./Context";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import MenuContext from "./Context";
const Header = ({ pageTitle, showNominee, showPMS, backArrow, showPoa, showPortal, showAdmin }) => {
  const isLoginPage = pageTitle === "Login";
  const [admin, setAdmin] = useState(false);
  const { roles, setRoles } = useContext(MenuContext);
  const rbacRoles = useContext(MenuContext);

  // console.log(rolesArray)
  const rolesArray = rbacRoles?.roles?.map((item) => item.toLowerCase());
  const [shouldShowHomeIcon, setShouldShowHomeIcom] = useState(false);
  // console.log({"array":rolesArray})
  //  const isAdminRole = rolesArray?.includes('admin');
  useEffect(() => {
    if (rolesArray?.includes('admin') || rolesArray?.length > 1) {
      setShouldShowHomeIcom(true);
    }
    else {
      setShouldShowHomeIcom(false);
    }

  }, [rolesArray])
  const navigate = useNavigate();
  // const { showPMS } = useContext(MenuContext);
  // const { showNominee } = useContext(MenuContext);
  // const [backArrow, setShowArrow] = useState(false);

  const logoutHandler = () => {
    navigate("/");
    localStorage.removeItem("token");
    localStorage.removeItem("alerted");
    localStorage.removeItem("admin");
    localStorage.removeItem("username");
    localStorage.removeItem("roles"); // Clear roles from localStorage
    // Other logout-related actions if needed
    setRoles([]); // Clear roles in state
  };

  const downloadHandler = () => {
    console.log("Download button clicked")
  }



  const configuraitonHandler = () => {
    navigate("/configuration");
    // setShowArrow(true);
  };
  const backArrowHandler = () => {
    navigate("/tradeFeed")
    // setShowArrow(false)
  }
  const poaBackArrowHandler = () => {
    navigate("/poa")
    // setShowArrow(false)
  }
  const adminHandler = () => {
    navigate("/admin");
    localStorage.setItem("admin", "yes");
  };
  const portalHandler = () => {
    navigate("/portal")
  }
  const poaConfigurationHandler = () => {
    navigate("/poaconfiguration")
  }
  const homeHandler = () => {
    navigate("/dashboard");
    localStorage.removeItem("admin");
  };

  const configurationHandler = () => {
    navigate("/configuration");
    setAnchorEl(null);
  };
  const tradeFeedHandler = () => {
    navigate("/tradeFeed");
    setAnchorEl(null);
  };

  // const aofHandler = () => {
  //   navigate("/accountOpeningForm");
  //   setAnchorEl(null);
  // };
  const mainMenuHandler = () => {
    navigate("/portal")
  }
  useEffect(() => {
    let admin = localStorage.getItem("admin");
    if (admin) {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        paddingX={2}
        paddingY={1}
        backgroundColor="#fff"
        boxShadow="0 0 20px #80808099"
        className="header"
      >
        <Box width="25%" onClick={mainMenuHandler}>
          <img className="header-logo" src={logo} alt="iifl-logo" />
        </Box>
        {showPMS && (


          <Box width="25%" textAlign="center">
            <Typography className="main-title">
              Pool Management Strategy
            </Typography>
          </Box>
        )}

        {showNominee && (

          <Box width="25%" textAlign="center">
            <Typography className="main-title"> Nominee & Account Opening Form</Typography>
          </Box>

        )}
        {showAdmin && (
          <Box width="25%" textAlign="center">
            <Typography className="main-title"> Add or Update User</Typography>
          </Box>
        )}
        {showPoa && (
          <Box width="25%" textAlign="center">
            <Typography className="main-title"> Power of Attorney</Typography>
          </Box>
        )}
        {/* {localStorage.getItem("token") && ( */}
        <Box
          width="25%"
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          gap="10px"
        >
          {showPoa && backArrow ?
            (
              <>
                {shouldShowHomeIcon ?
                  (<HomeIcon className="menuIcon" sx={{ cursor: "pointer" }}
                    onClick={portalHandler} />) : <></>}
                <ArrowBackIcon className="menuIcon" sx={{ cursor: "pointer" }}
                  onClick={poaBackArrowHandler} />
              </>
            )
            :
            showPoa ? (
              <>

                {shouldShowHomeIcon ?
                  (<HomeIcon className="menuIcon" sx={{ cursor: "pointer" }}
                    onClick={portalHandler} />) : null}
                <SettingsIcon className="menuIcon" sx={{ cursor: "pointer" }}
                  onClick={poaConfigurationHandler} />
              </>
            ) : null}
          {showAdmin ? (<HomeIcon className="menuIcon" sx={{ cursor: "pointer" }}
            onClick={portalHandler} />) : null}
          {showNominee && backArrow ? (
            <>
              {shouldShowHomeIcon ?
                (<HomeIcon className="menuIcon" sx={{ cursor: "pointer" }}
                  onClick={portalHandler} />) : <></>}
              <ArrowBackIcon
                className="arrowIcon"
                sx={{ cursor: "pointer" }}
                onClick={backArrowHandler}
              />

            </>

          ) : showNominee ? (
            <>
              {shouldShowHomeIcon ?
                (<HomeIcon className="menuIcon" sx={{ cursor: "pointer" }}
                  onClick={portalHandler} />) : <></>}
              <SettingsIcon
                className="settingsIcon"
                sx={{ cursor: "pointer" }}
                onClick={configuraitonHandler}
              />

            </>
          ) : null}
          {showPMS && backArrow ? (
            <>
              {shouldShowHomeIcon ?
                (<HomeIcon className="menuIcon" sx={{ cursor: "pointer" }}
                  onClick={portalHandler} />) : <></>}
              <ArrowBackIcon className="homeIcon" sx={{ cursor: "pointer" }} onClick={homeHandler} />

            </>

          ) : showPMS ? (
            <>
              {shouldShowHomeIcon ?
                (<HomeIcon className="menuIcon" sx={{ cursor: "pointer" }}
                  onClick={portalHandler} />) : <></>}
              <SettingsIcon
                className="settingsIcon"
                sx={{ cursor: "pointer" }}
                onClick={adminHandler}
              />

            </>
          ) : null}

          {/* {showPMS ?  ( 
  <> 
  <HomeIcon  sx={{ cursor: "pointer" }}
  onClick={portalHandler}/>
   
     
   
      <SettingsIcon className="settingsIcon" sx={{ cursor: "pointer" }} onClick={adminHandler} />
  
  </>
 ) : null} */}
          {/* {showNominee ? (
            <Button
              sx={{
                bgcolor: "#242056 !important",
                color: "white !important ",
                border: "none !important",
              }}
              className="logoutBtn"
              onClick={downloadHandler}
            >
              Download
            </Button>
          ) : null} */}

          {showNominee ? (
            <Button
              sx={{
                bgcolor: "#242056 !important",
                color: "white !important ",
                border: "none !important",
              }}
              className="logoutBtn"
              onClick={logoutHandler}
            >
              LOGOUT
            </Button>
          ) : null}

          {showPortal ? (
            <Button

              className="logoutBtn"
              onClick={logoutHandler}
            >
              LOGOUT
            </Button>
          ) : null}

          {showPoa ? (
            <Button
              sx={{
                bgcolor: " #2d545e!important",
                color: "white !important ",
                border: "none !important",
              }}
              className="logoutBtn"
              onClick={logoutHandler}
            >
              LOGOUT
            </Button>
          ) : null}
          {showAdmin ? (
            <Button
              sx={{
                bgcolor: " #3f51b5!important",
                color: "white !important ",
                border: "none !important",
              }}
              className="logoutBtn"
              onClick={logoutHandler}
            >
              LOGOUT
            </Button>
          ) : null}
          {/* {showNominee && showPoa ?( 
            <Button className="logoutBtn" onClick={logoutHandler}>
              LOGOUT
            </Button>
           ):null} */}
        </Box>

      </Box>
    </>
  );
};

export default Header;
