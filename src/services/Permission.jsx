import { getPermission } from './storage/Storage';

export const checkPermission = ((perm) => {
    let checkPermission = getPermission()
    const found = checkPermission.find(obj => {
        return obj.Name === perm
      });
      if(found === undefined || found === null || found === false){
        return false
      }else{
        if(found.IsPermission === "1"){
            return true
          }
          else{
            return false
          }
      }
})


