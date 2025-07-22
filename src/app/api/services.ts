import {AxiosApi} from "@/services/axios/AxiosApi";
import {FormPayload, QuestionGroupPayload, SearchFilterModel, SetFormStatusPayload,} from "./dataModel";
import {AccessType, FormStatus, FormType} from "./constants";

// helper
const extractData = <T>(response: { data: T }): T => response.data;

// Create Form
export const createForm = async (data: FormPayload) =>
    extractData(await AxiosApi.post("/form", data));

// Create Question Group
export const createQuestionGroup = async (data: QuestionGroupPayload) =>
    extractData(await AxiosApi.post("/question-group", data));

// Duplicate Question
export const duplicateQuestion = async (id: number) =>
    extractData(await AxiosApi.post(`/question/${id}/duplicate`));

// Get Form Detail
export const getForm = async (id: number) =>
    extractData(await AxiosApi.get(`/form/${id}`));

// Get Question Detail
export const getQuestionDetail = async (id: number) =>
    extractData(await AxiosApi.get(`/question/${id}`));

// Get Main Form List
export const getMainListForms = async (
    type: FormType,
    access: AccessType,
    filterModel: SearchFilterModel
) => {
    const query = encodeURIComponent(JSON.stringify(filterModel));
    return extractData(
        await AxiosApi.get(`/form/main-list/${type}/${access}?searchFilterModel=${query}`)
    );
};

// Delete Form
export const deleteForm = async (id: number) =>
    extractData(await AxiosApi.delete(`/form/${id}`));

// Set Form Status (valid/invalid/...)
export const setFormStatus = async (
    status: FormStatus,
    data: SetFormStatusPayload
) => extractData(await AxiosApi.put(`/form/${status}`, data));
