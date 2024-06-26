import './Login.css';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Box, Button, FormControl, IconButton, InputAdornment, Snackbar, TextField } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
// import { MenuContext } from './Context';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import MenuContext from './Context';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom';



const schema = Yup.object({
    username: Yup.string().email()
        .required("Username is required"),
    password: Yup.string()
        .required("Password is required")
        .min(6, "Please enter more than 6 characters")
        .max(15, "Only 15 characters allowed")
});

const Login = () => {

    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();
    const [severity, setSeverity] = useState("success");
    const [openAlert, setOpenAlert] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const match1 = ["pms", "poa"]
    const match2 = ["pms", "nominee"]
    const match3 = ["po3", "nominee"]
    // const roles = ['pms','nominee','poa']
    const { roles, setRoles } = useContext(MenuContext); // Accessing roles from the context



    const { control, register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange"
    });


    useEffect(() => {

        document.title = "IIFL";

        // if (localStorage.getItem('token')) {
        //     navigate('/dashboard');
        // }
    }, [])

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    const loginHandler = (data) => {
        setIsLoading(true);
        console.log(data);
        axios.post(`${baseUrl}/login`, data)
            .then((res) => {
                setIsLoading(false);
                setSnackbarMessage(res.data.message);
                setSeverity("success");
                setOpenAlert(true);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('username', data.username)
                console.log(res.data);
                console.log(res.data.token);
                const dataToken = res.data.token;
                const decodedToken = jwt_decode(dataToken);
                console.log(decodedToken.rbac_roles);
                const rbacRoles = decodedToken.rbac_roles;
                setRoles(rbacRoles);


                console.log("USERNAME: ", data.username)

                // const stateObj = { userData: { username: data.username } }

                // const userData = {
                //     state: "hello"
                // }

                // Check if roles array has only one element
                if (rbacRoles.length === 1) {
                    const roleName = rbacRoles[0].toLowerCase();
                    if (roleName === "nominee") {
                        navigate("/tradeFeed");
                        return; // Exit the function to prevent further navigation
                    }
                }

                // Check for "pms" role
                if (rbacRoles.includes("pms")) {
                    navigate("/dashboard");
                    return; // Exit the function to prevent further navigation
                }

                // Check for "poa" role
                if (rbacRoles.includes("poa")) {
                    navigate("/poa");
                    return; // Exit the function to prevent further navigation
                }

                // Navigate to the portal if none of the above conditions matched
                navigate("/portal");
            })
            .catch((err) => {
                setIsLoading(false);
                console.log(err, "err");
                setSnackbarMessage(err.response.data.message);
                setSeverity("error");
                setOpenAlert(true);


            })
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    };

    return (
        <MenuContext.Provider value={{ roles }}>
            <>
                <Header showPMS={false} showNominee={false} backArrow={false} showPoa={false} />

                {isLoading ? <Loader /> : null}
                <Box className="loginBox">
                    <form onSubmit={handleSubmit(loginHandler)} className="form" >
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <FormControl className='textBox' sx={{ m: 1, width: '35ch' }} >
                                    <TextField
                                        label="Username"
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        value={value ?? ""}
                                        error={!!errors.username}
                                        helperText={errors?.username?.message}
                                    />
                                </FormControl>
                            )}
                            name="username"
                        />

                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <FormControl className='textBox' sx={{ m: 1, width: '35ch' }} variant="outlined">
                                    <TextField
                                        label='Password'
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        value={value ?? ""}
                                        error={!!errors.password}
                                        helperText={errors?.password?.message}
                                        placeholder='Enter password'
                                        type={showPassword ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </FormControl>
                            )}
                            name="password"
                        />

                        <FormControl className='textBox' sx={{ m: 1, width: '35ch' }}>
                            <Button className='loginBtn' type="submit" >Login</Button>
                        </FormControl>


                        <Snackbar
                            anchorOrigin={{
                                horizontal: "center",
                                vertical: "bottom",
                            }}
                            open={openAlert} autoHideDuration={3000} onClose={handleCloseAlert}>
                            <Alert
                                className={severity === "success" ? "successAlert" : "failureAlert"}
                                onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }}>
                                {snackbarMessage}
                            </Alert>
                        </Snackbar>

                    </form>
                </Box>
            </>
        </MenuContext.Provider>
    )
}

export default Login
