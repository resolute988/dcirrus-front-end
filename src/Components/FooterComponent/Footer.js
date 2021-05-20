import style from "./style.module.css"
import { Row, Container } from "react-bootstrap"
import dcirrus_white from "../Assets/dcirrus_white.png"

const Footer = props => {
  const { login } = props

  return (
    <Container fluid>
      <Row className={style.footer}>
        <p className={style.footerChild1}>
          © 2020 DCirrus. &nbsp; All Rights Reserved.
        </p>
        <div className={style.footerChild2}>
          <p className={style.footerChild2Items}>Privacy notice</p>
          <p className={style.footerChild2Items}>Terms of Use</p>
        </div>
        {login && (
          <div className={style.footerChild3}>
            <p className={style.footerChild3Items}>powered by</p>
            <img
              className={style.footerChild3ItemsImage}
              src={dcirrus_white}
              alt=''
            />
          </div>
        )}
      </Row>
    </Container>
  )
}

export default Footer
