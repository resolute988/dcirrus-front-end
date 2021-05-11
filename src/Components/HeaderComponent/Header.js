import style from "./style.module.css"
import logo from "../Assets/main_logo.png"
import { Row, Container, DropdownButton, Dropdown } from "react-bootstrap"
import notification from "../Assets/notification.png"
import face from "../Assets/face.png"
import group from "../Assets/group.png"
import { useHistory } from "react-router-dom"

import auth from "../Authentication/Auth"

const Header = props => {
  const { login } = props
  const history = useHistory()

  return (
    <Container fluid>
      <Row className={style.navbar}>
        <a href='/'>
          <img alt='Resolute' className={style.logo} src={logo} />
        </a>
        {login ? (
          <div className={style.rightSideBar}>
            <a href='#' className={style.contactUs}>
              CONTACT US
            </a>
            <img src={notification} alt='' />
            <a href='#' className={` ${style.rpPortal}`}>
              <img src={face} alt='' />
              <DropdownButton
                id='dropdown-basic-button'
                className={style.dropdownMenu}
                title='RP PORTAL'
              >
                <Dropdown.Item
                  href='#'
                  onClick={() => {
                    auth.logout()
                    history.push("/")
                  }}
                >
                  <p className='d-flex m-0'>
                    <img src={group} className='mr-3' alt='Log Out' />
                    Log out
                  </p>
                </Dropdown.Item>
              </DropdownButton>
            </a>
          </div>
        ) : (
          <a href='#' className={style.downloadForm}>
            DOWNLOAD IBBI FORMS
          </a>
        )}
      </Row>
    </Container>
  )
}

export default Header
