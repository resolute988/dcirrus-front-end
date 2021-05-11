import React, { Component } from "react"
import Footer from "./FooterComponent/Footer"
import Header from "./HeaderComponent/Header"
import MiddleComponent from "./MiddleComponent/MiddleComponent"

class CreditorScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      creditorDetails: {},
    }
    console.log("props", this.props)
  }

  //  our creditor details
  updateCreditorDetails = obj => {
    this.setState({ creditorDetails: obj })
  }
  render() {
    return (
      <div>
        <Header />
        <MiddleComponent
          {...this.props.match.params}
          creditorDetails={this.state.creditorDetails}
          updateCreditorDetails={this.updateCreditorDetails}
        />
        <Footer />
      </div>
    )
  }
}

export default CreditorScreen
