import { motion } from "framer-motion";
import { ElementsType, FormElements } from "@/types/FormElements";
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
      key={question?.questionId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: "easeInOut", duration: 1 }}
      className={`
        w-full h-full 
        flex align-middle 
        rounded-xl 
        my-8
        ${isMobile ? "p-8" : "p-12"} 
      `}
    >
      {FormComponent && (
        <FormComponent elementInstance={question} isPreview={true} />
      )}
    </motion.div>
  );
}
