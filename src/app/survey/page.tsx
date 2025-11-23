"use client";

import { useState } from "react";
import { Dialog, Button, Box } from "@mui/material";

export default function BuilderModal() {
  const [config, setConfig] = useState({
    open: false,
    width: "600px",
    height: "500px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  });

  const openModal = (options: Partial<typeof config>) => {
    setConfig({ ...config, ...options, open: true });
  };

  const closeModal = () => {
    setConfig({ ...config, open: false });
  };

  return (
    <>
      {/* BUTTONS */}
      <div className="flex gap-4 p-4 flex-wrap">
        <Button
          sx={{
            width:"170px",
            height: "40px"
          }}
          variant="contained"
          onClick={() =>
            openModal({
              width: "400px",
              height: "400px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            })
          }
        >
          Small Center Modal
        </Button>

        <Button
          sx={{
            width:"170px",
            height: "40px"
          }}
          variant="contained"
          onClick={() =>
            openModal({
              width: "800px",
              height: "600px",
              top: "10%",
              left: "50%",
              transform: "translateX(-50%)",
            })
          }
        >
          Large Top Modal
        </Button>

        <Button
          sx={{
            width:"170px",
            height: "40px"
          }}
          variant="contained"
          onClick={() =>
            openModal({
              width: "600px",
              height: "500px",
              top: "50%",
              left: "10%",
              transform: "translateY(-50%)",
            })
          }
        >
          Left Side Modal
        </Button>

        <Button
          sx={{
            width:"170px",
            height: "40px"
          }}
          variant="contained"
          onClick={() =>
            openModal({
              width: "600px",
              height: "500px",
              top: "50%",
              left: "90%",
              transform: "translate(-100%, -50%)",
            })
          }
        >
          Right Side Modal
        </Button>
      </div>

      <Dialog
        open={config.open}
        onClose={closeModal}
        PaperProps={{
          sx: {
            width: config.width,
            height: config.height,
            maxWidth: "none",
            position: "absolute",
            top: config.top,
            left: config.left,
            transform: config.transform,
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{ width: "100%", height: "100%" }}>
          <iframe
            src="http://mbz2.ir/form/5265?survey=PSYA"
            style={{ width: "100%", height: "100%", border: "none" }}
            title="Builder"
            allowFullScreen
          />
        </Box>
      </Dialog>
    </>
  );
}
