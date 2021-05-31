import urls from "./api_urls"
import axios from "axios"
import auth from "../Authentication/Auth"
import notification from "../Utlitiy/notification"
import encryption from "../Utlitiy/encryption"

//  if token expires trigger this notification
const technicalErrorNotification=(data)=>{
  if (data   && data.error===true) {
    notification.someProblem()
  }
}
//  ist api
export const getCaptcha = setCaptcha => {
  axios
    .post(urls.captcha)
    .then(res => {
      const { data } = res
      technicalErrorNotification(data)
      //  201 code considered success
      if (data && data.messageCode === 201) {
        console.log(data.objectD)
        setCaptcha(data.objectD)
      }
    })
    .catch(err => {
      console.error("error", err)
    })
}

//  2nd api
export const login = (obj) => {
  const {body, loginMethod, redirectToDashboard}= obj
  axios
    .post(urls.login, body)
    .then(res => {
      const { data } = res
      console.log("login response", res)
      //  201 code considered success
      technicalErrorNotification(data)
      if (data && data.messageCode === 201) {
        const { token, emailId, userId ,name} = data.objectD
        //  store the token in localstorage
        const obj= { token, rp_email:emailId, rp_id :userId,rp_name:name}
        loginMethod(obj)
        // redirect user to dashboard screen
        redirectToDashboard()
      }
    })
    .catch(err => {
      console.error("error", err)
    })
}

//  3rd api
export const getFolders = setFolders => {
  axios
    .get(urls.getFolders, {
      headers: {
        Authorization: "Bearer " + auth.getToken(),
      },
    })
    .then(res => {
      const { data } = res
      console.log("get Folders API response", res)
      technicalErrorNotification(data)
      //  201 code considered success
      if (data && data.messageCode === 200) {
        const localArray = []
        data.object.map(obj => {
          const { folderId, folderNM,fileCreatedDate,userId } = obj
          localArray.push({ folderId, folderNM ,fileCreatedDate,userId})
        })
        setFolders(localArray)
      }
    })
    .catch(err => {
      console.error("error", err)
    })
}

//  4th api
export const createRootFolder = (folderName, setFolders) => {
  const structure = {
    folderPath: "",
    status: "A",
    folderType: "P",
    parentFolderId: 0,
  }

  const rootFolderStructure = { ...structure }
  rootFolderStructure.folderPath = folderName
  axios
    .post(urls.createFolder, rootFolderStructure, {
      headers: {
        Authorization: "Bearer " + auth.getToken(),
      },
    })
    .then(res => {
      const { data } = res
      console.log("create Root Folder Response", res)
      technicalErrorNotification(data)
      if (data && data.messageCode === 201) {
        //  if root folder already exist then this mesage
        if (data.message === "FOLDEREXISTS") {
          notification.folderAlreadyCreated(folderName)
        } else {
          notification.folderCreated(folderName)

          const folderId = data.object.split("#")[0]
          const folderNM = folderName
          const localArray = [{ folderNM, folderId }]
          setFolders(arr => [...arr, ...localArray])

          const subFolders = [
            `${folderNM}/Operational`,
            `${folderNM}/Financial`,
          ]

          subFolders.map(eachFolderPath => {
            var subFolderStructure = { ...structure }
            subFolderStructure.folderPath = eachFolderPath
            subFolderStructure.parentFolderId = folderId
            createSubFolders(subFolderStructure)
          })
        }
      }
    })
    .catch(err => {
      console.error("error", err)
      notification.folderNotCreated(folderName)
    })
}
//  5th api
export const createSubFolders = folderStructure => {
  axios
    .post(urls.createFolder, folderStructure, {
      headers: {
        Authorization: "Bearer " + auth.getToken(),
      },
    })
    .then(res => {
      const { data } = res
      console.log("create sub Folder Response", res)

      //  201 code considered success
      if (data && data.messageCode === 201) {
        var localArr = folderStructure.folderPath.split("/")

        if (data.message === "FOLDEREXISTS") {
          notification.folderAlreadyCreated(localArr[localArr.length - 1])
        } else {
          notification.folderCreated(localArr[localArr.length - 1])
        }
      }
    })
    .catch(err => {
      console.error("error", err)
      notification.folderNotCreated(folderStructure.folderPath.split("/")[1])
    })
}
//  6th api
export const getSubFolders = (obj, setSpecialUrl) => {
  axios
    .get(
      `${urls.baseURL}app/unindexdoclist/0/0/${obj.folderId}/DESC%60lastmodified/fetchAllAdmFolderChildListResponse`,
      {
        headers: {
          Authorization: "Bearer " + auth.getToken(),
        },
      }
    )
    .then(res => {
      const { data } = res
      console.log("get subfolders api Response", res)
      technicalErrorNotification(data)
      if (data && data.messageCode === 200) {
        const subfolders = data.object.unIndexFoldersList
        console.log("subfolders response", subfolders)
        var o_obj, f_obj
        subfolders.map(folders => {
          if (folders.folderPathLastChild === "Operational")
            o_obj = { id: folders.folderId, folderPath: folders.folderPath }
          else if (folders.folderPathLastChild === "Financial")
            f_obj = { id: folders.folderId, folderPath: folders.folderPath }
        })

        const encryptedUrl = {
          token: auth.getToken(),
          rp_id: auth.getRPId(),
          rp_name: auth.getRPName(),
          rp_email:auth.getRPEmail(),
          operational: o_obj,
          financial: f_obj,
          folderId:obj.folderId
        }
        console.log("before encryption", encryptedUrl)
        //  Encrypt
        const newUrl = encryption.encrypt(encryptedUrl)
        const creditorUrl = `http://${document.location.host}/creditor?e=${newUrl}`
      //  we are using the tinyurl service to short our large url
        urlShortener(creditorUrl,setSpecialUrl) 
      }
    })
    .catch(err => {
      console.error("get subfolders api error", err)
    })
}
export const urlShortener= (creditorUrl,setSpecialUrl)=>{

axios.get(`${urls.urlShortener}?url=${encodeURIComponent(creditorUrl)}`
).then(response=>{
  if(response.status===200)
  {
    console.log("response of url shortener api ",response)
    const url= response.data.url
  setSpecialUrl(url)
  notification.urlGenerated()}
}).catch(err=>{
  console.log("error ",err)
  notification.urlNotGenerated()
}
)
}

