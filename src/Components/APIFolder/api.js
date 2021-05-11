import urls from "./api_urls"
import axios from "axios"
import auth from "../Authentication/Auth"
import notification from "../Utlitiy/notification"
import encryption from "../Utlitiy/encryption"

//  total we have 10 apis
export const getCaptcha = setCaptcha => {
  axios
    .post(urls.captcha)
    .then(res => {
      const { data } = res

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
// 2 parameters body and function to store token in localStorage
export const login = (body, loginMethod, redirectToDashboard) => {
  axios
    .post(urls.login, body)
    .then(res => {
      const { data } = res
      console.log("login response", res)
      //  201 code considered success
      if (data && data.messageCode === 201) {
        const { token, emailId, userId } = data.objectD
        //  store the token in localstorage
        loginMethod({ emailId, token, userId })
        // redirect user to dashboard screen
        redirectToDashboard()
      }
    })
    .catch(err => {
      console.error("error", err)
    })
}
export const getFolders = setFolders => {
  axios
    .get(urls.getFolder, {
      headers: {
        Authorization: "Bearer " + auth.getToken(),
      },
    })
    .then(res => {
      const { data } = res
      console.log("get Folders API response", res)
      //  201 code considered success
      if (data && data.messageCode === 200) {
        const localArray = []
        data.object.map(obj => {
          const { folderId, folderNM } = obj
          localArray.push({ folderId, folderNM })
        })
        setFolders(localArray)
      }
    })
    .catch(err => {
      console.error("error", err)
    })
}

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
      console.log("create Folder Response", res)

      if (data && data.messageCode === 201) {
        //  if root folder already exist then this mesage
        if (data.message === "FOLDEREXISTS") {
          notification.folderAlreadyCreated(folderName)
        } else {
          notification.folderCreated(folderName)
        }
        const folderId = data.object.split("#")[0]
        const folderNM = folderName
        const localArray = [{ folderNM, folderId }]
        setFolders(arr => [...arr, ...localArray])

        // var ids = {}
        // if (Object.keys(auth.getfolderIds()).length)
        //   ids = JSON.parse(auth.getfolderIds())

        // ids[parentId] = { parentFolder, parentId }

        // auth.setfolderIds(ids)

        const subFolders = [`${folderNM}/Operational`, `${folderNM}/Financial`]

        subFolders.map(eachFolderPath => {
          var subFolderStructure = { ...structure }
          subFolderStructure.folderPath = eachFolderPath
          subFolderStructure.parentFolderId = folderId
          subFolderStructure.folderType = "S"
          createSubFolders(subFolderStructure)
        })

        // setTimeout(() => {
        //   //  we have an array of objects
        //   //  so we are transforming these objects to array based on their key
        //   const localObj = JSON.parse(auth.getfolderIds())
        //   const localArray = []
        //   Object.keys(localObj).map(obj => {
        //     localArray.push(localObj[obj])
        //   })
        //   console.log("localArray", localArray)
        //   // update the new folder array
        //   setFolders(localArray)
        // }, 1000)
      }
    })
    .catch(err => {
      console.error("error", err)
      notification.folderNotCreated(folderName)
    })
}
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
        //  sub folder id
        // const id = data.object.split("#")[0]
        //  sub folder name and key
        // const subFolderName =
        //   folderStructure.folderPath.split("/")[1].toLowerCase() + "Id"
        //  our whole object of root folders
        // const ids = JSON.parse(auth.getfolderIds())
        //  our individual folder
        // const subFolder = { ...ids[folderStructure.parentFolderId] }

        // subFolder[subFolderName] = id
        //  update sub folder object
        // ids[folderStructure.parentFolderId] = subFolder
        // auth.setfolderIds(ids)
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
export const createCreditorFolder = (
  creditorDetails,
  decryptedObject,
  filesArray,
  nextScreen
) => {
  const creditorFolderStructure = {
    folderPath:
      decryptedObject[creditorDetails.creditor_claim].folderPath +
      "/" +
      creditorDetails.creditor,
    status: "A",
    folderType: "P",
    parentFolderId: decryptedObject[creditorDetails.creditor_claim].id,
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

      if (data && data.messageCode === 201) {
        const folderId = data.object.split("#")[0]

        var fileUploadArray = []
        filesArray.map(files => {
          fileUploadArray.push({
            attribute1: folderId,
            attribute2: files.fileName,
            attribute3: files.fileSize,
          })
        })
        const fileUploadStructure = {
          listAttribute5: fileUploadArray,
        }
        fileUpload(decryptedObject, fileUploadStructure, nextScreen)
      }
    })
    .catch(err => {
      console.error("error", err)
    })
}
export const fileUpload = (
  decryptedObject,
  fileUploadStructure,
  nextScreen
) => {
  console.log("fileUpload Array", fileUploadStructure)

  axios
    .post(urls.fileUpload, fileUploadStructure, {
      headers: {
        Authorization: "Bearer " + decryptedObject.token,
      },
    })
    .then(res => {
      const { data } = res
      console.log("fileUpload response", res)
      //  201 code considered success
      if (data && data.messageCode === 202) {
        var results = []
        if (data.object !== null) {
          results = [...data.object]
        }
        //  if files are already uploaded then server return 0 in attribute4
        //  so we are removing those files from updating to DCirrus platform
        results = results.filter(obj => obj.attribute4 === "0")

        console.log("aws url", results)
        uploadToAws(
          results,
          decryptedObject,
          fileUploadStructure.listAttribute5,
          nextScreen
        )
      }
    })
    .catch(err => {
      console.error("error", err)
    })
}
const uploadToAws = (results, decryptedObject, listAttribute5, nextScreen) => {
  var feedbackArray = []

  results.map((eachUrl, index) => {
    axios
      .put(results[index].attribute3.replace("http", "https"))
      .then(res => {
        //  update metaData
        console.log("aws response ok", res)
        const metaDataObject = {
          userId: decryptedObject.u_id,
          folderId: results[index].attribute1,
          parentFolderId: results[index].attribute1,
          storageFileName: results[index].attribute2,
          fileName: results[index].attribute2,
          fileSize: listAttribute5[index].attribute3,
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

          updateMetaData(decryptedObject, feedbackArray, nextScreen)
        }
      })
      .catch(err => {
        console.log("aws error", err)
      })
  })
  if (results.length === 0) updateMetaData(decryptedObject, feedbackArray)
}
export const updateMetaData = (decryptedObject, feedbackArray, nextScreen) => {
  if (feedbackArray.length === 0) {
    console.log("update meta data files already uploaded")
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
          nextScreen()
        }
      })
      .catch(err => {
        console.error("update metadata API error", err)
        notification.filesNotUploaded("Files")
      })
  }
}

