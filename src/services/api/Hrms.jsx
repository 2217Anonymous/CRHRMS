import axios from "axios"
import { ADD_EXPERINCE, ADD_LANGUAGE, ADD_QUALIFICATION, DELETE_EXPERINCE, DELETE_LANGUAGE, DELETE_QUALIFICATION, GET_CANDIDATE_LIST, GET_CANDIDATE_QUALIFICATION, GET_EDIT_CANDIDATE, GET_EXPERINCE, GET_LANGUAGE, GET_RESUME_MASTER_ID, INSERT_CANDIDATE_URL } from "./ApiUrl"

const browser = {
    ipAddress:'127.0.0.1',
    geoLocation:'tiruppur',
}

export const GETRESUMEMASTERID = (async() => {
    return await axios.post(GET_RESUME_MASTER_ID)
})

export const GETCANDIDATE = (async() => {
    return await axios.post(GET_CANDIDATE_LIST)
})

export const GETEDITCANDIDATE = (async (id) => {
    return await axios.post(GET_EDIT_CANDIDATE,{id:id,...browser})
})

export const NEWCANDIDATE = ((dt) => {
    const form=new FormData();
    form.append("CompId"                  , dt.CompId)
    form.append("Salut"                   , dt.Salut)
    form.append("Master_Id"               , parseInt(dt.Master_Id))
    form.append("FirstName"               , dt.FirstName)
    form.append("MiddleName"              , dt.MiddleName)
    form.append("LastName"                , dt.LastName)
    form.append("PersonalEmail"           , dt.PersonalEmail)
    form.append("Mob"                     , dt.Mob)
    form.append("Mob1"                    , dt.Mob1)
    form.append("Gender"                  , dt.Gender)
    form.append("DateOfBirth"             , dt.DateOfBirth)
    form.append("Age"                     , dt.Age)
    form.append("BloodGroup"              , dt.BloodGroup)
    form.append("FatherName"              , dt.FatherName)
    form.append("FatherOccupation"        , dt.FatherOccupation)
    form.append("MotherName"              , dt.MotherName)
    form.append("MotherOccupation"        , dt.MotherOccupation)
    form.append("MaritalStatus"           , dt.MaritalStatus)
    form.append("HusbandorWifeName"       , dt.HusbandorWifeName)
    form.append("HusbandorWifeOccupation" , dt.HusbandorWifeOccupation)
    form.append("NoOfChildrens"           , dt.NoOfChildrens)
    form.append("PermenentAddress"        , dt.PermenentAddress)
    form.append("PresentAddress"          , dt.PresentAddress)
    form.append("AadharNumber"            , dt.AadharNumber)
    form.append("PanNumber"               , dt.PanNumber)
    form.append("PassportNumber"          , dt.PassportNumber)
    form.append("IsVehicleHave"           , dt.IsVehicleHave)
    form.append("IsLicenseHave"           , dt.IsLicenseHave)
    form.append("LicenceType"             , "1")
    form.append("LicenceNumber"           , dt.LicenceNumber)
    form.append("FileURI"                 , dt.FileURI)
    form.append("ReadyToRelocate"         , dt.ReadyToRelocate)
    form.append("SpecialSkills"           , dt.SpecialSkills)
    form.append("Remarks"                 , dt.Remarks)
    form.append("ExpectedSal"             , dt.ExpectedSal)
    form.append("ipAddress"               ,'127.0.0.1')
    form.append("geoLocation"              ,'tiruppur')
    // const data = {
    //     CompId                  : 13,
    //     Salut                   : "1",
    //     Master_Id               : 1,
    //     //PERSONAL
    //     FirstName               : dt.FirstName,
    //     MiddleName              : dt.MiddleName,
    //     LastName                : dt.LastName,
    //     PersonalEmail           : dt.PersonalEmail,
    //     Mob                     : dt.Mob,
    //     Mob1                    : dt.Mob1,
    //     Gender                  : dt.Gender,
    //     DateOfBirth             : dt.DateOfBirth,
    //     Age                     : dt.Age,
    //     BloodGroup              : dt.BloodGroup,
    //     //FAMILY
    //     FatherName              : dt.FatherName,
    //     FatherOccupation        : dt.FatherOccupation,
    //     MotherName              : dt.MotherName,
    //     MotherOccupation        : dt.MotherOccupation,
    //     MaritalStatus           : dt.MaritalStatus,
    //     HusbandorWifeName       : dt.HusbandorWifeName,
    //     HusbandorWifeOccupation : dt.HusbandorWifeOccupation,
    //     NoOfChildrens           : dt.NoOfChildrens,
    //     //ADDRESS
    //     PermenentAddress        : dt.PermenentAddress,
    //     PresentAddress          : dt.PresentAddress,
    //     //KYC
    //     AadharNumber            : dt.AadharNumber,
    //     PanNumber               : dt.PanNumber,
    //     PassportNumber          : dt.PassportNumber,
    //     IsVehicleHave           : dt.IsVehicleHave,
    //     IsLicenseHave           : dt.IsLicenseHave,
    //     LicenceType             : "1",
    //     LicenceNumber           : dt.LicenceNumber,
    //     FileURI                 : dt.FileURI,
    //     //ADDITIONAL
    //     ReadyToRelocate         : dt.ReadyToRelocate,
    //     SpecialSkills           : dt.SpecialSkills,
    //     Remarks                 : dt.Remarks,
    //     ExpectedSal             : dt.ExpectedSal,
    //     ...browser
    // }

    // console.log(dt);
    // let formData = new FormData(data)
    // console.log('form',formData);

    // const formData = new FormData()

    // Object.keys(this.data).forEach((key) => {
    //     formData.append(key, this.data[key])
    // })

    // console.log(formData);

    return axios.post(INSERT_CANDIDATE_URL,form)
})

