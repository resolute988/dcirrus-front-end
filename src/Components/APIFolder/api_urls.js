//  base URL
const baseURL = "http://dev.dcirrus.info/api.acms/v1/"

//const backend_server = "https://dcirrus.herokuapp.com"
const backend_server = "http://utility.dcirrus.info:3000/"

const urls = {
  baseURL,
  captcha: baseURL + "publicapi/gencaptcha/0/loginFetchCaptchaAfter",
  login: baseURL + "publicapi/login/0/loginsuccess",

  createFolder:
    baseURL + "app/unindexfolderaddauth/0/web/admAddNewFolderServiceAfter",

  getFolders:
    baseURL +
    "app/unindexfolderlistg/0/zerolevel/0/P/fetchAllAdmFolderListResponse",
  fileUpload: baseURL + "app/unindexgend/0/atc",
  updateMetaData:
    baseURL + "app/unindexdocadd/0/desktop/admDocAddMetaDataServiceAfter",
  creditorDetails: backend_server + "/creditordetails/create",
  getCreditorDetails: backend_server + "/creditordetails/",
  fileDetails: backend_server + "/filedetails/create",
}
export default urls
