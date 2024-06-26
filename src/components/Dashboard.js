import './Dashboard.css';
import { Alert, Box, Button, LinearProgress, Snackbar, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AlertMessage from './AlertMessage';
import Loader from './Loader';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsIcon from "@mui/icons-material/Settings";
let fileDownload = require('js-file-download');


const schema = Yup.object({
    fromdate: Yup.date().required("From date is required"),
    tilldate: Yup.date().required("Till date is required")
        .min(
            Yup.ref('fromdate'),
            "till date can't be before from date"
        )
});

const Dashboard = () => {
    const nseResponseFileRef = useRef();
    const utrResponseFileRef = useRef();
    const [uploaded, setUploaded] = useState(null);
    const [severity, setSeverity] = useState("success");
    const [openAlert, setOpenAlert] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const allowedExtensions = ["csv"];
    const fileSize = process.env.REACT_APP_FILE_SIZE_LIMIT;
    const fileSizeLimit = fileSize / 1000 / 1000;
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange"
    });

    const nse_transaction = `${process.env.REACT_APP_NSE_TRANSACTION}_${moment(new Date()).format("YYYY-MM-DDTHH-mm-ss")}.csv`;
    const custody_buy = `${process.env.REACT_APP_CUSTODY_BUY}_${moment(new Date()).format("YYYY-MM-DDTHH-mm-ss")}.csv`;
    const custody_sell = `${process.env.REACT_APP_CUSTODY_SELL}_${moment(new Date()).format("YYYY-MM-DDTHH-mm-ss")}.csv`;
    const utrn_confirmation = `${process.env.REACT_APP_UTRN_CONFIRMATION}_${moment(new Date()).format("YYYY-MM-DDTHH-mm-ss")}.csv`;
    const summary_file = `${process.env.REACT_APP_SUMMARY}_${moment(new Date()).format("YYYY-MM-DDTHH-mm-ss")}.csv`;