//  7th api
export const createCreditorFolder = obj => {
  const { creditorDetails, decryptedObject, showModal } = obj
  const { creditor, updateCreditorDetails } = creditorDetails
  // const updateFolderId = folderId => {
  //   creditor.c_obj.folderId = folderId
  //   updateCreditorDetails(creditor)
  // }

  const { c_obj } = creditor
  const folderObject = decryptedObject[c_obj.creditor_claim]

  const creditorFolderStructure = {
    folderPath: folderObject.folderPath + "/" + c_obj.creditor,
    status: "A",
    folderType: "P",
    parentFolderId: folderObject.id,
  }
  axios
    .post(urls.createFolder, creditorFolderStructure, {
      headers: {
        Authorization: "Bearer " + decryptedObject.token,
      },
    })
    .then(res => {
      const { data } = res
      console.log("create Creditor Folder Response", res)
      technicalErrorNotification(data)
      if (data && data.messageCode === 201) {
        const folderId = data.object.split("#")[0]
//        updateFolderId(folderId)
        const folderExist = data.message === "FOLDEREXISTS"
        showModal(folderExist)
      }
    })
    .catch(err => {
      console.error("error", err)
    })
}
export const onConfirmation = obj => {
  const {
    creditorDetails,
    decryptedObject,
    nextScreen,
    focusCreditorField,
    confirmationStatus,
  } = obj
  const { creditor, updateCreditorDetails } = creditorDetails
  const { c_obj, f_obj } = creditor
  const folderId = c_obj.folderId
  const removeCreditorId = () => {
    creditor.c_id = ""
    updateCreditorDetails(creditor)
  }
  if (confirmationStatus === "true") {
    var fileUploadArray = []
    f_obj.files.map(files => {
      fileUploadArray.push({
        attribute1: folderId,
        attribute2: files.fileName,
        attribute3: files.fileSize,
      })
    })
    const fileUploadStructure = {
      listAttribute5: fileUploadArray,
    }
    const obj_1 = {
      decryptedObject,
      fileUploadStructure,
      nextScreen,
      creditorDetails,
    }

    fileUpload(obj_1)
  } else {
    removeCreditorId()
    setTimeout(() => focusCreditorField(), 500)
  }
}
//  8th api
export const fileUpload = obj => {
  const { decryptedObject, fileUploadStructure, nextScreen, creditorDetails } =
    obj

  axios
    .post(urls.fileUpload, fileUploadStructure, {
      headers: {
        Authorization: "Bearer " + decryptedObject.token,
      },
    })
    .then(res => {
      const { data } = res
      console.log("fileUpload response", res)
      technicalErrorNotification(data)
      //  201 code considered success
      if (data && data.messageCode === 202) {
        var results = []
        if (data.object !== null) {
          results = [...data.object]
        }
        //  if files are not uploaded then server return 0 for new file in attribute4
        // so we are taking only new files and the files which were already uploaded have the same url
        //  so no need to call update meta data api

       //   results = results.filter(obj => obj.attribute4 === "0")

        console.log("aws url", results)

        const fileDetails = [...fileUploadStructure.listAttribute5]
        console.log("fileDetails", fileDetails)
        //  we have to shift this code when our file uploading api started working properly
        getCreditorDetails(creditorDetails)

        const obj_1 = {
          results,
          decryptedObject,
          fileDetails,
          nextScreen,
          creditorDetails,
        }
        uploadToAws(obj_1)
      }
    })
    .catch(err => {
      console.error("error", err)
    })
}
//  9th api
export const getCreditorDetails = creditorDetails => {
  const { creditor, updateCreditorDetails } = creditorDetails
  const obj = creditor.c_obj
  var query = `creditor=${obj.creditor}&`
  query += `resolution_professional=${obj.resolution_professional}&`
  query += `creditor_claim=${obj.creditor_claim}&`
  query += `email_id=${obj.email_id}&`
  query += `phone_number=${obj.phone_number}`

  const updateCreditorId = (creditor, creditorId) => {
    creditor.c_id = creditorId
    updateCreditorDetails(creditor)
  }
  axios
    .get(urls.getCreditorDetails + "?" + query)
    .then(res => {
      console.log("get CreditorDetails Api response", res)

      if (res.data.length === 0) {
        createCreditorDetails(creditor, updateCreditorId)
      } else {
        const creditorId = res.data._id
        updateCreditorId(creditor, creditorId)
      }
    })
    .catch(err => console.log("err", err))
}
//  10th api
export const createCreditorDetails = (creditor, updateCreditorId) => {
  var obj = {...creditor.c_obj}
  delete obj["captcha"]

  //  we are removing this field because we dont require
  //  delete obj["creditor_claim"]
  console.log("creditor", obj)
  axios
    .post(urls.creditorDetails, obj)
    .then(res => {
      console.log("create Creditor Api response", res)
      const creditorId = res.data._id
      updateCreditorId(creditor, creditorId)
    })
    .catch(err => console.log("err", err))
}

