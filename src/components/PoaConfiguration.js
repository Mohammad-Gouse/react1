import React from "react";
import Header from "./Header";
import {
  Alert,
  Box,
  Button,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import axios from "axios";
import moment from "moment";

import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import "./Configuration.css";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

let fileDownload = require("js-file-download");

function PoaConfiguration() {
  ////MIS-START////
  const schema = Yup.object({
    fromdate: Yup.date().required("From date is required"),
    tilldate: Yup.date()
      .required("Till date is required")
      .min(Yup.ref("fromdate"), "till date can't be before from date"),
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const summary_file = `${process.env.REACT_APP_POA_SUMMARY}_${moment(
    new Date()
  ).format("YYYY-MM-DDTHH-mm-ss")}.csv`;

  const summary = (data) => {
    let fromdate = moment(data.fromdate).format("DD-MM-YYYY");
    let tilldate = moment(data.tilldate).format("DD-MM-YYYY");
    setIsLoading(true);
    axios
      .get(
        `${baseUrl}/poa-summary?start_date=${fromdate}&end_date=${tilldate}`,
        { params: { filename: summary_file } }
      )
      .then((res) => {
        fileDownload(res.data, summary_file);
        setSnackbarMessage("PoA summary downloaded successfully");
        setSeverity("success");
        setOpenAlert(true);
        setIsLoading(false);
        reset();
      })
      .catch((err) => {
        setIsLoading(false)
        console.log("mis error response: ", err.response)
        if (err.response && err.response.status == 404) {
          setSnackbarMessage(err?.response.data.message);
          setSeverity("error");
          setOpenAlert(true);
        } else if (err.response && err.response.status === 500) {
          setSnackbarMessage(err.response.data.message);
          setSeverity("error");
          setOpenAlert(true);
        }
        else {
          // Handle other errors here
          setSnackbarMessage(err.response.data.message);
        }
        reset();
      });
  };

  ////MIS-END////
  const poaFileRef = useRef();
  const clientMasterFileRef = useRef();
  const clientMasterResponse = () => {
    clientMasterFileRef.current.click();
  };
  const allowedExtensions = [".csv"];
  const [openAlert, setOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const fileSize = process.env.REACT_APP_FILE_SIZE_LIMIT;
  const fileSizeLimit = fileSize / 1000 / 1000;
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const poaFileResponse = () => {
    poaFileRef.current.click();
  };
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  const poaFileResponseFileHandler = (e) => {
    const inputFile = e.target.files[0];
    const fileExtension = inputFile.type.split("/")[1];
    const formData = new FormData();
    const poa_dowload = `POA_MATCHING_FILE_${moment(new Date()).format(
      "YYYY-MM-DDTHH-mm-ss"
    )}.dbf`;

    formData.append("file", inputFile);
    console.log("file", inputFile);
    if (allowedExtensions.includes(fileExtension)) {
      setOpenAlert(true);
      setSnackbarMessage(`Please upload only csv files!`);
      setSeverity("error");
    } else if (inputFile.size === fileSize || inputFile.size > fileSize) {
      setOpenAlert(true);
      setSnackbarMessage(`Please upload file less than ${fileSizeLimit} mb!`);
      setSeverity("error");
    } else {
      setIsLoading(true);
      axios
        .post(`${baseUrl}/upload-poa`, formData, {
          headers: headers,

        })
        .then((res) => {
          // console.log({ res });
          // // console.log(res.heade  rs);\
          // console.log({ headers: res.headers });
          // const contentDisposition = res.headers["content-disposition"];
          // const blob = new Blob([res.data], { type: "application/zip" });
          // const blobUrl = URL.createObjectURL(blob);
          // const filenameMatch = contentDisposition
          //   ? contentDisposition.match(/filename=(?:"([^"]+)"|([^;]+))/)
          //   : null;
          // const filename = filenameMatch
          //   ? filenameMatch[1] || filenameMatch[2]
          //   : null;

          // const link = document.createElement("a");
          // link.href = blobUrl;

          // console.log({ link });

          // if (filename) {
          //   link.download = filename;
          //   console.log("Extracted filename:", filename);
          // }

          // link.click();
          // URL.revokeObjectURL(blobUrl);
          setIsLoading(false);
          setSnackbarMessage(res.data.message);
          setSeverity("success");
          setOpenAlert(true);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
          setSnackbarMessage(err.response.data.message);
          setSeverity("error");
          setOpenAlert(true);
          if (err.response && err.response.status === 400) {
            // The username already exists, show an error message to the user
            setSnackbarMessage(err.response.data.message);
            setSeverity("error");
            setOpenAlert(true);
          } else if (err.response && err.response.status === 401) {
            setSnackbarMessage("please upload valid file.");
            setSeverity("error");
            setOpenAlert(true);
          } else if (err.response && err.response.status === 402) {
            setSnackbarMessage("please upload client master file first.");
            setSeverity("error");
            setOpenAlert(true);
          } else {
            // Handle other errors here
            setSnackbarMessage("please upload valid file.");
          }
        });
    }
  };
  const clientMasterResponseileHandler = (e) => {
    const inputFile = e.target.files[0];
    const fileExtension = inputFile.type.split("/")[1];
    const formData = new FormData();
    formData.append("file", inputFile);
    console.log(formData);
    if (allowedExtensions.includes(fileExtension)) {
      setOpenAlert(true);
      setSnackbarMessage(`Please upload only csv files!`);
      setSeverity("error");
    } else if (inputFile.size === fileSize || inputFile.size > fileSize) {
      setOpenAlert(true);
      setSnackbarMessage(`Please upload file less than ${fileSizeLimit} mb!`);
      setSeverity("error");
    } else {
      setIsLoading(true);
      axios
        .post(`${baseUrl}/upload-client-master`, formData, { headers: headers })
        .then((res) => {
          setIsLoading(false);
          setSnackbarMessage(res.data.message);
          setSeverity("success");
          setOpenAlert(true);
        })
        .catch((error) => {
          setIsLoading(false);
          if (error.response && error.response.status === 400) {
            // The username already exists, show an error message to the user
            setSnackbarMessage("No new records found.");
            setSeverity("error");
            setOpenAlert(true);
          } else {
            // Handle other errors here
            setSnackbarMessage("An error occurred while adding the user.");
          }
          // console.log(err);
          // setSnackbarMessage(err.response.data.message);
          // setSeverity("error");
          // setOpenAlert(true);
        });
    }
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };


  // quality change option

  const [qualityLevel, setQualityLevel] = useState(null);
  const [openQualityConfirmDialog, setOpenQualityConfirmDialog] = useState(false); // Changed the function name

  // Function to fetch the initial quality level
  const fetchQualityLevel = async () => {
    try {
      const response = await fetch(`${baseUrl}/get-quality-level`); // Replace with your API endpoint
      if (response.ok) {
        const data = await response.json();
        setQualityLevel(data.qualityLevel);
      } else {
        console.error("Failed to fetch quality level.");
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    fetchQualityLevel(); // Fetch initial quality level when the component mounts
  }, []);

  const handleQualityLevelChange = (event, newValue) => {
    setQualityLevel(newValue);
  };

  const handleOpenQualityConfirmDialog = () => { // Changed the function name
    setOpenQualityConfirmDialog(true);
  };

  const closeQualityConfirmDialog = () => {
    setOpenQualityConfirmDialog(false);
  };

  const handleSetQualityLevel = () => {
    // You can perform the action to set the quality level here.
    // For example, you can make an API call or update a state variable.
    // Remember to handle the quality level change as per your application's needs.

    // Send a POST request to the backend API

    const data = { qualityLevel };
    fetch(`${baseUrl}/quality-change`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        // Handle the API response here if needed
        console.log("API Response:", result);
        setSnackbarMessage(`Quality level changed to: ${qualityLevel}`)
        setSeverity("success")
        setOpenAlert(true)
      })
      .catch((error) => {
        console.error("API Error:", error);
        setSnackbarMessage(`Error updating the quality`)
        setSeverity("error")
        setOpenAlert(true)
      });

    console.log("Quality level changed to:", qualityLevel);
    closeQualityConfirmDialog();
  };

  return (
    <>
      <Header
        backArrow={true}
        showPoa={true}
        showPMS={false}
        showNominee={false}
      />
      <Box className="table">
        <TableContainer>
          <Table>
            <TableBody>
              {/* <TableRow>
                <TableCell
                  sx={{ fontSize: "12px !important", padding: "13px 16px" }}
                  component="th"
                  scope="row"
                  className="title"
                >
                  Client Master
                </TableCell>
                <TableCell align="right" sx={{ padding: "13px 16px" }}>
                  <Button
                    className="configBtn"
                    sx={{
                      background: "#2d545e !important",
                      color: "white !important",
                      fontSize: "10px !important",
                      width: "80px",
                      textAlign: "center",
                      padding: "5px 8px !important",
                    }}
                    onClick={clientMasterResponse}
                  >
                    Upload
                  </Button>
                  <input
                    ref={clientMasterFileRef}
                    type="file"
                    accept=".csv"
                    style={{ display: "none" }}
                    onChange={clientMasterResponseileHandler}
                    onClick={(e) => {
                      e.target.value = null;
                    }}
                  />
                </TableCell>
              </TableRow> */}
              <TableRow>
                <TableCell
                  sx={{ fontSize: "12px !important", padding: "13px 16px" }}
                  component="th"
                  scope="row"
                  className="title"
                >
                  PoA RTA Reverse
                </TableCell>
                <TableCell align="right" sx={{ padding: "13px 16px" }}>
                  <Button
                    sx={{
                      background: "#2d545e !important",
                      color: "white !important",
                      fontSize: "10px !important",
                      width: "80px",
                      textAlign: "center",
                      padding: "5px 8px !important",
                    }}
                    onClick={poaFileResponse}
                  >
                    Upload
                  </Button>
                  <input
                    ref={poaFileRef}
                    type="file"
                    // accept=".csv"
                    style={{ display: "none" }}
                    onChange={poaFileResponseFileHandler}
                    onClick={(e) => {
                      e.target.value = null;
                    }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "13px 16px",
                  }}
                  component="th"
                  scope="row"
                  className="title"
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "fkex-start",
                      gap: "10px",
                    }}
                    className="datePicker"
                  >
                    <Typography
                      sx={{ fontSize: "12px !important", marginTop: "20px" }}
                    >
                      MIS Summary
                    </Typography>
                    <Box
                      mb={1}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        marginTop: "15px",
                      }}
                    >
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
                              },
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
                                },
                              },
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

                <TableCell
                  align="right"
                  sx={{ position: "relative", padding: "13px 16px" }}
                >
                  <Button
                    sx={{
                      position: "absolute",
                      right: 15,
                      top: 28,
                      background: "#2d545e !important",
                      color: "white !important",
                      fontSize: "10px !important",
                      width: "80px",
                      textAlign: "center",
                      padding: "5px 8px !important",
                    }}
                    onClick={handleSubmit(summary)}
                    className="btn"
                  >
                    Download
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "13px 16px",
                  }}
                  component="th"
                  scope="row"
                  className="title"
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                    className="qualityLevel"
                  >
                    <Typography sx={{ fontSize: "12px !important", marginTop: "20px" }}>
                      Quality:
                    </Typography>
                    <Box
                      mb={1}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        marginTop: "15px",
                      }}
                    >
                      <Typography sx={{ fontSize: "12px !important", marginTop: "5px", marginRight: "2px" }}>Low</Typography>
                      <Slider
                        value={qualityLevel}
                        onChange={handleQualityLevelChange}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value}`}
                        min={50}
                        max={250}
                        sx={{ width: "250px" }}
                      />
                      <Typography sx={{ fontSize: "12px !important", marginTop: "5px", marginRight: "2px" }}>High</Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell align="right" sx={{ position: "relative", padding: "13px 16px" }}>
                  <Button
                    sx={{ position: "absolute", right: 15, top: 28 }}
                    className="configBtnPoa"
                    onClick={handleOpenQualityConfirmDialog} // Updated the function name
                  >
                    Set
                  </Button>
                </TableCell>
              </TableRow>
              {/* Confirmation Dialog quality change*/}
              <Dialog open={openQualityConfirmDialog} onClose={closeQualityConfirmDialog}>
                <DialogTitle>Confirm Quality Level Change</DialogTitle>
                <DialogContent>
                  Are you sure you want to set the Quality Level to {qualityLevel}?
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeQualityConfirmDialog} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleSetQualityLevel} color="primary">
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>

            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {isLoading == true ? <Loader /> : null}

      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        open={openAlert}
        autoHideDuration={3000}
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
    </>
  );
}

export default PoaConfiguration;
