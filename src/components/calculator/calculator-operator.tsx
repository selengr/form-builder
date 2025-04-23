import { Button } from "@mui/material";


interface ICalculatorNumber {
    operator: string
    handleOperator: (content: string, type: string) => void
    index?: number
}


const CalculatorNumber = ({ operator, handleOperator, index }: ICalculatorNumber) => {
    return (
        <>

            <Button sx={{ border: '1px solid white', width: 30, height: 30, minWidth: 30, color: "#1758BA", backgroundColor: "#1758BA1A", margin: "2px", fontWeight: 600,borderRadius: '8px' }}
                onClick={() => handleOperator(operator, "OPERATOR")} key={index}>
                {operator as string}

            </Button>


        </>
    );
}

export default CalculatorNumber;