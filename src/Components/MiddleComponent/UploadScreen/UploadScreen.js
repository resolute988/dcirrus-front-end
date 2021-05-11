import { Row, Col, Form, Button } from "react-bootstrap"
import style from "./style.module.css"
import React, { useState, useEffect } from "react"
import dragIcon from "../../Assets/drag_and_drop.png"
import close from "../../Assets/close_light_bg.png"
import { createCreditorFolder } from "../../APIFolder/api"

import encryption from "../../Utlitiy/encryption"

import { useLocation } from "react-router-dom"

//  this is the middleComponent
const UploadScreen = props => {
  //  this is the function to change the screen
  const { nextScreen, creditorDetails, updateCreditorDetails } = props
  //  fetch encryptedUrl from url
  var encryptedUrl = useLocation().search.split("=")[1]

  //  Decrypt
  var decryptedObject = encryption.decrypt(encryptedUrl)

  //  in this state we store our fields values
  const [user, setUser] = useState({})

  //  this array is dedicated for uploaded forms and I think we have only one form
  //  this is my assumption please be carefull.

  const [uploadedForms, setUploadedForms] = useState([])

  //  this array is for the attachments with the form at the time of uploading the form
  const [formAttachments, setformAttachments] = useState([])

  // this state is dedicated to know whether we have to start validation process or not
  const [formValidation, setFormValidation] = useState(false)

  //  these are the ids of our form fields to avoid confustion
  const id = {
    resolution_professional: "resolution_professional",
    registration_number: "registration_number",
    creditor: "creditor",
    form_name: "form_name",
    form_id: "file_claim",
    uploaded_form: "uploaded_forms",
    form_attachments: "form_attachments",
  }

  //  we have to remove this object this is just for testing purpose
  const defaultValues = {
    [id.resolution_professional]: creditorDetails[id.resolution_professional],
    [id.registration_number]: creditorDetails[id.registration_number],
    [id.creditor]: creditorDetails[id.creditor],
  }

  //  you have to remove this code this is just for testing purposes
  const fillDefaultValues = () => {
    Object.keys(defaultValues).map(id_field => {
      document.getElementById(id_field).value = defaultValues[id_field]
    })
    console.log("default values", defaultValues)
    setUser(defaultValues)
  }

  useEffect(() => fillDefaultValues(), [])

  //  this is the arrow function to handle any change happenend in any input
  //  its a generic function
  const handleChange = e => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
    //console.log("form values", { ...user, [name]: value })
  }
  //  it tells us whether validation is started or not
  const changeFormValidationStatus = validationStatus => {
    setFormValidation(validationStatus)
  }

  //  this is the place where real validation happens
  const validate = () => {
    const {
      [id.resolution_professional]: resolution_professional,
      [id.registration_number]: registration_number,
      [id.creditor]: creditor,
      [id.form_name]: form_name,
    } = user

    if (
      resolution_professional === undefined ||
      resolution_professional === "" ||
      registration_number === undefined ||
      registration_number === "" ||
      creditor === undefined ||
      creditor === "" ||
      form_name === undefined ||
      form_name === "" ||
      uploadedForms.length === 0 ||
      formAttachments.length === 0
    ) {
      changeFormValidationStatus(true)
    } else {
      //  now everything is alright
      //  fields are validated
      changeFormValidationStatus(false)

      var localUser = {
        ...user,
        [id.uploaded_form]: [...uploadedForms],
        [id.form_attachments]: [...formAttachments],
      }
      localUser = { ...creditorDetails, ...localUser }
      console.log(
        "these are the information of creditor after validation",
        localUser
      )

      updateCreditorDetails(localUser)
      const filesArray = [...uploadedForms, ...formAttachments]

      createCreditorFolder(
        creditorDetails,
        decryptedObject,
        filesArray,
        nextScreen
      )
      console.log("Creditor Details", localUser)
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
    console.log("before validation", user)
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
      const fileName = files[fileIndex].name
      const fileSize = files[fileIndex].size
      const fileObj = { fileName, fileSize }
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
          formValidation
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

  //  this our main component our entire form
  return (
    <Form id={id.form_id} className='mt-5 mb-3' onSubmit={formSubmission}>
      {/*  the first 3 rows are our form fields */}
      <Row>
        <Col lg='7'>
          <Form.Group
            onChange={handleChange}
            controlId={id.resolution_professional}
            className={style.formGroup}
          >
            <Form.Label className={style.labelColor}>
              RESOLUTION PROFESSIONAL
            </Form.Label>
            <Form.Control
              className={
                formValidation &&
                !user[id.resolution_professional] &&
                style.error
              }
              name={id.resolution_professional}
              type='text'
            />
          </Form.Group>
        </Col>
        <Col lg='5'>
          <Form.Group
            controlId={id.registration_number}
            onChange={handleChange}
            className={style.formGroup}
          >
            <Form.Label className={style.labelColor}>
              REGISTRATION NUMBER
            </Form.Label>
            <Form.Control
              className={
                formValidation && !user[id.registration_number] && style.error
              }
              name={id.registration_number}
              type='text'
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col lg='6'>
          <Form.Group
            className={style.formGroup}
            onChange={handleChange}
            controlId={id.creditor}
          >
            <Form.Label className={style.labelColor}>CREDITOR</Form.Label>
            <Form.Control
              className={formValidation && !user[id.creditor] && style.error}
              name={id.creditor}
              type='text'
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col lg='4'>
          <Form.Group
            className={style.formGroup}
            controlId={id.form_name}
            onChange={handleChange}
          >
            <Form.Label className={style.labelColor}>FORM NAME</Form.Label>
            <Form.Control
              className={formValidation && !user[id.form_name] && style.error}
              name={id.form_name}
              type='text'
            />
          </Form.Group>
        </Col>
      </Row>

      {/*  our 4th and 5th rows are for uploading forms and form attachments */}
      <Row className='mb-4'>
        <Col lg='11'>
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
        <Col lg='11'>
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
        <Col>
          <Button type='submit' className={style.uploadButton}>
            UPLOAD & SUBMIT CLAIM
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default UploadScreen
