// import custom tracker components for Appointments, Claims, and Patients
import RowFilterList from '../sidebar/RowFilterList';
import ColumnFilterList from '../sidebar/ColumnFilterList';
import FullCalendar from '../sidebar/FullCalendar';

function Sidebar() {
  return (
    <div className="sidebar-wrapper">
      {/* <h1>--Sidebar--</h1> */}
      <FullCalendar />
      <RowFilterList />
      {/* <ColumnFilterList /> */}
    </div>
  );
}

export default Sidebar;
