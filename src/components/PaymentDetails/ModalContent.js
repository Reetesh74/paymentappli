import React from "react";
import { Box, Button, Typography, Grid } from "@mui/material";

const ModalContent = ({
  formValues,
  subjects,
  onConfirm,
  courses,
  onClose,
  allSubjects,
  skillSubject,
}) => {
  const getSubjectNames = (ids) => {
    // debugger
    // console.log("allSubjects==uuuuuuuuuuu ", allSubjects);
    // console.log("skillSubject==uuuuuuuuuuu ", skillSubject);
    // console.log("skillSubject==subject", subjects);
    const subjectlist=subjects.concat(skillSubject)
    // console.log("llllllllllllllllll",subjectlist)
    return ids
      .map((id) => {
        const subject = subjectlist.find((subject) => subject._id === id);
        console.log("subjectdatacheck", subject);
        console.log("subject.name", subject ? subject.name : `Unknown (${id})`);
        return subject ? subject.name : `Unknown (${id})`;
      })
      .join(", ");
  };

  // console.log("allSubjects== ", allSubjects);
  // console.log("course name this is the best ", courses);
  const getCourseName = (id) => {
    console.log("ids ", id);
    const course = courses.find((course) => course.value === id);
    return course ? course.label : `Unknown (${id})`;
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
      {/* <Typography
        variant="h6"
        component="h2"
        id="modal-title"
        sx={{ color: "#64748B" }}
        gutterBottom
      >
        Confirm Your Details
      </Typography> */}
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: 1,
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{ color: "#64748B" }}
            >
              Course Type:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" sx={{ color: "#64748B" }}>
              {formValues.courseType
                ? getCourseName(formValues.courseType)
                : "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{ color: "#64748B" }}
            >
              Tenure
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" sx={{ color: "#64748B" }}>
              {formValues.period || "N/A"}
            </Typography>
          </Grid>

          {formValues.class && (
            <>
              <Grid item xs={6}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ color: "#64748B" }}
                >
                  Class:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ color: "#64748B" }}>
                  {formValues.class}
                </Typography>
              </Grid>
            </>
          )}

          <Grid item xs={6}>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{ color: "#64748B" }}
            >
              Board:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" sx={{ color: "#64748B" }}>
              {formValues.board || "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{ color: "#64748B" }}
            >
              Price:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" sx={{ color: "#64748B" }}>
              {formValues.amount || "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{ color: "#64748B" }}
            >
              Subjects:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" sx={{ color: "#64748B" }}>
              {allSubjects && allSubjects.length > 0
                ? getSubjectNames(allSubjects)
                : "No Subjects Selected"}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#94A3B8",
            color: "rgb(100, 116, 139)",
          }}
        >
          Close
        </Button>

        <Button
          onClick={onConfirm}
          color="primary"
          variant="contained"
          sx={{
            backgroundColor: "#18508C",
          }}
        >
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default ModalContent;
