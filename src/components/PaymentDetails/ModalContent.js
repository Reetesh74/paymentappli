// src/components/PaymentDetails/ModalContent.js
import React from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
const ModalContent = ({ formValues, subjects, onConfirm, onClose }) => {
    const getSubjectNames = (ids) => {
      return ids
        .map((id) => {
          const subject = subjects.find((subject) => subject._id === id);
          return subject ? subject.name : `Unknown (${id})`;
        })
        .join(", ");
    };
  
    return (
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" id="modal-title" gutterBottom>
          Confirm Your Details
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Plan Type"
              secondary={formValues.planType || "N/A"}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Validity"
              secondary={formValues.period || "N/A"}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Class" secondary={formValues.class || "N/A"} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Board" secondary={formValues.board || "N/A"} />
          </ListItem>
          <ListItem>
            <ListItemText primary="State" secondary={formValues.state || "N/A"} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Subjects"
              secondary={
                formValues.productIds && formValues.productIds.length > 0
                  ? getSubjectNames(formValues.productIds)
                  : "No Subjects Selected"
              }
            />
          </ListItem>
        </List>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <Button onClick={onConfirm} color="primary" variant="contained">
            Confirm
          </Button>
          <Button onClick={onClose} color="secondary" variant="outlined">
            Close
          </Button>
        </Box>
      </Box>
    );
  };
  
  export default ModalContent;
  