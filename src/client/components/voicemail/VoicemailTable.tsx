import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';


interface Props {
  columns: any[];
  data: any[];
  className: string;
}

const VoicemailTable = ({ columns, data, className }: Props) => {
  // console.log(columns)

  const muiRows: GridRowsProp = data
  const muiColumns = columns.map(column => {
    const {label,value} = column
    return {
      field: label,
      headerName: value, 
      width: 200
    }
  })

  console.log(data[0])
  console.log(columns)
  /* {
    "id": "37aae2bc-a119-48a6-a47f-63f11d0d3066",
    "callerNumber": "(817) 705-5412",
    "callerName": "DONNA M MANNKE",
    "createdDate": "2025-04-23T15:32:23.984Z",
    "duration": "582:59",
    "messageFolder": "inbox",
    "status": "new",
    "transcription": "Hi. This is Donna Man. I'm calling about my pellet. I will be out of town the 20 ninth through the fifth. So it's due like the tenth of May. And I was hoping maybe I could come in, like, 8 or something. I don't know. My phone number 8 1 7 7 0 5 5 4 1 2. I also have a prescription that is out for my suggestion. But they may have already called you. So I don't know. Like I said, my phone number is 8 1 7 7 0 5 5 4 1 2. Thank you.",
    "callerType": "patient",
    "reason": "prescription",
    "officeId": null,
    "officeName": null,
    "created_at": "Invalid Date"

    [
    {
        "label": "id",
        "value": "id",
        "isSelected": true
    },
    {
        "label": "callerNumber",
        "value": "callerNumber",
        "isSelected": true
    },
    {
        "label": "callerName",
        "value": "callerName",
        "isSelected": true
    },
    {
        "label": "createdDate",
        "value": "createdDate",
        "isSelected": true
    },
    {
        "label": "duration",
        "value": "duration",
        "isSelected": true
    },
    {
        "label": "messageFolder",
        "value": "messageFolder",
        "isSelected": true
    },
    {
        "label": "status",
        "value": "status",
        "isSelected": true
    },
    {
        "label": "transcription",
        "value": "transcription",
        "isSelected": true
    },
    {
        "label": "callerType",
        "value": "callerType",
        "isSelected": true
    },
    {
        "label": "reason",
        "value": "reason",
        "isSelected": true
    },
    {
        "label": "officeId",
        "value": "officeId",
        "isSelected": true
    },
    {
        "label": "officeName",
        "value": "officeName",
        "isSelected": true
    }
]
}*/
  return (
    <div className={className}>
      <DataGrid rows={muiRows} columns={muiColumns} />
    </div>
  );
};

export default VoicemailTable;


/* 
      <table className="w-full table-fixed">
// SELECTED TABLE HEADERS FROM PROPS*
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
// TABLE BODY 
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
*/