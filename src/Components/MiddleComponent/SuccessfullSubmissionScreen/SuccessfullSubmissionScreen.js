import { Row, Col, Button, Container } from "react-bootstrap"
import style from "./style.module.css"
import React, { useEffect } from "react"
import {sendEmailToClaimant,sendEmailToRP} from "../../APIFolder/api"


const AfterSubmission = props => {
  //  this is the function to change the screen
  const { nextScreen, creditorDetails } = props.methods
useEffect(()=>{
const obj={creditorDetails}
sendEmailToClaimant(obj)
sendEmailToRP(obj)

},[])
  return (
    <Container fluid className={style.mainBlock}>
      <Row className={style.firstRow}>
        <Col>FORM SUBMITTED SUCCESSFULLY!</Col>
      </Row>
      <Row className={style.secondRow}>
        <Col>A COPY OF THE FORM HAS BEEN SENT TO YOUR REGISTERED EMAIL ID.</Col>
      </Row>
      <Row className={style.thirdRow}>
        <Col>
          <Button className={style.nextButton} onClick={() => {
           setTimeout(()=>{
          window.location.reload()
           },500)
           nextScreen()}}>
            FILE ANOTHER CLAIM
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default AfterSubmission
