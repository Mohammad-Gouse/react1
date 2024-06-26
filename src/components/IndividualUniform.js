import React from "react";
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
    IconButton,
} from "@mui/material";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Chip from "@mui/material/Chip";
import PreviewIcon from "@mui/icons-material/Preview";
// import IconButton from "@mui/material/IconButton";
function IndividualUniform({
    aofCamsFileName,
    aofKarvyFileName,
    regCode,
    onAofUploaded,
    rowId,
    onAllFilesUploaded,
    handleLoading,
    onClose,
    id
}) {
    // const aofFileList = [];
    const [openAlert, setOpenAlert] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [panFileName, setPanFileName] = useState("");
    const [aofFileName, setAofFileName] = useState("");
    const [welLetFileName, setWelLetFileName] = useState("");
    const [pmsPoaFileName, setPmsPoaFileName] = useState("");
    const [showChipPms, setShowChipPms] = useState(false);
    const [showChipAof, setShowChipAof] = useState(false);
    const [showChipWel, setShowChipWel] = useState(false);
    const [showChipPmsPoa, setShowChipPmsPoa] = useState(false);
    const [fileUploadStatus, setFileUploadStatus] = useState({});
    const [panFile, setPanFile] = useState(null);
    const [showBtn, setShowbtn] = useState(false);
    const [reload, setReload] = useState(false);

    const panArrayRef = useRef([]);
    const aofArrayRef = useRef([]);
    const welLetArrayRef = useRef([]);
    const pmsPoaArrayRef = useRef([]);
    // const otherArrayRef = useRef([]);
    let fileExtension;
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

    // const othersFileRef = useRef();
    // const othersFileResponse = () => {
    //     othersFileRef.current.click();
    // };
    // const panFiles = [];
    // const aofFiles = [];
    // const welLetFiles = [];
    // const pmsPoaFiles = [];
    const MAX_FILE_SIZE = 3 * 1024 * 1024;
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
                setSnackbarMessage("Please upload only PDF or TIFF files!");
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
                setSnackbarMessage("Please upload only PDF and Tiff files!");
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
                setSnackbarMessage("Please upload only PDF and Tiff files!");
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
    ];
    useEffect(() => {
        if (aofFileList.length === 1) {
            setShowbtn(true);
        } else {
            setShowbtn(false);
        }
    }, [aofFileList.length]);
    const isAllFilesUploadedForAllRows = () => {
        // Iterate through fileUploadStatus object and check if all rows are uploaded
        for (const rowId in fileUploadStatus) {
            if (!fileUploadStatus[rowId]) {
                return false; // At least one row is not uploaded
            }
        }
        return true; // All rows are uploaded
    };
    // After successful AOF file upload
    const handleAofUploaded = (rowId, isUploaded) => {
        // Your existing logic

        // Update the file upload status for the specific row
        setFileUploadStatus((prevStatus) => ({
            ...prevStatus,
            [rowId]: isUploaded,
        }));

        // Check if all rows have completed both AOF and Nominee uploads
        if (isAllFilesUploadedForAllRows()) {
            onAllFilesUploaded();
        }
    };

    const sendFilesHandler = () => {
        const formdata = new FormData();

        aofFileList.forEach((file, index) => {
            formdata.append(`pdf_file${index + 1}`, file);
            if (index === aofFileList.length - 1) {
                // If this is the last file, make the API call based on regCode
                if (regCode === "CAMS") {
                    // Add the specific API endpoint for CAMS
                    formdata.append("file_name", aofCamsFileName);
                    console.log("id", id)
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
                // responseType: "blob",
            })
            .then((response) => {
                // console.log(res.headers);
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

                // if (filename) {
                //   link.download = filename;
                //   console.log("Extracted filename:", filename);
                // }

                // link.click();
                // URL.revokeObjectURL(blobUrl);
                // // setSnackbarMessage(res?.data?.message);
                // setSnackbarMessage("Tiff file addded sucessfully");
                // setSeverity("success");
                // setOpenAlert(true);
                // onAofUploaded(rowId, true);
                // handleAofUploaded(rowId, true);
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
            .catch((err) => {
                if (err.response && err.response.status === 500) {
                    setSnackbarMessage("corrupted pdf found, please check the pdf files.");
                    setSeverity("error");
                    setOpenAlert(true);
                    handleLoading(false);
                }
                handleLoading(false);
            });
    };

    const makeKarvyApiCall = (formdata) => {
        // Add the logic for making the API call to KARVY endpoint
        handleLoading(true);
        axios
            .post(`${baseUrl}/aof-karvy-converter`, formdata, {
                headers: headers,
            })
            .then((response) => {
                // console.log(res.headers);
                // const contentDisposition = res.headers["content-disposition"];
                // const filenameMatch = contentDisposition
                //   ? contentDisposition.match(/filename=(?:"([^"]+)"|([^;]+))/)
                //   : null;
                // const filename = filenameMatch
                //   ? filenameMatch[1] || filenameMatch[2]
                //   : null;

                // const blob = new Blob([res.data], { type: "application/zip" });
                // const blobUrl = URL.createObjectURL(blob);

                // const link = document.createElement("a");
                // link.href = blobUrl;

                // if (filename) {
                //   link.download = filename;
                //   console.log("Extracted filename:", filename);
                // }

                // link.click();
                // URL.revokeObjectURL(blobUrl);
                // // setSnackbarMessage(res?.data?.message);
                // setSnackbarMessage("Tiff file addded sucessfully");
                // setSeverity("success");
                // setOpenAlert(true);
                // onAofUploaded(rowId, true);
                // handleAofUploaded(rowId, true);
                // handleLoading(false);
                // onClose(true);
                // setLoading(false);
                console.log("response", response);
                console.log("message", response.message);
                setSnackbarMessage("Tiff file addded sucessfully");
                setSeverity("success");
                setOpenAlert(true)
                handleLoading(false);
                onClose(true)
                // window.location.reload()

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
                                }}
                                component="th"
                                scope="row"
                                className="title"
                            >
                                Individual List All Documents
                            </TableCell>
                            <TableCell sx={{ textAlign: "center !important" }}>
                                {showChipPms ? (
                                    <Chip
                                        sx={{ width: "300px" }}
                                        label={panFileName}
                                        variant="outlined"
                                    />
                                ) : null}
                            </TableCell>
                            <TableCell align="right" sx={{ padding: "13px 16px" }}>
                                <IconButton sx={{ color: "#242056" }} onClick={panFileResponse}>
                                    <CloudUploadIcon />
                                </IconButton>
                                <input
                                    ref={panFileRef}
                                    type="file"
                                    // accept=".pdf"
                                    style={{ display: "none" }}
                                    onChange={panFileResponseHandler}
                                    onClick={(e) => {
                                        e.target.value = null;
                                    }}
                                />
                                {/* <IconButton onClick={openFileInNewTab(panFile)}  sx={{color:"#242056"}} >
                   <PreviewIcon/>
                </IconButton> */}
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

export default IndividualUniform;
