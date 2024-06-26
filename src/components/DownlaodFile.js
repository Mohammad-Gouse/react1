import React from "react";
// import Header from "./Header";
import Button from "@mui/material/Button";
import { useState } from "react";
// import history from "@history";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import Box from "@mui/material/Box";
import "./AddingUser.css";
import "./DownloadFile.css";
function DownlaodFile({isAllFilesUploaded }) {


  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const headers = {
    "Content-Type": "application/json",
  };
  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ maxWidth: "500px" }}>
      <Grid container spacing={2} alignItems="center" >
        {/* Select Element */}
        <Grid item xs={12} sm={6}>
          <FormControl >
          <InputLabel >
                  Choose Transaction
                </InputLabel>
          <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label=" Choose Transaction"
                  className="selectStyle"
                >
                  <MenuItem value="nominee-cams">Nominee-Cams</MenuItem>
                  <MenuItem value="nominee-karvy">Nomine-Karvy</MenuItem>
                  <MenuItem value="aof-cams">Aof-Cams</MenuItem>
                  <MenuItem value="aof-karvy">Aof-Karvy</MenuItem>
                </Select>

          </FormControl>
        </Grid>
        {/* Download Button */}
        <Grid item xs={12} sm={6}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>

          <Button
            className="downBtn" // Apply the CSS class for the download button
            sx={{
              bgcolor: "#242056",
              color: "white",
              border: "none",
            }}
            disabled={!isAllFilesUploaded}
            // onClick={() => handleDownloadFile("SelectedFileType")}
          >
            Download File
          </Button>
        </div>
        </Grid>
      </Grid>
      {/* ... (existing Snackbar and other elements) */}
    </Box>
    </>
  );
}

export default DownlaodFile;
