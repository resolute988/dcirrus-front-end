import CryptoJS from "crypto-js"

const our_secret_key = "secret"

const encrypt = object => {
  const encryptedUrl = CryptoJS.AES.encrypt(
    JSON.stringify(object),
    our_secret_key
  ).toString()
  return encryptedUrl
}
const decrypt = encryptedUrl => {
  var bytes = CryptoJS.AES.decrypt(encryptedUrl, our_secret_key)
  var decryptedObject = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  return decryptedObject
}

const encryption = { encrypt, decrypt }
export default encryption
