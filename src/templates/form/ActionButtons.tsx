"use client";
import {Button} from "@mui/material";

export default function ActionButtons({
                                        prevAction = () => {
                                        }, nextAction = () => {
  }, disablePrev = false, disableNext = false, loadingPrev = false, loadingNext = false,
                                      }: {
  prevAction?: () => void; nextAction?: () => void; disablePrev?: boolean; disableNext?: boolean; loadingPrev?: boolean; loadingNext?: boolean;
}) {
  return (<div className="w-full justify-center items-center m-4">
      <div className="bg-[#F7F7FF] rounded-xl overflow-hidden flex items-center">
        <Button
          variant="contained"
          loading={loadingPrev}
          onClick={prevAction}
          // disabled={disablePrev} //todo دیزیبل موقتی تا زمانی که بیزینس اوکی بشه
          disabled={true}
          sx={{
            width: 120, height: 52, borderRadius: 0, bgcolor: "#1758BA", boxShadow: "none", "&:hover": {bgcolor: "#174AA0"},
          }}
        >
          سوال قبلی
        </Button>

        <div className="flex-1 flex items-center justify-center px-4">
        </div>

        <Button
          variant="contained"
          onClick={nextAction}
          loading={loadingNext}
          disabled={disableNext}
          sx={{
            width: 120, height: 52, borderRadius: 0, bgcolor: "#1758BA", boxShadow: "none", "&:hover": {bgcolor: "#174AA0"},
          }}
        >
          سوال بعدی
        </Button>
      </div>
    </div>);
}
