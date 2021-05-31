import { Row, Col, Container, Button } from "react-bootstrap"
import style from "./style.module.css"
import middle_icon from "../Assets/middle_icon.png"
import dcirrus from "../Assets/dcirrus.png"
import React, { useState } from "react"

import CreditorDetailScreen from "./CreditorDetailScreen/CreditorDetailScreen"
import SuccessfullSubmissionScreen from "./SuccessfullSubmissionScreen/SuccessfullSubmissionScreen"
import UploadScreen from "./UploadScreen/UploadScreen"
import { useHistory } from "react-router-dom"
import LoginScreen from "./LoginScreen/LoginScreen"

//  this is the middleComponent
const Middle = props => {
  const { login } = props
  const history = useHistory()
  //  all the screens we have 3 screens
  const componentList = [
    "creditor_detail_screen",
    "upload_screen",
    "successfull_submission_screen",
  ]

  //  index of current screen we will trigger this function when we have to change the screen
  const [currentScreen, setCurrentScreen] = useState(0)
  //  this is the id returned from database if creditor is present
  const [creditorId, setCreditorId] = useState("")
  const nextScreen = () => {
    var screenNo = currentScreen + 1
    if (screenNo === componentList.length) {
      screenNo = 0
    }

    setCurrentScreen(screenNo)
  }
  const methods = { nextScreen, ...props, setCreditorId }
  const components = {
    creditor_detail_screen: <CreditorDetailScreen methods={methods} />,
    upload_screen: <UploadScreen methods={methods} />,
    successfull_submission_screen: (
      <SuccessfullSubmissionScreen methods={methods} />
    ),
  }
  const Sidebar = () => {
    return (
      <div className={style.sidebar}>
        <Button size='sm' onClick={() => nextScreen()}>
          Screen {currentScreen + 1}
        </Button>
        <Button size='sm' onClick={() => history.push("/")}>
          login
        </Button>
        <Button size='sm' onClick={() => history.push("/dashboard")}>
          dashboard
        </Button>
      </div>
    )
  }
  return (
    <Container fluid>
      {/* <Sidebar /> */}

      <Row className={style.firstRow}>
        <div className={style.firstColumn}>
          {login ? <LoginScreen /> : components[componentList[currentScreen]]}
        </div>
        <Col className={style.secondColumn}>
          <img
            className={style.middleIcon}
            src={middle_icon}
            alt='Middle Icon'
          />
          <span className={style.dcirrusBlock}>
            powered by{" "}
            <img className={style.dcirrusImage} src={dcirrus} alt='dcirrus' />
          </span>
        </Col>
      </Row>
    </Container>
  )
}

export default Middle
