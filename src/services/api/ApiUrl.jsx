import axios from "axios"

axios.defaults.baseURL                          = "https://hr-api.urdreamdestiny.com/api/";
// axios.defaults.headers.common['Authorization']  = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type']     = 'application/x-www-form-urlencoded';

// https://148.72.209.206/api/account/GetSuperAdminStatus

export const ADMIN_STATUS_URL               = "account/GetSuperAdminStatus";
export const USER_REGISTER_URL              = "account/insertsuperadmin";
export const LOGIN_URL                      = "account/login";
export const LOGOUT_URL                     = "account/logout";
export const FORGOT_URL                     = "account/forgotpassword";
export const RESET_URL                      = "account/resetpassword";
export const CHANGE_PASSWORD_URL            = "account/changepassword";
export const GET_PERMISSION_URL             = 'account/getpermissionlist';
export const INSERT_PERMISSION_URL          = 'account/insertpermission';

//COMPANY
export const NEW_COMPANY_URL                = "admin/addeditcompany";
export const COMPANY_LIST_URL               = "admin/companylist";
export const STATUS_COMPANY_URL             = "admin/companystatuschange"
export const EDIT_COMPANY_URL               = "admin/geteditcompanydetails"
export const ADD_SMTP_URL                   = "admin/addeditsmtp"
export const SMTP_LIST_URL                  = "admin/smtplist"
export const EDIT_SMTP_URL                  = "admin/geteditsmtpdetails"
export const GET_COMPANY_SMTP_URL           = "admin/getcompanysmtp"

//USER      
export const USER_LIST_URL                  = "user/userlist";
export const ADD_USER_URL                   = "user/addedituser";
export const GET_USER_BY_URL                = "user/getedituserbyid";
export const UPDATE_USER_STATUS_URL         = "user/UpdateUserStatus";
export const GET_PROFILE_URL                = "user/getprofile";

//HRMS  
export const GET_CANDIDATE_LIST             = "hrms/candidates";
export const INSERT_CANDIDATE_URL           = "hrms/addeditandidates";
export const GET_EDIT_CANDIDATE             = "hrms/getcandidateeditdetails";

export const ADD_LANGUAGE                   = "hrms/addcandidatelanguages";
export const GET_LANGUAGE                   = "hrms/candidatelanguages";
export const DELETE_LANGUAGE                = "hrms/deletecandidatelanguage";

export const ADD_EXPERINCE                  = "hrms/addexperience";
export const GET_EXPERINCE                  = "hrms/candidateexperience";
export const DELETE_EXPERINCE               = "hrms/deleteexperience";

export const ADD_QUALIFICATION              = "hrms/addcandidatequalification";
export const GET_CANDIDATE_QUALIFICATION    = "hrms/qualificationlist";
export const DELETE_QUALIFICATION           = "hrms/deletequalification";
export const VIEW_CANDIDATE_URL             = "hrms/viewcandidate"; 

export const EMPLOYEE_JOIN_ENTRY            = "hrms/empjoiningentry";
export const APPLICATION_DOWNLOAD_URL       = 'hrms/applicationdownload';
export const GET_DOCUMENT_LIST              = 'hrms/getdocslist';
export const UPLOAD_DOCUMENT_URL            = 'hrms/empdocumentupload';

//GET MASTER    
export const GET_BLOOD_URL                  = "masters/bloodgroups";
export const GET_BRANCHES_URL               = "masters/branches";
export const GET_DEPARTMENT_URL             = "masters/departments";
export const GET_DESIGNATION_URL            = "masters/designations";
export const GET_GENDER_URL                 = "masters/genders";
export const GET_MARITAL_URL                = "masters/maritalstatus";
export const GET_QUALIFICATION_URL          = "masters/qualificatios";
export const GET_WORKTYPE_URL               = "masters/worktypes";
export const GET_DOCUMENT_URL               = "masters/documents";
export const GET_RESUME_MASTER_ID           = "masters/getresumemasterid"

//ADD MASTER    
export const INSERT_GENDER_URL              = "masters/addeditgender"
export const INSERT_MARITAL_URL             = "masters/addeditmaritalstatus"
export const INSERT_BLOOD_URL               = "masters/addeditbloodgroup"
export const INSERT_DEPARTMENT_URL          = "masters/addeditdepartment"
export const INSERT_DESIGNATION_URL         = "masters/addeditdesignation"
export const INSERT_WORK_URL                = "masters/addeditworktype"
export const INSERT_QUALIFICATION_URL       = "masters/addeditqualification"
export const INSERT_BRANCH_URL              = "masters/addeditbranch"
export const INSERT_DOC_URL                 = "masters/addeditdocument"
//STATUS UPDATE 
export const STATUS_GENDER_URL              = "masters/updategenderstatus"
export const STATUS_MARITAL_URL             = "masters/Changemaritalstatus"
export const STATUS_BLOOD_URL               = "masters/bloodgroupstatuschange"
export const STATUS_DEPARTMENT_URL          = "masters/departmentstatuschange"
export const STATUS_DESIGNATION_URL         = "masters/updatedesignationstatus"
export const STATUS_WORK_URL                = "masters/updateworktypestatus"
export const STATUS_QUALIFICATION_URL       = "masters/qualificationstatuschange"
export const STATUS_BRANCH_URL              = "masters/branchstatuschange"
export const STATUS_DOCUMENT_URL            = "masters/documentstatuschange"

//UTILITY   
export const MODULE_LIST_URL                = 'utility/modulelist';
export const ACTIVE_MODULE_LIST_URL         = 'utility/activemodulelist';
export const ADD_MODULE_URL                 = 'utility/addmodule';
export const MODULE_STATUS_URL              = 'utility/modulestatuschange';

export const ADD_SUBMODULE_URL              = 'utility/addsubmodule';
export const SUBMODULE_LIST_URL             = 'utility/submodulelist';
export const ACTIVE_SUBMODULE_LIST_URL      = 'utility/activesubmodulelist';
export const SUBMODULE_STATUS_URL           = 'utility/submodulestatuschange';

export const ADD_OPERATION_URL              = 'utility/addoperation';
export const OPERATION_LIST_URL             = 'utility/operationlist';
export const OPERATION_STATUS_URL           = 'utility/operationstatuschange';

export const INSERT_MODULE_OPERATION_URL    = 'utility/insertmoduleoperation';
export const SUBMODULES_BY_MODULES_URL      = 'utility/submodulesbymoduleid';

export const COUNTRY_LIST_URL               = 'utility/getcountries';
export const STATE_LIST_URL                 = 'utility/getstatesbycountry';
export const CITY_LIST_URL                  = 'utility/getcitiesbystate';

export const HISTORY_URL                    = 'utility/rowhistory';
