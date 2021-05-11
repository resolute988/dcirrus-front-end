const RP = {
  token: "token",
  username: "username",
  userId: "userId",
  folderIds: "folderIds",
}

const auth = {
  login: ({ emailId: username, token, userId }) => {
    console.log("log 3", username, token, userId)
    localStorage.setItem(RP.token, token)
    localStorage.setItem(RP.username, username)
    localStorage.setItem(RP.userId, userId)
  },
  logout: () => {
    //  remove all keys stored in local storage
    Object.keys(RP).map(keys => {
      localStorage.removeItem(keys)
    })
  },
  getLoginStatus: () => {
    const login = localStorage.getItem(RP.token)
    if (login === undefined || login === null || login === "") return false
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
  getUsername: () => {
    const username = localStorage.getItem(RP.username)
    return username
  },
  setUsername: username => {
    localStorage.setItem(RP.username, username)
  },
  removeUsername: () => {
    localStorage.removeItem(RP.username)
  },
  getfolderIds: () => {
    const folderIds = localStorage.getItem(RP.folderIds) || {}
    return folderIds
  },
  setfolderIds: obj => {
    //    const ids = localStorage.getItem(RP.folderIds) || {}
    localStorage.setItem(RP.folderIds, JSON.stringify(obj))
  },

  removefolderIds: () => {
    localStorage.removeItem(RP.folderIds)
  },
  getUserId: () => {
    return localStorage.getItem(RP.userId)
  },
}

export default auth
