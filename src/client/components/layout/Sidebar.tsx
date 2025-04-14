// import custom tracker components for Appointments, Claims, and Patients
import RowFilterList from '../trackers/RowFilterList';
import ColumnFilterList from '../trackers/ColumnFilterList';

function Sidebar() {
  return (
    <div className="sidebar-wrapper">
      {/* <h1>--Sidebar--</h1> */}
      <RowFilterList />
      <ColumnFilterList />
    </div>
  );
}

export default Sidebar;
