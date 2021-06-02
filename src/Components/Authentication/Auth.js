const RP = {
  token: "token",
  rp_name: "rp_name",
  rp_id: "rp_id",
  rp_email:"rp_email",
  rootFolderId:"rootFolderId"
}

const auth = {
  login: (obj) => {
    const { token, rp_email, rp_id ,rp_name} = obj
    
    localStorage.setItem(RP.token, token)
    localStorage.setItem(RP.rp_name, rp_name)
    localStorage.setItem(RP.rp_id, rp_id)
    localStorage.setItem(RP.rp_email,rp_email)
  },
  logout: () => {
    //  remove all keys stored in local storage
    Object.keys(RP).map(keys => {
      localStorage.removeItem(keys)
    })
  },
  getLoginStatus: () => {
    const token = localStorage.getItem(RP.token)
    if (token === undefined || token === null || token === "") return false
    else return true
  },
  getToken: () => {
    return localStorage.getItem(RP.token)
  },
  setToken: token => {
    localStorage.setItem(RP.token, token)
  },
  removeToken: () => {
    localStorage.removeItem(RP.token)
  },
  getRPName: () => {
    const name = localStorage.getItem(RP.rp_name)
    return name
  },
  getRPId: () => {
    return localStorage.getItem(RP.rp_id)
  },
  getRPEmail:()=>{
    return localStorage.getItem(RP.rp_email)
  },
  setRootFolderId:(rootFolderId)=>{
    localStorage.setItem(RP.rootFolderId,rootFolderId)
  },
  isRootFolderSelected:()=>{
    const rootFolderId = localStorage.getItem(RP.rootFolderId)
    if (rootFolderId === undefined || rootFolderId === null || rootFolderId === "") return false
    else return true
  },
  getRootFolderId:()=>{
   return  localStorage.getItem(RP.rootFolderId)
  },
  removeRootFolderId:()=>{
    localStorage.removeItem(RP.rootFolderId)
  }
}

export default auth