export const getUrl = (obj, setSpecialUrl) => {
  console.log("obj", obj)
  axios
    .get(`${urls.getUrl}/${obj.folderId}`)
    .then(res => {
      if (res.status === 200) {
        const { data } = res
        if (data.length === 0) {
          console.log("url response url not present", data)
          getSubFolders(obj, setSpecialUrl)
        } else {
          console.log("url response", data, obj)
          if (obj.folderId === data[0].folderId) {
            setSpecialUrl(data[0].url)
            notification.urlGenerated()
          }
        }
      }
    })
    .catch(err => console.log("err", err))
}
export const getSubFolders = (obj, setSpecialUrl) => {
  axios
    .get(
      `https://prepod.dcirrus.co.in/api.acms/v1/app/unindexdoclist/0/0/${obj.folderId}/DESC%60lastmodified/fetchAllAdmFolderChildListResponse`,
      {
        headers: {
          Authorization: "Bearer " + auth.getToken(),
        },
      }
    )
    .then(res => {
      const { data } = res
      console.log("get subfolders api Response", res)

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
          uId: auth.getUserId(),
          u_name: auth.getUsername(),
          operational: o_obj,
          financial: f_obj,
        }
        console.log("before encryption", encryptedUrl)
        //  Encrypt
        const newUrl = encryption.encrypt(encryptedUrl)
        const creditorUrl = `${document.location.host}/creditor?e=${newUrl}`
        setSpecialUrl(creditorUrl)

        //  we are storing three properties in our collection
        const savedObj = {
          ...obj,
          url: creditorUrl,
        }
        saveUrl(savedObj)
        notification.urlGenerated()
      }
    })
    .catch(err => {
      console.error("get subfolders api error", err)
    })
}
export const saveUrl = folderObj => {
  const obj = folderObj
  axios
    .post(urls.saveUrl, obj)
    .then(res => console.log("saveUrl response", res))
    .catch(err => console.log("err", err))
}
export const createCreditorDetails = creditorDetailsObj => {
  const obj = creditorDetailsObj
  console.log("credetailsDetails", obj)
  axios
    .post(urls.saveUrl, obj)
    .then(res => console.log("create CreditorDetails Api response", res))
    .catch(err => console.log("err", err))
}

export const deleteUrls = () => {
  axios
    .delete(urls.deleteUrls)
    .then(res => console.log("deleted api response", res))
    .catch(err => console.log("deleted api error", err))
}
