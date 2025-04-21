interface Props {
  columns: any[];
  data: any[];
  className: string;
}

const VoicemailTable = ({ columns, data, className }: Props) => {
  console.log(columns)
  return (
    <div className={className}>
      <table className="w-full table-fixed">
      {/* SELECTED TABLE HEADERS FROM PROPS*/}
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.value} 
            className={column.value === 'transcription' ? 'max-w-[500px] w-[500px]' : 'w-auto'}>
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
              <td key={column.value} 
              className={column.value === 'transcription' ? 'max-w-[500px] w-[500px]' : 'w-auto'}>
                {row[column.value]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
        </table>
    </div>
  );
};

export default VoicemailTable;
