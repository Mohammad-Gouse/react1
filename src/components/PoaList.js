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

import axios from "axios";
import './PoaList.css'

function PoaList({ poaFileName, ids, handleLoading, onClose }) {
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [panFileName, setPanFileName] = useState("");
  const [aofFileName, setAofFileName] = useState("");
  const [welLetFileName, setWelLetFileName] = useState("");
  const [pmsPoaFileName, setPmsPoaFileName] = useState("");
  const [otherFilesName, setOthersFileName] = useState("");
  const [brAslFileName, setBrAslFileName] = useState("");
  const [othersPdfFileName, setOthersPdfFileName] = useState("");
  const [showChipPms, setShowChipPms] = useState(false);
  const [showChipAof, setShowChipAof] = useState(false);
  const [showChipWel, setShowChipWel] = useState(false);
  const [showChipPmsPoa, setShowChipPmsPoa] = useState(false);
  const [showChipOthers, setShowChipOthers] = useState(false);
  const [showChipBrAsl, setShowChipBrAsl] = useState(false);
  const [showOthersPdf, setShowOthersPdf] = useState(false);
  const [showBtn, setShowbtn] = useState(false)
  // const [panFile, setPanFile] = useState(null);
  const panArrayRef = useRef([]);
  const aofArrayRef = useRef([]);
  const welLetArrayRef = useRef([]);
  const pmsPoaArrayRef = useRef([]);
  const otherArrayRef = useRef([]);
  const BrAslArrayRef = useRef([]);
  const othersPdfArray = useRef([]);
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
  const BrAslFileRef = useRef();
  const BrAslFileResponse = () => {
    BrAslFileRef.current.click();
  };
  const othersPdfRef = useRef();
  const OthersPdfResponse = () => {
    othersPdfRef.current.click();
  };
  // const panFiles = [];
  //   const aofFiles = [];
  //   const welLetFiles = [];
  //   const pmsPoaFiles = [];
  //   const otherFiles = [];
  const panFileResponseHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "image/tiff") {

        panArrayRef.current = [file];
        setShowChipPms(true);
        setPanFileName(file.name);
      }
      else {
        setOpenAlert(true);
        setSnackbarMessage("Please upload only PDF or TIFF files!");
        setSeverity("error");
      }
    }
  };
  const aofFileResponseHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "image/tiff") { // Check if it's a PDF file
        setShowChipAof(true);
        aofArrayRef.current = [file];
        setAofFileName(file.name);
      } else {
        // Show an error alert for invalid file type
        setOpenAlert(true);
        setSnackbarMessage("Please upload only PDF or TIFF files!");
        setSeverity("error");
      }
    }
  };

  const welLetFileResponseHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "image/tiff") {

        welLetArrayRef.current = [file];
        setShowChipWel(true);
        setWelLetFileName(file.name);
      }
      else {
        setOpenAlert(true);
        setSnackbarMessage("Please upload only PDF or TIFF files!");
        setSeverity("error");
      }
    }
  };
  const pmsPoaFileResponseHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "image/tiff") {

        pmsPoaArrayRef.current = [file];
        setShowChipPmsPoa(true);
        setPmsPoaFileName(file.name);
      }
      else {
        setOpenAlert(true);
        setSnackbarMessage("Please upload only PDF or TIFF files!");
        setSeverity("error");
      }
    }
  };
  const othersFileResponseHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "image/tiff") {

        otherArrayRef.current = [file];
        setShowChipOthers(true);
        setOthersFileName(file.name);
      }
      else {
        setOpenAlert(true);
        setSnackbarMessage("Please upload only PDF or TIFF files!");
        setSeverity("error");
      }
    }
  };
  const BrAslFileResponseHandler = (e) => {
    const file = e.target?.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "image/tiff") {

        BrAslArrayRef.current = [file];
        setShowChipBrAsl(true);
        setBrAslFileName(file.name);
      }
      else {
        setOpenAlert(true);
        setSnackbarMessage("Please upload only PDF or TIFF files!");
        setSeverity("error");
      }
    }
  };
  const OthersPdfResponsehandler = (e) => {
    const file = e.target?.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "image/tiff") {

        othersPdfArray.current = [file];
        setShowOthersPdf(true);
        setOthersPdfFileName(file.name);
      }
      else {
        setOpenAlert(true);
        setSnackbarMessage("Please upload only PDF or TIFF files!");
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
    ...BrAslArrayRef.current,
    ...othersPdfArray.current
  ];
  useEffect(() => {
    if (aofFileList.length >= 6) {
      setShowbtn(true);
    } else {
      setShowbtn(false);
    }
  }, [aofFileList.length]);

  const sendFilesHandler = () => {

    const formdata = new FormData();
    formdata.append(`file_name`, poaFileName)
    formdata.append('id', ids)
    aofFileList.forEach((file, index) => {

      formdata.append(`pdf_file${index + 1}`, file);
      if (index === aofFileList.length - 1) {
        // If this is the last file, make the API call based on uploadedFileName
        makeApiCall(formdata);
      }
    });
  };



  const makeApiCall = (formdata) => {
    handleLoading(true)
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const headers = {
      "Content-Type": "multipart/form-data",
    };

    axios
      .post(`${baseUrl}/poa-converter`, formdata, { headers: headers })
      .then((res) => {
        // console.log({ res });
        // // console.log(res.heade  rs);\
        // console.log({ headers: res.headers })
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

        // console.log({ link })

        // if (filename) {
        //   link.download = filename;
        //   console.log("Extracted filename:", filename);
        // }

        // link.click();
        // URL.revokeObjectURL(blobUrl);
        // setSnackbarMessage(res?.data?.message);
        setSnackbarMessage("Tiff file addded sucessfully");
        setSeverity("success");
        setOpenAlert(true);
        handleLoading(false);
        onClose(true);
      })
      .catch((err) => {
        if (err.response && err.response.status === 500) {
          setSnackbarMessage("corrupted pdf found, please check the pdf files.");
          setSeverity("error");
          setOpenAlert(true);
          handleLoading(false);
        }
        else if (err.response && err.response.status === 400) {
          setSnackbarMessage(err?.response.data.message);
          setSeverity("error");
          setOpenAlert(true);
          handleLoading(false);
        }
        else {
          setSnackbarMessage("Server error");
          setSeverity("error");
          setOpenAlert(true);
          handleLoading(false);
        }
        handleLoading(false);
      });
  };


  return (
    <Grid className="fileList1" >
      <TableContainer style={{ maxHeight: "250px", overflowY: "scroll" }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell
                className="title titleColumn"
                sx={{
                  fontSize: "12px !important",
                  padding: "6px 10px",
                  width: "220px"
                }}
                component="th"
                scope="row"
              >
                PoA
              </TableCell>
              <TableCell>
                {showChipPms ? (
                  <Chip
                    className="fileChip"



                    sx={{ width: "300px" }}
                    label={panFileName}
                    variant="outlined"
                  />
                ) : null}
              </TableCell>
              <TableCell align="right" sx={{ padding: "13px 16px" }}>
                <IconButton sx={{ color: "#2d545e" }} onClick={panFileResponse}>
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
                className="title titleColumn"
                sx={{
                  fontSize: "12px !important",
                  padding: "6px 10px",
                  width: "220px"
                }}
                component="th"
                scope="row"
              >
                Stamp Paper
              </TableCell>
              <TableCell>
                {showChipAof ? (
                  <Chip
                    className="fileChip"



                    sx={{ width: "300px" }}
                    label={aofFileName}
                    variant="outlined"
                  />
                ) : null}
              </TableCell>
              <TableCell align="right" sx={{ padding: "13px 16px" }}>
                <IconButton sx={{ color: "#2d545e" }} onClick={aofFileResponse}>
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
                className="title titleColumn"
                sx={{
                  fontSize: "12px !important",
                  padding: "6px 10px",
                  width: "220px"
                }}
                component="th"
                scope="row"
              >
                Audit Trials
              </TableCell>
              <TableCell>
                {showChipWel ? (
                  <Chip
                    className="fileChip"



                    sx={{ width: "300px" }}
                    label={welLetFileName}
                    variant="outlined"
                  />
                ) : null}
              </TableCell>
              <TableCell align="right" sx={{ padding: "13px 16px" }}>
                <IconButton
                  sx={{ color: "#2d545e" }}
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
                className="title titleColumn"
                sx={{
                  fontSize: "12px !important",
                  padding: "6px 10px",
                  width: "220px"
                }}
                component="th"
                scope="row"
              >
                Sign
              </TableCell>
              <TableCell>
                {showChipPmsPoa ? (
                  <Chip
                    className="fileChip"



                    sx={{ width: "300px" }}
                    label={pmsPoaFileName}
                    variant="outlined"
                  />
                ) : null}
              </TableCell>
              <TableCell align="right" sx={{ padding: "13px 16px" }}>
                <IconButton
                  sx={{ color: "#2d545e" }}
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
                className="title titleColumn"
                sx={{
                  fontSize: "12px !important",
                  padding: "6px 10px",
                  width: "220px"
                }}
                component="th"
                scope="row"
              >
                BR and ASL of Account Opening team
              </TableCell>
              <TableCell>
                {showChipOthers ? (
                  <Chip
                    className="fileChip"



                    sx={{ width: "300px" }}
                    label={otherFilesName}
                    variant="outlined"
                  />
                ) : null}
              </TableCell>
              <TableCell align="right" sx={{ padding: "13px 16px" }}>
                <IconButton
                  sx={{ color: "#2d545e" }}
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

            <TableRow>
              <TableCell
                className="title titleColumn"
                sx={{
                  fontSize: "12px !important",
                  padding: "6px 10px",
                  width: "220px"


                }}
                component="th"
                scope="row"
              >
                Company BR and ASL along <br />with Company Name change certificate
              </TableCell>
              <TableCell>
                {showChipBrAsl ? (
                  <Chip
                    className="fileChip"


                    sx={{ width: "300px" }}
                    label={brAslFileName}
                    variant="outlined"
                  />
                ) : null}
              </TableCell>
              <TableCell align="right" sx={{ padding: "13px 16px" }}>
                <IconButton
                  sx={{ color: "#2d545e" }}
                  onClick={BrAslFileResponse}
                >
                  <CloudUploadIcon />
                </IconButton>
                <input
                  ref={BrAslFileRef}
                  type="file"
                  accept=".pdf,.tiff,.tif"
                  style={{ display: "none" }}
                  onChange={BrAslFileResponseHandler}
                  onClick={(e) => {
                    e.target.value = null;
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                className="title titleColumn"
                sx={{
                  fontSize: "12px !important",
                  padding: "6px 10px",
                  width: "220px"


                }}
                component="th"
                scope="row"
              >
                Others
              </TableCell>
              <TableCell>
                {showOthersPdf ? (
                  <Chip
                    className="fileChip"


                    sx={{ width: "300px" }}
                    label={othersPdfFileName}
                    variant="outlined"
                  />
                ) : null}
              </TableCell>
              <TableCell align="right" sx={{ padding: "13px 16px" }}>
                <IconButton
                  sx={{ color: "#2d545e" }}
                  onClick={OthersPdfResponse}
                >
                  <CloudUploadIcon />
                </IconButton>
                <input
                  ref={othersPdfRef}
                  type="file"
                  accept=".pdf,.tiff,.tif"
                  style={{ display: "none" }}
                  onChange={OthersPdfResponsehandler}
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
        <Grid sx={{ display: "flex", margin: "14px 0px 6px 14px", justifyContent: "center", alignItems: "center" }}>

          <Button
            className="poaBtn"
            sx={{
              fontSize: "10px !important",
              width: "300px !important",
              textAlign: "center",
              padding: "10px 8px !important",
              backgroundColor: "#2d545e !important ",
              color: "white",
              borderRadius: "8px",
              letterSpacing: "1"
            }}
            onClick={sendFilesHandler}
          >
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

export default PoaList;
