interface Props {
  columns: any[];
  data: any[];
  className: string;
}

const VoicemailTable = ({ columns, data, className }: Props) => {
  return (
    <div className={className}>
      <table>
      {/* SELECTED TABLE HEADERS FROM PROPS*/}
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.value}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      {/* TABLE BODY */}
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (
              <td key={column.value}>{row[column.value]}</td>
            ))}
          </tr>
        ))}
      </tbody>
        </table>
    </div>
  );
};

export default VoicemailTable;
