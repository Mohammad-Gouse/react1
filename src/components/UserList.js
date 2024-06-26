import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import AddingUser from "./AddingUser"; // Import the AddingUser component or form
import { Alert, Grid, Snackbar, Typography } from "@mui/material";
import "./UserList.css";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import TableHeader from "./TableHeader";
import ReactPaginate from 'react-paginate';
import Loader from "./Loader";

function UserList() {
  const [jsonData, setJsonData] = useState({
    payload: [],
    row_count: 0,
  });

  ////
  const [currentPage, setCurrentPage] = useState(0); // Initialize current page to 0
  // Replace with the actual total number of pages

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  /////
  const rowCount = jsonData.row_count

  const [rowCountState, setRowCountState] = useState(rowCount);
  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      rowCount !== undefined ? rowCount : prevRowCountState,
    );
  }, [rowCount, setRowCountState]);

  const [userList, setUserList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]); // State variable to hold the selected user data
  const [data, setData] = useState(null);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [openAlert, setOpenAlert] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [severity, setSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [pageState, setPageState] = useState({
    page: 1,
    pageSize: 25,
    isLoading: false,
    total: 0,
  });

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  // Fetch user list from the backend on component mount
  useEffect(() => {
    setIsLoading(true)
    fetchUserList();
  }, []);
  const buttonText = "Add User";
  const buttonClassName = "addBtn";

  const fetchUserList = () => {
    setIsLoading(true)
    axios
      .get(`${baseUrl}/list-users`)
      .then((response) => {
        setUserList(response.data);
        const rowsWithIds = response.data.payload.map((user) => ({
          ...user,
          id: user.id,
        }));
        setData(rowsWithIds);
        setIsLoading(false)
      })

      .catch((error) => {
        console.error("Error fetching user list:", error);
      });
  };

  const columns = [
    {
      field: "id",
      headerAlign: "center",
      align: "center",
      headerClassName: "headerName",
      headerName: "SrNo",
      minWidth: 70,
      // flex:0.1
    },
    {
      field: "username",
      headerAlign: "left",
      align: "left",
      headerClassName: "headerName",
      headerName: "User Name",
      minWidth: 200,
      flex: 0.1,
    },
    {
      field: "roles",
      headerAlign: "left",
      headerName: "Roles",
      headerClassName: "headerName",
      align: "left",
      minWidth: 200,
      flex: 0.1,
    },
    {
      field: "last_updated",
      headerAlign: "center",
      headerClassName: "headerName",
      align: "center",
      headerName: "Updated At",
      minWidth: 200,
      flex: 0.1,
    },
    {
      field: "updated_by",
      headerAlign: "center",
      headerClassName: "headerName",
      align: "center",
      headerName: "Updated By",
      minWidth: 200,
      flex: 0.1,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      headerClassName: "headerName",
      align: "center",
      minWidth: 150,
      flex: 0.1,
      renderCell: (params) => (
        <>
          <EditIcon
            onClick={() => handleEditUser(params.row.id)}
            style={{ cursor: "pointer", marginRight: "8px", color: "#3f51b5" }}
          />
          <DeleteIcon
            onClick={() => handleDeleteUser(params.row.id)}
            style={{ cursor: "pointer", color: "#3f51b5" }}
          />
        </>
      ),
    },
  ];
  const handleEditUser = (userId) => {
    axios
      .get(`${baseUrl}/get-user/${userId}`)
      .then((res) => {
        console.log("User updated successfully.");
        console.log("User data retrieved successfully:", res.data);
        setSelectedUser(res.data); // Set the retrieved user data in the selectedUser state
        setOpenDialog(true); // Open the dialog
        setIsLoading(false);
        // setSnackbarMessage(res.data.message);
        // setSeverity("success");
        // setOpenAlert(true);
      })
      .catch((err) => {
        console.log("Error updating user:", err);
        setIsLoading(false);
        // setSnackbarMessage(err.response.data.message);
        // setSeverity("success");
        // setOpenAlert(true);
      });
  };
  const handleDeleteUser = (userId) => {
    setOpenConfirmDialog(true);
    setSelectedUser(userId);
  };
  const handleConfirmDelete = () => {
    setOpenConfirmDialog(false);

    axios
      .delete(`${baseUrl}/delete-user/${selectedUser}`)
      .then((res) => {
        console.log("User deleted successfully.");
        // After deleting the user, update the user list to reflect the changes
        const updatedUserList = jsonData.payload.filter((user) => user.id !== selectedUser);
        setUserList(updatedUserList);
        // If you want to update the DataGrid as well, update the 'data' state
        setData((prevData) => prevData.filter((user) => user.id !== selectedUser));
        setIsLoading(false);
        setSnackbarMessage(res.data.message);
        setSeverity("success");
        setOpenAlert(true);
        window.location.reload();

      })
      .catch((err) => {
        console.error("Error deleting user:", err);
        setIsLoading(false);
        setSnackbarMessage(err.response.data.message);
        setSeverity("error");
        setOpenAlert(true);
      });
  };


  // Transform the user list data to match the data grid row format
  // const rows = userList.map((user) => ({
  //   id: user.id,
  //   username: user.userName,
  //   roles: user.roles.join(", "), // Assuming roles is an array of strings
  // }));
  const handleOpenDialog = () => {
    setSelectedUser(null); // Reset the selected user data when opening the dialog for adding a new user
    setOpenDialog(true);
  };


  const handleCloseDialog = (updated) => {
    setOpenDialog(false);
    if (updated) {
      fetchUserList();
    }
    setOpenConfirmDialog(false);
  };

  ////new poa
  const [pageCount, setPageCount] = useState(0);

  let limit = 7;

  useEffect(() => {
    setLoading(true)
    const getPoaList = async () => {
      const res = await fetch(
        `${baseUrl}/list-users?page=1&per_page=${limit}`
      );
      const data = await res.json();
      const total = data.row_count
      setPageCount(Math.ceil(total / limit))
      setJsonData(data);
      setLoading(false)
    };

    getPoaList();
  }, []);

  // console.log(items);
  const total = jsonData.row_count
  console.log("total", total)

  const fetchPoaList = async (currentPage) => {
    setLoading(true)
    const res = await fetch(
      `${baseUrl}/list-users?page=${currentPage}&per_page=${limit}`
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

  console.log("pagecount: ", pageCount)

  return (
    <>
      <Header showAdmin={true} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
            width: "70%",
            // maxHeight:"50% !important",
            // overflow:"auto"

          }}
        >
          {/* <Grid sx={{ padding: "30px" }}>
            <Button
              onClick={handleOpenDialog}
              className="addBtn"
              style={{
                position: "absolute",
                top: "80px",
                right: "200px",
                margin: "10px 0",
                fontSize:"12px !important",
                // padding: "5px 40px",
                borderRadius: "10px",
                // bgcolor: "#3f51b5 !important",
                // color:"white "
              }}
            >
              Add User
            </Button>
          </Grid> */}
          <TableHeader buttonText={buttonText} buttonClassName={buttonClassName} handleOpenDialog={handleOpenDialog} />
          {data ? (
            <Grid
              sx={{

                width: "100%",
                bgcolor: "#fff",
                height: "55vh",
                // overflowY:"scroll",
                "& .headerName": {
                  bgcolor: "#eae6e6",
                  font: "bold !important",
                  fontSize: "14px",
                },
              }}
            >
              <DataGrid
                rows={jsonData.payload}
                columns={columns}
                pagination
                pageSizeOptions={[10, 25, 50, 100]}
                {...jsonData}
                initialState={{
                  ...jsonData.initialState,
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
              />


            </Grid>

          ) : null}
        </Grid>
      </div>
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

      <Dialog
        open={openDialog}
        // width={}
        // sx={{maxWidth:""}}
        maxWidth="md"
      // onClose={handleCloseDialog}
      >
        <Grid sx={{ display: "flex" }}>

          <DialogActions>
            <Typography
              flex={1}
              variant="h6"
              sx={{ fontWeight: "bold", color: "common.black", mt: 1, ml: 2 }}
            >
              Add User
            </Typography>
            <IconButton onClick={handleCloseDialog} sx={{ position: 'absolute', right: '30px', top: '10px' }} flex={1}>
              <ClearIcon sx={{ fontSize: "1.5em" }} />
            </IconButton>
          </DialogActions>
        </Grid>
        <DialogContent>
          {/* Render the AddingUser form inside the Dialog */}
          {/* {console.log({selectedUser})} */}
          <AddingUser
            user={selectedUser} //pasing row details of selected user
            onClose={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
    </>
  );
}

export default UserList;
