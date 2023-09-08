import React from "react";
import { Box } from "@mui/material";

function TryIt() {
  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        padding: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // or set a specific height if needed
      }}
    >
      <Box
        sx={{
          borderRadius: "10px",
          backgroundColor: "#ffffff",
          padding: "7rem",
          boxShadow: "4px 4px 4px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          flexDirection: "column",
          textAlign: "center",
          backgroundImage: 'linear-gradient(225deg,#9afe9d,#ccfbfe)'
        }}
      >
        <h2
          style={{
            fontSize: "4vw",
            color: "black",
            fontWeight: "bold",

            fontFamily: '"Montserrat", sans-serif',
          }}
        >
          Try PMAI
        </h2>
        <h4
          style={{
            fontSize: "2rem",
            color: "black",
            fontWeight: "300px",
            fontFamily: '"Montserrat", sans-serif',
            marginBottom: '20px'
          }}
        >
          The Product Management Co-Pilot
        </h4>
        <button
          className="btn"
          style={{
            borderRadius: "0.5rem",
            width: "fit-content",
            fontSize: "16px",
          }}
          variant="contained"
          color="primary"
        >
          Create a Feature
        </button>
      </Box>
    </Box>
  );
}

export default TryIt;
