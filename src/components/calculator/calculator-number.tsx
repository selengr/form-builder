import { Button } from "@mui/material";

interface ICalculatorNumber {
    number: string
    handleOperator: (content: string, type: string) => void
    idx?: number | any
}

const CalculatorNumber = ({ number, handleOperator, idx }: ICalculatorNumber) => {
    return (


        <Button sx={{
            border: '1px solid white', width: number === "0" ? 64 : 30, height: 30, minWidth: number === "0" ? 64 : 30, color: "#1758BA", backgroundColor: "#1758BA1A", margin: "2px",
            fontWeight: 600,borderRadius: '8px'
        }}
            onClick={() => handleOperator(number, "NUMBER")}
            key={idx}
        >
            {number}
        </Button>


    );
}

export default CalculatorNumber;