//  11th api
const uploadToAws = obj => {
  const { results, decryptedObject, fileDetails, nextScreen, creditorDetails } =
    obj
    const { creditor, updateCreditorDetails } = creditorDetails
    const rp_id = creditor.c_obj.rp_id
    const files= creditor.f_obj.files
  var feedbackArray = []

  results.map((eachUrl, index) => {
    axios
      .put(results[index].attribute3,
       files[index].eachFile,
        )
      .then(res => {
        //  update metaData
        console.log("aws response ok", res)
        const metaDataObject = {
          userId:rp_id,
          folderId: results[index].attribute1,
          parentFolderId: results[index].attribute1,
          storageFileName: results[index].attribute2,
          fileName: results[index].attribute2,
          fileSize: fileDetails[index].attribute3,
          fileType: results[index].attribute2.split(".")[1],
          status: "A",
          deleteStatus: "",
          folderType: "P",
          fileUniqueId: "",
          fileId: "0",
        }
        feedbackArray.push(metaDataObject)
        if (results.length === feedbackArray.length) {
          //  an array of results from aws
          //  it means files are uploaded  or not
          //  if yes then inserted an object otherwise returns false
          const obj_1 = {
            decryptedObject,
            feedbackArray,
            nextScreen,
            creditorDetails,
          }
          updateMetaData(obj_1)
        }
      })
      .catch(err => {
        console.log("aws error", err)
      })
  })
  if (results.length===0 && results.length === feedbackArray.length) {
    //  an array of results from aws
    //  it means files are uploaded  or not
    //  if yes then inserted an object otherwise returns false
    const obj_1 = {
      decryptedObject,
      feedbackArray,
      nextScreen,
      creditorDetails,
    }
    updateMetaData(obj_1)
  }
}
//  12th api
export const updateMetaData = obj => {
  const { decryptedObject, feedbackArray, creditorDetails } = obj
  const { creditor, updateCreditorDetails } = creditorDetails
  //  u_status is true and creditor_id is present only then update the files in our database
  const updateUploadStatus = () => {
    creditor.u_status = true
    updateCreditorDetails(creditor)
  }
  if (feedbackArray.length === 0) {
    console.log("update meta data files already uploaded")
    notification.filesAlreadyUploaded("files")
    //  also create the files to our database
    updateUploadStatus()
  } else {
    var metaDataStructure = {
      listAttribute4: feedbackArray,
      boolAttribute1: false,
    }
    console.log("update meta data API structure", metaDataStructure)

    axios
      .post(urls.updateMetaData, metaDataStructure, {
        headers: {
          Authorization: "Bearer " + decryptedObject.token,
        },
      })
      .then(res => {
        const { data } = res
        console.log("update metadata API response", res)
        //  201 code considered success
        if (data && data.messageCode === 201) {
          console.log(`${data.object.length} files sucessfully uploaded`, data)
          notification.filesUploaded(`${data.object.length} files`)
          //  if everything is fine then save the file related information to our database
          updateUploadStatus()
        }
      })
      .catch(err => {
        console.error("update metadata API error", err)
        notification.filesNotUploaded("Files")
      })
  }
}
//  13th api
export const updateUploadingFiles = obj => {
  const { creditorDetails, nextScreen } = obj
  console.log("update uploading files", creditorDetails)
  const { creditor } = creditorDetails
  const { c_obj } = creditor
  const { files } = creditor.f_obj

  const fileDetailsArray = []
  //  destructure some fields from object

  const c_id = creditor.c_id
  const form_name = creditor.f_obj.form_name
  files.map(fileObj => {
    fileDetailsArray.push({
      creditorId: c_id,
      formName: form_name,
      fileName: fileObj.fileName,
      fileSize: fileObj.fileSize,
    })
  })
  const obj_1 = { fileDetailsArray, nextScreen }
  createFileDetails(obj_1)
}
//  14th api
export const createFileDetails = obj => {
  const { fileDetailsArray, nextScreen } = obj
  console.log("fileDetails obj", fileDetailsArray)
  axios
    .post(urls.fileDetails, fileDetailsArray)
    .then(res => {
      console.log("create FileDetails Api response", res)
      nextScreen()
    })
    .catch(err => console.log("err", err))
}