// icons on this page
const homeIcon = <HomeIcon />;
const settingsIcon = <ArrowBackIcon />;
const arrowIcon = <SettingsIcon />;
// header rendering 
// const location = useLocation();
//   const isLoginPage = location.pathname === "/login";       
//   const renderHeader = !isLoginPage && (
//       <Header
//       homeIcon={homeIcon}
//       settingsIcon={settingsIcon}
//       arrowIcon={arrowIcon}
//       />)       
    useEffect(() => {
        const userToken = localStorage.getItem('token');

        // if (!userToken) {
        //     navigate('/')
        // }
    }, [])

    useEffect(() => {
        let alerted = localStorage.getItem('alerted');
        // if (!alerted) {
        //     setIsLoggedIn(true);
        //     localStorage.setItem('alerted', "Yes");
        // }
    }, [])

    useEffect(() => {
        document.title = "IIFL | Dashboard"
    }, [])

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    const nseTransaction = () => {
        setIsLoading(true);
        axios.get(`${baseUrl}/transactions`, { params: {"filename": nse_transaction} })
            .then((res) => {
                fileDownload(res.data, nse_transaction)
                setIsLoading(false);
                setSnackbarMessage("Nse transaction download successfully");
                setSeverity("success");
                setOpenAlert(true);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
                setSnackbarMessage(err?.message);
                setSeverity("error");
                setOpenAlert(true);
            })
    }

    const custodyBuy = () => {
        setIsLoading(true);
        axios.get(`${baseUrl}/custody-buy`, { params: {"filename": custody_buy} })
            .then((res) => {
                fileDownload(res.data, custody_buy)
                setIsLoading(false);
                setSnackbarMessage("Custody buy downloaded successfully");
                setSeverity("success");
                setOpenAlert(true);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
                setSnackbarMessage(err?.message);
                setSeverity("error");
                setOpenAlert(true);
            })
    }

    const custodySell = () => {
        setIsLoading(true);

        axios.get(`${baseUrl}/custody-sell`, { params: {"filename": custody_sell} })
            .then((res) => {
                fileDownload(res.data, custody_sell)
                setSnackbarMessage("Custody sell downloaded successfully");
                setSeverity("success");
                setOpenAlert(true);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
                setSnackbarMessage(err?.message);
                setSeverity("error");
                setOpenAlert(true);
            })
    }

    const utrConfirmation = () => {
        setIsLoading(true);

        axios.get(`${baseUrl}/utrn-confirmation`, { params: {"filename": utrn_confirmation} })
            .then((res) => {
                fileDownload(res.data, utrn_confirmation)
                setSnackbarMessage("Utr confirmation downloaded successfully");
                setSeverity("success");
                setOpenAlert(true);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
                setSnackbarMessage(err?.message);
                setSeverity("error");
                setOpenAlert(true);
            })
    }

    const summary = (data) => {
        let fromdate = moment(data.fromdate).format("DD-MM-YYYY")
        let tilldate = moment(data.tilldate).format("DD-MM-YYYY")
        setIsLoading(true);
        axios.get(`${baseUrl}/summary?start_date=${fromdate}&end_date=${tilldate}`, { params: {"filename": summary_file} })
            .then((res) => {
                fileDownload(res.data, summary_file)
                setSnackbarMessage("Summary downloaded successfully");
                setSeverity("success");
                setOpenAlert(true);
                setIsLoading(false);
                reset();
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
                setSnackbarMessage(err?.message);
                setSeverity("error");
                setOpenAlert(true);
                reset();
            })
    }

    const nseResponse = () => {
        nseResponseFileRef.current.click();
    }

    const utrResponse = () => {
        utrResponseFileRef.current.click();
    }

    const headers = {
        "Content-Type": "multipart/form-data",
    }

    const nseResponseFileHandler = (e) => {
        const inputFile = e.target.files[0];
        const fileExtension = inputFile?.type.split("/")[1];
        const formData = new FormData();
        formData.append("file", inputFile);
        const extension = ["text", "plain", "txt"];
        if (!extension.includes(fileExtension)) {
            setOpenAlert(true);
            setSnackbarMessage(`Please upload only text files!`);
            setSeverity("error");
        }
        else if (inputFile.size === fileSize || inputFile.size > fileSize) {
            setOpenAlert(true);
            setSnackbarMessage(`Please upload file less than ${fileSizeLimit} mb!`);
            setSeverity("error");
        }
        else {
            setIsLoading(true);
            axios.post(`${baseUrl}/upload-nse-response`, formData, { headers: headers })
                .then((res) => {
                    setIsLoading(false);
                    setSnackbarMessage(res.data.message);
                    setSeverity("success");
                    setOpenAlert(true);
                })
                .catch((err) => {
                    setIsLoading(false);
                    console.log(err);
                    setSnackbarMessage(err?.message);
                    setSeverity("error");
                    setOpenAlert(true);
                })
        }

    }

    const utrResponseFileHandler = (e) => {
        const inputFile = e.target.files[0];
        const fileExtension = inputFile?.type.split("/")[1];
        const formData = new FormData();
        formData.append("file", inputFile);
        if (!allowedExtensions.includes(fileExtension)) {
            setOpenAlert(true);
            setSnackbarMessage(`Please upload only csv files!`);
            setSeverity("error");
        }
        else if (inputFile.size === fileSize || inputFile.size > fileSize) {
            setOpenAlert(true);
            setSnackbarMessage(`Please upload file less than ${fileSizeLimit} mb!`);
            setSeverity("error");
        }
        else {
            setIsLoading(true);
            axios.post(`${baseUrl}/upload-utrn`, formData, { headers: headers })
                .then((res) => {
                    setIsLoading(false);
                    setSnackbarMessage(res.data.message);
                    setSeverity("success");
                    setOpenAlert(true);
                })
                .catch((err) => {
                    setIsLoading(false);
                    console.log(err);
                    setSnackbarMessage(err?.message);
                    setSeverity("error");
                    setOpenAlert(true);
                })
        }

    }

    useEffect(() => {
        console.log(isLoading)
      },[isLoading])

    return (
        <>
        <Header showPMS={true} showPoa={false} showNominee={false} showPortal={true} backArrow={false}/>
            {
                (uploaded > 0 && uploaded < 100) &&
                <Box marginTop={2} display="flex" width="100%" alignItems="center" justifyContent='center' gap="10px" >
                    <Box style={{ width: "43%", marginLeft: "" }} >
                        <LinearProgress
                            className="custom-class"
                            style={{ height: "20px", color: "black", marginLeft: "43px" }}
                            variant="determinate"
                            value={uploaded}
                        />
                    </Box>
                    <Box>
                        <Typography>
                            {uploaded}%
                        </Typography>
                    </Box>
                </Box>
            }

            <Box className='table'>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontSize: "12px", padding: "13px 16px" }} component="th" scope="row" className="title">
                                    NSE Transaction
                                </TableCell>
                                <TableCell align="right" sx={{ padding: "13px 16px" }} >
                                    <Button onClick={nseTransaction} className="btn" >Download</Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontSize: "12px !important", padding: "13px 16px" }} component="th" scope="row" className="title">
                                    NSE Response
                                </TableCell>
                                <TableCell align="right" sx={{ padding: "13px 16px" }}>
                                    <Button onClick={nseResponse} className="btn" >Upload</Button>
                                    <input
                                        ref={nseResponseFileRef}
                                        type="file"
                                        accept=".txt"
                                        style={{ display: "none" }}
                                        onChange={nseResponseFileHandler}
                                        onClick={(e)=> { 
                                            e.target.value = null
                                       }}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontSize: "12px !important", padding: "13px 16px" }} component="th" scope="row" className="title">
                                    Custody Buy
                                </TableCell>
                                <TableCell align="right" sx={{ padding: "13px 16px" }} >
                                    <Button onClick={custodyBuy} className="btn" >Download</Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontSize: "12px !important", padding: "13px 16px" }} component="th" scope="row" className="title">
                                    Custody Sell
                                </TableCell>
                                <TableCell align="right" sx={{ padding: "13px 16px" }} >
                                    <Button onClick={custodySell} className="btn">Download</Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontSize: "12px !important", padding: "13px 16px" }} component="th" scope="row" className="title">
                                    UTR Response from custody
                                </TableCell>
                                <TableCell align="right" sx={{ padding: "13px 16px" }}>
                                    <Button onClick={utrResponse} className="btn" >Upload</Button>
                                    <input
                                        ref={utrResponseFileRef}
                                        type="file"
                                        accept=".csv"
                                        style={{ display: "none" }}
                                        onChange={utrResponseFileHandler}
                                        onClick={(e)=> { 
                                            e.target.value = null
                                       }}
                                    />
                                </TableCell>

                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontSize: "12px !important", padding: "13px 16px" }} component="th" scope="row" className="title">
                                    UTR confirmation NSE
                                </TableCell>
                                <TableCell align="right" sx={{ padding: "13px 16px" }} >
                                    <Button onClick={utrConfirmation} className="btn" >Download</Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ display: "flex", alignItems: "center", gap: "10px", padding: "13px 16px" }} component="th" scope="row" className="title">
                                    <Box sx={{ display: "flex", alignItems: "fkex-start", gap: "10px" }} className="datePicker" >
                                        <Typography sx={{ fontSize: "12px !important", marginTop: "20px" }} >
                                            Summary
                                        </Typography>
                                        <Box mb={1} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginTop: "15px" }} >
                                            <Controller
                                                control={control}
                                                rules={{
                                                    maxLength: 100,
                                                }}
                                                defaultValue={new Date().toISOString().split("T")[0]}
                                                render={({ field: { onChange, onBlur, value } }) => (
                                                    <TextField
                                                        type="date"
                                                        label="From"
                                                        size="small"
                                                        onBlur={onBlur}
                                                        onChange={onChange}
                                                        value={value ?? ""}
                                                        error={!!errors.fromdate}
                                                        helperText={errors?.fromdate?.message}
                                                        sx={{ width: 115 }}
                                                        InputProps={{
                                                            inputProps: {
                                                                min: "2000-01-01",
                                                                max: new Date().toISOString().split("T")[0],
                                                                style: {
                                                                    fontSize: "12px",
                                                                },
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                )}
                                                name="fromdate"
                                            />
                                            <Controller
                                                control={control}
                                                rules={{
                                                    maxLength: 100,
                                                }}
                                                defaultValue={new Date().toISOString().split("T")[0]}
                                                render={({ field: { onChange, onBlur, value } }) => (
                                                    <TextField
                                                        type="date"
                                                        label="Till"
                                                        size="small"
                                                        onBlur={onBlur}
                                                        onChange={onChange}
                                                        value={value ?? ""}
                                                        error={!!errors.tilldate}
                                                        helperText={errors?.tilldate?.message}
                                                        sx={{ width: 115 }}
                                                        InputProps={{
                                                            inputProps: {
                                                                max: new Date().toISOString().split("T")[0],
                                                                style: {
                                                                    fontSize: "12px",
                                                                }
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                )}
                                                name="tilldate"
                                            />

                                        </Box>
                                    </Box>
                                </TableCell>

                                <TableCell align="right" sx={{ position: "relative", padding: "13px 16px" }} >
                                    <Button sx={{ position: "absolute", right: 15, top: 28 }} onClick={handleSubmit(summary)} className="btn" >Download</Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {isLoading ? <Loader /> : null}

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

            {isLoggedIn ? <AlertMessage status="loginsuccess" /> : null}

        </>
    )
}

export default Dashboard