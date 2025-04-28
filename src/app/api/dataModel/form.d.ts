export interface FormPayload {
    formId: number;
    position: number;
}

export interface SetFormStatusPayload {
    id: number;
    invalid: boolean;
}
