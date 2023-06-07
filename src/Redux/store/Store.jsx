import { configureStore }   from "@reduxjs/toolkit";
import adminStatusReducer   from '../slice/GetAdminSlice'
import companyReducer       from '../slice/CompanySlice'
import qualificationReducer from '../slice/Master/Qualification'
import bloodGroupReducer    from '../slice/Master/BloodGroup'
import branchReducer        from '../slice/Master/Branch'
import departmentReducer    from '../slice/Master/Department'
import designationReducer   from '../slice/Master/Designation'
import genderReducer        from '../slice/Master/Gender'
import documentReducer      from '../slice/Master/Document'
import maritalReducer       from '../slice/Master/Marital'
import workTypeReducer      from '../slice/Master/WorkType'
import locationReducer      from '../slice/Master/Location'

const store = configureStore({
    reducer : {
        adminStatus     : adminStatusReducer,
        company         : companyReducer,
        qualification   : qualificationReducer,
        bloodGroup      : bloodGroupReducer,
        branch          : branchReducer,
        department      : departmentReducer,
        designation     : designationReducer,
        document        : documentReducer,
        gender          : genderReducer,
        marital         : maritalReducer,
        workType        : workTypeReducer,
        location        : locationReducer,
    }
})

export default store