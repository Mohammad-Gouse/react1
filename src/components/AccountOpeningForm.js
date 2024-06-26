import React, { useEffect, useRef, useState } from "react";
import "./TradeFeed.css"
import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Box,
  Button,
  Card,
  InputAdornment,
  Snackbar,
  TextField,
  Grid
} from "@mui/material";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";

function AccountOpeningForm() {
  const { control } = useForm();
  const [rows, setRows] = useState([
    { id: 1, tradeFeed: `feed` },
    { id: 2, tradeFeed: `feed` },
    { id: 3, tradeFeed: `feed` },
    { id: 4, tradeFeed: `feed` },
    { id: 5, tradeFeed: `feed` },
  ]);
  const [fileList, setFileList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const fileInputRef = useRef();
  const allowedExtensions = ["image/tiff", "application/pdf"];
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  
  const columns = [
    { field: "id", headerName: "Sr No", width: 100 },
    { field: "tradeFeed", headerName: "Trade Feed", width: 200 },
    {
      field: "uploadFile",
      headerName: "Upload File",
      className:"uploadfield",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            <Button
              onClick={() => handleOpen(params.row.id)}
              variant="contained"
              size="small"
            >
              Upload
            </Button>
          </div>
        );
      },
    },
    // {
    //   field: "convertFile",
    //   headerName: "Convert To Tiff",
    //   width: 200,
    //   renderCell: (params) => {
    //     return (
    //       <div>
    //         <Button variant="contained" size="small">
    //           Convert
    //         </Button>
    //       </div>
    //     );
    //   },
    // },
  ];


  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  
  const filePostingHandler = (acceptedFiles) => {
    // let inputFile = e.target.files;
    // console.log(inputFile)
    const fileArray = Array.from(acceptedFiles);
    const validFiles = [...fileList];
    fileArray.forEach((file) => {
      if (allowedExtensions.includes(file.type)) {
        validFiles.push(file);
      } else {
        setOpenAlert(true);
        setSeverity("error");
        setSnackbarMessage("please upload only tiff or pdf file");
      }
    });
    setFileList(validFiles);
  };
  // console.log({"after file handler ":validFiles})
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: filePostingHandler,
  });
  const fileInputResponseHandling = () => {
    fileInputRef.current.click();
  };
  const handleOpen = (id) => {
    setOpen(true);
    setSelectedId(id);
    console.log(id);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
    setFileList([]);
    // if (fileInputRef.current) {
    //   fileInputRef.current.value = "";
    // }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  


  useEffect(() => {
    console.log({ fileList });
  }, [fileList]);

  const removeFileHandler = (i) => {
    const file = fileList.at(i);
    const validFiles = [...fileList];
    validFiles.pop(file);
    setFileList(validFiles);
  };
  const apiPostingHandler =() =>{
    console.log("api testing")
    const formdata = new FormData();
    formdata.append('rows', JSON.stringify(rows));
  for(let i =0 ;i<fileList.length;i++)
  {
    formdata.append(`file${i}`,fileList[i])
  }
  axios.post(`${baseUrl}`,formdata,{headers:headers})
  .then((res) => {
    
    setSnackbarMessage(res.data.message);
    setSeverity("success");
    setOpenAlert(true);
  })
  .catch((err) => {
  
    console.log(err);
    setSnackbarMessage(err.response.data.message);
    setSeverity("error");
    setOpenAlert(true);
  });

  }

  return (
    <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
      <Box> 
        <h1>Trade List</h1>
      </Box>
      <Grid className="dataGridStyling" style={{backgroundColor:"#f5f5f5" ,width:"100%"}}>
        
        <DataGrid
        sx={{marginLeft:5,marginRight:5 }}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10]}
        />
      </Grid>
      {/* <div>
      <button onClick={handleOpen}>Open Dialog</button>
     
      </div> */}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "common.black", mb: 5 }}
          >
            Upload File
          </Typography>
          {/* <Button onClick={fileInputResponseHandling}>
          <CloudUploadIcon />
          </Button>
            <input
            type="file"
            multiple
            accept={allowedExtensions}
            onChange={filePostingHandler}
            ref={fileInputRef}
            title=""
            hidden
          /> */}
          <>
            {isDragActive ? (
              <Typography sx={{ color: "blue" }}>
                Drop the files here...
              </Typography>
            ) : (
              <>
                <Typography>
                  Drag and drop files here, or click to select files
                </Typography>
              </>
            )}
          </>
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? "active" : ""}`}
          >
            <>
              <input {...getInputProps()} />
              <TextField
                label="Upload Document"
                disabled={true}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <CloudUploadIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </>
          </div>

          <div>
            {fileList.map((file, index) => {
              return (
                <div key={index}>
                  {
                    <Card
                      sx={{
                        display: "flex",
                        padding: "10px",
                        margin: " 6px 4px",
                      }}
                    >
                      <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
                        {file.name}
                      </Typography>
                      <ClearIcon
                        onClick={() => {
                          removeFileHandler(index);
                        }}
                        sx={{
                          position: "absolute",
                          right: "10%",
                          color: "gray",
                        }}
                      />
                    </Card>
                  }
                </div>
              );
            })}
          </div>

          <Button onClick={apiPostingHandler} sx={{background:"lightBlue",color:"black",borderRadius:"10px",border:"2px solid lightBlue" ,mt:"2px",padding:"0px 4px"}}>Save</Button>
        </Box>
      </Modal>

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
  );
}
export default AccountOpeningForm
