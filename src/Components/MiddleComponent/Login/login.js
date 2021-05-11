import { Row, Col, Container } from "react-bootstrap"
import style from "./style.module.css"
import middle_icon from "../../Assets/middle_icon.png"
import dcirrus from "../../Assets/dcirrus.png"
import React from "react"

import Header from "../../HeaderComponent/Header"
import Footer from "../../FooterComponent/Footer"

import LoginScreen from "../LoginScreen/LoginScreen"
import auth from "../../Authentication/Auth"

//  our login screen
const Login = () => {
  return (
    <>
      <Header />
      <Container fluid>
        <Row className={style.firstRow}>
          <div className={style.firstColumn}>
            <LoginScreen />
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
      <Footer />
    </>
  )
}

export default Login
