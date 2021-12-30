export const API_PATH_ENTRIES = '/api/operations/production/dl/entry/:EntryDate';
export const API_PATH_SAVE_ENTRY = '/api/operations/production/dl/entry';
export const API_PATH_DELETE_ENTRY = '/api/operations/production/dl/entry/:id';
export const API_PATH_WORKORDER = '/node/production/wo/:Company/:WorkOrderNo';
export const API_PATH_INVTRANSFER = '/node/production/wo/:Company/it/:WorkOrderNo';
export const API_PATH_OP_LOOKUP = '/node/search/workorder/:company/:WorkCenter/:search';
export const API_PATH_STEPS = '/api/operations/production/dl/step-codes';

export const API_PATH_REPORT = '/api/operations/production/dl/report/data/:minDate/:maxDate?:queryString';
export const API_PATH_REPORT_EMPLOYEE_TOTAL = '/api/operations/production/dl/report/employee-total/:minDate/:maxDate/:workCenter/render';
export const API_PATH_REPORT_STEP_TOTAL = '/api/operations/production/dl/report/step-total/:minDate/:maxDate/:workCenter/render';
