import { Button } from "@mui/material";


interface IParenthesis {
    operator: string
    handleParenthesis: (content?: string, type?: string) => void
    idx?: number
}


const CalculatorParenthesis = ({ operator, handleParenthesis, idx }: IParenthesis) => {
    return (

        <Button sx={{ border: '1px solid white', width: 33, height: 33, minWidth: 33, color: "#1758BA", backgroundColor: "#1758BA1A", margin: "2px", fontWeight: 500 }}
            onClick={() => handleParenthesis(operator, "OPERATOR")} key={idx}>
            {operator}

        </Button>

    );
}

export default CalculatorParenthesis;