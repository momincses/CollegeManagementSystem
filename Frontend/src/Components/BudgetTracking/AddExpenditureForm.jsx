import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Paper,
} from "@mui/material";
import { AddCircle, Delete, CloudUpload } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Cloudinary configuration
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/deegscbvr/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "momincses";
const BASE_URL = "http://localhost:5000";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflowY: "auto",
};

const AddExpenditureForm = ({ closePopup, expenditureId }) => {
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("coordinatorAuthToken");
    const decodedUser = jwtDecode(token);
    const email = decodedUser.email;
    setUserEmail(email);
    setExpenditures([
      {
        amountSpent: "",
        description: "",
        receiptImageUrl: "",
        updatedBy: email,
        dateOfUpdate: new Date().toISOString(),
      },
    ]);
  }, []);

  const handleAddExpenditureField = () => {
    setExpenditures((prev) => [
      ...prev,
      {
        amountSpent: "",
        description: "",
        receiptImageUrl: "",
        updatedBy: userEmail,
        dateOfUpdate: new Date().toISOString(),
      },
    ]);
  };

  const handleRemoveExpenditureField = (index) => {
    const updated = [...expenditures];
    updated.splice(index, 1);
    setExpenditures(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...expenditures];
    updated[index][field] = value;
    setExpenditures(updated);
  };

  // ✅ Handle Cloudinary Image Upload
  const handleImageUpload = async (file, index) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    try {
      setLoading(true);
      const response = await axios.post(CLOUDINARY_URL, formData);
      const updated = [...expenditures];
      updated[index].receiptImageUrl = response.data.secure_url;
      setExpenditures(updated);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Submit all expenditure entries to backend
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/expenditures/${expenditureId}/add-entry`,
        { entries: expenditures } // Wrap in "entries" object for backend compatibility
      );
      if (response.status === 200) {
        alert("Expenditures added successfully!");
        closePopup();
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to add expenditures:", error);
      alert("Failed to add expenditures.");
    }
  };

  return (
    <Modal open={true} onClose={closePopup}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Add Expenditures
        </Typography>

        {expenditures.map((exp, index) => (
          <Paper key={index} elevation={2} sx={{ p: 2, mb: 2, borderRadius: 2, position: "relative" }}>
            {expenditures.length > 1 && (
              <IconButton
                color="error"
                sx={{ position: "absolute", top: 5, right: 5 }}
                onClick={() => handleRemoveExpenditureField(index)}
              >
                <Delete />
              </IconButton>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Amount Spent (₹)"
                  variant="outlined"
                  type="number"
                  fullWidth
                  required
                  value={exp.amountSpent}
                  onChange={(e) => handleChange(index, "amountSpent", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  value={exp.description}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  fullWidth
                  component="label"
                  startIcon={<CloudUpload />}
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload Receipt"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleImageUpload(e.target.files[0], index)}
                  />
                </Button>
                {exp.receiptImageUrl && (
                  <Typography variant="body2" sx={{ mt: 1 }} color="green">
                    Receipt Uploaded ✔
                  </Typography>
                )}
              </Grid>
              <Grid item xs={6}>
                <TextField label="Updated By" variant="filled" fullWidth value={exp.updatedBy} InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Date of Update" variant="filled" fullWidth value={exp.dateOfUpdate} InputProps={{ readOnly: true }} />
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Button variant="contained" startIcon={<AddCircle />} onClick={handleAddExpenditureField} sx={{ mt: 2 }}>
          Add More Expense
        </Button>

        <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Grid item>
            <Button variant="outlined" onClick={closePopup}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              disabled={loading || expenditures.some((exp) => !exp.amountSpent)}
            >
              Submit All
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default AddExpenditureForm;
