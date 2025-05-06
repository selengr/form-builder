"use client";
import {memo, useCallback, useState} from "react";
import {useParams} from "next/navigation";
import {toast} from "sonner";
import useActionDesigner from "@/hooks/useActionDesigner";
import AxiosApi from "@/services/axios/AxiosApi";
import {Button} from "@mui/material";
// import useElements from "@/hooks/useElements";
// import useDesigner from "@/hooks/useDesigner";

const CreateGroupBtn = memo(function CreateGroupBtn() {
  const [newPageIsLoading, setNewPageIsLoading] = useState<boolean>(false);
  const { createNewQuestionGroup } = useActionDesigner();
  const { id } = useParams();
  // const { questionGroups } = useDesigner();
  // const elements = useElements();

  const handleCreateNewPage = useCallback(async () => {
    try {
      setNewPageIsLoading(true);
      const res = await AxiosApi.post("/question-group", {
        formId: id,
      } as any);
      if (res?.data?.questionGroupId) {
        createNewQuestionGroup(res.data.questionGroupId);
        toast.success("گروه سوال با موفقیت ایجاد شد");
      } else {
        toast.error("ایجاد گروه سوال با خطا مواجه شده است");
      }
      setNewPageIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("عملیات ناموفق بود مجددا تلاش کنید");
      setNewPageIsLoading(false);
    }
  }, []);

  // const isLastQuestionGroupNotEmpty = elements?.some(
  //   (questions) =>
  //     questions?.questionGroupId === questionGroups[questionGroups?.length - 1]
  // );

  return (
    <div
      dir="rtl"
      className="flex justify-center items-center h-[54px] w-full cursor-pointer rounded-xl border-[1px] border-dashed border-[#DDE1E6] bg-[#fff]"
    >
      <Button
        variant="text"
        onClick={handleCreateNewPage}
        loading={newPageIsLoading}
        fullWidth
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          color: "#6F6F6F",
        }}
      >
        <p className="font-bold">گروه سوال جدید</p>
      </Button>
    </div>
  );
});

export default CreateGroupBtn;
