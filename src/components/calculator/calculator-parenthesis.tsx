"use client";
import {Button} from "@mui/material";


interface IParenthesis {
    operator: string
    handleParenthesis: (content?: any, type?: any) => void
    idx?: number
}


const CalculatorParenthesis = ({ operator, handleParenthesis, idx }: IParenthesis) => {
    return (

        <Button sx={{ border: '1px solid white', width: 30, height: 30, minWidth: 30, color: "#1758BA", backgroundColor: "#1758BA1A", margin: "2px", fontWeight: 600,borderRadius: '8px' }}
            onClick={() => handleParenthesis(operator, "OPERATOR")} key={idx}>
            {operator}

        </Button>

    );
}

export default CalculatorParenthesis;