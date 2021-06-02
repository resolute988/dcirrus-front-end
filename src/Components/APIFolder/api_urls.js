//  base URL
// const baseURL = "http://dev.dcirrus.info/api.acms/v1/"
 const baseURL = "https://dcirrus.co.in/api.acms/v1/"

//const backend_server = "https://dcirrus.herokuapp.com"
const backend_server = "http://utility.dcirrus.info/api/"

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
  creditorDetails: backend_server + "creditordetails/create",
  getCreditorDetails: backend_server + "creditordetails/",
  fileDetails: backend_server + "filedetails/create",
  urlShortener:backend_server+"urlshortener/",
  totalClaims:backend_server+"totalclaims/",
  captchaGeneration:backend_server+"captcha/create",
  captchaVerfication:backend_server+"captcha/verify",
  otpGeneration:backend_server+"otp/create",
  otpVerfication:backend_server+"otp/verify",
  sendEmailToClaimant:backend_server+ "send/claimant",
  sendEmailToRP:backend_server+ "send/rp",
  
}
export default urls
