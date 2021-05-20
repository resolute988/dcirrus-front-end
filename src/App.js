import MainScreen from "./Components/MainScreen"
import DashboardScreen from "./Components/DashboardScreen/DashboardScreen"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import auth from "./Components/Authentication/Auth"
import { ToastContainer } from "react-toastify"
import "./App.css"

function App() {
  //  our protected route
  const ProtectedRoute = ({ component: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props => {
          return auth.getLoginStatus() ? (
            <Component {...props} />
          ) : (
            <Redirect to='/' />
          )
        }}
      />
    )
  }
  const Wrapper = ({ render: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props => {
          return auth.getLoginStatus() ? (
            <Redirect to='/dashboard' />
          ) : (
            <Component {...props} />
          )
        }}
      />
    )
  }
  return (
    <div>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnHover
      />
      <Router>
        <Switch>
          {/*  total we have 3 screen login,dashboard and creditor screen */}
          {/*  our public route  login component  */}
          <Wrapper
            exact
            path='/'
            render={props => <MainScreen {...props} login={true} />}
          />
          {/* our private route dashboad component display only when user is login */}
          <ProtectedRoute exact path='/dashboard' component={DashboardScreen} />
          {/* our public route available for everybody but with fixed path otherwise redirect user to main url  */}
          {/*  u_id => user id,u_name => RP username,o_id =>operational id,f_id=> financial id */}
          <Route
            exact
            path='/creditor'
            render={props => <MainScreen {...props} login={false} />}
          />
          {/* our default case if above path will not match then we redirect to main url */}
          <Redirect to='/' />
        </Switch>
      </Router>
    </div>
  )
}

export default App
