//  base URL
const baseURL = "http://dev.dcirrus.info/api.acms/v1/"

const backend_server = "https://dcirrus.herokuapp.com"

const urls = {
  baseURL,
  captcha: baseURL + "publicapi/gencaptcha/0/loginFetchCaptchaAfter",
  login: baseURL + "publicapi/login/0/loginsuccess",

  createFolder:
    baseURL + "app/unindexfolderaddauth/0/web/admAddNewFolderServiceAfter",

  getFolder:
    baseURL +
    "app/unindexfolderlistg/0/zerolevel/0/P/fetchAllAdmFolderListResponse",
  getSubFolders:
    baseURL +
    "app/unindexdoclist/0/0/17/DESC%60lastmodified/fetchAllAdmFolderChildListResponse",
  fileUpload: baseURL + "app/unindexgend/0/atc",
  updateMetaData:
    baseURL + "app/unindexdocadd/0/desktop/admDocAddMetaDataServiceAfter",
  getUrl: backend_server + "/saveurl",
  saveUrl: backend_server + "/saveurl/create",
  creditorDetails: backend_server + "/creditordetails/create",
  deleteUrls: backend_server + "/",
}
export default urls
