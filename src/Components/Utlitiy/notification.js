import { toast } from "react-toastify"

const notification = {
  filesUploaded: fileName => {
    toast.success(`${fileName} successfully uploaded`)
  },
  filesAlreadyUploaded: fileName => {
    toast.info(`${fileName} already uploaded`)
  },
  filesNotUploaded: fileName => {
    toast.error(`${fileName} not uploaded`)
  },
  folderCreated: folderName => {
    toast.success(`${folderName} succesfully created`)
  },
  folderAlreadyCreated: folderName => {
    toast.info(`${folderName} already created`)
  },
  folderNotCreated: folderName => {
    toast.error(`${folderName} not created`)
  },
  urlGenerated: () => {
    toast.success(`Url successfully generated`)
  },
  urlNotGenerated: () => {
    toast.error(`url not generated`)
  },
  someProblem: () => {
    toast.error(`There is some problem. Please refresh the browser`)
  },
}

export default notification
