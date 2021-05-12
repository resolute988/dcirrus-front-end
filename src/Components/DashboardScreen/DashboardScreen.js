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

//  this is the middleComponent
const DashboardScreen = props => {
  const [folders, setFolders] = useState([])

  useEffect(() => {
    getFolders(setFolders)
    // deleteUrls()
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
  const loginStatus = auth.getLoginStatus()

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
                lg='8'
                className={`${style.firstRowFirstColumn} d-flex justify-space-between`}
              >
                <div> MY COMPANIES </div>
                <div className='d-inline-block ml-5'>
                  {toggleCreateFolder ? (
                    <Button
                      variant='primary'
                      className=' text-uppercase'
                      size='lg'
                      onClick={() => {
                        setToggleCreateFolder(!toggleCreateFolder)
                      }}
                    >
                      create company
                    </Button>
                  ) : (
                    <Form.Control
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
                </div>
              </Col>

              <Col lg='4' className={style.firstRowSecondColumn}>
                <div className='d-flex align-items-center'>
                  <Form.Control
                    type='text'
                    className={style.searchFolder}
                    onChange={e => {
                      setSearchValue(e.target.value)
                    }}
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
              <Col lg='8' className={style.secondRowFirstColumn}>
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

                            //  first have to call our database for url
                            //  our mongodb database
                            //                            getUrl(obj, setSpecialUrl)
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
                <Col lg='4' className={style.secondRowSecondColumn}>
                  <div className={style.folderInformationBlock}>
                    <span className={style.selectedFolderName}>
                      {folderName}
                    </span>
                    <hr className='mb-2' />

                    <span className={style.folderCreationDate}>
                      Created on 30th March, 2021
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
                                window.navigator.clipboard.writeText(specialUrl)
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
