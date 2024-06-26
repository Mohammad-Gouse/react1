import React, { useEffect, useRef, useState } from "react";
import "./TradeFeed.css";
import ClearIcon from "@mui/icons-material/Clear";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactPaginate from "react-paginate";
import IndividualList from "./IndividualList";
import NonIndividualList from "./NonIndividualList";
import IconButton from "@mui/material/IconButton";

import {
    Alert,
    Box,
    Button,
    Card,
    Snackbar,
    Grid,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    Chip,
} from "@mui/material";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Header from "./Header";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Icon,
} from "@mui/material";
// import DownloadFile from "./DownlaodFile";
import Loader from "./Loader";
import TableHeader from "./TableHeader";
import { idID } from "@mui/material/locale";

function TradeFeedAofOld() {
    const [jsonData, setJsonData] = useState({
        payload: [],
        row_count: 0,
    });
    // const [fileList, setFileList] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectReg, setSelectedRegs] = useState("");
    const [firstSelection, setFirstSelection] = useState(true);
    const [disableClients, setDisableClients] = useState([]);

    const [open, setOpen] = React.useState(false);
    const [option, setOption] = React.useState("");
    const [openAof, setOpenAof] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [selectedId, setSelectedId] = useState("");
    const [selectedNomineeCams, setSelectedNomineeCams] = useState("");
    const [selectedNomineeKarvy, setSelectedNomineeKarvy] = useState("");
    const [selectedAofCams, setSelectedAofCams] = useState("");
    const [selectedAofKarvy, setSelectedAofKarvy] = useState("");
    const [selectedRegCode, SetSelectedRegCode] = useState("");
    const [selectedClientId, setSelectedClientId] = useState("");
    const [selectedNomineeRegCode, SetSelectedNomineeRegCode] = useState("");
    const [selected, setSelected] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [green, setGreen] = useState({});
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [selectedIdAof, setSelectedIdAof] = useState(null);
    const fileInputRef = useRef();
    const [selectedFileBase64, setSelectedFileBase64] = useState("");
    const [enableButton, setEnableButton] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [isAofUploaded, setIsAofUploaded] = useState(false);
    const [reload, setReload] = useState(false);

    const [pageState, setPageState] = useState({
        page: 1,
        pageSize: 25,
        isLoading: false,
        total: 0,
    });

    ////
    const [currentPage, setCurrentPage] = useState(0); // Initialize current page to 0
    // Replace with the actual total number of pages

    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };
    /////
    const handleLoading = (isLoading) => {
        setLoading(isLoading);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    // const buttonText = "DownLoad Converted File";
    const buttonClassName = "topBtn";
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const headers = {
        "Content-Type": "multipart/form-data",
    };
    const getSelectedRowData = () => {
        const selectedData = jsonData.payload.filter((row) =>
            selectedRows.includes(row.id)
        );
        return selectedData;
    };

    // useEffect(() => {
    //   console.log(jsonData);
    //   if (selectedRows.length > 0) {
    //     const firstSelectedRow = jsonData.payload.find(
    //       (row) => row.id === selectedRows[0]
    //     );
    //     if (firstSelectedRow) {
    //       setSelectedRegs(firstSelectedRow.reg_code);
    //     }
    //   } else {
    //     setSelectedRegs("");
    //   }
    // }, [selectedRows, jsonData.payload]);

    // useEffect(() => {
    //   console.log(jsonData);
    //   if (selectedRows.length > 0) {
    //     const firstSelectedRow = jsonData.payload.find((row) => row.id === selectedRows[0]);
    //     if (firstSelectedRow) {
    //       setSelectedRegs(firstSelectedRow.reg_code);
    //       if (firstSelection && firstSelectedRow.reg_code === 'karvy') {
    //         setSelectedRegs('KARVY');
    //         setFirstSelection(false);
    //       }
    //     }
    //   } else {
    //     setSelectedRegs('');
    //   }
    // }, [selectedRows, jsonData.payload, firstSelection]);

    // const categorizeSelectedRows = () => {
    //   const nomineeCamsData = [];
    //   const aofCamsData = [];
    //   const camsAofTxtData = [];
    //   const camsNomTxtData = [];

    //   const nomineeKarvyData = [];
    //   const aofKarvyData = [];
    //   const karvyAofDbfData = [];

    //   let regCode = "";

    //   selectedRows.forEach((rowId) => {
    //     const selectedRow = jsonData.payload.find((row) => row.id === rowId);
    //     if (selectedRow) {
    //       const {
    //         reg_code,
    //         Nominee_cams_TIFF_file_name,
    //         AOF_cams_TIFF_file_name,
    //         cams_aof_txt,
    //         cam_nom_txt,
    //         AOF_Karvy_TIFF_file_name,
    //         Nominee_karvy_TIFF_file_name,
    //         karvy_aof_dbf,
    //       } = selectedRow;
    //       // regCode.push(reg_code)
    //       if (reg_code === "CAMS") {
    //         regCode = reg_code;
    //         nomineeCamsData.push(Nominee_cams_TIFF_file_name);
    //         aofCamsData.push(AOF_cams_TIFF_file_name);
    //         camsAofTxtData.push(cams_aof_txt);
    //         camsNomTxtData.push(cam_nom_txt);
    //       } else if (reg_code === "KARVY") {
    //         regCode = reg_code;
    //         nomineeKarvyData.push(Nominee_karvy_TIFF_file_name);
    //         aofKarvyData.push(AOF_Karvy_TIFF_file_name);
    //         karvyAofDbfData.push(karvy_aof_dbf);
    //       }
    //     }
    //   });
    //   console.log(regCode);
    //   // Now you have categorized data in separate arrays for both "CAMS" and "KARVY"
    //   console.log("CAMS - Nominee_cams_TIFF_file_name:", nomineeCamsData);
    //   console.log("CAMS - AOF_cams_TIFF_file_name:", aofCamsData);
    //   console.log("CAMS - cams_aof_txt:", camsAofTxtData);
    //   console.log("CAMS - cams_nom_txt:", camsNomTxtData);

    //   console.log("KARVY - Nominee_karvy_TIFF_file_name:", nomineeKarvyData);
    //   console.log("KARVY - AOF_Karvy_TIFF_file_name:", aofKarvyData);
    //   console.log("KARVY - karvy_aof_dbf:", karvyAofDbfData);
    // };
    const categorizeSelectedRows = () => {
        const nomineeCamsData = [];
        // const aofCamsData = [];
        // const camsAofTxtData = [];
        const camsNomTxtData = [];
        const ids = [];
        const nomineeKarvyData = [];
        const aofKarvyData = [];
        const karvyAofDbfData = [];
        const formdata = new FormData();
        let regCode = "";

        selectedRows.forEach((rowId) => {
            const selectedRow = jsonData.payload.find((row) => row.id === rowId);
            if (selectedRow) {
                const {
                    reg_code,
                    Nominee_cams_TIFF_file_name,
                    id,
                    AOF_cams_TIFF_file_name,
                    cams_aof_txt,
                    cam_nom_txt,
                    AOF_Karvy_TIFF_file_name,
                    Nominee_karvy_TIFF_file_name,
                    karvy_aof_dbf,
                } = selectedRow;
                // regCode.push(reg_code)
                if (reg_code === "CAMS") {
                    regCode = reg_code;
                    nomineeCamsData.push(AOF_cams_TIFF_file_name);
                    ids.push(id)
                    // aofCamsData.push(AOF_cams_TIFF_file_name);
                    // camsAofTxtData.push(cams_aof_txt);
                    camsNomTxtData.push(cams_aof_txt);
                } else if (reg_code === "KARVY") {
                    regCode = reg_code;
                    ids.push(id)
                    nomineeKarvyData.push(AOF_Karvy_TIFF_file_name);
                    // aofKarvyData.push(AOF_Karvy_TIFF_file_name);
                    karvyAofDbfData.push(karvy_aof_dbf);
                }
            }
        });
        if (regCode === "CAMS") {
            // console.log(selectedNomineeRegCode);
            // console.log({ pdf_files: selectedFile });
            // console.log({ fileName: selectedNomineeCams });
            // console.log(selectedNomineeRegCode);
            // formdata.append("cams-tiff-file",nomineeCamsData.join(','))
            // formdata.append("cams-text-file",camsNomTxtData.join(','))
            const requestData = {
                cams_tiff_file: nomineeCamsData, // Send this array in JSON format
                cams_text_file: camsNomTxtData,
                id: ids
            };

            setLoading(true);
            axios
                .post(`${baseUrl}/download-aof-cams-zip`, requestData, {
                    headers: {
                        ...headers,
                        "Content-Type": "application/json",
                    },
                    responseType: "blob",
                })
                .then((res) => {
                    // console.log({ headers: res.headers })
                    const contentDisposition = res.headers["content-disposition"];
                    const blob = new Blob([res.data], { type: "application/zip" });
                    const blobUrl = URL.createObjectURL(blob);
                    const filenameMatch = contentDisposition
                        ? contentDisposition.match(/filename=(?:"([^"]+)"|([^;]+))/)
                        : null;
                    const filename = filenameMatch
                        ? filenameMatch[1] || filenameMatch[2]
                        : null;

                    const link = document.createElement("a");
                    link.href = blobUrl;

                    console.log({ link });

                    if (filename) {
                        link.download = filename;
                        console.log("Extracted filename:", filename);
                    }

                    link.click();
                    URL.revokeObjectURL(blobUrl);

                    setSnackbarMessage("Tiff file addded sucessfully");
                    setSeverity("success");
                    setOpenAlert(true);
                    setGreen((prevState) => ({
                        ...prevState,
                        [selectedId]: true,
                    }));
                    setLoading(false);
                    setOpen(false);
                    setReload(prevReload => !prevReload);
                })

                .catch((err) => {
                    console.log(err?.message);
                    setSeverity("error");
                    setOpenAlert(true);
                    setLoading(false);
                });
        } else if (regCode === "KARVY") {
            // console.log(selectedNomineeRegCode);
            // formdata.append("file_name", selectedNomineeKarvy);
            // formdata.append("karvy-text-file",nomineeKarvyData.join(','))
            const requestDatas = {
                cams_tiff_file: nomineeKarvyData,
                cams_text_file: karvyAofDbfData,
                id: ids

                // Send this array in JSON format
            };
            setLoading(true);

            // console.log({ pdf_files: selectedFile });
            // console.log({ fileName: selectedNomineeCams });
            // console.log(selectedNomineeRegCode);
            axios
                .post(`${baseUrl}/download-aof-karvy-zip`, requestDatas, {
                    headers: {
                        ...headers,
                        "Content-Type": "application/json",
                    },
                    responseType: "blob",
                })
                .then((res) => {
                    console.log({ headers: res.headers });
                    const contentDisposition = res.headers["content-disposition"];
                    const blob = new Blob([res.data], { type: "application/zip" });
                    const blobUrl = URL.createObjectURL(blob);
                    const filenameMatch = contentDisposition
                        ? contentDisposition.match(/filename=(?:"([^"]+)"|([^;]+))/)
                        : null;
                    const filename = filenameMatch
                        ? filenameMatch[1] || filenameMatch[2]
                        : null;

                    const link = document.createElement("a");
                    link.href = blobUrl;

                    console.log({ link });

                    if (filename) {
                        link.download = filename;
                        console.log("Extracted filename:", filename);
                    }

                    link.click();
                    URL.revokeObjectURL(blobUrl);
                    // setSnackbarMessage(res.data.message);
                    setSnackbarMessage("Tiff file addded sucessfully");
                    setSeverity("success");
                    setOpenAlert(true);
                    // console.log(res.data.message);
                    setGreen((prevState) => ({
                        ...prevState,
                        [selectedId]: true,
                    }));
                    setLoading(false);
                    setOpen(false);
                    setReload(prevReload => !prevReload);
                })
                .catch((err) => {
                    console.log({ err });
                    setSnackbarMessage(err?.message);
                    setSeverity("error");
                    setOpenAlert(true);
                    setLoading(false);
                });
        }

        console.log(regCode);
        // Now you have categorized data in separate arrays for both "CAMS" and "KARVY"
        console.log("CAMS - Nominee_cams_TIFF_file_name:", nomineeCamsData);
        //console.log("CAMS - AOF_cams_TIFF_file_name:", aofCamsData);
        // console.log("CAMS - cams_aof_txt:", camsAofTxtData);
        console.log("CAMS - cams_nom_txt:", camsNomTxtData);

        console.log("KARVY - Nominee_karvy_TIFF_file_name:", nomineeKarvyData);
        console.log("KARVY - AOF_Karvy_TIFF_file_name:", aofKarvyData);
        console.log("KARVY - karvy_aof_dbf:", karvyAofDbfData);
    };



    const checkSelection = (selectedData) => {
        const disableRows = [];
        const selectedRows = jsonData.payload.filter((row) => selectedData.includes(row.id));

        if (selectedRows.length > 0) {
            // Calculate the sum of 'aof_tiff_kb_size' for selected rows
            const sumAofTiffSize = selectedRows.reduce((sum, row) => {
                if (row.aof_tiff_kb_size !== 'N/A') {
                    console.log("nom size: ", parseFloat(row.aof_tiff_kb_size))
                    return sum + parseFloat(row.aof_tiff_kb_size);
                }
                return sum;
            }, 0);

            // Check if the sum is greater than or equal to 4 MB (4000 KB)
            console.log("sum of nom tiff size", sumAofTiffSize)
            if (sumAofTiffSize >= 4000) {
                // Find the current row that is trying to be selected

                const currentRowId = selectedData[selectedData.length - 1];
                const currentRow = jsonData.payload.find((row) => row.id === currentRowId);

                setSnackbarMessage("4MB exceeds")
                setSeverity("success");
                setOpenAlert(true);


                // Deselect the current row if its 'nom_tiff_size' is not 'N/A'
                if (currentRow && currentRow.aof_tiff_kb_size !== 'N/A') {
                    const rowIndexToDeselect = selectedData.indexOf(currentRowId);
                    if (rowIndexToDeselect !== -1) {
                        selectedData.splice(rowIndexToDeselect, 1);
                    }
                    disableRows.push(currentRow);
                }
            }

            // Get the reg_code of the first selected row
            const firstSelectedRow = selectedRows[0];
            const firstSelectedRegCode = firstSelectedRow ? firstSelectedRow.reg_code : null;

            // Implement Karvy and Cams logic here to disable rows if needed
            if (firstSelectedRegCode === 'CAMS') {
                // Disable rows with reg_code 'karvy'
                const karvyRows = jsonData.payload.filter((row) => row.reg_code === 'KARVY');
                disableRows.push(...karvyRows);
            } else if (firstSelectedRegCode === 'KARVY') {
                // Disable rows with reg_code 'cams'
                const camsRows = jsonData.payload.filter((row) => row.reg_code === 'CAMS');
                disableRows.push(...camsRows);
            }
        }

        console.log("disableRows: ", disableRows);
        setDisableClients(disableRows);
        return disableRows;
    };

    // const aofFileNames = [];
    // const nomineeFileNames = [];
    // const aofDbfs = [];

    // const categorizeSelectedRows = () => {
    //   console.log("inserrt",selectedRows)
    //   selectedRows.forEach((rowId) => {
    //     const selectedRow = jsonData.find((row) => row.id === rowId);
    //     if (selectedRow) {
    //       const { reg_code, AOF_cams_TIFF_file_name, Nominee_cams_TIFF_file_name, AOF_Karvy_TIFF_file_name, karvy_aof_dbf } = selectedRow;
    //       if (reg_code === 'CAMS') {
    //         aofFileNames.push(AOF_cams_TIFF_file_name);
    //         console.log('AOF File Names:', aofFileNames);

    //         nomineeFileNames.push(Nominee_cams_TIFF_file_name);
    //       } else if (reg_code === 'KARVY') {
    //         aofFileNames.push(AOF_Karvy_TIFF_file_name);
    //         aofDbfs.push(karvy_aof_dbf);
    //       }
    //     }
    //   });
    //   console.log('Nominee File Names:', nomineeFileNames);
    //   console.log('AOF DBFs:', aofDbfs);
    //   // Now you have categorized data as per your requirements

    // };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(",")[1];
                resolve(`data:application/pdf;base64,` + base64String);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    // const columns = [

    //   {
    //     field: "client_id",
    //     headerName: "Client ID",
    //     minWidth: 70,
    //     headerClassName: "headerName",
    //     align: "center",
    //     headerAlign: "center",
    //     flex: 0.1,
    //   },
    //   {
    //     field: "reg_code",
    //     headerName: "Reg Code",
    //     minWidth: 150,
    //     headerClassName: "headerName",
    //     align: "center",
    //     headerAlign: "center",
    //     flex: 0.1,
    //   },
    //   {
    //     field: "client_name",
    //     headerName: "Client Name",
    //     minWidth: 150,
    //     headerClassName: "headerName",
    //     align: "left",
    //     headerAlign: "left",
    //     flex: 0.1,
    //   },
    //   {
    //     field: "amc_code",
    //     headerName: "AMC Code",
    //     minWidth: 150,
    //     headerClassName: "headerName",
    //     align: "center",
    //     headerAlign: "center",
    //     flex: 0.1,
    //   },
    //   {
    //     field: "transaction_type",
    //     headerName: "Transaction Type",
    //     minWidth: 150,
    //     headerClassName: "headerName",
    //     align: "center",
    //     headerAlign: "center",
    //     flex: 0.1,
    //   },
    //   {
    //     field: "order_date",
    //     headerName: "Order Date",
    //     minWidth: 150,
    //     headerClassName: "headerName",
    //     align: "center",
    //     headerAlign: "center",
    //     flex: 0.1,
    //   },
    //   {
    //     field: "amount",
    //     headerName: "Amount",
    //     minWidth: 150,
    //     headerClassName: "headerName",
    //     align: "center",
    //     headerAlign: "center",
    //     flex: 0.1,
    //   },
    //   {
    //     field: "user_trxn_no",
    //     headerName: "Transaction No.",
    //     minWidth: 150,
    //     headerClassName: "headerName",
    //     align: "center",
    //     headerAlign: "center",
    //     flex: 0.1,
    //   },
    //   {
    //     field: "updated_at",
    //     headerName: "Updated At",
    //     minWidth: 200,
    //     headerClassName: "headerName",
    //     align: "center",
    //     headerAlign: "center",
    //     flex: 0.1,
    //   },
    //   {
    //     field: "updated_by",
    //     headerName: "Updated By",
    //     minWidth: 200,
    //     headerClassName: "headerName",
    //     align: "center",
    //     headerAlign: "center",
    //     flex: 0.1,
    //   },
    //   {
    //     field: "nominee",
    //     align: "center",
    //     headerAlign: "center",
    //     flex: 0.1,
    //     headerName: "Nominee",
    //     className: "uploadfield",
    //     headerClassName: "headerName",
    //     minWidth: 150,
    //     renderCell: (params) => {
    //       const rowId = params?.row?.id;
    //       const isFileUploaded = rowId !== undefined ? green[rowId] : false;
    //       return (
    //         <>
    //           <div className="uploadBtn">
    //             <Button
    //               type="button"
    //               // onClick={handleOpenNominee(params.row.id)}
    //               onClick={() => {
    //                 setOpen(true);
    //                 setSelectedId(params.row.id); // Store the selected row id in state
    //                 setSelectedRowId(params.row.id);
    //                 // document.getElementById("fileInput").click(); // Trigger file input click

    //                 const nominee_reg_code = params.row.reg_code.toLowerCase();
    //                 let nomineeCamsFileName =
    //                   params.row.Nominee_cams_TIFF_file_name;
    //                 let nomineeKarvyFileName =
    //                   params.row.Nominee_karvy_TIFF_file_name;
    //                 setSelectedNomineeCams(nomineeCamsFileName);
    //                 setSelectedNomineeKarvy(nomineeKarvyFileName);
    //                 SetSelectedNomineeRegCode(nominee_reg_code);
    //               }}
    //               variant="contained"
    //               size="small"
    //               sx={{
    //                 backgroundColor: isFileUploaded ? "green" : "#242056",
    //                 // color: isFileUploaded ? "white" : "inherit",
    //               }}
    //             >
    //               {isFileUploaded ? "Regenerate" : "Generate"}
    //             </Button>
    //           </div>

    //           {/* Hidden file input */}
    //           {/* <input
    //             type="file"
    //             ref={fileInputRef}
    //             id="fileInput"
    //             style={{ display: "none" }}
    //             accept="image/tiff,application/pdf" // Add the allowed extensions here
    //             onChange={(event) => {
    //               const selectedFile = event.target.files[0];
    //               setSelectedFile(selectedFile); // Store the selected file in state
    //             }}
    //           /> */}
    //         </>
    //       );
    //     },
    //   },

    //   {
    //     field: "aof",
    //     align: "center",
    //     headerAlign: "center",
    //     flex: 0.1,

    //     headerName: "AOF",
    //     className: "uploadfield",
    //     headerClassName: "headerName",
    //     minWidth: 150,
    //     renderCell: (params) => {
    //       const isFileUploaded = isAofFileUploaded[params.row.id];
    //       return (
    //         <div className="uploadBtn">
    //           <Button
    //             onClick={() => handleOpenAof(params.row.id)}
    //             variant="contained"
    //             size="small"
    //             sx={{
    //               backgroundColor: isFileUploaded ? "green" : "#242056",
    //               // color: isFileUploaded ? "white" : "inherit",
    //             }}
    //           >
    //             {isFileUploaded ? "Regenerate" : "Generate"}
    //           </Button>
    //         </div>
    //       );
    //     },
    //   },
    // ];

    const columns = [
        {
            field: "client_id",
            headerName: "Client ID",
            minWidth: 70,
            headerClassName: "headerName",
            align: "center",
            headerAlign: "center",
            flex: 0.1,
        },
        {
            field: "reg_code",
            headerName: "Reg Code",
            minWidth: 150,
            headerClassName: "headerName",
            align: "center",
            headerAlign: "center",
            flex: 0.1,
        },
        {
            field: "client_name",
            headerName: "Client Name",
            minWidth: 150,
            headerClassName: "headerName",
            align: "left",
            headerAlign: "left",
            flex: 0.1,
        },
        {
            field: "amc_code",
            headerName: "AMC Code",
            minWidth: 150,
            headerClassName: "headerName",
            align: "center",
            headerAlign: "center",
            flex: 0.1,
        },
        {
            field: "transaction_type",
            headerName: "Transaction Type",
            minWidth: 150,
            headerClassName: "headerName",
            align: "center",
            headerAlign: "center",
            flex: 0.1,
        },
        {
            field: "order_date",
            headerName: "Order Date",
            minWidth: 150,
            headerClassName: "headerName",
            align: "center",
            headerAlign: "center",
            flex: 0.1,
        },
        {
            field: "amount",
            headerName: "Amount",
            minWidth: 150,
            headerClassName: "headerName",
            align: "center",
            headerAlign: "center",
            flex: 0.1,
        },
        {
            field: "user_trxn_no",
            headerName: "Transaction No.",
            minWidth: 150,
            headerClassName: "headerName",
            align: "center",
            headerAlign: "center",
            flex: 0.1,
        },
        {
            field: "updated_at",
            headerName: "Updated At",
            minWidth: 200,
            headerClassName: "headerName",
            align: "center",
            headerAlign: "center",
            flex: 0.1,
        },
        {
            field: "updated_by",
            headerName: "Updated By",
            minWidth: 200,
            headerClassName: "headerName",
            align: "center",
            headerAlign: "center",
            flex: 0.1,
        },
        // {
        //   field: "nominee",
        //   align: "center",
        //   headerAlign: "center",
        //   flex: 0.1,
        //   headerName: "Nominee",
        //   className: "uploadfield",
        //   headerClassName: "headerName",
        //   minWidth: 150,
        //   renderCell: (params) => {
        //     const rowId = params?.row?.id;
        //     const isFileUploaded = rowId !== undefined ? green[rowId] : false;
        //     return (
        //       <>
        //         <div className="uploadBtn">
        //           <Button
        //             type="button"
        //             // onClick={handleOpenNominee(params.row.id)}
        //             onClick={() => {
        //               setOpen(true);
        //               setSelectedId(params.row.id); // Store the selected row id in state
        //               setSelectedRowId(params.row.id);
        //               // document.getElementById("fileInput").click(); // Trigger file input click

        //               const nominee_reg_code = params.row.reg_code.toLowerCase();
        //               let nomineeCamsFileName =
        //                 params.row.Nominee_cams_TIFF_file_name;
        //               let nomineeKarvyFileName =
        //                 params.row.Nominee_karvy_TIFF_file_name;
        //               setSelectedNomineeCams(nomineeCamsFileName);
        //               setSelectedNomineeKarvy(nomineeKarvyFileName);
        //               SetSelectedNomineeRegCode(nominee_reg_code);
        //             }}
        //             variant="contained"
        //             size="small"
        //             sx={{
        //               backgroundColor: isFileUploaded ? "green" : "#242056",
        //               // color: isFileUploaded ? "white" : "inherit",
        //             }}
        //           >
        //             {isFileUploaded ? "Regenerate" : "Generate"}
        //           </Button>
        //         </div>

        //         {/* Hidden file input */}
        //         {/* <input
        //           type="file"
        //           ref={fileInputRef}
        //           id="fileInput"
        //           style={{ display: "none" }}
        //           accept="image/tiff,application/pdf" // Add the allowed extensions here
        //           onChange={(event) => {
        //             const selectedFile = event.target.files[0];
        //             setSelectedFile(selectedFile); // Store the selected file in state
        //           }}
        //         /> */}
        //       </>
        //     );
        //   },
        // },
        // {
        //   field: "nom_tiff_size",
        //   headerName: "Nom TIFF size",
        //   minWidth: 120,
        //   headerClassName: "headerName",
        //   align: "center",
        //   headerAlign: "center",
        //   flex: 0.1,
        // },
        // {
        //   field: "nom_downloaded_on",
        //   headerName: "Nom Downloaded on",
        //   minWidth: 180,
        //   headerClassName: "headerName",
        //   align: "center",
        //   headerAlign: "center",
        //   flex: 0.1,
        // },

        {
            field: "aof",
            align: "center",
            headerAlign: "center",
            flex: 0.1,

            headerName: "AOF",
            className: "uploadfield",
            headerClassName: "headerName",
            minWidth: 150,
            renderCell: (params) => {
                const isFileUploaded = isAofFileUploaded[params.row.id];
                const aof_status = params.row.aof_status;
                return (
                    <div className="uploadBtn">
                        <Button
                            onClick={() => handleOpenAof(params.row.id)}
                            variant="contained"
                            size="small"
                            sx={{
                                backgroundColor: aof_status === "generated" ? "green" : "#242056",
                                // color: isFileUploaded ? "white" : "inherit",
                            }}
                        >
                            {aof_status}
                        </Button>
                    </div>
                );
            },
        },
        {
            field: "aof_tiff_size",
            headerName: "AOF TIFF size",
            minWidth: 120,
            headerClassName: "headerName",
            align: "center",
            headerAlign: "center",
            flex: 0.1,
        },
        {
            field: "aof_downloaded_on",
            headerName: "AOF Downloaded on",
            minWidth: 180,
            headerClassName: "headerName",
            align: "center",
            headerAlign: "center",
            flex: 0.1,
        },
    ];
    const aofCloseHandler = () => {
        setOpenAof(false);
        setSelected("");
        setOption("");
        setReload(prevReload => !prevReload);
    };
    const [data, setData] = useState([]);

    const fetchData = () => {
        setLoading(true);
        axios
            .get(`${baseUrl}/list-rta-old`)
            .then((res) => {
                const rowsWithIds = res.data.payload.map((row, index) => ({
                    ...row,
                    id: index,
                    // selectedFile: null,
                }));

                setData(rowsWithIds);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                setSnackbarMessage(err?.message);
                setSeverity("error");
                setOpenAlert(true);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);
    const handleChange = (event) => {
        setOption(event.target.value);
        // console.log(option)
    };

    const handleOpenAof = (rowId) => {
        const selectedRow = jsonData.payload.find((row) => row.id === rowId);
        setSelectedIdAof(rowId);
        // Extract the AOF file names from the selected row
        const aofCamsFileName = selectedRow.AOF_cams_TIFF_file_name;
        const aofKarvyFileName = selectedRow.AOF_Karvy_TIFF_file_name;
        const reg_code = selectedRow.reg_code;
        const ids = selectedRow.id;
        console.log(ids);
        SetSelectedRegCode(reg_code);
        // Update the state with the file names
        setSelectedAofCams(aofCamsFileName);
        setSelectedAofKarvy(aofKarvyFileName);
        setSelectedClientId(ids);
        setOpenAof(true);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    // useEffect(() => {
    //   console.log({ fileList });
    // }, [fileList]);

    // useEffect(() => {
    //   if (selectedFile) {
    //     apiPostingHandler();
    //   }
    // }, [selectedFile]);
    const apiPostingHandler = () => {
        if (selectedFile) {
            console.log("api testing");
            const formdata = new FormData();
            formdata.append(`pdf_file1`, selectedFile);

            if (selectedNomineeRegCode === "cams") {
                // console.log(selectedNomineeRegCode);

                formdata.append("file_name", selectedNomineeCams);
                // console.log({ pdf_files: selectedFile });
                // console.log({ fileName: selectedNomineeCams });
                // console.log(selectedNomineeRegCode);
                setLoading(true);
                axios
                    .post(`${baseUrl}/nominee-cams-converter`, formdata, {
                        headers: headers,
                        responseType: "blob",
                    })
                    .then((res) => {
                        // console.log({ headers: res.headers })
                        const contentDisposition = res.headers["content-disposition"];
                        const blob = new Blob([res.data], { type: "application/zip" });
                        const blobUrl = URL.createObjectURL(blob);
                        const filenameMatch = contentDisposition
                            ? contentDisposition.match(/filename=(?:"([^"]+)"|([^;]+))/)
                            : null;
                        const filename = filenameMatch
                            ? filenameMatch[1] || filenameMatch[2]
                            : null;

                        const link = document.createElement("a");
                        link.href = blobUrl;

                        console.log({ link });

                        if (filename) {
                            link.download = filename;
                            console.log("Extracted filename:", filename);
                        }

                        link.click();
                        URL.revokeObjectURL(blobUrl);

                        setSnackbarMessage("Tiff file addded sucessfully");
                        setSeverity("success");
                        setOpenAlert(true);
                        setGreen((prevState) => ({
                            ...prevState,
                            [selectedId]: true,
                        }));
                        setLoading(false);
                        setOpen(false);
                    })

                    .catch((err) => {
                        console.log(err?.message);
                        setSeverity("error");
                        setOpenAlert(true);
                        setLoading(false);
                    });
            } else if (selectedNomineeRegCode === "karvy") {
                // console.log(selectedNomineeRegCode);
                formdata.append("file_name", selectedNomineeKarvy);
                setLoading(true);

                // console.log({ pdf_files: selectedFile });
                // console.log({ fileName: selectedNomineeCams });
                // console.log(selectedNomineeRegCode);
                axios
                    .post(`${baseUrl}/nominee-karvy-converter`, formdata, {
                        headers: headers,
                        responseType: "blob",
                    })
                    .then((res) => {
                        console.log({ headers: res.headers });
                        const contentDisposition = res.headers["content-disposition"];
                        const blob = new Blob([res.data], { type: "application/zip" });
                        const blobUrl = URL.createObjectURL(blob);
                        const filenameMatch = contentDisposition
                            ? contentDisposition.match(/filename=(?:"([^"]+)"|([^;]+))/)
                            : null;
                        const filename = filenameMatch
                            ? filenameMatch[1] || filenameMatch[2]
                            : null;

                        const link = document.createElement("a");
                        link.href = blobUrl;

                        console.log({ link });

                        if (filename) {
                            link.download = filename;
                            console.log("Extracted filename:", filename);
                        }

                        link.click();
                        URL.revokeObjectURL(blobUrl);
                        // setSnackbarMessage(res.data.message);
                        setSnackbarMessage("Tiff file addded sucessfully");
                        setSeverity("success");
                        setOpenAlert(true);
                        // console.log(res.data.message);
                        setGreen((prevState) => ({
                            ...prevState,
                            [selectedId]: true,
                        }));
                        setLoading(false);
                        setOpen(false);
                    })
                    .catch((err) => {
                        console.log({ err });
                        setSnackbarMessage(err?.message);
                        setSeverity("error");
                        setOpenAlert(true);
                        setLoading(false);
                    });
            }
            setSelectedFile("");
        }
        // console.log(formdata?.file_name);
    };
    const handleFileChange = (event) => {
        // console.log("handlefilechange");
        // console.log({ "selected row id": selectedRowId });
        if (selectedRowId !== null) {
            const selectedFile = event.target.files[0];
            // console.log(selectedFile);
            if (selectedFile?.type !== "application/pdf") {
                // console.log("if block");
                // console.log(selectedFile?.type);
                setOpenAlert(true);
                setSnackbarMessage(`Please upload only pdf files!`);
                setSeverity("error");
                // setShowName(false);
            } else {
                console.log("else block");
                setSelectedFile(selectedFile);

                // fileToBase64(selectedFile)
                //   .then((base64Data) => {
                //     setSelectedFileBase64(base64Data);
                //   })
                //   .catch((error) => {
                //     console.log("Error converting file to base64:", error);
                //   });
            }
        }
    };
    const [isAofFileUploaded, setIsAofFileUploaded] = useState(false);
    const handleAofUploaded = (rowId, uploaded) => {
        setIsAofFileUploaded((prevStatus) => ({
            ...prevStatus,
            [rowId]: uploaded,
        }));
    };
    const [isAllFilesUploaded, setIsAllFilesUploaded] = useState(false);

    // ... (other code)

    // Function to handle all files uploaded
    const handleAllFilesUploaded = () => {
        setIsAllFilesUploaded(true);
    };
    // console.log({selectedFileBase64})
    // console.log({selectedFile})

    const handleClose = () => {
        setOpen(false);
        setSelectedFileBase64("");
    };

    const fileInputResponse = () => {
        fileInputRef.current.click();
    };

    ////new poa
    const [pageCount, setPageCount] = useState(0);

    let limit = 20;

    useEffect(() => {
        const getPoaList = async () => {
            const res = await fetch(`${baseUrl}/list-rta-old?page=1&per_page=${limit}`);
            const data = await res.json();
            const total = data.row_count;
            setPageCount(Math.ceil(total / limit));
            setJsonData(data);
        };

        getPoaList();
    }, [reload]);

    // console.log(items);
    const total = jsonData.row_count;
    console.log(total);

    const fetchPoaList = async (currentPage) => {
        setLoading(true);
        const res = await fetch(
            `${baseUrl}/list-rta-old?page=${currentPage}&per_page=${limit}`
            // `https://jsonplaceholder.typicode.com/comments?_page=${currentPage}&_limit=${limit}`
        );
        const data = await res.json();
        setLoading(false);
        return data;
    };

    const hadlePageClick = async (data) => {
        console.log(data.selected);
        let currentPage = data.selected + 1;
        const poaListServer = await fetchPoaList(currentPage);
        setJsonData(poaListServer);
    };

    console.log("pagecount: ", pageCount);

    console.log("diableclients: ", disableClients);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    flexDirection: "column",
                    marginRight: "50px",
                    marginTop: "25px",
                    // width:"auto"
                }}
            >
                <Button
                    sx={{
                        // bgcolor: "#228b22 !important",
                        bgcolor: selectedRows.length === 0 ? "#808080 !important" : "#228b22 !important",
                        color: "white !important ",
                        width: "100px",
                        height: "35px",
                        border: "none !important",
                    }}
                    className="logoutBtn"
                    onClick={categorizeSelectedRows}
                    disabled={selectedRows.length === 0}
                >
                    Download
                </Button>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    // width:"auto"
                }}
            >
                <Grid
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                        borderRadius: "10px",
                        boxShadow: "rgba(76, 78, 100, 0.22) 0px 2px 10px 0px",
                        border: "none",
                        marginTop: "7px",
                        // overflow: "scroll",
                        bgcolor: "#fff",
                        width: "93%",
                        // maxHeight:"50% !important",
                        // overflow:"auto"
                    }}
                >
                    {/* <Grid sx={{ padding: "30px" }}> */}
                    {/* <TableHeader buttonText={buttonText} buttonClassName={buttonClassName} handleOpenDialog={handleOpenDialog} /> */}
                    {/* </Grid> */}
                    {/* <Grid className="dataGridStyling"> */}
                    <Grid
                        sx={{
                            // backgroundColor: "#ffff",
                            width: "100%",
                            bgcolor: "#fff",
                            height: "65vh",
                            // overflowY:"scroll",
                            "& .headerName": {
                                bgcolor: "#eae6e6",
                                font: "bold !important",
                                fontSize: "14px",
                            },
                            "& .MuiDataGrid-columnHeaderDraggableContainer": {
                                bgcolor: "#eae6e6",
                                font: "bold !important",
                                fontSize: "14px",
                            },
                        }}
                    >
                        {/* <DataGrid
              className="dataGrid"
              // sx={{ width:"100%"}}
              rowHeight={55}
              // disableColumnMenu
              rows={jsonData.payload}
              rowCount={pageCount}
              getRowId={(row) => row.id} // Specify the custom id for each row
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 100 },
                },
              }}
              // disableRowSelectionOnClick
              pageSizeOptions={[50, 100, 500, 1000]}
              sx={{
                border: 1,

                borderColor: "#dedede",

                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "inherit !important",
                },
              }}
            /> */}
                        <DataGrid
                            // className="dataGrid"
                            rows={jsonData.payload}
                            columns={columns}
                            checkboxSelection
                            //onRowSelectionModelChange={}
                            // onRowSelectionModelChange={(newSelection) => {
                            //   setSelectedRows(newSelection);
                            //   if (newSelection.length > 0) {
                            //     setSelectedRegs(jsonData.payload[newSelection[0]].reg_code);
                            //   } else {
                            //     setSelectedRegs("");
                            //   }
                            //   console.log(newSelection);
                            // }}
                            onRowSelectionModelChange={(newSelection) => {
                                checkSelection(newSelection);
                                setSelectedRows(newSelection);
                                // console.log(newSelection)
                            }}
                            isRowSelectable={(params) =>
                                !disableClients.find((client) => client.id === params.row.id)
                            }
                            loading={pageState.isLoading}
                            pagination
                            pageSizeOptions={[10, 25, 50, 100]}
                            {...jsonData}
                            initialState={{
                                ...jsonData.initialState,
                                pagination: { paginationModel: { pageSize: 10 } },
                            }}
                            sx={{
                                "& .MuiDataGrid-columnHeaderTitleContainerContent": {
                                    "& .MuiCheckbox-root": {
                                        display: "none"
                                    }
                                }
                            }}
                        />
                    </Grid>
                </Grid>

                {/* <ReactPaginate
          previousLabel={'Prev'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={hadlePageClick}
          containerClassName={'pageNumberContainer'}
          pageClassName={'pageNumberClass'}
          pageLinkClassName={'pageLinkClass'}

          previousClassName={`pageNumberClass ${currentPage === 1 ? 'disabled' : ''}`}
          previousLinkClassName={`pageLinkClass ${currentPage === 1 ? 'disabled' : ''}`}
          nextClassName={`pageNumberClass ${currentPage === pageCount - 1 ? 'disabled' : ''}`}
          nextLinkClassName={`pageLinkClass ${currentPage === pageCount - 1 ? 'disabled' : ''}`}

          breakClassName={'pageNumberClass'}
          breakLinkClassName={'pageLinkClass'}
          activeClassName={'pageNumberClassActive'}
        /> */}
                {/* </Grid> */}
                <Modal
                    open={open}
                    // onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Grid
                        className="modalStylingForAof"
                        sx={{ width: "600px !important" }}
                    >
                        <Grid sx={{ display: "flex" }}>
                            <Typography
                                flex={1}
                                variant="h6"
                                sx={{ fontWeight: "bold", color: "common.black", mb: 2 }}
                            >
                                Upload File
                            </Typography>
                            <IconButton onClick={() => handleClose()} flex={1}>
                                <ClearIcon sx={{}} />
                            </IconButton>
                        </Grid>
                        <Grid
                            sx={{
                                color: "#01579B !important",
                                marginBottom: "10px",
                                fontSize: "12px!important",
                                backgroundColor: "#bbdefb75 !important",
                                borderRadius: " 6px",
                                padding: " 4px",
                            }}
                        >
                            Note:Only <b>PDF</b> or <b>TIFF</b> files accepted *
                        </Grid>
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
                                        Uploaded File:
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontSize: "12px !important",
                                            padding: "6px 10px",
                                            width: "100px !important",
                                        }}
                                        scope="row"
                                        className="columnTitle"
                                    >
                                        {selectedFile ? (
                                            <Chip
                                                className="fileChip"
                                                sx={{ width: "320px" }}
                                                label={selectedFile?.name}
                                                variant="outlined"
                                            />
                                        ) : null}
                                    </TableCell>
                                    <TableCell align="right" sx={{ padding: "10px " }}>
                                        <IconButton
                                            sx={{ color: "#242056" }}
                                            onClick={fileInputResponse}
                                        >
                                            <CloudUploadIcon />
                                        </IconButton>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            id="fileInput"
                                            style={{ display: "none" }}
                                            accept="application/pdf" // Add the allowed extensions here
                                            onChange={handleFileChange} // Pass the row id to the handleFileChange function
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        {selectedFile ? (
                            <Grid
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Button className="postBtn" onClick={apiPostingHandler}>
                                    Generate
                                </Button>
                            </Grid>
                        ) : null}
                    </Grid>
                </Modal>

                <Modal
                    sx={{ width: "100%" }}
                    open={openAof}
                    // onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className="modalStylingForAof">
                        <Grid sx={{ display: "flex" }}>
                            <Typography
                                flex={1}
                                variant="h6"
                                sx={{ fontWeight: "bold", color: "common.black", mb: 2 }}
                            >
                                Upload File
                            </Typography>
                            <IconButton onClick={() => aofCloseHandler()} flex={1}>
                                <ClearIcon sx={{}} />
                            </IconButton>
                        </Grid>
                        <Grid
                            sx={{
                                color: "#01579B !important",
                                marginBottom: "10px",
                                fontSize: "12px!important",
                                backgroundColor: "#bbdefb75 !important",
                                borderRadius: " 6px",
                                padding: " 4px",
                            }}
                        >
                            *Note:Only <b>PDF</b> or <b>TIFF</b> files accepted <br />
                            *File Size: Less than <b>3MB</b>
                        </Grid>
                        <Grid sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                    Client Type
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={option}
                                    label="Client Type"
                                    onChange={handleChange}
                                >
                                    <MenuItem
                                        onClick={() => {
                                            setSelected("individual");
                                        }}
                                        value="individual"
                                    >
                                        Individual
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            setSelected("non-individual");
                                        }}
                                        value="non-ndividual"
                                    >
                                        Non-Individual
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {selected == "individual" ? (
                            <IndividualList
                                aofCamsFileName={selectedAofCams}
                                aofKarvyFileName={selectedAofKarvy}
                                regCode={selectedRegCode}
                                id={selectedClientId}
                                onAofUploaded={handleAofUploaded}
                                rowId={selectedIdAof}
                                onAllFilesUploaded={handleAllFilesUploaded}
                                handleLoading={handleLoading}
                                onClose={aofCloseHandler}
                            />
                        ) : null}
                        {selected == "non-individual" ? (
                            <Grid className="fileList1">
                                <NonIndividualList
                                    aofCamsFileName={selectedAofCams}
                                    aofKarvyFileName={selectedAofKarvy}
                                    regCode={selectedRegCode}
                                    id={selectedClientId}
                                    onAofUploaded={handleAofUploaded}
                                    rowId={selectedIdAof}
                                    handleLoading={handleLoading}
                                    onClose={aofCloseHandler}
                                />
                            </Grid>
                        ) : null}
                    </Box>
                </Modal>
                {/* dialog */}

                {/* <Dialog
          open={openDialog}
          // width={}
          // sx={{maxWidth:""}}
          maxWidth="md"
          sx={{ marginTop: "-140px" }}
        // onClose={handleCloseDialog}
        >
          <DialogActions>
            <Typography
              flex={1}
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "common.black",
                marginTop: "4px",
                marginLeft: "4px",
              }}
            >
              Download Converted File
            </Typography>
            <IconButton
              onClick={handleCloseDialog}
              sx={{ position: "absolute", right: "30px", top: "10px" }}
              flex={1}
            >
              <ClearIcon sx={{ fontSize: "1.5em" }} />
            </IconButton>
          </DialogActions>
          <DialogContent>
            <DownloadFile isAllFilesUploaded={isAllFilesUploaded} />
          </DialogContent>
        </Dialog> */}
                {loading ? <Loader /> : null}
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
            </Box>
        </>
    );
}

export default TradeFeedAofOld;

