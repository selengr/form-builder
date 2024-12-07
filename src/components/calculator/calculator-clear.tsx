
import { Button } from "@mui/material";
import Image from "next/image";

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

        <Image
            src={"/images/home-page/arrow-left.svg"}
            width={25}
            height={25} alt="" 
        />

            </Button >


        </>
    );
}

export default CalculatorClear;