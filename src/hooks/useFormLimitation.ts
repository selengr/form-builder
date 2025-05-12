import {useState} from "react";
import AxiosApi from "@/services/axios/AxiosApi";
import {useParams} from "next/navigation";
import {ILimitation} from "@/hooks/useParticipateForm";

export const useFormLimitation = (
  type: "" | "phone" | "email",
  setLimitation: (limitation: ILimitation) => void,
  setQuestion: (data: any) => void,
  addQuestion: (data: any) => void
) => {
  const [formValue, setFormValue] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [loading, setLoading] = useState(false);

  const {slug} = useParams<{ slug: string }>();

  const validatePhone = (phone: string) => /^09\d{9}$/.test(phone);
  const validateEmail = (email: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.toLowerCase());

  const handleChange = (value: string) => {
    setFormValue(value);

    if (type === "phone") {
      if (!validatePhone(value)) {
        if (value.length === 0) {
          setError(true);
          setHelperText("شماره موبایل الزامی است");
        } else if (value.length < 11) {
          setError(true);
          setHelperText("شماره موبایل باید 11 رقم باشد");
        } else {
          setError(true);
          setHelperText("شماره موبایل باید با '09' شروع شود");
        }
      } else {
        setError(false);
        setHelperText("");
      }
    } else {
      if (value.length === 0) {
        setError(true);
        setHelperText("ایمیل الزامی است");
      } else if (!validateEmail(value)) {
        setError(true);
        setHelperText("فرمت ایمیل صحیح نمی‌باشد");
      } else {
        setError(false);
        setHelperText("");
      }
    }
  };

  const handleSubmit = () => {
    setError(true);
    setHelperText(type === "phone" ? "شماره تلفن همراه الزامی می‌باشد" : "ایمیل الزامی است");
  };

  const takePartApi = async () => {
    try {
      setLoading(true);
      const response = await AxiosApi.post("/take-part/check-answer-to-form-before", {
        link: slug.startsWith("public-") ? slug : null,
        formId: !slug.startsWith("public-") ? slug : null,
        username: formValue,
      });

      addQuestion(response);
      setQuestion(response.data);
      setLimitation({isLimited: false, limitationType: ""});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isValid = type === "phone" ? validatePhone(formValue) : validateEmail(formValue);

  return {
    formValue,
    error,
    helperText,
    loading,
    handleChange,
    handleSubmit,
    takePartApi,
    isValid,
  };
};
