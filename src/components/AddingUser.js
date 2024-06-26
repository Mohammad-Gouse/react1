import React from "react";
// import Header from "./Header";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import _ from "lodash";
// import history from "@history";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import { Controller, useForm } from "react-hook-form";
import { Alert, Checkbox, FormControl, Grid, Hidden, InputLabel, MenuItem, Select } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import "./AddingUser.css";
import { getValue } from "@testing-library/user-event/dist/utils";
function AddingUser({ user, onClose }) {
  const schema = yup.object().shape({
    username: yup.string().trim().required("You must enter the First Name"),
    role: yup
      .array()
      .required("You must select at least one Role")
      .min(1, "You must select at least one Role"),
    password: yup
      .string()
      .required("You must enter the Password")
      .min(8, "Password Must contatin atleast 8 character"),
    confirm_password: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("password")], "Passwords must match"),
    // email: yup
    //   .string()
    //   .email("Please Enter Valid Email Address")
    //   .required("Please Enter the Email Address"),
    // select_product: yup.array().of(yup.object().shape({value:yup.string()})).min(1,"Select at least one product")
  });
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState("success");

  const [alertMessage, setAlertMessage] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [name, setName] = useState("");
  const [roles, setRoles] = useState([]);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const headers = {
    "Content-Type": "application/json",
  };

  useEffect(() => {
    // Prefill form fields with user data if available (for updating)
    if (user) {
      console.log("User prop received:", user);
      setValue("username", user.username || "");
      setValue(
        "role",
        user.role_names?.map((role) => ({ value: role, name: role })) || []
      );
      setRoles(user.role_names?.map((role) => role) || []);
    }
  }, [user]);

  // const usertypes = ["POA", "PMS", "Nominee"];

  const { handleSubmit, reset, control, formState, setValue, getValues } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  //   useEffect(() => {
  //     loadProductList();
  //   },[])

  //   const loadProductList = useCallback(() => {

  //     axios.getAwsCall('product').then((response) => {
  //       setProductList(response.data.body.rows)
  //     })
  //   },[])

  // const createUser = (formdata) => {
  //   // setIsLoading(true);
  //   axios
  //   .post(`${baseUrl}/add-user`, formdata, { headers: headers })
  //     .then(function (response) {
  //       console.log(formdata)
  //       // if (response.data.success) {
  //       //   setIsLoading(false);
  //       //   //   history.push({
  //       //   //     pathname: "/user/list",
  //       //   //   });
  //       // } else {
  //       //   setIsLoading(false);
  //       //   setOpenSnackbar(true);
  //       //   if (response.data.body.status.indexOf("users_email_key") !== -1) {
  //       //     setAlertMessage("An Account exist with given Email Address ");
  //       //   } else {
  //       //     setAlertMessage(response.data.body.status);
  //       //   }
  //       // }
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
    setAlertMessage("");
  };

  const usertypes = [
    { value: 4, name: "Admin" },
    { value: 1, name: "POA" },
    { value: 2, name: "PMS" },
    { value: 3, name: "Nominee" },
  ];

  const handleUpdateUser = (userId, data) => {
    setValue("username", "");
    setValue("role", []);
    console.log("update :", userId)
    const { username, role } = data;
    // console.log("role:",role)
    //       const roles = role?.map((selectedRole) => selectedRole.value);
    const roles = [...role];
    console.log({ "update": roles })
    const updatedUserData = {
      username,
      roles,
    };
    console.log({ formData: "update" });
    axios
      .put(`${baseUrl}/update-user/${user.id}`, updatedUserData)
      .then((response) => {
        setSnackbarMessage("User updated successfully")
        // setSnackbarMessage(res.data.message);
        setSeverity("success");
        setOpenAlert(true);

        console.log("User updated successfully.", response.data);
        // onClose(true); // Notify the parent component that user was updated successfully
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };
  const handleAddUser = (data) => {
    setValue("username", "");
    setValue("role", []);
    const { username, password, confirm_password, role } = data;
    console.log("data->", data)
    //     const roles = role?.map((selectedRole) => selectedRole.value);
    // console.log({"add":roles})
    const roles = [...role];
    const formData = {
      username,
      password,
      confirm_password,
      roles,
    };
    console.log({ formData: "add" });
    axios
      .post(`${baseUrl}/add-user`, formData, { headers: headers })
      .then((response) => {
        setSnackbarMessage("user added successfully");
        setSeverity("success");
        setOpenAlert(true);
        // console.log("response.data->q ", response.data);
        // console.log("response.data.message -> ", response.data.message);
        // console.log("response.message->", response.message);
        // console.log(formData);
        window.location.reload();
        // Handle the response here if needed
      })
      .catch((error) => {
        console.log(error);
        // Handle the error here if needed
        if (error.response && error.response.status === 401) {
          // The username already exists, show an error message to the user
          setSnackbarMessage("Username already exists. Please choose a different username.");
          setSeverity("error");
          setOpenAlert(true);
        } else {
          // Handle other errors here
          setSnackbarMessage("An error occurred while adding the user.");
        }
      });


  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };


  const handleFormReset = () => {
    // Reset the form fields and clear the selected roles
    setValue("username", "");
    setValue("role", []);
    setValue("password", "");
    setValue("confirm_password", "");
    setShowPassword(false);
    setShowCPassword(false);
    setSelectedRoles([]); // Clear the selected roles when resetting the form
  };

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center">
        <form
          className="w-full"
          // onSubmit={handleSubmit( (addUserHandler))}
          style={{
            background: "#ffffff",
            padding: "32px",
            borderRadius: "8px",
          }}
        >


          <Grid container spacing={2} alignItems="center">
            {/* User Name */}
            <Grid item xs={12} sm={6}>

              <Controller
                render={({ field }) => (
                  <TextField
                    label="User Name"
                    sx={{ maxHeight: 60 }}
                    error={!!errors.username}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    helperText={errors?.username?.message}
                    {...field}
                    variant="outlined"
                    fullWidth
                  // inputProps={{ style: { paddingTop: "8px", paddingBottom: "8px" } }}

                  />
                )}
                name="username"
                control={control}
              />
            </Grid>
            {/* Role */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Controller

                  name="role"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      {...field}
                      multiple
                      value={field.value}
                      onChange={(event) => field.onChange(event.target.value)}
                      label="Role"
                      error={!!errors.role}
                      sx={{ maxHeight: 60 }}
                      fullWidth
                    >
                      {usertypes.map((role) => (
                        <MenuItem key={role.value} value={role.value}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            {user ? null : (<>

              {/* Password */}
              <Grid item xs={12} sm={6} mt={2}>

                <Controller
                  render={({ field }) => (
                    <TextField
                      label="Pasword"
                      sx={{ maxHeight: 60 }}
                      error={!!errors.password}
                      helperText={errors?.password?.message}
                      InputProps={{
                        type: showPassword ? "text" : "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              size="large"
                            >
                              {showPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      {...field}
                      variant="outlined"
                      fullWidth
                    // inputProps={{ style: { paddingTop: "8px", paddingBottom: "8px" } }}

                    />
                  )}
                  name="password"
                  control={control}
                />
              </Grid>

              {/* Confirm Password */}
              <Grid item xs={12} sm={6} mt={2}>

                <Controller
                  render={({ field }) => (
                    <TextField
                      label="Confirm Password"
                      sx={{
                        maxHeight: 60,
                        borderRadius: "20px !important",
                        // marginTop:"10px"
                      }}
                      type="password"
                      error={!!errors.confirm_password}
                      helperText={errors?.confirm_password?.message}
                      InputProps={{
                        type: showCPassword ? "text" : "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowCPassword(!showCPassword)}
                              size="large"
                            >
                              {showCPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      {...field}
                      variant="outlined"
                      fullWidth
                    // inputProps={{ style: { paddingTop: "8px", paddingBottom: "8px" } }}
                    />
                  )}
                  name="confirm_password"
                  control={control}
                />
              </Grid>
            </>)}
          </Grid>

          {/* Submit and Reset buttons */}
          <Grid
            container
            justifyContent="center"
            className="my-8"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: " 42px",
            }}
          >
            {isLoading ? (
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                size="large"
                disabled
              >
                <CircularProgress size={25} />
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  className="resetBtn"
                  onClick={handleFormReset}
                >
                  Reset
                </Button>
                {user ? (
                  <Button onClick={() => handleUpdateUser(user.Id, getValues())} className="submitBtn" type="button">
                    Update User
                  </Button>

                ) :
                  (
                    <Button onClick={() => handleAddUser(getValues())} className="submitBtn" type="button">
                      Add User
                    </Button>
                  )}
              </>
            )}
          </Grid>
        </form>

        {/* <Snackbar
          autoHideDuration={10000}
          open={openSnackbar}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar> */}

        <Snackbar
          anchorOrigin={{
            horizontal: "center",
            vertical: "bottom",
          }}
          open={openAlert}
          autoHideDuration={5000}
          onClose={handleCloseAlert}
        >
          <Alert
            className={severity === "success" ? "successAlert" : "failureAlert"}
            onClose={handleCloseAlert}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}

export default AddingUser;
