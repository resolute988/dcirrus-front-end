import { Row, Col, Form, Button, Modal } from "react-bootstrap"
import style from "./style.module.css"
import React, { useState, useEffect } from "react"
import dragIcon from "../../Assets/drag_and_drop.png"
import close from "../../Assets/close_light_bg.png"
import {
  createCreditorFolder,
  updateUploadingFiles,
  onConfirmation,
} from "../../APIFolder/api"

import encryption from "../../Utlitiy/encryption"
import { useLocation } from "react-router-dom"

//  this is the middleComponent
const UploadScreen = props => {
  const location = useLocation()
  //  this is the function to change the screen
  const { nextScreen, creditorDetails } = props.methods

  useEffect(() => {
    if (
      creditorDetails.creditor.c_id !== "" &&
      creditorDetails.creditor.u_status === true
    ) {
      //  this is the function which will update the files that we have uploaded to our database
      const obj = { creditorDetails, nextScreen }
      updateUploadingFiles(obj)
      //  have to update the flag again so that files should be uploaded next time
      const { updateCreditorDetails } = creditorDetails
      const { creditor } = creditorDetails
      creditor.u_status = false
      updateCreditorDetails(creditor)
    }
  }, [creditorDetails.creditor.c_id, creditorDetails.creditor.u_status])
  //  in this state we store our fields values
  const [secondScreen, setSecondScreen] = useState({})

  //  this array is dedicated for uploaded forms and I think we have only one form
  //  this is my assumption please be carefull.

  const [uploadedForms, setUploadedForms] = useState([])

  //  this array is for the attachments with the form at the time of uploading the form
  const [formAttachments, setformAttachments] = useState([])

  // this state is dedicated to know whether we have to start validation process or not
  const [formValidationStatus, setFormValidationStatus] = useState(false)

  //  these are the ids of our form fields to avoid confustion
  const id = {
    creditor: "creditor",
    amount_claimed: "amount_claimed",
    amount_admitted: "amount_admitted",
    form_name: "form_name",
    form_id: "file_claim",
    uploaded_form: "uploaded_forms",
    form_attachments: "form_attachments",
  }

  //  you have to remove this code this is just for testing purposes
  const fillDefaultValues = () => {
    //  c_obj means  this object will contain all the details related to  creditor
    const { c_obj } = creditorDetails.creditor
    //  we have to remove this object this is just for testing purpose
    const defaultValues = {
      [id.creditor]: c_obj[id.creditor],
    }

    Object.keys(defaultValues).map(id_field => {
      document.getElementById(id_field).value = defaultValues[id_field]
    })
    setSecondScreen(defaultValues)
  }

  const [decryptedObject, setDecryptedObject] = useState({})
  useEffect(() => {
    //  fetch encryptedUrl from url
    var encryptedUrl = location.search.split("=")[1]
    //  Decrypt
    setDecryptedObject(encryption.decrypt(encryptedUrl))
    fillDefaultValues()
    console.log("uploadScreen", creditorDetails)
  }, [])

  //  this is the arrow function to handle any change happenend in any input
  //  its a generic function
  const handleChange = e => {
    var { name, value } = e.target
    value = typeof value === "string" ? value.toLowerCase() : value
    setSecondScreen({ ...secondScreen, [name]: value })
  }

  const focusCreditorField = () => {
    var creditorField = document.getElementById(id.creditor)
    creditorField.value = ""
    creditorField.focus()
    const duplicateUser = { ...secondScreen }
    duplicateUser[id.creditor] = ""
    setSecondScreen(duplicateUser)
  }
const removeDuplicateObjects= (d_files)=>{
  var u_files_obj= {}
  //  we are taking filename as a key
  d_files.map(obj=>{
      u_files_obj[obj.fileName]=obj
  })
  var u_files_array=[]
  Object.keys(u_files_obj).map(key=>{
    u_files_array.push(u_files_obj[key])
  })
return u_files_array
}

  //  this is the place where real validation happens
  const validate = () => {
    const {
      [id.creditor]: creditor_name,
      [id.amount_claimed]: amount_claimed,
      [id.amount_admitted]: amount_admitted,

      [id.form_name]: form_name,
    } = secondScreen

    if (
      amount_claimed === undefined ||
      amount_claimed === "" ||
      amount_admitted === undefined ||
      amount_admitted === "" ||
      creditor_name === undefined ||
      creditor_name === "" ||
      form_name === undefined ||
      form_name === "" ||
      uploadedForms.length === 0 ||
      formAttachments.length === 0
    ) {
      setFormValidationStatus(true)
    } else {
      //  now everything is alright
      //  fields are validated
      setFormValidationStatus(false)
      console.log("secondScreen", secondScreen)

      const { creditor, updateCreditorDetails } = creditorDetails

      const form_name = secondScreen[id.form_name]
      const amount_claimed = secondScreen[id.amount_claimed]
      const amount_admitted = secondScreen[id.amount_admitted]
      const creditor_name = secondScreen[id.creditor]

      creditor.c_obj[id.creditor] = creditor_name
      creditor.c_obj[id.amount_claimed] = amount_claimed
      creditor.c_obj[id.amount_admitted] = amount_admitted

      creditor.f_obj.form_name = form_name
       var d_files=[...uploadedForms, ...formAttachments]

      
   creditor.f_obj.files =removeDuplicateObjects(d_files)
      updateCreditorDetails(creditor)
      console.log(
        "these are the information of creditor after validation",
        creditor
      )

      const obj = {
        creditorDetails,
        decryptedObject,
        showModal,
      }
      createCreditorFolder(obj)
    }
  }
  const formReset = () => {
    //  reset all the fields
    document.getElementById(id.form_id).reset()
    //  reset the uploaded forms
    setUploadedForms([])
    //  reset the form attachments
    setformAttachments([])
    console.log("form values reset")
  }
  const formSubmission = e => {
    e.preventDefault()
    console.log("before validation", secondScreen)
    validate()
  }

  // when we want to upload files through file control and we clicked on the block
  //  then corrosponding block will be displayed
  const openFileComponent = fileControlId => {
    document.getElementById(fileControlId).click()
  }

  // this funciton stores our files in our state
  const saveFiles = (files, fileControlId) => {
    const filesArray = []
    //  right now we are only taking the name of the file
    //  may be we have to take different values as well
    var formAttachmentBlock = false
    if (fileControlId === id.form_attachments) {
      formAttachmentBlock = true
    }

    Object.keys(files).map(fileIndex => {
      const fileName = files[fileIndex].name.toLowerCase()
      const fileSize = files[fileIndex].size
      const eachFile= files[fileIndex]
      const fileObj = { fileName, fileSize,eachFile }
      //  if file name is already present then dont add again into the array
      //  to avoid duplicate files
      if (formAttachmentBlock) {
        if (!formAttachments.includes(fileName)) filesArray.push(fileObj)
      } else filesArray.push(fileObj)
    })
    //  no of files is greateer than 0 then save those files
    if (filesArray.length > 0) {
      if (fileControlId === id.uploaded_form) {
        //  save uploaded form in array

        setUploadedForms(filesArray)
      } else if (fileControlId === id.form_attachments) {
        //  save form attachments files in array

        setformAttachments([...formAttachments, ...filesArray])
      }
    }
  }
  //  our drag and drop component
  //  initially when we click on this component a file input function is called
  const DragDropUploadingBlock = props => {
    const { id: fileControlId } = props

    //  this evert handler method will be required for the drag and drop operation
    const dragOver = e => {
      e.preventDefault()
    }
    //  this event handler method is used to handle when we drop files over the block
    const dropFile = (e, fileControlId) => {
      //  prevent the default behaviour
      e.preventDefault()
      //  get the files
      const files = e.dataTransfer.files
      //   call the same saveFiles function which we used recently for saving the files with different id
      saveFiles(files, fileControlId)
    }
    return (
      <div
        className={`${style.uploadedFormButton} ${
          formValidationStatus
            ? id.uploaded_form === fileControlId && uploadedForms.length === 0
              ? style.error
              : id.form_attachments === fileControlId &&
                formAttachments.length === 0
              ? style.error
              : ""
            : ""
        }`}
        onClick={() => openFileComponent(fileControlId)}
        onDragOver={dragOver}
        //  id represent through which drag and drop block we are receiving files
        onDrop={e => dropFile(e, fileControlId)}
      >
        <img src={dragIcon} alt='upload icon' />
        <p className={style.dragDropContent}>
          DRAG & DROP OR <span>SELECT</span>
        </p>
      </div>
    )
  }
  //  this component is used for uploading the file
  //  it is hidden by default
  const UploadFile = props => {
    //  no need to pass callbackfunction as a prop use id instead of that
    const { id: fileControlId, multiple } = props

    return (
      <Form.Group hidden>
        <Form.File
          id={fileControlId}
          name={fileControlId}
          multiple={multiple}
          onChange={e => {
            const files = e.target.files
            console.log("uploaded files", files)
            saveFiles(files, fileControlId)
            //  code for reading the file
            // var fileReader = new FileReader()
            // fileReader.onloadend = () => {
            //   console.log(fileReader.result)
            // }
            // fileReader.readAsText(files[0])
          }}
        />
      </Form.Group>
    )
  }

  //  this component is used to create multiples input fields  based on files
  //  after uploading files this component is used to create input elements to display how manyy
  //  files we have uploaded.
  //  and gave the ability to remove that file through cross button
  const UploadedFormBlock = props => {
    //  id represents from which block this this function is calling
    // these are the only two options that we have right now  either uploadedForms and formAttachments
    //  fileName representing itself.

    const { fileControlId, fileName } = props
    const removeFile = () => {
      if (fileControlId === id.uploaded_form) {
        const localArray = [...uploadedForms]

        localArray.splice(
          localArray.findIndex(fileObj => fileObj.fileName === fileName),
          1
        )
        setUploadedForms(localArray)
      } else if (fileControlId === id.form_attachments) {
        const localArray = [...formAttachments]
        localArray.splice(
          localArray.findIndex(fileObj => fileObj.fileName === fileName),
          1
        )
        setformAttachments(localArray)
      } else {
        console.log("shunya")
      }
    }
    return (
      <div className='mb-3 d-flex align-items-center'>
        <Form.Control
          className={`${style.inputColor}`}
          type='text'
          style={{ paddingRight: "40px", color: "#6F6D73" }}
          defaultValue={fileName}
        />
        <span className={style.removeFileIcon} onClick={removeFile}>
          <img src={close} alt='Remove files' />
        </span>
      </div>
    )
  }

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [confirmationStatus, setConfirmationStatus] = useState("")
  useEffect(() => {
    if (confirmationStatus !== "") {
      console.log("yes", confirmationStatus, creditorDetails)
      const obj = {
        creditorDetails,
        decryptedObject,
        nextScreen,
        focusCreditorField,
        confirmationStatus,
      }
      onConfirmation(obj)
    }
  }, [confirmationStatus])

  const showModal = creditorFolderExist => {
    if (creditorFolderExist === true) {
      //  just empty  the value before opening modal for confirmation
      setConfirmationStatus("")
      handleShow()
    } else {
      setConfirmationStatus("true")
    }
  }

  //  this is our main component our entire form
  return (
    <Form
      id={id.form_id}
      className={`mt-5 mb-3 ${style.formStyle}`}
      onSubmit={formSubmission}
    >
      {/*  the first 3 rows are our form fields */}
      <Row>
        <Col xs='11' md='7' xl='7'>
          <Form.Group
            className={style.formGroup}
            onChange={handleChange}
            controlId={id.creditor}
          >
            <Form.Label className={style.labelColor}>CREDITOR</Form.Label>
            <Form.Control
              className={`${
                formValidationStatus &&
                !secondScreen[id.creditor] &&
                style.error
              } ${style.inputColor}`}
              name={id.creditor}
              type='text'
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col xs='11' sm='5' md='5' lg='5' xl='5'>
          <Form.Group
            onChange={handleChange}
            controlId={id.amount_claimed}
            className={style.formGroup}
          >
            <Form.Label className={style.labelColor}>
              Amount Claimed (Rs.)
            </Form.Label>
            <Form.Control
              className={`${
                formValidationStatus &&
                !secondScreen[id.amount_claimed] &&
                style.error
              } ${style.inputColor}`}
              name={id.amount_claimed}
              type='number'
              step='0.01'
              min='0'
            />
          </Form.Group>
        </Col>
        <Col xs='11' sm='6' md='6' lg='5' xl='5'>
          <Form.Group
            controlId={id.amount_admitted}
            onChange={handleChange}
            className={style.formGroup}
          >
            <Form.Label className={style.labelColor}>
              Amount Admitted (Rs.)
            </Form.Label>
            <Form.Control
              className={`${
                formValidationStatus &&
                !secondScreen[id.amount_admitted] &&
                style.error
              } ${style.inputColor}`}
              name={id.amount_admitted}
              type='number'
              step='0.01'
              min='0'
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs='11' md='7' xl='7'>
          <Form.Group
            className={style.formGroup}
            controlId={id.form_name}
            onChange={handleChange}
          >
            <Form.Label className={style.labelColor}>FORM NAME</Form.Label>
            <Form.Control
              className={`${
                formValidationStatus &&
                !secondScreen[id.form_name] &&
                style.error
              } ${style.inputColor}`}
              name={id.form_name}
              type='text'
            />
          </Form.Group>
        </Col>
      </Row>

      {/*  our 4th and 5th rows are for uploading forms and form attachments */}
      <Row className='mb-4'>
        <Col xs='11' lg='7' xl='9'>
          <Form.Group
            className={style.formGroup}
            onChange={handleChange}
            //            controlId={id.uploaded_form}
          >
            <Form.Label className={style.labelColor}>
              UPLOAD FILLED FORM
            </Form.Label>
            <UploadFile id={id.uploaded_form} multiple={true} />
            {uploadedForms.length > 0 ? (
              <>
                {uploadedForms.map((fileObj, fileIndex) => {
                  return (
                    <UploadedFormBlock
                      key={fileIndex}
                      fileControlId={id.uploaded_form}
                      fileName={fileObj.fileName}
                    />
                  )
                })}
              </>
            ) : (
              <DragDropUploadingBlock id={id.uploaded_form} />
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs='11' lg='7' xl='9'>
          <Form.Group
            className={style.formGroup}
            onChange={handleChange}
            //     controlId={id.form_attachments}
          >
            <div className={style.addNewAttachmentBlock}>
              <Form.Label className={style.labelColor}>
                ADD ATTACHMENTS
              </Form.Label>
              <span
                onClick={() => openFileComponent(id.form_attachments)}
                className={style.addNewAttachments}
              >
                ADD MORE
              </span>
            </div>
            <UploadFile id={id.form_attachments} multiple={true} />
            {formAttachments.length > 0 ? (
              <>
                {formAttachments.map((fileObj, fileIndex) => {
                  return (
                    <UploadedFormBlock
                      key={fileIndex}
                      fileControlId={id.form_attachments}
                      fileName={fileObj.fileName}
                    />
                  )
                })}
              </>
            ) : (
              <DragDropUploadingBlock id={id.form_attachments} />
            )}
          </Form.Group>
        </Col>
      </Row>

      {/*  our last row that is 6th is a button we have to click when we submit all the fields  */}
      <Row className={style.uploadRow}>
        <Col xs='11'>
          <Button type='submit' className={style.uploadButton}>
            UPLOAD & SUBMIT CLAIM
          </Button>
        </Col>
      </Row>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>ARE YOU SURE ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This creditor already exists. Do you want to save the files to the
          same folder ?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => {
              setConfirmationStatus("true")
              handleClose()
            }}
          >
            YES
          </Button>
          <Button
            variant='primary'
            onClick={() => {
              setConfirmationStatus("false")
              handleClose()
            }}
          >
            NO
          </Button>
        </Modal.Footer>
      </Modal>
    </Form>
  )
}

export default UploadScreen
