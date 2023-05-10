import { isAuthenticated } from "../../services/Auth";
import { getUserMenu } from "../../services/storage/Storage";
let MENUITEMS=[]

isAuthenticated ? (
    MENUITEMS = getUserMenu()
)
: MENUITEMS = []

export default MENUITEMS;