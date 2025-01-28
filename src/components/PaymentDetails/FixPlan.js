import React, { useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";

const FixPlan = ({ fixPlan, onSubjectSelect, onAmountsChange }) => {
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);


  const handlePlanClick = (index, plan) => {
    let newSelectedIndices = [...selectedIndices];
    let newSelectedProductIds = [...selectedProductIds];
    let updatedAmounts = { maxAmount: 0, minAmount: 0 };

    if (newSelectedIndices.includes(index)) {
      newSelectedIndices = newSelectedIndices.filter((i) => i !== index);
      newSelectedProductIds = newSelectedProductIds.filter(
        (id) => !(plan.productIds || []).includes(id)
      );
    } else if (newSelectedIndices.length < 2) {
      newSelectedIndices.push(index);
      newSelectedProductIds = [
        ...newSelectedProductIds,
        ...(plan.productIds || []),
      ];
    }

    // Calculate total amounts for selected plans
    newSelectedIndices.forEach((i) => {
      const selectedPlan = fixPlan[i];
      if (selectedPlan) {
        updatedAmounts.maxAmount += selectedPlan.maxAmount || 0;
        updatedAmounts.minAmount += selectedPlan.minAmount || 0;
      }
    });

    setSelectedIndices(newSelectedIndices);
    setSelectedProductIds(newSelectedProductIds);
   
    if (onAmountsChange) {
      onAmountsChange(updatedAmounts);
    }
    onSubjectSelect(newSelectedProductIds);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Fix Plan
      </Typography>
      {fixPlan && fixPlan.length > 0 ? (
        <Grid container spacing={2}>
          {fixPlan.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  padding: 2,
                  borderRadius: 2,
                  textAlign: "center",
                  backgroundColor: selectedIndices.includes(index)
                    ? "red"
                    : "#f9f9f9",
                  color: selectedIndices.includes(index) ? "#fff" : "#000",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  pointerEvents:
                    selectedIndices.length >= 2 &&
                    !selectedIndices.includes(index)
                      ? "none"
                      : "auto",
                  opacity:
                    selectedIndices.length >= 2 &&
                    !selectedIndices.includes(index)
                      ? 0.6
                      : 1,
                }}
                onClick={() => handlePlanClick(index, plan)}
              >
                <Typography variant="body1">
                  {plan.subjects && plan.subjects.length > 0
                    ? plan.subjects.join(", ")
                    : "No Subjects Available"}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No plans available
        </Typography>
      )}
    </Box>
  );
};

export default FixPlan;
