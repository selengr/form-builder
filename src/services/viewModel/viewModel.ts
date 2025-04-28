// import { useState } from "react";
// import * as FormService from "@/app/api/services";
// import { FormPayload, QuestionGroupPayload, SearchFilterModel, SetFormStatusPayload } from "@/services/api/dataModel";
// import { AccessType, FormStatus, FormType } from "@/services/api/constants";
//
// export const useFormViewModel = () => {
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);
//
//     const handleRequest = async <T>(callback: () => Promise<T>): Promise<T> => {
//         try {
//             setLoading(true);
//             setError(null);
//             return await callback();
//         } catch (err: any) {
//             const errorMsg = err?.response?.data?.message || err.message || "An error occurred";
//             setError(errorMsg);
//             throw new Error(errorMsg);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Create Form
//     const createForm = (data: FormPayload) =>
//         handleRequest(() => FormService.createForm(data));
//
//     // Create Question Group
//     const createQuestionGroup = (data: QuestionGroupPayload) =>
//         handleRequest(() => FormService.createQuestionGroup(data));
//
//     // Duplicate Question
//     const duplicateQuestion = (id: number) =>
//         handleRequest(() => FormService.duplicateQuestion(id));
//
//     // Get Form Detail
//     const getForm = (id: number) =>
//         handleRequest(() => FormService.getForm(id));
//
//     // Get Question Detail
//     const getQuestionDetail = (id: number) =>
//         handleRequest(() => FormService.getQuestionDetail(id));
//
//     // Get Main List of Forms
//     const getMainListForms = (
//         type: FormType,
//         access: AccessType,
//         filterModel: SearchFilterModel
//     ) => handleRequest(() => FormService.getMainListForms(type, access, filterModel));
//
//     // Delete Form
//     const deleteForm = (id: number) =>
//         handleRequest(() => FormService.deleteForm(id));
//
//     // Set Form Status (valid / invalid / ...)
//     const setFormStatus = (status: FormStatus, data: SetFormStatusPayload) =>
//         handleRequest(() => FormService.setFormStatus(status, data));
//
//     return {
//         loading,
//         error,
//
//         createForm,
//         createQuestionGroup,
//         duplicateQuestion,
//         getForm,
//         getQuestionDetail,
//         getMainListForms,
//         deleteForm,
//         setFormStatus,
//     };
// };
