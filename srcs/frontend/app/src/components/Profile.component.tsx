import AuthService from "../services/authReq.service";
//import userService from "../services/user.service";
import GenerateQr from '../components/GenerateQR.component'
//import Input from "react-validation/build/input";
//import { vrequired } from "../services/formValidation.service";
//import Form from "react-validation/build/form";
//import classes from './Login.component.module.css'

const Profile = () => {
  //const currentUser = AuthService.getCurrentUser();
  //userService.findByUsername(currentUser.user_pseudo);
 // const form = useRef();

 // const [buttonOn, setButtonOn] = useState(false);
 // const [isFormOn, setIsFormOn] = useState(false);
 // const [errorMessage, setErrorMessage] = useState("");
 // const [twoFaCode, setTwoFaCode] = useState("");

  const handleTwoFa = event => {
    event.preventDefault();
   // setErrorMessage("");
    AuthService.ActivateTwoFa("");

  }

  /*const onChangetwoFaCode = event => {
      const twoFaCode = event.target.value;
      //setTwoFaCode(twoFaCode);
  }*/

  	return (
    /*<div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.user_pseudo}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Token:</strong> {currentUser.user_JWT.substring(0, 20)} ...{" "}
        {currentUser.user_JWT.substr(currentUser.user_JWT.length - 20)}
      </p>
      <p>
        <strong>Id:</strong> {currentUser.user_id}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.user_mail}
      </p>*/
        
      <div className="card" style={{width: '25rem', margin: '1rem', padding: '3rem'}}>
          <h5 className="card-title">Two-Factor Authentication</h5>
          <GenerateQr/>
          <div className="card-body">
          </div>
          <button className='btn btn-primary btn-block' onClick={handleTwoFa}>Activate</button>
      </div>
  );
};

export default Profile;
