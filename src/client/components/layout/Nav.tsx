import { NavLink } from 'react-router-dom';

function Nav() {
  const activePage = window.location.pathname;
  // console.log("CURRENT URL pathname: ", activePage);

  return (
    <nav className="nav-wrapper">
      {/* <h1>--Nav--</h1> */}
      <ul>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'active-page' : '')}
          end
        >
          <li>Home</li>
        </NavLink>

        <NavLink
          to="/appointments"
          className={({ isActive }) => (isActive ? 'active-page' : '')}
        >
          <li>Appointments</li>
        </NavLink>

        <NavLink
          to="/claims"
          className={({ isActive }) => (isActive ? 'active-page' : '')}
        >
          <li>Claims</li>
        </NavLink>

        <NavLink
          to="/patients"
          className={({ isActive }) => (isActive ? 'active-page' : '')}
        >
          <li>Patients</li>
        </NavLink>

        <NavLink
          to="/voicemail"
          className={({ isActive }) => (isActive ? 'active-page' : '')}
        >
          <li>Voicemail</li>
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) => (isActive ? 'active-page' : '')}
        >
          <li>Reports</li>
        </NavLink>

        <NavLink
          to="/tebra"
          className={({ isActive }) => (isActive ? 'active-page' : '')}
        >
          <li>Tebra</li>
        </NavLink>

        {/* <NavLink
          to="/demo"
          className={({ isActive }) => (isActive ? 'active-page' : '')}
        >
          <li>Demo</li>
        </NavLink> */}

        <NavLink
          to="/payments"
          className={({ isActive }) => (isActive ? 'active-page' : '')}
        >
          <li>Payments</li>
        </NavLink>
      </ul>
    </nav>
  );
}

export default Nav;
