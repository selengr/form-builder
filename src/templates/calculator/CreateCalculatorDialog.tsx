"use client";

import { CgClose } from "react-icons/cg";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import AdvancedFormulaEditor from "@/components/AdvancedFormulaEditor";
import { IconButton } from "@mui/material";



const CreateCalculatorDialog = ({ open, setOpen }: { open: boolean,
setOpen: any }) => {



const handleClose = () => {
setOpen((prev) => !prev);
};

return (
<Dialog
open={open}
dir="ltr"
maxWidth="md"
sx={{
overflow: "hidden",
scrollbarWidth: "none",
"& .MuiPaper-root": {
borderRadius: "24px",
margin: "10px",
},
"& .MuiDialog-container": {
backdropFilter: "blur(4px)",
backgroundColor: "hsl(0deg 0% 100% / 50%)",
},
}}
>

<DialogContent
dir="rtl"
sx={{
maxHeight: "75vh",
scrollbarWidth: "thin",
maxWidth: "100%",
paddingX: 3.8,
paddingBottom: 3.8,
paddingTop: 3.8,
}}
>
<div className="flex items-center justify-end h-6">
<IconButton edge="end">
<CgClose color="#404040" width={25} height={20}
size="1.5rem"
onClick={() => handleClose()}
/>
</IconButton>

</div>
<AdvancedFormulaEditor />

</DialogContent>

</Dialog >
);
}

export default CreateCalculatorDialog;