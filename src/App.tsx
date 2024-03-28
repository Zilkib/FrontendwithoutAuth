import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./input.css";
import PatientForm from "./components/Patients/PatientInput";
import PatientList from "./components/Patients/ViewPatients";
import Welcome from "./components/Welcome";
import PatientDetails from "./components/Patients/PatientDetails";
import ObservationInput from "./components/Observations/ObservationInput";
import ObservationDetails from "./components/Observations/ObservationDetails";
import PatientObservationsList from "./components/Observations/PatientObservationsList";
import { AuthenticationGuard } from "./components/Utils/AuthenticationGuard";
import ObservationAll from "./components/Observations/ObservationAll";
import ConditionInput from "./components/Conditions/ConditionInput";
import ConditionList from './components/Conditions/ViewConditions';
import ConditionDetails from './components/Conditions/ConditionDetails';


function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route
            path="/patient"
            element={<AuthenticationGuard component={PatientList} />}
          />
          <Route
            path="/observations"
            element={<AuthenticationGuard component={ObservationAll} />}
          />
          <Route
            path="/add"
            element={<AuthenticationGuard component={PatientForm} />}
          />
          <Route
            path="/patient/:patientId"
            element={<AuthenticationGuard component={PatientDetails} />}
          />
          <Route
            path="/observations/:patientId"
            element={
              <AuthenticationGuard component={PatientObservationsList} />
            }
          />
          <Route
            path="/observations/addObservation/:patientId"
            element={<AuthenticationGuard component={ObservationInput} />}
          />
          <Route 
            path="/addCondition" 
            element = {<AuthenticationGuard component={ConditionInput} />}
          />
          <Route path="/observation/:observationId" 
          element={<AuthenticationGuard component={ObservationDetails} />}
          />
          <Route
						path="/condition/:conditionId"
						element={<AuthenticationGuard component={ConditionDetails} />}
					/>
          <Route
						path="/condition"
						element={<AuthenticationGuard component={ConditionList} />}
					/>


        </Routes>
      </div>
    </Router>
  );
}

export default App;
