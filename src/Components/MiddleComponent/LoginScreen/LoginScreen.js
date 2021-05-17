import { Row, Col, Form, Button, Container } from "react-bootstrap"
import style from "./style.module.css"
import React, { useEffect, useState } from "react"
import download from "../../Assets/download.png"
import { getCaptcha, login } from "../../APIFolder/api"
import { useHistory } from "react-router-dom"
import auth from "../../Authentication/Auth"
import Show from "../../Assets/show.svg"
import eye_slash from "../../Assets/eye.png"
import hide_eye_slash from "../../Assets/hide-eye-slash.png"

//  this is the login Scree for Resolution Representative
const LoginScreen = props => {
  const history = useHistory()
  //  if rp is login then redirect him to dashboard page
  const redirectToDashboard = () => {
    history.push("/dashboard")
  }
  //  this is the function to change the screen
  const { nextScreen } = props

  //  in this state we store our fields values
  const [user, setUser] = useState({})

  //  these are the ids of our form fields to avoid confustion
  const id = {
    email_id: "email_id",
    password: "password",
    captcha: "captcha",
    form_id: "login_screen",
  }

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

  // this state is dedicated to know whether we have to start validation process or not
  const [formValidation, setFormValidation] = useState(false)
  //  it tells us whether validation is started or not
  const changeFormValidationStatus = validationStatus => {
    setFormValidation(validationStatus)
  }
  //  this is the place where real validation happens
  const validate = async () => {
    const {
      [id.email_id]: email_id,
      [id.password]: password,
      [id.captcha]: captcha,
    } = user
    if (
      email_id === undefined ||
      email_id === "" ||
      password === undefined ||
      password === "" ||
      captcha === undefined ||
      captcha === ""
    ) {
      changeFormValidationStatus(true)
    } else {
      //  now everything is alright
      //  fields are validated
      changeFormValidationStatus(false)

      console.log("these are the form fields after validation", user)
      const { email_id: userName, password, captcha: captchaStr } = user

      const corporateId = "0"
      const deviceId = "VIJAYMATHUR20202025GMAILCOM"

      const requestBody = {
        userValidateDto: {
          userName: userName,
          password: password,
          lawFirmNumber: corporateId,
          deviceId: deviceId,
          captcaStr: captchaStr,
          rememberMe: 0,
          captcaIdentifier: captchaObj.identifier,
        },
        deviceDto: {
          lawFirmNumber: corporateId,
          loginId: userName,
          deviceId: deviceId,
          remoteAddress: "1.1.1.1",
          deviceType: "desktop",
          deviceName: "Web Browser",
          remoteAddressV4: "1.1.1.1",
          geoLocation: "",
          regNew: "browser",
        },
      }

      //  api call for login
      console.log("login request", requestBody)
      //  first parameter represents the body username ,password, identifier and captcha
      //  second parameters represents the function to store the token in localStorage received from the login api
      // third parameter is also a function to redirect user to dashboard
      login(requestBody, auth.login, redirectToDashboard)
      //      auth.setLogin()
      //     history.push("/dashboard")

      //  if everything is alright we are opening the model for otp verification
      //  before opening the modal we have to reset the values
    }
  }
  const formSubmission = e => {
    e.preventDefault()
    console.log("form fields", user)
    validate()
  }

  const [captchaObj, setCaptchaObj] = useState("")

  useEffect(() => {
    getCaptcha(setCaptchaObj)
  }, [])
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={style.loginScreen}>
      <div className='my-4 pl-3'>
        <Row className={style.filingClaim}>Filing claims just</Row>
        <Row className={style.filingClaim}>became easier.</Row>
      </div>
      <Form
        id={id.form_id}
        className={style.formClass}
        onSubmit={formSubmission}
      >
        <Row>
          <Col xs='11'>
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
          <Col xs='11'>
            <Form.Group
              className={style.formGroup}
              onChange={handleChange}
              controlId={id.password}
            >
              <Form.Label className={style.labelColor}>PASSWORD</Form.Label>
              <div className='mb-3 d-flex align-items-center'>
                <Form.Control
                  className={`${
                    formValidation && !user[id.password] && style.error
                  } ${style.inputColor}`}
                  name={id.password}
                  type={showPassword ? "text" : "password"}
                  style={{ paddingRight: "40px", color: "#6F6D73" }}
                />
                <span
                  className={style.showPassword}
                  onClick={() => {
                    setShowPassword(!showPassword)
                  }}
                >
                  <img src={showPassword ? hide_eye_slash : eye_slash} alt='' />
                </span>
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs='11'>
            <Form.Group
              className={style.formGroup}
              onChange={handleChange}
              controlId={id.captcha}
            >
              <Form.Label className={style.labelColor}>
                <img src={captchaObj.img} alt='Captcha' />
              </Form.Label>
              <Form.Control
                className={`${
                  formValidation && !user[id.captcha] && style.error
                } ${style.inputColor}`}
                name={id.captcha}
                type='text'
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className={style.loginRow}>
          <Col xs='11'>
            <Button type='submit' className={`${style.nextButton} `}>
              LOGIN
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default LoginScreen
