import { toast } from "react-toastify"
import { otpGeneration, otpVerification } from "../APIFolder/api"

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
    toast.error(`There is some technical problem. Please logout and login again.`)
  },
  captchaNotMatched:()=>{
    toast.error(`Captcha not matched. Try again`)
  },
  otpGeneration:()=>{
    toast.success(`OTP has been sent to you Email Id.`)
  },
  otpVerificationSuccess:()=>{
    toast.success(`OTP has been successfully matched.`)
  },
  otpVerficationFailed:()=>{
    toast.error(`OTP did not match. Try again`)
  }
}

export default notification
