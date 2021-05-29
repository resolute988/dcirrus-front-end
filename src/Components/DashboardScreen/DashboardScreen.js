import {
  Row,
  Col,
  Form,
  Button,
  Container,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap"
import style from "./style.module.css"
import React, { useState, useRef, useEffect } from "react"

import folder from "../Assets/folder.png"
import search from "../Assets/search.png"
import close from "../Assets/close_light_bg.png"

import Header from "../HeaderComponent/Header"
import Footer from "../FooterComponent/Footer"

import auth from "../Authentication/Auth"
import { getFolders, createRootFolder, getSubFolders } from "../APIFolder/api"
import copy from "copy-to-clipboard"
import dateFormat from "dateformat"

//  this is the middleComponent
const DashboardScreen = props => {
  const list = [
  ]
  const [folders, setFolders] = useState([])

  useEffect(() => {
    getFolders(setFolders)
  }, [])

  //  to track the selected folder
  const [folderSelected, setFolderSelected] = useState(-1)
  //  also have to select folder name
  const [folderName, setFolderName] = useState(folders[folderSelected])

  //  store search value for searching folders
  const [searchValue, setSearchValue] = useState("")

  const searchElement = useRef(null)
  const searchElementAutoFocus = () => {
    searchElement.current.focus()
  }

  //  when we click on a button it will open an input box and hide the button and when we enter it will create a folder
  //  after clicking enter button again button will display and input box is hide

  const [toggleCreateFolder, setToggleCreateFolder] = useState(true)
  const [newFolder, setNewFolder] = useState("")

  //  this is our special url to the company folder where creditor will  go and upload their documents
  const [specialUrl, setSpecialUrl] = useState("")
  const loginStatus = auth.getLoginStatus() || true

  const creditorTooltip = useRef(null)

  const tooltip = Object.freeze({
    beforeClick: "copy",
    afterClick: "copied...",
  })
  const [tooltipText, setTooltipText] = useState("")

  return (
    <>
      <Header login={loginStatus} />
      <Container fluid>
        <div className={style.loginScreen}>
          <Container fluid className={style.mainContainer}>
            <Row className={style.firstRow}>
              <Col
                md='4'
                sm='12'
                xs='12'
                className={`${style.firstRowFirstColumn} d-flex justify-space-between`}
              >
                MY COMPANIES
              </Col>
              <Col md='4' sm='6' xs='11'>
                {toggleCreateFolder ? (
                  <Button
                    variant='success'
                    className=' text-uppercase'
                    size='lg'
                    style={{ borderRadius: "30px" }}
                    block
                    onClick={() => {
                      setToggleCreateFolder(!toggleCreateFolder)
                    }}
                  >
                    create
                  </Button>
                ) : (
                  <Form.Control
                    style={{ borderRadius: "30px" }}
                    onBlur={() => {
                      setNewFolder("")
                      setToggleCreateFolder(!toggleCreateFolder)
                    }}
                    value={newFolder}
                    onChange={e => {
                      //  these are the special characters which we dont want to allow while creating a new folder
                      const notAllowed = "\\/:*?<>|# "

                      //  if these characters present  then we dont save that value
                      if (
                        !notAllowed.includes(
                          e.target.value[e.target.value.length - 1]
                        )
                      ) {
                        setNewFolder(e.target.value)
                      } else if (
                        e.target.value[e.target.value.length - 1] === " " &&
                        newFolder !== ""
                      ) {
                        setNewFolder(e.target.value)
                      }
                    }}
                    onKeyPress={e => {
                      if (e.key === "Enter") {
                        if (newFolder !== "") {
                          // first is the new root folder name
                          //  second is the function to set the array of folders
                          createRootFolder(newFolder, setFolders)

                          setToggleCreateFolder(!toggleCreateFolder)
                          setNewFolder("")
                        }
                      }
                    }}
                    autoFocus
                    size='lg'
                    type='text'
                  />
                )}
              </Col>

              <Col md='4' sm='6' xs='12' className={style.firstRowSecondColumn}>
                <div className='d-flex align-items-center'>
                  <Form.Control
                    type='text'
                    style={{ borderRadius: "30px" }}
                    className={style.searchFolder}
                    onChange={e => {
                      setSearchValue(e.target.value)
                    }}
                    size='lg'
                    ref={searchElement}
                    value={searchValue}
                  />
                  <span
                    className={style.removeFileIcon}
                    onClick={
                      searchValue === ""
                        ? () => {}
                        : () => {
                            setSearchValue("")
                            searchElementAutoFocus()
                          }
                    }
                  >
                    <img
                      src={searchValue === "" ? search : close}
                      alt='Remove files'
                    />
                  </span>
                </div>
              </Col>
            </Row>
            <Row className={style.secondRow}>
              <Col
                xs='12'
                lg={folderSelected === -1 ? "12" : "7"}
                className={style.secondRowFirstColumn}
              >
                {folders
                  .filter(folderObj => folderObj.folderNM.includes(searchValue))
                  .map((obj, index) => {
                    return (
                      <div
                        key={index}
                        className={
                          index === folderSelected
                            ? `${style.folderSelected} ${style.folderBlock} ${style.hoverOnFolder}`
                            : `${style.hoverOnFolder} ${style.folderBlock}`
                        }
                        onClick={() => {
                          if (folderSelected !== index) {
                            setFolderSelected(index)
                            setFolderName(obj.folderNM)
                            getSubFolders(obj, setSpecialUrl)
                          }
                        }}
                      >
                        <img src={folder} alt='' />
                        <p className={style.folderName}>{obj.folderNM}</p>
                      </div>
                    )
                  })}
              </Col>

              {folderSelected !== -1 ? (
                <Col
                  xs='12'
                  sm='10'
                  md='8'
                  lg='5'
                  className={style.secondRowSecondColumn}
                >
                  <div className={style.folderInformationBlock}>
                    <span className={style.selectedFolderName}>
                      {folderName}
                    </span>
                    <hr className='mb-2' />

                    <span className={style.folderCreationDate}>
                      Created on {dateFormat(folders[folderSelected].fileCreatedDate, "dS mmmm, yyyy ")}
                    </span>

                    <div className={style.claimsReceived}>
                      Claims Received: 45
                    </div>
                    <div className={style.creditorClaims}>
                      <span>Operational Creditor Claims: 20</span> <br />
                      <span>Financial Creditor Claims: 25</span>
                    </div>
                    <div className='mb-3'>
                      <div className={style.linkBlock}>
                        <p className={style.link}>{specialUrl.substr(0, 50)}</p>
                        <p className='m-0'>
                          <OverlayTrigger
                            delay={{ show: 250, hide: 500 }}
                            onEnter={() => {
                              setTooltipText(tooltip.beforeClick)
                            }}
                            overlay={
                              <Tooltip id='overlay tooltip'>
                                <span
                                  style={
                                    tooltipText === tooltip.afterClick
                                      ? {
                                          color: "yellow",
                                          fontWeight: "bold",
                                        }
                                      : {}
                                  }
                                >
                                  {tooltipText}
                                </span>
                              </Tooltip>
                            }
                            placement='top'
                          >
                            <Button
                              className={style.linkButton}
                              onClick={() => {
                                copy(specialUrl)
                                setTooltipText(tooltip.afterClick)
                              }}
                              ref={creditorTooltip}
                            >
                              Copy Link
                            </Button>
                          </OverlayTrigger>
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>
              ) : (
                ""
              )}
            </Row>
          </Container>
        </div>
      </Container>
      <Footer login={loginStatus} />
    </>
  )
}

export default DashboardScreen
