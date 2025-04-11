import { Dropzone, FileMosaic } from "@files-ui/react";
import { useState } from "react";
import api from "../../hooks/useApi";
import { ActionTypes } from "../../context/GlobalContext";
import useGlobalContext from "../../hooks/useGlobalContext";
// imports for sheet selection
import * as XLSX from "xlsx";
import { Select, MenuItem } from "@mui/material";

// !NEW FEATURES:
// Add sheet selection functionality
// Read the Excel file contents before upload
// Add a sheet selector UI

function FileUploadDropZone() {
  // IMPORT GLOBAL STATE:
  const { state, dispatch } = useGlobalContext();

  // DROP ZONE CONTROLS:
  // state to manage uploadedfiles
  const [files, setFiles] = useState([]);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [dataType, setDataType] = useState<"appointment" | "claim" | "patient">(
    "appointment"
  );

  // function to update files
  const updateFiles = (newFiles: any) => {
    // console.log("new files: ", newFiles);
    setFiles(newFiles);
    if (newFiles.length > 0) {
      const file = newFiles[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetNames = workbook.SheetNames;
        console.log("sheet names: ", sheetNames);
        setSheets(sheetNames);
        setSelectedSheet(sheetNames[0]); // Select first sheet by default
      };
      reader.readAsArrayBuffer(file.file);
    } else {
      setSheets([]);
      setSelectedSheet("");
    }
    console.log("selected sheet: ", selectedSheet);
  };

  // function to remove file
  const removeFile = (id: string) => {
    console.log("File removed");
    setFiles(files.filter((x: any) => x.id !== id));
  };

  // function to trigger global state update on upload finish
  const handleUploadFinish = async () => {
    console.log("Upload finished with sheet:", selectedSheet);
    // const appointments = await Utils.fetchAppointments();
    setFiles([]);
    setSheets([]);
    setSelectedSheet("");
    // dispatch({
    //   type: ActionTypes.GET_APPOINTMENTS,
    //   payload: {
    //     data: appointments,
    //   },
    // });
  };

  return (
    <div className="dropzone-wrapper">
      {state.uploadModal && (
        <>
          <Dropzone
            value={files}
            maxFiles={1}
            // accept=".xlsx,.xls" // !TODO: ADD SUPPORT          onChange={updateFiles}
            onChange={updateFiles}
            onUploadFinish={handleUploadFinish} // onDelete={removeFile}
            actionButtons={{
              position: "after",
              uploadButton: {
                className: "dropzone-button",
                style: { backgroundColor: "#249f9c" },
              },
              abortButton: {
                className: "dropzone-button",
                style: { backgroundColor: "#249f9c" },
              },
              deleteButton: {
                className: "dropzone-button",
                style: { backgroundColor: "#249f9c" },
              },
            }}
            label="Drag'n drop files here or click to browse"
            // fakeUpload={true}
            uploadConfig={{
              url: `http://localhost:3000/api/upload/${dataType}/${selectedSheet}`,
              method: "POST",
              cleanOnUpload: true,
            }}
          >
            {files.map((file: any) => (
              <FileMosaic key={file.id} {...file} onDelete={removeFile} info />
            ))}
          </Dropzone>
          {/* Add sheet selector */}
          {sheets.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <Select
                value={selectedSheet}
                onChange={(e) => {
                  console.log("selected sheet: ", e.target.value);
                  setSelectedSheet(e.target.value);
                }}
                fullWidth
                size="small"
              >
                {sheets.map((sheet) => (
                  <MenuItem key={sheet} value={sheet}>
                    {sheet}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}
        </>
      )}
      <form id="upload-form" className="dropzone">
        {/* <!-- this is were the previews should be shown. --> */}
        <div className="previews"></div>
        {/* <!-- Now setup your input fields --> */}
        <input
          type="radio"
          name="dataType"
          id="patient"
          value="patient"
          onChange={(e) => setDataType(e.target.value as "patient")}
        />
        <label htmlFor="patient">Patient</label>
        <br />

        <input
          type="radio"
          name="dataType"
          id="appointment"
          value="appointment"
          onChange={(e) => setDataType(e.target.value as "appointment")}
        />

        <label htmlFor="appointment">Appointment</label>
        <br />
      </form>
    </div>
  );
}

export default FileUploadDropZone;
