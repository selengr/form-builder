"use client";

import { useState } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TabData } from "@/data/home-page/Tab.constant";
import { Button } from "@mui/material";
import { AllData } from "@/data/home-page";
import IconButton from "@mui/material/IconButton";
import { IoIosArrowDown } from "react-icons/io";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

export default function CollapsibleMenu() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const filterMenu = () => {
    if (activeTab === 0) return AllData;
    const filterData = AllData.filter((item) => item.id === activeTab);
    return filterData;
  };
  const showMenu = filterMenu();

  return (
    <Stack>
      <Box
        overflow="hidden"
        display="flex"
        flexDirection="row"
        my="15px"
        sx={{
          overflowX: "scroll",
          "&::-webkit-scrollbar": {
            height: "3px !important",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#0000001f !important",
          },
        }}
      >
        {TabData.map((itemTab) => (
          <Box className="mx-[6px]" key={itemTab.id}>
            <Button
              onClick={() => setActiveTab(itemTab.id)}
              sx={{
                bgcolor: itemTab.id === activeTab ? "#96FAEE" : "#FFF",
                borderRadius: "20px",
                color: itemTab.id === activeTab ? "#00A692" : "#000",
                fontSize: "11px",
                width: "auto",
                whiteSpace: "nowrap",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                boxSizing: "border-box",
                padding: "5px 20px 5px 5px",
                border: "1px solid transparent",
                "&:hover": {
                  bgcolor: itemTab.id === activeTab ? "#96FAEE" : "#FFF",
                  border: "1px solid #00A692",
                },
              }}
            >
              <Box display="flex" ml={!itemTab.activeIcon ? "10px" : ""}>
                {itemTab.notActiveIcon && (
                  <Image
                    src={
                      activeTab === itemTab.id
                        ? itemTab.activeIcon
                        : itemTab.notActiveIcon
                    }
                    width={20}
                    height={20}
                    alt="filter"
                    style={{ marginLeft: "10px" }}
                  />
                )}
                <Typography
                  variant="subtitle2"
                  fontSize="12px"
                  textAlign="center"
                >
                  {itemTab.title}
                </Typography>
              </Box>
            </Button>
          </Box>
        ))}
      </Box>
      <Box
        overflow="hidden"
        sx={{
          overflowY: "scroll",
          paddingTop: 0,
          paddingBottom: "50px",
          marginTop: "8px",
          height: "calc(100vh - 188px)",
          "&::-webkit-scrollbar": {
            width: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#0000001f !important",
          },
        }}
      >
        {showMenu.map((itemMenu, index) => (
          <Accordion
            key={index}
            defaultExpanded={true}
            sx={{
              my: "5px",
              boxShadow: "none",
              "&.MuiPaper-root": {
                borderRadius: "16px",
                "&::before": {
                  display: "none",
                },
                "& .MuiButtonBase-root": {
                  maxHeight: "50px",
                },
              },
            }}
          >
            <AccordionSummary>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Typography fontSize="14px" fontWeight="700">
                  {itemMenu.name}
                </Typography>
                <IconButton>
                  <IoIosArrowDown color="#000" size="1.15rem" />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                display="grid"
                gridTemplateColumns="repeat(4,1fr)"
                alignItems="center"
                rowGap="10px"
              >
                {itemMenu.data?.map(
                  (itemData, index) =>
                    itemData?.show && (
                      <div
                        key={index}
                        className="flex flex-col justify-start gap-[10px] items-center h-full cursor-pointer"
                      >
                        <div>
                          <Image
                            src={itemData.icon}
                            width={60}
                            height={60}
                            alt={itemData.title}
                          />
                        </div>
                        <div className="w-[70px]">
                          <p className="text-center text-[10px] font-bold whitespace-normal">
                            {itemData.title}
                          </p>
                        </div>
                      </div>
                    )
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Stack>
  );
}
