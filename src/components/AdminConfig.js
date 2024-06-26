import './AdminConfig.css';
import { Alert, Box, Button, Checkbox, MenuItem, Snackbar, Table, TableBody, TableCell, TableRow, TextField, Typography } from '@mui/material'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Loader from './Loader';
import Header from './Header';
let validPath = new RegExp(/^([a-z]:((\\|\/|\\\\|\/\/))|(\\\\|\/\/))[^<>:"|?*]+/i);


const schema = Yup.object({
  filepath: Yup.string()
    .required("Filepath is required")
    .matches(/(\\{1}[^/:\*;\/\:\?<>\|]+)/, "Invalid filepath")
    // .matches(validPath, "Invalid Filepath")
});


const AdminConfig = () => {
  const [exportType, setExportType] = useState("CSV");
  const [delimeterType, setDelimeterType] = useState("Comma");
  const [filePath, setFilePath] = useState("");
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [showHeader, setShowHeader] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [openAlert, setOpenAlert] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const nseScriptFileRef = useRef();
  const fileSize = process.env.REACT_APP_FILE_SIZE_LIMIT;
  const fileSizeLimit = fileSize / 1000 / 1000;
  const allowedExtensions = ["csv"];
  const [isLoading, setIsLoading] = useState(false);
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange"
  });

  useEffect(() => {
    document.title = "IIFL | Admin"
    const userToken = localStorage.getItem('token');
    // if (!userToken) {
    //   navigate('/')
    // }
  }, [])

  const saveHandler = (data) => {
    setIsLoading(true);
    const { filepath } = data;
    const body = {
      exportType: exportType,
      delimeterType: delimeterType,
      path: filepath,
      showHeader: showHeader
    }
    axios.post(`${baseUrl}/config`, body)
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        setSnackbarMessage(res.data.message);
        setSeverity("success");
        setOpenAlert(true);
        reset();
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setSnackbarMessage(err.response.data.message);
        setSeverity("error");
        setOpenAlert(true);
        reset();
      })
  }

  const nseScript = () => {
    nseScriptFileRef.current.click();
  }

  const headers = {
    "Content-Type": "multipart/form-data",
  }

  const nseScriptFileHandler = (e) => {
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
      axios.post(`${baseUrl}/nse-script-master`, formData, { headers: headers })
        .then((res) => {
          setIsLoading(false);
          setSnackbarMessage(res.data.message);
          setSeverity("success");
          setOpenAlert(true);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setSnackbarMessage(err.response.data.message);
          setSeverity("error");
          setOpenAlert(true);
        })
    }
  }

  const checkboxHandler = () => {
    setShowHeader(!showHeader);
  }

  const exportTypeChangeHandler = (e) => {
    const { value } = e.target;
    setExportType(value);
  }

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <>
      {/* <Box className='admin' margin="auto" >
        <form onSubmit={handleSubmit(saveHandler)} >
          <Box sx={{ display: "flex", flexDirection: "column" }} >
            <Table>
              <TableBody >
                <TableRow>
                  <TableCell sx={{ fontSize: "13px !important" }} component="th" scope="row" className="title">
                    Include headers in file
                  </TableCell>
                  <TableCell align="right">
                    <Checkbox
                      onChange={checkboxHandler}
                      value={showHeader}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontSize: "13px !important" }} component="th" scope="row" className="title" >
                    Export Type
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <TextField
                        size="small"
                        value={exportType}
                        variant="outlined"
                        select
                        defaultValue="CSV"
                        sx={{ width: "110px", textAlign: "left" }}
                        SelectProps={{
                          renderValue: (value) => value,
                        }}
                        onChange={exportTypeChangeHandler}
                        InputProps={{
                          style: {
                            height: "32px",
                            fontSize: "12px"
                          },
                        }}
                      >
                        <MenuItem value="CSV">CSV(.csv)</MenuItem>
                        <MenuItem value="Text">Text(.txt)</MenuItem>
                      </TextField>
                    </Box>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontSize: "13px !important" }} component="th" scope="row" className="title">
                    Delimiter Type
                  </TableCell>
                  <TableCell align="right">
                    <Box >
                      <TextField
                        size="small"
                        value={delimeterType}
                        onChange={(e) => setDelimeterType(e.target.value)}
                        variant="outlined"
                        select
                        defaultValue="Comma"
                        sx={{ width: "110px", textAlign: "left" }}
                        SelectProps={{
                          renderValue: (value) => value,
                        }}
                        InputProps={{
                          style: {
                            height: "32px",
                            fontSize: "12px"
                          },
                        }}
                      >
                        <MenuItem value="Comma">Comma( , )</MenuItem>
                        <MenuItem value="Pipe">Pipe( | )</MenuItem>
                      </TextField>
                    </Box>
                  </TableCell>
                </TableRow>

                <TableRow  >
                  <TableCell sx={{ position: "relative" }} component="th" scope="row" className="title">
                    <Typography sx={{ fontSize: "13px !important", position: "absolute", top: 22 }}>
                      File Path:
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Controller
                      control={control}
                      rules={{
                        maxLength: 100,
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextField
                          size="small"
                          onBlur={onBlur}
                          onChange={onChange}
                          value={value ?? ""}
                          error={!!errors.filepath}
                          helperText={errors?.filepath?.message}
                          placeholder='Enter filepath'
                          InputProps={{
                            style: {
                              height: "32px",
                            },
                          }}
                        />
                      )}
                      name="filepath"
                    />
                    <Box alignSelf="center" marginTop="10px" height="28px" >
                      <Button
                        className="saveBtn"
                        type="submit"
                      >
                        Save
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </form>
      </Box> */}
       <Header showPMS={true} showNominee={false} backArrow={true} showPortal={true}/>
      <Box margin="auto" marginTop="10px" className="nsescript">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontSize: "12px !important", padding: "13px 16px" }} component="th" scope="row" className="title">
                NSE Script master
              </TableCell>
              <TableCell align="right" >
                <input
                  ref={nseScriptFileRef}
                  type="file"
                  accept=".csv"
                  style={{ display: "none" }}
                  onChange={nseScriptFileHandler}
                  onClick={(e) => {
                    e.target.value = null
                  }}
                />
                <Button onClick={nseScript} className="btn" >Upload</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
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
    </>

  )
}

export default AdminConfig