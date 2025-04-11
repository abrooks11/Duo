import { ActionTypes, TableColumn } from "../../context/GlobalContext";
import useGlobalContext from "../../hooks/useGlobalContext";
interface TableProps {
  columns: TableColumn[];
  data: any[];
}

function Table({ columns, data }: TableProps) {
  const { dispatch } = useGlobalContext();

  const handleSort = (column: string) => {
    // dispatch({
    //   type: ActionTypes.SET_APPOINTMENT_SORT,
    //   payload: {
    //     sortColumn: column,
    //   },
    // });
  };
// console.log("PROP DATA:", data)
  return (
    <div>
      <table className="data-table">
        {/* SELECTED TABLE HEADERS FROM APPOINTMENTS COMPONENT PROPS*/}
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.value} onClick={() => handleSort(column.value)}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        {/* TABLE BODY */}
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="data-table-row">
              {columns.map((column) => (
                <td key={column.value}>{row[column.value]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
