import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  FormControl,
  Typography,
} from "@mui/material";

const CustomDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  fields,
  onChange,
  isLoading,
  message,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      {/* <DialogTitle>{message}</DialogTitle> */}
      {/* <Typography>message</Typography> */}
      <DialogContent>
        {fields.map((field) => {
          if (field.type === "autocomplete") {
            return (
              <FormControl key={field.name} fullWidth margin="dense">
                <Autocomplete
                  multiple
                  options={field.options || []}
                  getOptionLabel={(option) => option.name || ""}
                  isOptionEqualToValue={(option, value) => {
                    return option._id === value._id;
                  }}
                  value={field.value || []}
                  onChange={(e, newValue) => {
                    onChange(field.name, newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={field.label} margin="dense" />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option._id}>
                      {option.name}
                    </li>
                  )}
                />
              </FormControl>
            );
          }

          return (
            <React.Fragment key={field.name}>
              {message && <Typography>{message}</Typography>}
              <TextField
                autoFocus={field.name === fields[0].name}
                margin="dense"
                label={field.label}
                type={field.type || "text"}
                fullWidth
                value={field.value || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
              />
            </React.Fragment>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onSubmit} color="primary" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
