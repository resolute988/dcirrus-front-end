import style from "./style.module.css"
import { Row, Col, Container } from "react-bootstrap"
import dcirrus_white from "../Assets/dcirrus_white.png"

const Footer = props => {
  const { login } = props

  return (
    <Container fluid>
      <Row className={style.footer}>
        <Col xs='12' lg={login ? "4" : "6"}>
          <p> © 2021 DCirrus. &nbsp; All Rights Reserved.</p>
        </Col>
        <Col xs='12' sm='6' lg={login ? "2" : "3"}>
          <a
            href='https://dcirrus.com/privacy-policy/'
            target='new_tab'
            className={style.footerChild2Items}
          >
            Privacy Policy
          </a>
        </Col>
        <Col xs='12' sm='6' lg={login ? "2" : "3"}>
          <a
            href='https://dcirrus.com/terms-of-service/'
            target='new_tab'
            className={style.footerChild2Items}
          >
            Terms of Use
          </a>
        </Col>
        {login && (
          <Col xs='12' lg='4'>
            <p style={{ display: "inline-block", paddingRight: "15px" }}>
              powered by
            </p>
            <a href='https://dcirrus.com' target='new_tab'>
              <img
                className={style.footerChild4ItemsImage}
                src={dcirrus_white}
                alt='DCirrus Logo'
              />
            </a>
          </Col>
        )}
      </Row>
    </Container>
  )
}

export default Footer
