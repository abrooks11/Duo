import { Dropzone, FileMosaic } from '@files-ui/react';
import type { ExtFile } from '@files-ui/react';
import { useState } from 'react';
import useGlobalContext from '../../hooks/useGlobalContext';
import * as XLSX from 'xlsx';
import { Select, MenuItem } from '@mui/material';

function FileUploadDropZone() {
  const { state } = useGlobalContext();

  const [files, setFiles] = useState<ExtFile[]>([]);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [resourceType, setResourceType] = useState<'appointment' | 'claim' | 'patient'>(
    'appointment'
  );

  const updateFiles = (newFiles: ExtFile[]) => {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      const file = newFiles[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetNames = workbook.SheetNames;
        setSheets(sheetNames);
        setSelectedSheet(sheetNames[0] ?? '');
      };
      if (file?.file) {
        reader.readAsArrayBuffer(file.file);
      }
    } else {
      setSheets([]);
      setSelectedSheet('');
    }
  };

  const removeFile = (id: string | number | undefined) => {
    setFiles(files.filter((x) => x.id !== id));
  };

  const handleUploadFinish = async () => {
    setFiles([]);
    setSheets([]);
    setSelectedSheet('');
  };

  return (
    <div className="dropzone-wrapper">
      {state.ui.uploadModal && (
        <>
          <Dropzone
            value={files}
            maxFiles={1}
            onChange={updateFiles}
            onUploadFinish={handleUploadFinish}
            actionButtons={{
              position: 'after',
              uploadButton: {
                className: 'dropzone-button',
                style: { backgroundColor: '#249f9c' },
              },
              abortButton: {
                className: 'dropzone-button',
                style: { backgroundColor: '#249f9c' },
              },
              deleteButton: {
                className: 'dropzone-button',
                style: { backgroundColor: '#249f9c' },
              },
            }}
            label="Drag'n drop files here or click to browse"
            uploadConfig={{
              url: `http://localhost:3000/api/upload/${resourceType}/${selectedSheet}`,
              method: 'POST',
              cleanOnUpload: true,
            }}
          >
            {files.map((file) => (
              <FileMosaic key={file.id} {...file} onDelete={removeFile} info />
            ))}
          </Dropzone>
          {sheets.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <Select
                value={selectedSheet}
                onChange={(e) => {
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
        <div className="previews"></div>
        <input
          type="radio"
          name="resourceType"
          id="patient"
          value="patient"
          onChange={(e) => setResourceType(e.target.value as 'patient')}
        />
        <label htmlFor="patient">Patient</label>
        <br />

        <input
          type="radio"
          name="resourceType"
          id="appointment"
          value="appointment"
          onChange={(e) => setResourceType(e.target.value as 'appointment')}
        />

        <label htmlFor="appointment">Appointment</label>
        <br />
      </form>
    </div>
  );
}

export default FileUploadDropZone;
