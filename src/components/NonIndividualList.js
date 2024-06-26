import React from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import IconButton from "@mui/material/IconButton";

import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  InputAdornment,
  Snackbar,
  TextField,
  Grid,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Icon,
} from "@mui/material";
import Chip from "@mui/material/Chip";
// import './TradeFeed.css'
import axios from "axios";

function NonIndividualList({
  aofCamsFileName,
  aofKarvyFileName,
  regCode,
  onAofUploaded,
  rowId,
  id,
  handleLoading,
  onClose
}) {
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [panFileName, setPanFileName] = useState("");
  const [aofFileName, setAofFileName] = useState("");
  const [welLetFileName, setWelLetFileName] = useState("");
  const [pmsPoaFileName, setPmsPoaFileName] = useState("");
  const [otherFilesName, setOthersFileName] = useState("");
  const [showChipPms, setShowChipPms] = useState(false);
  const [showChipAof, setShowChipAof] = useState(false);
  const [showChipWel, setShowChipWel] = useState(false);
  const [showChipPmsPoa, setShowChipPmsPoa] = useState(false);
  const [showChipOthers, setShowChipOthers] = useState(false);
  const [showBtn, setShowbtn] = useState(false);
  // const [camsFileName ,setCamsFileName] = useState();
  // const [karvyFileName ,setKarvyFileName] = useState("");

  let fileExtension;
  // const [panFile, setPanFile] = useState(null);
  const panArrayRef = useRef([]);
  const aofArrayRef = useRef([]);
  const welLetArrayRef = useRef([]);
  const pmsPoaArrayRef = useRef([]);
  const otherArrayRef = useRef([]);
  const panFileRef = useRef();
  const panFileResponse = () => {
    panFileRef.current.click();
  };
  const aofFileRef = useRef();
  const aofFileResponse = () => {
    aofFileRef.current.click();
  };
  const welLetFileRef = useRef();
  const welLetFileResponse = () => {
    welLetFileRef.current.click();
  };
  const pmsPoaFileRef = useRef();
  const pmsPoaFileResponse = () => {
    pmsPoaFileRef.current.click();
  };
  const othersFileRef = useRef();
  const othersFileResponse = () => {
    othersFileRef.current.click();
  };
  const MAX_FILE_SIZE = 3 * 1024 * 1024;
  // const panFiles = [];
  //   const aofFiles = [];
  //   const welLetFiles = [];
  //   const pmsPoaFiles = [];
  //   const otherFiles = [];
  const panFileResponseHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "image/tiff") {
        if (file.size <= MAX_FILE_SIZE) {
          panArrayRef.current = [file];
          setShowChipPms(true);
          setPanFileName(file.name);
        } else {
          setOpenAlert(true);
          setSnackbarMessage("File size exceeds 3MB limit.");
          setSeverity("error");
        }
      } else {
        setOpenAlert(true);
        setSnackbarMessage("Please upload only PDF and TIFF files!");
        setSeverity("error");
      }
    }
  };
  const aofFileResponseHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "image/tiff") {
        // Check if it's a PDF file
        if (file.size <= MAX_FILE_SIZE) {
          setShowChipAof(true);
          aofArrayRef.current = [file];
          setAofFileName(file.name);
        } else {
          setOpenAlert(true);
          setSnackbarMessage("File size exceeds 3MB limit.");
          setSeverity("error");
        }
      } else {
        // Show an error alert for invalid file type
        setOpenAlert(true);
        setSnackbarMessage("Please upload only PDF and TIFF files!");
        setSeverity("error");
      }
    }
  };

  const welLetFileResponseHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "image/tiff") {
        if (file.size <= MAX_FILE_SIZE) {
          welLetArrayRef.current = [file];
          setShowChipWel(true);
          setWelLetFileName(file.name);
        } else {
          setOpenAlert(true);
          setSnackbarMessage("File size exceeds 3MB limit.");
          setSeverity("error");
        }
      } else {
        setOpenAlert(true);
        setSnackbarMessage("Please upload only PDF and TIFF files!");
        setSeverity("error");
      }
    }
  };
  const pmsPoaFileResponseHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "image/tiff") {
        if (file.size <= MAX_FILE_SIZE) {
          pmsPoaArrayRef.current = [file];
          setShowChipPmsPoa(true);
          setPmsPoaFileName(file.name);
        } else {
          setOpenAlert(true);
          setSnackbarMessage("File size exceeds 3MB limit.");
          setSeverity("error");
        }
      } else {
        setOpenAlert(true);
        setSnackbarMessage("Please upload only PDF and TIFF files!");
        setSeverity("error");
      }
    }
  };
  const othersFileResponseHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "image/tiff") {
        if (file.size <= MAX_FILE_SIZE) {
          otherArrayRef.current = [file];
          setShowChipOthers(true);
          setOthersFileName(file.name);
        } else {
          setOpenAlert(true);
          setSnackbarMessage("File size exceeds 3MB limit.");
          setSeverity("error");
        }
      } else {
        setOpenAlert(true);
        setSnackbarMessage("Please upload only PDF and TIFF files!");
        setSeverity("error");
      }
    }
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const aofFileList = [
    ...panArrayRef.current,
    ...aofArrayRef.current,
    ...welLetArrayRef.current,
    ...pmsPoaArrayRef.current,
    ...otherArrayRef.current,
  ];
  useEffect(() => {
    if (aofFileList.length === 5) {
      setShowbtn(true);
    } else {
      setShowbtn(false);
    }
  }, [aofFileList.length]);

  const sendFilesHandler = () => {
    const formdata = new FormData();

    aofFileList.forEach((file, index) => {
      formdata.append(`pdf_file${index + 1}`, file);
      if (index === aofFileList.length - 1) {
        // If this is the last file, make the API call based on regCode
        if (regCode === "CAMS") {
          // Add the specific API endpoint for CAMS
          formdata.append("file_name", aofCamsFileName);
          formdata.append("id", id)
          makeCamsApiCall(formdata);
        } else if (regCode === "KARVY") {
          // Add the specific API endpoint for KARVY
          formdata.append("file_name", aofKarvyFileName);
          formdata.append("id", id)
          makeKarvyApiCall(formdata);
        } else {
          // Handle other regCode values or show an error message
          console.log("Invalid regCode:", regCode);
          setOpenAlert(true);
          setSnackbarMessage("Invalid regCode.");
          setSeverity("error");
        }
      }
    });
  };

  const makeCamsApiCall = (formdata) => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    handleLoading(true);

    axios
      .post(`${baseUrl}/aof-cams-converter`, formdata, {
        headers: headers,
      })


      .then((response) => {
        // console.log(res.headers)
        // const contentDisposition = res.headers["content-disposition"];
        // const blob = new Blob([res.data], { type: "application/zip" });
        // const blobUrl = URL.createObjectURL(blob);
        // const filenameMatch = contentDisposition
        //   ? contentDisposition.match(/filename=(?:"([^"]+)"|([^;]+))/)
        //   : null;
        // const filename = filenameMatch ? filenameMatch[1] || filenameMatch[2] : null;



        // const link = document.createElement("a");
        // link.href = blobUrl;

        // if (filename) {
        //   link.download = filename;
        //   console.log("Extracted filename:", filename);
        // }


        // link.click();
        // URL.revokeObjectURL(blobUrl);
        // setSnackbarMessage("Tiff file addded sucessfully");
        // setSeverity("success");
        // setOpenAlert(true);
        // onAofUploaded(rowId, true);
        // handleLoading(false);
        // onClose(true);
        console.log("response", response);
        console.log("message", response.message);
        setSnackbarMessage("Tiff added Successfully");
        setSeverity("success");
        setOpenAlert(true);
        onClose(true)
        handleLoading(false);
        // window.location.reload();

      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          setSnackbarMessage("corrupted pdf found, please check the pdf files.");
          setSeverity("error");
          setOpenAlert(true);
          handleLoading(false)
        }
        handleLoading(false);

      });
  };

  const makeKarvyApiCall = (formdata) => {
    // Add the logic for making the API call to KARVY endpoint
    handleLoading(true);
    axios
      .post(`${baseUrl}/aof-karvy-converter`, formdata, { headers: headers, })
      .then((response) => {
        // console.log(res.headers)
        // const contentDisposition = res.headers["content-disposition"];
        // const filenameMatch = contentDisposition
        //   ? contentDisposition.match(/filename=(?:"([^"]+)"|([^;]+))/)
        //   : null;
        // const filename = filenameMatch ? filenameMatch[1] || filenameMatch[2] : null;

        // const blob = new Blob([res.data], { type: "application/zip" });
        // const blobUrl = URL.createObjectURL(blob);

        // const link = document.createElement("a");
        // link.href = blobUrl;

        // if (filename) {
        //   link.download = filename;
        //   console.log("Extracted filename:", filename);
        // }


        // link.click();
        // URL.revokeObjectURL(blobUrl)
        // // setSnackbarMessage(res?.data?.message);
        // setSnackbarMessage("Tiff file addded sucessfully");
        // setSeverity("success");
        // setOpenAlert(true);
        // onAofUploaded(rowId, true);
        // handleLoading(false);
        // onClose(true);
        console.log("response", response);
        console.log("message", response.message);
        setSnackbarMessage("Tiff added successfully");
        setSeverity("success");
        setOpenAlert(true);
        onClose(true)
        handleLoading(false);
        // window.location.reload();

      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          setSnackbarMessage("corrupted pdf found, please check the pdf files.");
          setSeverity("error");
          setOpenAlert(true);
          handleLoading(false);
        }
        handleLoading(false);

      });
  };

  // Other regCode conditions can be added similarly if required

  return (
    <Grid className="fileList1">
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell
                sx={{
                  fontSize: "12px !important",
                  padding: "6px 10px",
                  width: "100px !important",
                }}
                scope="row"
                className="columnTitle"
              >
                PAN Card
              </TableCell>
              <TableCell sx={{ textAlign: "center !important" }}>
                {showChipPms ? (
                  <Chip
                    className="fileChip"
                    sx={{ width: "300px" }}
                    label={panFileName}
                    variant="outlined"
                  />
                ) : null}
              </TableCell>
              <TableCell align="right" sx={{ padding: "10px " }}>
                <IconButton sx={{ color: "#242056" }} onClick={panFileResponse}>
                  <CloudUploadIcon />
                </IconButton>
                <input
                  ref={panFileRef}
                  type="file"
                  accept=".pdf,.tiff,.tif"
                  style={{ display: "none" }}
                  onChange={panFileResponseHandler}
                  onClick={(e) => {
                    e.target.value = null;
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  fontSize: "12px !important",
                  padding: "6px 10px",
                  width: "100px !important",
                }}
                scope="row"
                className="columnTitle"
              >
                AOF
              </TableCell>
              <TableCell sx={{ textAlign: "center !important" }}>
                {showChipAof ? (
                  <Chip
                    className="fileChip"
                    sx={{ width: "300px" }}
                    label={aofFileName}
                    variant="outlined"
                  />
                ) : null}
              </TableCell>
              <TableCell align="right" sx={{ padding: "10px " }}>
                <IconButton sx={{ color: "#242056" }} onClick={aofFileResponse}>
                  <CloudUploadIcon />
                </IconButton>
                <input
                  ref={aofFileRef}
                  type="file"
                  accept=".pdf,.tiff,.tif"
                  style={{ display: "none" }}
                  onChange={aofFileResponseHandler}
                  onClick={(e) => {
                    e.target.value = null;
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  fontSize: "12px !important",
                  padding: "6px 10px",
                  width: "100px !important",
                }}
                scope="row"
                className="columnTitle"
              >
                Welcome Letter
              </TableCell>
              <TableCell sx={{ textAlign: "center !important" }}>
                {showChipWel ? (
                  <Chip
                    className="fileChip"
                    sx={{ width: "300px" }}
                    label={welLetFileName}
                    variant="outlined"
                  />
                ) : null}
              </TableCell>
              <TableCell align="right" sx={{ padding: "10px " }}>
                <IconButton
                  sx={{ color: "#242056" }}
                  onClick={welLetFileResponse}
                >
                  <CloudUploadIcon />
                </IconButton>
                <input
                  ref={welLetFileRef}
                  type="file"
                  accept=".pdf,.tiff,.tif"
                  style={{ display: "none" }}
                  onChange={welLetFileResponseHandler}
                  onClick={(e) => {
                    e.target.value = null;
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  fontSize: "12px !important",
                  padding: "6px 10px",
                  width: "100px !important",
                }}
                scope="row"
                className="columnTitle"
              >
                PMS POA
              </TableCell>
              <TableCell sx={{ textAlign: "center !important" }}>
                {showChipPmsPoa ? (
                  <Chip
                    className="fileChip"
                    sx={{ width: "300px" }}
                    label={pmsPoaFileName}
                    variant="outlined"
                  />
                ) : null}
              </TableCell>
              <TableCell align="right" sx={{ padding: "10px " }}>
                <IconButton
                  sx={{ color: "#242056" }}
                  onClick={pmsPoaFileResponse}
                >
                  <CloudUploadIcon />
                </IconButton>
                <input
                  ref={pmsPoaFileRef}
                  type="file"
                  accept=".pdf,.tiff,.tif"
                  style={{ display: "none" }}
                  onChange={pmsPoaFileResponseHandler}
                  onClick={(e) => {
                    e.target.value = null;
                  }}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                sx={{
                  fontSize: "12px !important",
                  padding: "6px 10px",
                  width: "100px !important",
                }}
                scope="row"
                className="columnTitle"
              >
                Others (Trust deed/ Co. document)
              </TableCell>
              <TableCell sx={{ textAlign: "center !important" }}>
                {showChipOthers ? (
                  <Chip
                    className="fileChip"
                    sx={{ width: "300px" }}
                    label={otherFilesName}
                    variant="outlined"
                  />
                ) : null}
              </TableCell>
              <TableCell align="right" sx={{ padding: "10px " }}>
                <IconButton
                  sx={{ color: "#242056" }}
                  onClick={othersFileResponse}
                >
                  <CloudUploadIcon />
                </IconButton>
                <input
                  ref={othersFileRef}
                  type="file"
                  accept=".pdf,.tiff,.tif"
                  style={{ display: "none" }}
                  onChange={othersFileResponseHandler}
                  onClick={(e) => {
                    e.target.value = null;
                  }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {showBtn ? (
        <Grid
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button className="postBtn" onClick={sendFilesHandler}>
            Generate
          </Button>
        </Grid>
      ) : null}
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
    </Grid>
  );
}

export default NonIndividualList;