import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Poa.css";
import ClearIcon from "@mui/icons-material/Clear";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

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
} from "@mui/material";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { BorderColor, Grade } from "@mui/icons-material";
import { isEmptyArray } from "formik";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import IndividualList from "./IndividualList";
import NonIndividualList from "./NonIndividualList";
import PoaList from "./PoaList";
import Loader from "./Loader";
import ReactPaginate from 'react-paginate';


function Poa() {
  const [jsonData, setJsonData] = useState({
    payload: [],
    row_count: 0,
  });

  ////
  const [currentPage, setCurrentPage] = useState(0); // Initialize current page to 0
  // Replace with the actual total number of pages

  const [reload, setReload] = useState(false);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  /////

  const rowCount = jsonData.row_count

  const [rowCountState, setRowCountState] = React.useState(rowCount);
  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      rowCount !== undefined ? rowCount : prevRowCountState,
    );
  }, [rowCount, setRowCountState]);

  const [rows, setRows] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [poaFileName, setPoaFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [disableClients, setDisableClients] = useState([])
  const [selectedRows, setSelectedRows] = useState([])

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
  }
  const [pageState, setPageState] = useState({
    page: 1,
    pageSize: 25,
    isLoading: false,
    total: 0,
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 5,
  });

  const columns = [
    {
      field: "clientid",
      headerName: "Client ID",
      minWidth: 70,
      headerClassName: "headerName",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "clientname",
      headerName: "Client Name",
      minWidth: 200,
      headerClassName: "headerName",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "usertrxnno",
      headerName: "Transaction No",
      minWidth: 200,
      headerClassName: "headerName",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "brokercode",
      headerName: "Broker Code",
      minWidth: 200,
      headerClassName: "headerName",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "amccode",
      headerName: "AMC Code",
      minWidth: 100,
      headerClassName: "headerName",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "folio_no",
      headerName: "Folio No",
      minWidth: 200,
      headerClassName: "headerName",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      minWidth: 200,
      headerClassName: "headerName",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "updated_by",
      headerName: "Updated By",
      minWidth: 200,
      headerClassName: "headerName",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "poa",
      align: "center",
      headerAlign: "center",
      headerName: "PoA",
      className: "uploadfield",
      headerClassName: "headerName",
      minWidth: 200,
      renderCell: (params) => {
        const poa_status = params.row.poa_status
        return (
          <>
            <div className="poaBtn">
              <Button
                onClick={
                  () => {
                    handleOpen(params.row.id);
                    // document.getElementById("fileInput").click();
                  } // Trigger file input click
                }
                variant="contained"
                size="small"
                sx={{ backgroundColor: poa_status === "generated" ? "green !important" : "#2d545e" }}
              >
                {poa_status}
              </Button>
            </div>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              accept=".pdf,.tiff,.tif" // Add the allowed extensions here
              onChange={(event) => {
                const selectedFile = event.target.files[0];
                setSelectedFile(selectedFile); // Store the selected file in state
              }}
            />
          </>
        );
      },
    },
    {
      field: "poa_tiff_size",
      headerName: "PoA TIFF size",
      minWidth: 180,
      headerClassName: "headerName",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "poa_downloaded_on",
      headerName: "PoA Downloaded on",
      minWidth: 180,
      headerClassName: "headerName",
      align: "center",
      headerAlign: "center",
    },
  ];

  // styling for modal
  // const style = {
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transform: "translate(-50%, -50%)",
  //   width: 400,
  //   bgcolor: "background.paper",
  //   boxShadow: 24,
  //   p: 4,
  //   borderRadius: "10px",
  //   overflowY: "scroll",
  //   maxHeight: "70%",
  // };
  const handleOpen = (id) => {
    const selectedRow = jsonData.payload.find((row) => row.id === id);
    console.log("data: ", data)
    console.log("selected row: ", selectedRow)

    const poa_tiff_file_name = selectedRow.poa_tiff_file_name;
    const ids = selectedRow.id;
    setPoaFileName(poa_tiff_file_name);
    setSelectedId(ids)
    setOpen(true);
  };
  const closeHandler = () => {
    setOpen(false);
    setReload(prevReload => !prevReload);
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const baseUrl = process.env.REACT_APP_BASE_URL;


  const fetchData = useCallback(() => {
    setLoading(true);
    setPageState((prev) => ({ ...prev, isLoading: true }));

    const url = `${baseUrl}/poa-list-rta?page=${pageState.page}&per_page=${pageState.pageSize}`;

    axios
      .get(url)
      .then((res) => {
        const rowsWithIds = res.data.payload.map((row, index) => ({
          ...row,
          id: index,
        }));
        setPageState((prev) => ({
          ...prev,
          total: +res.data.row_count,
          isLoading: false,
        }));
        setData(rowsWithIds);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setSnackbarMessage(err?.message);
        setSeverity("error");
        setOpenAlert(true);
      });
  }, [
    setData,
    pageState.page, pageState.pageSize
  ]);

  ////new poa
  const [pageCount, setPageCount] = useState(0);

  let limit = 12;

  useEffect(() => {
    setLoading(true)
    const getPoaList = async () => {
      const res = await fetch(
        `${baseUrl}/poa-list-rta?page=1&per_page=${limit}`
      );
      const data = await res.json();
      const total = data.row_count
      setPageCount(Math.ceil(total / limit))
      setJsonData(data);
      setLoading(false)
    };

    getPoaList();
  }, [reload]);

  // console.log(items);
  const total = jsonData.row_count
  console.log(total)

  const fetchPoaList = async (currentPage) => {
    setLoading(true)
    const res = await fetch(
      `${baseUrl}/poa-list-rta?page=${currentPage}&per_page=${limit}`
      // `https://jsonplaceholder.typicode.com/comments?_page=${currentPage}&_limit=${limit}`
    );
    const data = await res.json();
    setLoading(false)
    return data;
  };

  const hadlePageClick = async (data) => {
    console.log(data.selected);
    let currentPage = data.selected + 1
    const poaListServer = await fetchPoaList(currentPage)
    setJsonData(poaListServer)
  }

  //current row + previous selected row

  // const checkSelection = (selectedData) => {
  //   const disableRows = [];
  //   const selectedRows = jsonData.payload.filter((row) => selectedData.includes(row.id));

  //   if (selectedRows.length > 0) {
  //     // Calculate the sum of 'poa_tiff_kb_size' for selected rows
  //     const sumPoaTiffSize = selectedRows.reduce((sum, row) => {
  //       if (row.poa_tiff_kb_size !== 'N/A') {
  //         console.log("poa size: ", parseFloat(row.poa_tiff_kb_size))
  //         return sum + parseFloat(row.poa_tiff_kb_size);
  //       }
  //       return sum;
  //     }, 0);

  //     // Check if the sum is greater than or equal to 4 MB (4000 KB)
  //     console.log("sum of poa tiff size", sumPoaTiffSize)
  //     if (sumPoaTiffSize >= 5000) {
  //       // Find the current row that is trying to be selected

  //       const currentRowId = selectedData[selectedData.length - 1];
  //       const currentRow = jsonData.payload.find((row) => row.id === currentRowId);

  //       setSnackbarMessage("5MB exceeds")
  //       setSeverity("success");
  //       setOpenAlert(true);


  //       // Deselect the current row if its 'nom_tiff_size' is not 'N/A'
  //       if (currentRow && currentRow.poa_tiff_kb_size !== 'N/A') {
  //         const rowIndexToDeselect = selectedData.indexOf(currentRowId);
  //         if (rowIndexToDeselect !== -1) {
  //           selectedData.splice(rowIndexToDeselect, 1);
  //         }
  //         disableRows.push(currentRow);
  //       }
  //     }

  //     // Get the reg_code of the first selected row
  //     const firstSelectedRow = selectedRows[0];
  //     const firstSelectedRegCode = firstSelectedRow ? firstSelectedRow.reg_code : null;

  //     // Implement Karvy and Cams logic here to disable rows if needed
  //     if (firstSelectedRegCode === 'CAMS') {
  //       // Disable rows with reg_code 'karvy'
  //       const karvyRows = jsonData.payload.filter((row) => row.reg_code === 'KARVY');
  //       disableRows.push(...karvyRows);
  //     } else if (firstSelectedRegCode === 'KARVY') {
  //       // Disable rows with reg_code 'cams'
  //       const camsRows = jsonData.payload.filter((row) => row.reg_code === 'CAMS');
  //       disableRows.push(...camsRows);
  //     }
  //   }

  //   console.log("disableRows: ", disableRows);
  //   setDisableClients(disableRows);
  //   return disableRows;
  // };

  const checkSelection = (selectedData) => {
    const disableRows = [];
    const selectedRows = jsonData.payload.filter((row) => selectedData.includes(row.id));

    if (selectedRows.length > 0) {
      // Get the AMC code of the first selected row
      const firstSelectedRow = selectedRows[0];
      const firstSelectedAmcCode = firstSelectedRow ? firstSelectedRow.amccode : null;

      // Calculate the sum of 'poa_tiff_kb_size' for selected rows
      const sumPoaTiffSize = selectedRows.reduce((sum, row) => {
        if (row.poa_tiff_kb_size !== 'N/A') {
          return sum + parseFloat(row.poa_tiff_kb_size);
        }
        return sum;
      }, 0);

      // Check if the sum is greater than or equal to 5 MB (5000 KB)
      console.log("sumTiff: ", sumPoaTiffSize)
      if (sumPoaTiffSize >= 300000) {
        // Find the current row that is trying to be selected
        const currentRowId = selectedData[selectedData.length - 1];
        const currentRow = jsonData.payload.find((row) => row.id === currentRowId);

        setSnackbarMessage("5MB exceeds");
        setSeverity("success");
        setOpenAlert(true);

        // Deselect the current row if its 'poa_tiff_kb_size' is not 'N/A'
        if (currentRow && currentRow.poa_tiff_kb_size !== 'N/A') {
          const rowIndexToDeselect = selectedData.indexOf(currentRowId);
          if (rowIndexToDeselect !== -1) {
            selectedData.splice(rowIndexToDeselect, 1);
          }
          disableRows.push(currentRow);
        }
      }

      // Implement logic to disable rows with different AMC codes
      jsonData.payload.forEach((row) => {
        console.log("amc: ", firstSelectedAmcCode)
        if (row.amccode !== firstSelectedAmcCode && !selectedData.includes(row.id)) {
          disableRows.push(row);
        }
      });
    }

    console.log("disableRows: ", disableRows);
    setDisableClients(disableRows);
    return disableRows;
  };

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
  //       const { reg_code, Nominee_cams_TIFF_file_name, AOF_cams_TIFF_file_name, cams_aof_txt, cam_nom_txt, AOF_Karvy_TIFF_file_name, Nominee_karvy_TIFF_file_name, karvy_aof_dbf } = selectedRow;
  //       // regCode.push(reg_code)
  //       if (reg_code === 'CAMS') {
  //         regCode = reg_code
  //         nomineeCamsData.push(Nominee_cams_TIFF_file_name);
  //         aofCamsData.push(AOF_cams_TIFF_file_name);
  //         camsAofTxtData.push(cams_aof_txt);
  //         camsNomTxtData.push(cam_nom_txt);
  //       } else if (reg_code === 'KARVY') {
  //         regCode = reg_code
  //         nomineeKarvyData.push(Nominee_karvy_TIFF_file_name);
  //         aofKarvyData.push(AOF_Karvy_TIFF_file_name);
  //         karvyAofDbfData.push(karvy_aof_dbf);
  //       }
  //     }
  //   });
  //   console.log(regCode)
  //   // Now you have categorized data in separate arrays for both "CAMS" and "KARVY"
  //   console.log('CAMS - Nominee_cams_TIFF_file_name:', nomineeCamsData);
  //   console.log('CAMS - AOF_cams_TIFF_file_name:', aofCamsData);
  //   console.log('CAMS - cams_aof_txt:', camsAofTxtData);
  //   console.log('CAMS - cams_nom_txt:', camsNomTxtData);

  //   console.log('KARVY - Nominee_karvy_TIFF_file_name:', nomineeKarvyData);
  //   console.log('KARVY - AOF_Karvy_TIFF_file_name:', aofKarvyData);
  //   console.log('KARVY - karvy_aof_dbf:', karvyAofDbfData);
  // };


  const categorizeSelectedRows = () => {
    const poa_file = []
    const poa_dbfs = []
    const ids = []


    selectedRows.forEach((rowId) => {
      const selectedRow = jsonData.payload.find((row) => row.id === rowId);
      if (selectedRow) {
        const {
          poa_tiff_file_name,
          poa_dbf,
          id

        } = selectedRow;
        poa_file.push(poa_tiff_file_name)
        poa_dbfs.push(poa_dbf)
        ids.push(id)
      }
    });

    // console.log(selectedNomineeRegCode);
    // console.log({ pdf_files: selectedFile });
    // console.log({ fileName: selectedNomineeCams });
    // console.log(selectedNomineeRegCode);
    // formdata.append("cams-tiff-file",nomineeCamsData.join(','))
    // formdata.append("cams-text-file",camsNomTxtData.join(','))
    const requestData = {
      cams_tiff_file: poa_file, // Send this array in JSON format
      cams_text_file: poa_dbfs,
      id: ids
    };

    setLoading(true);
    setReload(true);
    axios
      .post(`${baseUrl}/download-poa-zip`, requestData, {
        headers: {
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

        setLoading(false);
        setReload(false);
        setOpen(false);
      })

      .catch((err) => {
        console.log(err?.message);
        setSeverity("error");
        setOpenAlert(true);
        setLoading(false);
      });

  };


  return (
    <>
      {/* <Header
        showNominee={false}
        showPMS={false}
        showPoa={true}
        backArrow={false}
      /> */}
      <Box sx={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        flexDirection: "column",
        marginRight: "55px",
        marginTop: "0px"
        // width:"auto"
      }}>
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
            backgroundColor: "#ffff",
            marginBottom: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            borderRadius: "10px",
            boxShadow: "rgba(76, 78, 100, 0.22) 0px 2px 10px 0px",
            border: "none",
            height: "65vh",
            marginTop: "7px",
            width: "93%",
            "& .headerName": {
              // bgcolor: "#eae6e6",
              font: "bold ",
              fontSize: "14px",
              rowHeight: 90
              // paddingTop:"2px",
              // paddingBottom:"2px",
            },
          }}
        >
          <DataGrid
            rows={jsonData.payload}
            columns={columns}
            loading={pageState.isLoading}
            checkboxSelection
            pagination
            onRowSelectionModelChange={(newSelection) => {
              checkSelection(newSelection)
              setSelectedRows(newSelection)
              // console.log(newSelection)
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            {...jsonData}
            initialState={{
              ...jsonData.initialState,
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            isRowSelectable={(params) => !disableClients.find((client) => client.id === params.row.id)}
            sx={{
              "& .MuiDataGrid-columnHeaderTitleContainerContent": {
                "& .MuiCheckbox-root": {
                  display: "none"
                }
              }
            }}
          // disableVirtualization
          // disableRowSelectionOnClick
          />
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
        <Modal
          sx={{ width: "100%" }}
          open={open}
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
              <IconButton onClick={() => closeHandler()} flex={1}>
                <ClearIcon sx={{ mb: 2 }} />
              </IconButton>
            </Grid>
            <Grid
              sx={{
                color: "#004D40;",
                marginBottom: "10px",
                fontSize: "12px!important",
                backgroundColor: "#e0f2f1",
                borderRadius: " 6px",
                padding: " 4px",
              }}
            >
              Note:Only <b>PDF</b> or <b>TIFF</b> files accepted *
            </Grid>

            <PoaList poaFileName={poaFileName} handleLoading={handleLoading} ids={selectedId} onClose={closeHandler} />
          </Box>
        </Modal>
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

export default Poa;
