import './AlertMessage.css';
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const AlertMessage = (props) => {
    const [openAlert, setOpenAlert] = useState(false);
    const { status } = props;

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    useEffect(() => {
        setOpenAlert(true);
    }, [])

    return (
        <>
            {
                status === "loginsuccess" &&
                <Snackbar
                    anchorOrigin={{
                        horizontal: "center",
                        vertical: "bottom",
                    }}
                    open={openAlert} autoHideDuration={3000} onClose={handleCloseAlert}>
                    <Alert
                        className="successAlert"
                        onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
                        Login Successfull
                    </Alert>
                </Snackbar>
            }
        </>
    );
}

export default AlertMessage