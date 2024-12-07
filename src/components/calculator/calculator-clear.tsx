import Iconify from "@/components/iconify/Iconify";
import { Button } from "@mui/material";

interface ICalculatorClear {
    handleClear: () => void
}

const CalculatorClear = ({ handleClear }: ICalculatorClear) => {
    return (
        <>

            <Button sx={{
                border: '1px solid white', width: 70, minWidth: 70, height: 33, color: "#FA4D56", backgroundColor: "#FA4D561A", margin: "2px",
                '&.MuiButtonBase-root:hover': {
                    backgroundColor: "#FA4D561A"
                },
                fontWeight: 500
            }}
                onClick={handleClear}
            >

                <Iconify icon="ion:arrow-back-outline" sx={{ width: 25, height: 25, color: "#FA4D56" }} />
            </Button >


        </>
    );
}

export default CalculatorClear;