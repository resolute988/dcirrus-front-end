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
import {exportLogs} from "../APIFolder/api"
import file from "../Assets/creditor.xlsx"


const Header = props => {
  const { login } = props
  const history = useHistory()
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const items = [
    {
    name:"DRIVE",
    click:()=>{ window.open("http://dev.dcirrus.info/appnew/drive.html", "new_tab")}
  },
  {
    name:"EXPORT",
    click:()=>{
      //  this api will fetch details from database and will create a excel sheet 
      exportLogs() }
  },
  
  {
    name: "RP PORTAL",
    click:()=>{}}
]
const fileName = 'TechnicalAdda'

  const viewers = [

    {id:1,name:'sakumar'},

    {id:2,name:'kumar'}

  ]
  return (
    <Container fluid>
      <Row className={style.navbar}>
        <a href='/'>
          <img alt='Resolute' className={style.logo} src={logo} />
        </a>
        {/*  for smaller screens */}
        <div className={style.hamburgerMenu}>
          <Hamburger toggled={isSidebarOpen} toggle={setSidebarOpen} />
          {login ? (
            <Sidebar
              bgColor='black'
              isCollapsed={!isSidebarOpen}
              classes={isSidebarOpen ? style.sidebarOpen : style.sidebarClose}
            >
              {items.map((obj, index) => {
                return (
                  <Item bgColor='black' onClick={obj.click}>
                   
                      <Button variant='secondary' block>
                        {obj.name}
                      </Button>
                  </Item>
                )
              })}

              <Item
                bgColor='black'
                onClick={() => {
                  auth.logout()
                  history.push("/")
                }}
              >
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
                <Button
                  variant='info'
                  onClick={() => {
                    window.open("https://ibbi.gov.in/home/downloads", "new_tab")
                  }}
                  block
                >
                  DOWNLOAD IBBI FORMS
                </Button>
              </Item>
            </Sidebar>
          )}
        </div>
        {/*  for larger screens */}
        {login ? (
          <div className={style.rightSideBar}>
            <a href="http://dev.dcirrus.info/appnew/drive.html" target="new_tab" className={style.contactUs}>
              DRIVE 
            </a>
            <Button size="lg" disabled={!auth.isRootFolderSelected()} onClick={()=>{
              exportLogs()
  }}>
             EXPORT 
            </Button>
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
          <a
            href='https://ibbi.gov.in/home/downloads'
            target='new_tab'
            className={style.downloadForm}
          >
            DOWNLOAD IBBI FORMS
          </a>
        )}
      </Row>
    </Container>
  )
}

export default Header
