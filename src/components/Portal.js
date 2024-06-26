import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Box,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import "./Portal.css";
import { useNavigate } from "react-router";
import MenuContext from "./Context";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Dashboard from "./Dashboard";
import Poa from "./Poa";


function Portal() {
  const roles = useContext(MenuContext);
  const navigate = useNavigate();
  // console.log(rolesArray)
  const rolesArray = roles.roles.map((item) => item.toLowerCase());
  console.log(rolesArray);
  useEffect(() => {
    console.log("Roles Array:", rolesArray);

    if (rolesArray.includes("admin")) {
      console.log("Admin role");
    } else if (rolesArray.length === 1) {
      const singleRole = rolesArray[0];
      console.log("Single Role:", singleRole);

      if (singleRole === "pms") {
        console.log("Navigating to Dashboard");
        navigate("/dashboard");
      } else if (singleRole === "nominee") {
        console.log("Navigating to Trade Feed");
        navigate("/tradeFeed");
      } else if (singleRole === "poa") {
        console.log("Navigating to POA");
        navigate("/poa");
      }
    }
  }, [rolesArray, navigate]);

  const pmsHandler = () => {
    navigate("/dashboard");
  };
  const nomineeAofHandler = () => {
    navigate("/tradeFeed");
  };
  const userListHandler = () => {
    navigate("/userlist");
  };
  const poaHandler = () => {
    navigate("/poa");
  };

  return (
    <>
      <Header
        showPMS={false}
        showNominee={false}
        backArrow={false}
        showPortal={true}
      // rolesArray={rolesArray}
      />

      <Box>
        <Grid
          container
          alignItems="center"
          justify="center"
          className="mainGrid"
          spacing={2}
          //  marginTop="30px"
          padding="20px"
        >
          {/* admin */}
          {/* {console.log({roles})} */}
          {roles && rolesArray.includes("admin") && (
            <>
              <Grid alignItems="center" justify="center">
                <Grid item>
                  <IconButton onClick={pmsHandler} className="MyCustomButton">
                    <Grid
                      className="optionDiv"
                      container
                      sx={{
                        width: "400px",
                        height: "100px",
                        borderTop: "10px solid #F26F21 ",
                        borderTopLeftRadius: "4px",
                        borderTopRightRadius: "4px",
                        backgroundColor: "whitesmoke",
                        boxShadow: "0.1rem 0.1rem 1.5rem rgba(0, 0, 0, 0.3)",
                        paddingTop: "20px",
                        paddingLeft: "10px",
                      }}
                    >
                      <Grid
                        item
                        style={{
                          borderRadius: "50%",
                          width: "40px",
                          height: "36px",
                          backgroundColor: "#F26F21",
                        }}
                      >
                        <Typography
                          sx={{
                            textAlign: "center",
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "white",
                            paddingTop: "8px",
                          }}
                        >
                          PMS
                        </Typography>
                      </Grid>
                      <Typography
                        className="textDiv"
                        sx={{
                          marginLeft: "20px",
                          marginTop: "5px",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        Pool Management System
                      </Typography>
                    </Grid>
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton onClick={poaHandler} className="MyCustomButton">
                    <Grid
                      container
                      className="optionDiv"
                      sx={{
                        width: "400px",
                        height: "100px",
                        borderTop: "10px solid #2d545e",
                        borderTopLeftRadius: "4px",
                        borderTopRightRadius: "4px",
                        backgroundColor: "whitesmoke",
                        boxShadow: "0.1rem 0.1rem 1.5rem rgba(0, 0, 0, 0.3)",
                        paddingTop: "20px",
                        paddingLeft: "10px",
                      }}
                    >
                      <Grid
                        item
                        style={{
                          borderRadius: "50%",
                          width: "40px",
                          height: "36px",
                          backgroundColor: "#2d545e",
                        }}
                      >
                        <Typography
                          sx={{
                            textAlign: "center",
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "white",
                            paddingTop: "8px",
                          }}
                        >
                          POA
                        </Typography>
                      </Grid>
                      <Typography
                        className="textDiv"
                        sx={{
                          marginLeft: "20px",
                          marginTop: "5px",
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        Power of Attorney
                      </Typography>
                    </Grid>
                  </IconButton>
                </Grid>
              </Grid>
              <Grid alignItems="center" justify="center">
                <Grid item>
                  <IconButton
                    onClick={nomineeAofHandler}
                    className="MyCustomButton"
                  >
                    <Grid
                      className="optionDiv"
                      container
                      sx={{
                        width: "400px",
                        height: "100px",
                        borderTop: "10px solid #242056 ",
                        borderTopLeftRadius: "4px",
                        borderTopRightRadius: "4px",
                        backgroundColor: "whitesmoke",
                        boxShadow: "0.1rem 0.1rem 1.5rem rgba(0, 0, 0, 0.3)",
                        paddingTop: "20px",
                        paddingLeft: "10px",
                      }}
                    >
                      <Grid
                        item
                        style={{
                          borderRadius: "50%",
                          width: "40px",
                          height: "36px",
                          backgroundColor: "#242056",
                        }}
                      >
                        <Typography
                          sx={{
                            textAlign: "center",
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "white",
                            paddingTop: "8px",
                          }}
                        >
                          NAOF
                        </Typography>
                      </Grid>
                      <Typography
                        className="textDiv"
                        sx={{
                          marginLeft: "20px",
                          marginTop: "5px",
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        Nominee & Accounting Opening Form
                      </Typography>
                    </Grid>
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={userListHandler}
                    className="MyCustomButton"
                  >
                    <Grid
                      className="optionDiv"
                      container
                      sx={{
                        width: "400px",
                        height: "100px",
                        borderTop: "10px solid #3f51b5 ",
                        borderTopLeftRadius: "4px",
                        borderTopRightRadius: "4px",
                        backgroundColor: "whitesmoke",
                        boxShadow: "0.1rem 0.1rem 1.5rem rgba(0, 0, 0, 0.3)",
                        paddingTop: "20px",
                        paddingLeft: "10px",
                      }}
                    >
                      <Grid
                        item
                        style={{
                          borderRadius: "50%",
                          width: "40px",
                          height: "36px",
                          backgroundColor: "#3f51b5",
                        }}
                      >
                        <Typography
                          sx={{
                            textAlign: "center",
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "white",
                            padding: "6px 4px",
                          }}
                        >
                          <PersonAddIcon />
                        </Typography>
                      </Grid>

                      <Typography
                        className="textDiv"
                        sx={{
                          marginLeft: "20px",
                          marginTop: "5px",
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        Manage User
                      </Typography>

                    </Grid>
                  </IconButton>
                </Grid>
              </Grid>
            </>
          )}
          {roles && rolesArray.includes("pms") && (
            <IconButton onClick={pmsHandler} className="MyCustomButton">
              <Grid
                className="optionDiv"
                container
                sx={{
                  width: "400px",
                  height: "100px",
                  borderTop: "10px solid #F26F21 ",
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px",
                  backgroundColor: "whitesmoke",
                  boxShadow: "0.1rem 0.1rem 1.5rem rgba(0, 0, 0, 0.3)",
                  paddingTop: "20px",
                  paddingLeft: "10px",
                }}
              >
                <Grid
                  item
                  style={{
                    borderRadius: "50%",
                    width: "40px",
                    height: "36px",
                    backgroundColor: "#F26F21",
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "white",
                      paddingTop: "8px",
                    }}
                  >
                    PMS
                  </Typography>
                </Grid>
                <Typography
                  className="textDiv"
                  sx={{
                    marginLeft: "20px",
                    marginTop: "5px",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  Pool Management System
                </Typography>
              </Grid>
            </IconButton>
          )}

          {roles && rolesArray.includes("nominee") && (
            <IconButton onClick={nomineeAofHandler} className="MyCustomButton">
              <Grid
                className="optionDiv"
                container
                sx={{
                  width: "400px",
                  height: "100px",
                  borderTop: "10px solid #242056 ",
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px",
                  backgroundColor: "whitesmoke",
                  boxShadow: "0.1rem 0.1rem 1.5rem rgba(0, 0, 0, 0.3)",
                  paddingTop: "20px",
                  paddingLeft: "10px",
                }}
              >
                <Grid
                  item
                  style={{
                    borderRadius: "50%",
                    width: "40px",
                    height: "36px",
                    backgroundColor: "#242056",
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "white",
                      paddingTop: "8px",
                    }}
                  >
                    NAOF
                  </Typography>
                </Grid>
                <Typography
                  className="textDiv"
                  sx={{
                    marginLeft: "20px",
                    marginTop: "5px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  Nominee & Accounting Opening Form
                </Typography>
              </Grid>
            </IconButton>
          )}

          {roles && rolesArray.includes("poa") && (
            <IconButton onClick={poaHandler} className="MyCustomButton">
              <Grid
                container
                className="optionDiv"
                sx={{
                  width: "400px",
                  height: "100px",
                  borderTop: "10px solid #2d545e",
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px",
                  backgroundColor: "whitesmoke",
                  boxShadow: "0.1rem 0.1rem 1.5rem rgba(0, 0, 0, 0.3)",
                  paddingTop: "20px",
                  paddingLeft: "10px",
                }}
              >
                <Grid
                  item
                  style={{
                    borderRadius: "50%",
                    width: "40px",
                    height: "36px",
                    backgroundColor: "#393e46 !important",
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "white",
                      paddingTop: "8px",
                    }}
                  >
                    POA
                  </Typography>
                </Grid>
                <Typography
                  className="textDiv"
                  sx={{
                    marginLeft: "20px",
                    marginTop: "5px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  Power Of Attorney
                </Typography>
              </Grid>
            </IconButton>
          )}
        </Grid>
      </Box>
    </>
  );
}

export default Portal;
