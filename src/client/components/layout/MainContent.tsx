import { Route, Routes } from "react-router-dom";

// import pages
import Home from "../pages/Home";
import Appointments from "../pages/Appointments";
import Claims from "../pages/Claims";
import Patients from "../pages/Patients";

function MainContent() {
  return (
    <div className="main-content-wrapper">
      {/* <h1>--MainContent--</h1> */}
      <Routes>
        {/* <Route path="/" exact element={<Home />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/patients" element={<Patients />} />
      </Routes>
    </div>
  );
}

export default MainContent;
