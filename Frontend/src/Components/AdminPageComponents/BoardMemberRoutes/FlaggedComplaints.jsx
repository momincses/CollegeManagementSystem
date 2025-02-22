import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

const API_BASE_URL = "http://localhost:5000/api/events";

const PublicComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(""); 
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentComplaint, setCurrentComplaint] = useState(null);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setError("User not authenticated");
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/get-flagged-complaints`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch complaints");

            const data = await response.json();
            setComplaints(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 🛠 Handle Delete
    const handleDelete = async (id) => {
        // console.log(id);
        if (!window.confirm("Are you sure you want to delete this complaint?")) return;

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${API_BASE_URL}/delete-complaint/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to delete complaint");

            setComplaints(complaints.filter(complaint => complaint._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    // 🛠 Open Edit Dialog
    const handleEditOpen = (complaint) => {
        // console.log(complaint)
        setCurrentComplaint(complaint);
        setEditDialogOpen(true);
    };

    // 🛠 Close Edit Dialog
    const handleEditClose = () => {
        setEditDialogOpen(false);
        setCurrentComplaint(null);
    };

    // 🛠 Handle Edit Submission
    const handleEditSubmit = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${API_BASE_URL}/modify-complaint`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(currentComplaint),
            });
            
            if (!response.ok) throw new Error("Failed to update complaint");

            setComplaints(complaints.map(c => (c._id === currentComplaint._id ? currentComplaint : c)));
            handleEditClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h5" gutterBottom>User Inappropriate Complaints</Typography>

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Title</b></TableCell>
                                <TableCell><b>Description</b></TableCell>
                                <TableCell><b>Category</b></TableCell>
                                <TableCell><b>Status</b></TableCell>
                                <TableCell><b>Moderation</b></TableCell>
                                <TableCell><b>Date</b></TableCell>
                                <TableCell><b>Actions</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {complaints.length > 0 ? (
                                complaints.map((complaint) => (
                                    <TableRow key={complaint._id}>
                                        <TableCell>{complaint.title}</TableCell>
                                        <TableCell>{complaint.description}</TableCell>
                                        <TableCell>{complaint.category}</TableCell>
                                        <TableCell>{complaint.status}</TableCell>
                                        <TableCell sx={{ color: "red" }}>{complaint.moderation_status}</TableCell>
                                        <TableCell>{new Date(complaint.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Button variant="outlined" color="primary" onClick={() => handleEditOpen(complaint)}>Edit</Button>
                                            <Button variant="outlined" color="error" onClick={() => handleDelete(complaint._id)} style={{ marginLeft: "10px" }}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No complaints found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Edit Complaint Dialog */}
            {currentComplaint && (
                <Dialog open={editDialogOpen} onClose={handleEditClose}>
                    <DialogTitle>Edit Complaint</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Title"
                            fullWidth
                            margin="normal"
                            value={currentComplaint.title}
                            onChange={(e) => setCurrentComplaint({ ...currentComplaint, title: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            margin="normal"
                            value={currentComplaint.description}
                            onChange={(e) => setCurrentComplaint({ ...currentComplaint, description: e.target.value })}
                        />
                        <TextField
                            label="Category"
                            fullWidth
                            margin="normal"
                            value={currentComplaint.category}
                            onChange={(e) => setCurrentComplaint({ ...currentComplaint, category: e.target.value })}
                        />
                        <TextField
                            label="Status"
                            fullWidth
                            margin="normal"
                            value={currentComplaint.status}
                            onChange={(e) => setCurrentComplaint({ ...currentComplaint, status: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditClose} color="secondary">Cancel</Button>
                        <Button onClick={handleEditSubmit} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
};

export default PublicComplaints;
