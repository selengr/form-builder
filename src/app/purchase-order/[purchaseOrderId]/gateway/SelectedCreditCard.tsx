"use client";

import Image from "next/image";
import type {SelectedCreditCardProps} from "./types";
import {formatNumberWithCommas} from "@/lib/numberFormatter";
import {Box, IconButton, Typography, useTheme} from "@mui/material";
import TrashIcon from "@/../public/images/purchase-order/trashMts.svg";

export function SelectedCreditCard({
  availableAmount = 0,
  creditTypeValue,
  onDelete,
  remainedCredit = 0,
}: SelectedCreditCardProps) {
  const { palette } = useTheme();

  return (  
    <Box
      border="1px solid #DDE1E6"
      padding="0.7rem 0.6rem"
      marginY="0.5rem"
      borderRadius="12px"
    >
      <Box display="flex" alignItems="center" marginBottom="0.2rem">
        <Typography variant="body2" marginLeft="0.3rem">
          اعتبار {creditTypeValue} استفاده شده :
        </Typography>
        <Typography
          variant="body1"
          fontWeight="bold"
          color={palette.primary.main}
        >
          {formatNumberWithCommas(
            Math.min(
              availableAmount,
              availableAmount - remainedCredit
            ).toString()
          )}
          تومان
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" flexWrap="wrap">
        <Typography variant="body2" marginLeft="0.3rem" whiteSpace="nowrap">
          باقیمانده اعتبار :
        </Typography>
        <Typography
          variant="body1"
          fontWeight="bold"
          color={palette.primary.main}
          whiteSpace="nowrap"
        >
          {formatNumberWithCommas(remainedCredit.toString())} تومان
        </Typography>
        <IconButton onClick={() => onDelete()} sx={{ marginLeft: "auto" }}>
          <Image src={TrashIcon} alt="trash" />
        </IconButton>
      </Box>
    </Box>
  );
}
