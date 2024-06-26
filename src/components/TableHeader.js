import React from "react";
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import './TableHeader.css';
function TableHeader({handleOpenDialog,buttonClassName,buttonText}) {
  return (
    <Box
      sx={{
        // p: 2,
        // pb: 3,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
   

      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <Button
        className={buttonClassName}
        //   disabled={!trust.allowAdd}
          sx={{ m:2 }}
          onClick={handleOpenDialog}
        
        >
  {buttonText}
        </Button>
      </Box>
    </Box>
  );
}

export default TableHeader;
