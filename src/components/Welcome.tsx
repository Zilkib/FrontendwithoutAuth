import { Link } from "react-router-dom";
import "./styles/WelcomeScreen.css";
//import { useAuth0 } from "@auth0/auth0-react";
//import LoginButton from "./elements/LoginButton";
//import LogoutButton from "./elements/LogoutButton";
//import React, { useState } from "react";
import {
  faSearch,
  faPlus,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";


Modal.setAppElement("#root");

function Welcome() {
  //const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  //const [isModalOpen, setModalOpen] = useState<boolean>(false);
  //const [token, setToken] = useState<string>("");


  /*
  async function accessToken() {
    const fetchedToken = await getAccessTokenSilently();
    setToken(fetchedToken);
    setModalOpen(true);
  }
  
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(token);
      console.log("Token copied to clipboard");
      setModalOpen(false); // Close the modal after copying
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }
  */

  return (
    <div className="welcome-screen">
      <h1 className="welcome-screen-title">
        Welcome to the Patients Management System
      </h1>

        <div className="welcome-screen-options ">
          <Link to="/patient" className="welcome-screen-option search">
            <div className="option-content">
              <FontAwesomeIcon icon={faSearch} className="option-icon" />
              <span className="welcome-screen-option-text">
                Search and View Patients
              </span>
            </div>
          </Link>
          <Link to="/add" className="welcome-screen-option add">
            <div className="option-content">
              <FontAwesomeIcon icon={faPlus} className="option-icon" />
              <span className="welcome-screen-option-text">
                Add a New Patient
              </span>
            </div>
          </Link>
          <Link to="/condition" className="welcome-screen-option search">
					<div className="option-content">
						<FontAwesomeIcon icon={faSearch} className="option-icon" />
						<span className="welcome-screen-option-text">
							Search and View Conditions
						</span>
					</div>
				</Link>
          <Link to="/addCondition" className="welcome-screen-option add">
					<div className="option-content">
						<FontAwesomeIcon icon={faPlus} className="option-icon" />
						<span className="welcome-screen-option-text">
							Add a New Condition
						</span>
					</div>
				</Link>
         <Link to="/observations" className="welcome-screen-option observations">
          <div className="option-content">
            <FontAwesomeIcon icon={faStethoscope} className="option-icon" />
            <span className="welcome-screen-option-text">
              All Observations
            </span>
            </div>
          </Link>
        </div>
    </div>
  );
}

export default Welcome;
