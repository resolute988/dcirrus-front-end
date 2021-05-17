import { Row, Col, Form, Button, Modal, Container } from "react-bootstrap"
import style from "./style.module.css"
import middle_icon from "../../Assets/middle_icon.png"
import close from "../../Assets/close.png"
import dcirrus from "../../Assets/dcirrus.png"
import React, { useState, useEffect } from "react"
import OtpInput from "react-otp-input"
import { createCreditorDetails, getCreditorDetails } from "../../APIFolder/api"

import encryption from "../../Utlitiy/encryption"

import { useLocation } from "react-router-dom"

//  this is the middleComponent
const Middle = props => {
  //  this is the function to change the screen
  const { nextScreen, creditorDetails, updateCreditorDetails, setCreditorId } =
    props
  //  in this state we store our fields values
  const [user, setUser] = useState({})

  //  these are the ids of our form fields to avoid confustion
  const id = {
    resolution_professional: "resolution_professional",
    registration_number: "registration_number",
    creditor: "creditor",
    first_name: "first_name",
    last_name: "last_name",
    email_id: "email_id",
    phone_number: "phone_number",
    creditor_claim: "creditor_claim",
    operational_creditor_claim: "operational_creditor_claim",
    financial_creditor_claim: "financial_creditor_claim",
    form_id: "file_claim",
  }
  const defaultValues = {
    [id.resolution_professional]: "STEVIE REED",
    [id.registration_number]: "wwwhdb333,33/2020/",
    [id.creditor]: "XYZ_CoMPANY PVT. LTD",
    [id.first_name]: "JOHNSTON",
    [id.last_name]: "DOE",
    [id.email_id]: "JOHNSTON.DOE@GMAIL.COM",
    [id.phone_number]: "+91-684-6992-452",
  }

  //  you have to remove this code this is just for testing purposes
  const fillDefaultValues = () => {
    Object.keys(defaultValues).map(id_field => {
      document.getElementById(id_field).value = defaultValues[id_field]
    })
    console.log("default values", defaultValues)
    setUser({
      ...user,
      ...defaultValues,
    })
  }

  // some basic set up
  const initialization = () => {
    //  we are getting the radio button through their id to selected by default

    const operationalCreditor = document.getElementById(
      id.operational_creditor_claim
    )
    //  here we are setting their value to true
    operationalCreditor.checked = true
    //  here we have to update our main state that is user object
    //  in this object we will get all our form values
    //  we are doing this because by default we are selecting one radio value
    setUser({
      ...user,
      [operationalCreditor.getAttribute("name")]:
        operationalCreditor.getAttribute("value"),
    })
  }
  var encryptedUrl = useLocation().search.split("=")[1]

  //  Decrypt
  var decryptedObject = encryption.decrypt(encryptedUrl)

  useEffect(() => {
    initialization()
  }, [])

  //  this is the arrow function to handle any change happenend in any input
  //  its a generic function
  const handleChange = e => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }
  const resetForm = () => {
    document.getElementById(id.form_id).reset()
    console.log("form values reset")
  }
  //  when we open modal for OTP verification then cursor must be there on first input box
  const autoFocus = () => {
    setTimeout(() => {
      var firstInput = document.querySelector("#otp input")
      firstInput.focus()
    }, 100)
  }

  // this state is dedicated to know whether we have to start validation process or not
  const [formValidation, setFormValidation] = useState(false)
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
      [id.first_name]: first_name,
      [id.last_name]: last_name,
      [id.email_id]: email_id,
      [id.phone_number]: phone_number,
    } = user

    if (
      resolution_professional === undefined ||
      resolution_professional === "" ||
      registration_number === undefined ||
      registration_number === "" ||
      creditor === undefined ||
      creditor === "" ||
      first_name === undefined ||
      first_name === "" ||
      last_name === undefined ||
      last_name === "" ||
      email_id === undefined ||
      email_id === "" ||
      phone_number === undefined ||
      phone_number === ""
    ) {
      changeFormValidationStatus(true)
    } else {
      //  now everything is alright
      //  fields are validated
      changeFormValidationStatus(false)

      console.log("these are the form fields after validation", user)
      //      console.log("user saved", { ...creditorDetails, ...user })
      // here we are saving our creditor information
      updateCreditorDetails({ ...creditorDetails, ...user })
      //  if everything is alright we are opening the model for otp verification
      //  before opening the modal we have to reset the values
      setOtpCode("")
      setOtpVerification(true)

      handleShow()
      //  this function focuses on the first input element
      autoFocus()
      //  we have to call our database api to check whether current creditor
      //  is present or not if yes then save their id
      user["userId"] = decryptedObject.uId
      getCreditorDetails(user, setCreditorId)
      //  we are resetting the form
      //      resetForm()
    }
  }
  const formSubmission = e => {
    e.preventDefault()
    console.log("form fields", user)
    validate()
  }
  //  these states are for the modal using for otp verification
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  //  this state is for storing the otp value
  const [otpCode, setOtpCode] = useState("")

  const [otpVerification, setOtpVerification] = useState(true)

  return (
    <div className='ml-5'>
      <Container fluid className='my-4 mr-2'>
        <Row className={style.filingClaim}>Filing claims just</Row>
        <Row className={style.filingClaim}>became easier.</Row>
      </Container>
      <Form
        id={id.form_id}
        style={{ lineHeight: "1", marginTop: "50px" }}
        onSubmit={formSubmission}
      >
        <Row>
          <Col xs='10'>
            <Form.Group
              onChange={handleChange}
              controlId={id.resolution_professional}
              className={style.formGroup}
            >
              <Form.Label className={style.labelColor}>
                RESOLUTION PROFESSIONAL
              </Form.Label>
              <Form.Control
                className={`${
                  formValidation &&
                  !user[id.resolution_professional] &&
                  style.error
                } ${style.inputColor}`}
                name={id.resolution_professional}
                type='text'
              />
            </Form.Group>
          </Col>
          <Col xs='10'>
            <Form.Group
              controlId={id.registration_number}
              onChange={handleChange}
              className={style.formGroup}
            >
              <Form.Label className={style.labelColor}>
                REGISTRATION NUMBER
              </Form.Label>
              <Form.Control
                className={`${
                  formValidation && !user[id.registration_number] && style.error
                } ${style.inputColor}`}
                name={id.registration_number}
                type='text'
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs='10'>
            <Form.Group
              className={style.formGroup}
              onChange={handleChange}
              controlId={id.creditor}
            >
              <Form.Label className={style.labelColor}>CREDITOR</Form.Label>
              <Form.Control
                className={`${
                  formValidation && !user[id.creditor] && style.error
                } ${style.inputColor}`}
                name={id.creditor}
                type='text'
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs='10'>
            <Form.Group
              className={style.formGroup}
              controlId={id.first_name}
              onChange={handleChange}
            >
              <Form.Label className={style.labelColor}>FIRST NAME</Form.Label>
              <Form.Control
                className={`${
                  formValidation && !user[id.first_name] && style.error
                } ${style.inputColor}`}
                name={id.first_name}
                type='text'
              />
            </Form.Group>
          </Col>
          <Col xs='10'>
            <Form.Group
              className={style.formGroup}
              controlId={id.last_name}
              onChange={handleChange}
            >
              <Form.Label className={style.labelColor}>LAST NAME</Form.Label>
              <Form.Control
                className={`${
                  formValidation && !user[id.last_name] && style.error
                } ${style.inputColor}`}
                name={id.last_name}
                type='text'
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs='10'>
            <Form.Group
              className={style.formGroup}
              onChange={handleChange}
              controlId={id.email_id}
            >
              <Form.Label className={style.labelColor}>EMAIL ID</Form.Label>
              <Form.Control
                className={`${
                  formValidation && !user[id.email_id] && style.error
                } ${style.inputColor}`}
                name={id.email_id}
                type='email'
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs='10'>
            <Form.Group
              className={style.formGroup}
              onChange={handleChange}
              controlId={id.phone_number}
            >
              <Form.Label className={style.labelColor}>PHONE NUMBER</Form.Label>
              <Form.Control
                className={`${
                  formValidation && !user[id.phone_number] && style.error
                } ${style.inputColor}`}
                name={id.phone_number}
                type='tel'
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs='10'>
            <Form.Group className={style.formGroup} onChange={handleChange}>
              <Form.Check
                className={style.radioLabelColor}
                type='radio'
                value='operational'
                label='OPERATIONAL CREDITOR CLAIM'
                name={id.creditor_claim}
                id={id.operational_creditor_claim}
              />

              <Form.Check
                className={style.radioLabelColor}
                type='radio'
                value='financial'
                label='FINANCIAL CREDITOR CLAIM'
                name={id.creditor_claim}
                id={id.financial_creditor_claim}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col className='col-10 text-center'>
            <Button type='submit' className={style.nextButton}>
              NEXT
            </Button>
            {/*  a modal opens when we sumbit all the fields then we have to verify through OTP */}

            <Modal
              show={show}
              onHide={handleClose}
              backdrop='static'
              keyboard={false}
              contentClassName={style.modalBorderRadius}
            >
              <Modal.Body>
                <Row>
                  <Col>
                    <div className='text-right'>
                      <img src={close} alt='close icon' onClick={handleClose} />
                    </div>
                  </Col>
                </Row>
                <Row className={style.modalSecondRow}>
                  <Col>Enter the OTP sent to your registered email ID.</Col>
                </Row>
                <Row className={style.modalThirdRow}>
                  <Col id='otp'>
                    <OtpInput
                      value={otpCode}
                      onChange={setOtpCode}
                      numInputs={4}
                      isInputNum='true'
                      className={style.removeOtpBorder}
                      containerStyle={
                        otpVerification
                          ? `${style.otpInputParent}`
                          : `${style.otpInputParent}  ${style.error}`
                      }
                      inputStyle={style.inputStyle}
                    />
                  </Col>
                </Row>
                <Row className={style.modalFourthRow}>
                  <Col className='text-center'>
                    <Button
                      variant={otpCode.length === 4 ? "primary" : "secondary"}
                      className={style.modalSubmitButton}
                      onClick={() => {
                        console.log("otp code is ", otpCode)
                        if (otpCode === "0000") {
                          nextScreen()
                        } else {
                          setOtpVerification(false)
                        }
                      }}
                    >
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Modal.Body>
            </Modal>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default Middle
