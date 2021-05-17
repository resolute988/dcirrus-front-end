import style from "./style.module.css"
import logo from "../Assets/main_logo.png"
import {
  Row,
  Container,
  DropdownButton,
  Dropdown,
  Button,
  Collapse,
} from "react-bootstrap"
import notification from "../Assets/notification.png"
import face from "../Assets/face.png"
import group from "../Assets/group.png"
import { useHistory, Link } from "react-router-dom"
import auth from "../Authentication/Auth"
import Hamburger from "hamburger-react"
import { useState } from "react"
import {
  Sidebar,
  InputItem,
  DropdownItem,
  Item,
  Toggler,
} from "react-sidebar-ui"
const Header = props => {
  const { login } = props
  const history = useHistory()
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const items = [" CONTACT US", "NOTIFICATIONS", "  RP PORTAL"]
  return (
    <Container fluid>
      <Row className={style.navbar}>
        <a href='/'>
          <img alt='Resolute' className={style.logo} src={logo} />
        </a>
        <div className={style.hamburgerMenu}>
          <Hamburger toggled={isSidebarOpen} toggle={setSidebarOpen} />
          {login ? (
            <Sidebar
              bgColor='black'
              isCollapsed={!isSidebarOpen}
              classes={isSidebarOpen ? style.sidebarOpen : style.sidebarClose}
            >
              {items.map((item, index) => {
                return (
                  <Item bgColor='black'>
                    {true ? (
                      <Button variant='secondary' block>
                        {item}
                      </Button>
                    ) : (
                      item
                    )}
                  </Item>
                )
              })}

              <Item bgColor='black'>
                <img src={group} className='mr-3' alt='Log Out' />
                Log out
              </Item>
            </Sidebar>
          ) : (
            <Sidebar
              bgColor='black'
              isCollapsed={!isSidebarOpen}
              classes={isSidebarOpen ? style.sidebarOpen : style.sidebarClose}
            >
              <Item bgColor='black'>
                <Button variant='secondary' block>
                  DOWNLOAD IBBI FORMS
                </Button>
              </Item>
            </Sidebar>
          )}
        </div>

        {login ? (
          <div className={style.rightSideBar}>
            <Link className={style.contactUs}>CONTACT US</Link>
            <Link>
              <img src={notification} alt='' />
            </Link>

            <Link className={` ${style.rpPortal}`}>
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
            </Link>
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
