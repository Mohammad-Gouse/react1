import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Header from "./Header";
import Poa from "./Poa";
import PoaOld from "./PoaOld";
import { useLocation } from "react-router-dom";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const PoA_Tab_table = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  ////get username
  const location = useLocation();
  const userData = location;

  // Access the username from the state object
  console.log("state: ", userData)
  return (
    <>
      <Header
        showPMS={false}
        showPoa={true}
        showNominee={false}
        backArrow={false}
      />
      <Box
        sx={{ maxWidth: "100%", flexDirection: "column", minHeight: "100vh" }}
      >
        <Box sx={{ borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab label="PoA" {...a11yProps(0)} />
            <Tab label="PoA_old" {...a11yProps(1)} />
          </Tabs>
        </Box>
        {/* <Button
          sx={{
            bgcolor: "#242056 !important",
            color: "white !important ",
            border: "none !important",
          }}
          className="logoutBtn"
          // onClick={categorizeSelectedRows}
        >
          LOGOUT
        </Button> */}
        <Box
          sx={{
            flexGrow: 1, // Allow the content to take up remaining vertical space
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // Center the content vertically
            // alignItems: "center", // Center the content horizontally
          }}
        >
          <CustomTabPanel value={value} index={0}>
            <Poa />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            < PoaOld />
          </CustomTabPanel>
        </Box>
      </Box>
    </>
  );
};

export default PoA_Tab_table;
