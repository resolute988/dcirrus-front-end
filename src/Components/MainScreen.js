import React, { Component } from "react"
import Footer from "./FooterComponent/Footer"
import Header from "./HeaderComponent/Header"
import MiddleComponent from "./MiddleComponent/MiddleComponent"

class CreditorScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      creditorDetails: {
        c_obj: {},
        c_id: "",
        f_obj: {
          form_name: "",
          files: [],
        },
        u_status: false,
      },
    }
  }

  //  our creditor details
  updateCreditorDetails = obj => {
    this.setState({ creditorDetails: obj })
  }
  render() {
    const { login } = this.props

    return (
      <div>
        <Header />
        <MiddleComponent
          {...this.props.match.params}
          creditorDetails={{
            creditor: this.state.creditorDetails,
            updateCreditorDetails: this.updateCreditorDetails,
          }}
          login={login}
        />
        <Footer />
      </div>
    )
  }
}

export default CreditorScreen