export const ADDLANGUAGE = (async (data) => {
    const dt = [{id:0,empId:0,language:data.language,readSkill:data.readSkill,writeSkill:data.writeSkill,speakSkill:data.speakSkill,empParamStr:data.empParamStr,...browser}]
    console.log(dt);
    return await axios.post(ADD_LANGUAGE,dt)
})
export const ADDEXPERIENCE = (async (data) => {
    const dt = [{id:0,empId:0,companyName:data.companyName,designation:data.designation,workFrom:data.workFrom,workTo:data.workTo,yearsOfExperiance:data.yearsOfExperiance,salaryPerMonth:data.salaryPerMonth,empParamStr:data.empParamStr,...browser}]
    return await axios.post(ADD_EXPERINCE,dt)
})
export const ADDQUALIFICATION = (async (data) => {
    const dt = [{id:0,empId:0,courceId:data.courceId,courseName:data.courseName,medium:data.medium,institution:data.institution,yearOfPassing:parseInt(data.yearOfPassing),gradeOrPercentage:data.gradeOrPercentage,empParamStr:data.empParamStr,...browser}]
    return await axios.post(ADD_QUALIFICATION,dt)
})

export const GETLANGUAGE = (async (id) => {
    return await axios.post(GET_LANGUAGE,{id:id,...browser})
})
export const GETEXPERIENCE = (async (id) => {
    return await axios.post(GET_EXPERINCE,{id:id,...browser})
})
export const GETCANDIDATEQUALIFICATION = (async (id) => {
    return await axios.post(GET_CANDIDATE_QUALIFICATION,{id:id,...browser})
})

export const DELETELANGUAGE = (async (id) => {
    return await axios.post(DELETE_LANGUAGE,{id:id,...browser})
})
export const DELETEEXPERIENCE = (async (id) => {
    return await axios.post(DELETE_EXPERINCE,{id:id,...browser})
})
export const DELETEQUALIFICATION = (async (id) => {
    return await axios.post(DELETE_QUALIFICATION,{id:id,...browser})
})
       