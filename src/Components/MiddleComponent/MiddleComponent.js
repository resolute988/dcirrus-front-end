import { Row, Col, Container } from "react-bootstrap"
import style from "./style.module.css"
import middle_icon from "../Assets/middle_icon.png"
import dcirrus from "../Assets/dcirrus.png"
import React, { useState } from "react"

import CreditorDetailScreen from "./CreditorDetailScreen/CreditorDetailScreen"
import SuccessfullSubmissionScreen from "./SuccessfullSubmissionScreen/SuccessfullSubmissionScreen"
import UploadScreen from "./UploadScreen/UploadScreen"

//  this is the middleComponent
const Middle = props => {
  //  all the screens we have 3 screens
  const componentList = [
    "creditor_detail_screen",
    "upload_screen",
    "successfull_submission_screen",
  ]

  //  index of current screen we will trigger this function when we have to change the screen
  const [currentScreen, setCurrentScreen] = useState(0)

  const nextScreen = () => {
    var screenNo = currentScreen + 1
    if (screenNo === componentList.length) {
      screenNo = 0
    }

    setCurrentScreen(screenNo)
  }

  const components = {
    creditor_detail_screen: (
      <CreditorDetailScreen nextScreen={nextScreen} {...props} />
    ),
    upload_screen: <UploadScreen nextScreen={nextScreen} {...props} />,
    successfull_submission_screen: (
      <SuccessfullSubmissionScreen nextScreen={nextScreen} />
    ),
  }

  return (
    <Container fluid>
      <Row className={style.firstRow}>
        <div className={style.firstColumn}>
          {components[componentList[currentScreen]]}
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
