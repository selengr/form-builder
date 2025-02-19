import { motion } from "framer-motion";
import { ElementsType, FormElements } from "../../types/FormElements";
import { useResponsive } from "@/hooks/useResponsive";
import usePreview from "@/hooks/usePreview";

export default function PreviewQuestion() {
  const isMobile = useResponsive("down", "md");
  const { questions, index } = usePreview();
  const question = questions.at(index);

  const FormComponent =
    FormElements[question?.questionType as ElementsType]?.formComponent;

  return (
    <motion.div
      key={Math.random()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ ease: "easeOut", duration: 1 }}
      style={{
        width: "100%",
        margin: "2rem 0",
        maxHeight: "5000px",
        borderRadius: "10px",
        padding: isMobile ? "1rem 2rem" : "2rem 3rem",
        height: "100%",
        display: "flex",
        justifyContent: "flex-start",
        border: "1px solid #e5e5e5",
      }}
    >
      <FormComponent
        elementInstance={question}
        // ^ check
        onChange={null as any}
        error=""
        value=""
      />
    </motion.div>
  );
}
