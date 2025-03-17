import { Box, Grid2, IconButton, Typography } from "@mui/material";
import { ReactNode } from "react";

interface IProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  hasTab?: boolean;
  component?: ReactNode;
  leftComponent?: ReactNode;
  CB_onClick: () => void;
}

export default function PrerequestHeader({
  title,
  icon,
  children,
  hasTab = false,
  component,
  CB_onClick = () => {},
  leftComponent = null,
}: IProps) {
  return (
    <Grid2
      container
      // direction="column"
      sx={{
        // height: "100vh",
        backgroundColor: "white",
        width: "inherit",
        position: "relative",
      }}
    >
      <Grid2
        // item
        sx={{
          bgcolor: "#F7F7FF",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          p: 1.2,
          paddingBottom: hasTab ? 0 : "auto",
          position: "sticky",
          top: 0,
          width: "100%",
          borderRadius: "0.625rem",
        }}
      >
        <Grid2
          // item
          // xs={12}
          sx={{ bgcolor: "#F7F7FF", display: "flex", flexDirection: "row" }}
        >
          <Grid2
          //  item
          >
            <IconButton sx={{ mr: 1 }} onClick={CB_onClick}>
              {icon}
            </IconButton>
          </Grid2>
          <Grid2
            // item
            display={"flex"}
            alignItems={"center"}
            width={"100%"}
            justifyContent={leftComponent ? "space-between" : "flex-start"}
          >
            <Typography color={"#2A2A2A"}>{title}</Typography>
            {leftComponent}
          </Grid2>
        </Grid2>
        {hasTab ? component : null}
      </Grid2>

      <Grid2 
      // item xs={12}
      >
        {children}
      </Grid2>
    </Grid2>
  );
}