export const getTotalClaims = (obj,setTotalClaims) => {
  const { folderId, userId } = obj
  console.log("rp username and folder id",obj)
  axios
    .get(`${urls.totalClaims}?user_id=${userId}&folder_id=${folderId}`)
    .then(res => {
      console.log("get total claims Api response", res)
      setTotalClaims(res.data)
    })
    .catch(err => console.log("err", err))
}
export const captchaGeneration= (setCaptchaImage)=>{
  axios.get(urls.captchaGeneration).then(res=>{
    const image= res.data
    setCaptchaImage(image)
  }).catch(err=>console.log("error ",err))
}

export const captchaVerification= (obj)=>{
  const {captcha,openModal,focusCaptchaField,creditor}= obj
  const gmail_id=creditor.c_obj.email_id
  const body={captcha:captcha}
  axios.post(urls.captchaVerfication,body).then(res=>{
    const result= res.data.response
    console.log("result",result)
if(result)
{ 
  //  captcha matches trigger the otpGeneration api for given user
otpGeneration(gmail_id)  
setTimeout(()=> 
openModal(),1000)
}else{
  //  remove field value and get focus on captcha field
  focusCaptchaField()
notification.captchaNotMatched()
}
  }).catch(err=>console.log("error ",err))
}

export const otpGeneration= (gmailId)=>{

  const body= {gmail_id:gmailId}
  axios.post(urls.otpGeneration,body).then(res=>{
    console.log("otpGeneration response ",res)
    const result= res.data.response
    if(result)
    {
      notification.otpGeneration()
    }
  }).catch(err=>console.log("error ",err))
}
export const otpVerificationAPI= (obj)=>{
  const {otp,nextScreen}= obj
  const body={otp:otp}
  console.log("otpVerfication body",obj)
  axios.post(urls.otpVerfication,body).then(res=>{
    const result= res.data.response
    console.log("OTP verfication api response",result)
if(result)
{ 
  notification.otpVerificationSuccess()
  nextScreen()
}else{
  notification.otpVerficationFailed()
}
  }).catch(err=>console.log("error ",err))
}

export const sendEmailTo= (obj)=>{
  const {creditorDetails}=obj
  const { creditor} = creditorDetails
  const claimant_email = creditor.c_obj.email_id
  const rp_email= creditor.c_obj.rp_email
  const files= creditor.f_obj.files
  const body={claimant_email:claimant_email,rp_email:rp_email,files:files  }
  axios.post(urls.sendEmailTo,body).then(res=>{
    console.log("send email to",res.data)
    notification.emailSendSuccessfully()
  }).catch(err =>{
    notification.emailSendFailed()
    console.log("err", err)})
}