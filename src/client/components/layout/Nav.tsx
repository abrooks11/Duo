import { NavLink} from "react-router-dom";

function Nav() {
  const activePage = window.location.pathname;
  // console.log("CURRENT URL pathname: ", activePage);

  return (
    <nav className="nav-wrapper">
      {/* <h1>--Nav--</h1> */}
      <ul>
          <NavLink to="/" 
          className={({ isActive }) => (isActive ? 'active-page' : '')} end><li>Home</li></NavLink>
        
          <NavLink to="/appointments" 
          className={({ isActive }) => (isActive ? 'active-page' : '')}><li>Appointments</li></NavLink>
        
        
          <NavLink to="/claims" 
          className={({ isActive }) => (isActive ? 'active-page' : '')}><li>Claims</li></NavLink>
        
        
          <NavLink to="/patients" 
          className={({ isActive }) => (isActive ? 'active-page' : '')}><li>Patients</li></NavLink>

          <NavLink to="/voicemail" 
          className={({ isActive }) => (isActive ? 'active-page' : '')}><li>Voicemail</li></NavLink>
        
      </ul>
    </nav>
  );
}

export default Nav;

