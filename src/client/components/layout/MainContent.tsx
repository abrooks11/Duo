import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// import pages
import Home from '../../pages/Home';
import Appointments from '../../pages/Appointments';
import Claims from '../../pages/Claims';
import Patients from '../../pages/Patients';
import Voicemail from '../../pages/Voicemail';
import Demo from '../../pages/Demo';
import Payments from '../../pages/Payments';
import Reports from '../../pages/Reports';
import Tebra from '../../pages/Tebra';

function MainContent() {
  return (
    <div className="main-content-wrapper">
      {/* <h1>--MainContent--</h1> */}
      <ToastContainer />
      <Routes>
        {/* <Route path="/" exact element={<Home />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/voicemail" element={<Voicemail />} />
        <Route path="/tebra" element={<Tebra />} />
        <Route path="/demo" element={<Demo />} />
      </Routes>
    </div>
  );
}

export default MainContent;
