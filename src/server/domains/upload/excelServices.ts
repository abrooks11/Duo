// import xlsx to read excel files and parse data
import xlsx from 'xlsx';
import fieldMap from './fieldMap.ts';
import type { ExcelRow } from './uploadTypes.ts';

const excelServices = {
  readFile: async (file: Buffer, _resourceType: string, sheetName: string): Promise<ExcelRow[]> => {
    try {
      // READ THE UPLOADED EXCEL FILE
      // const workbook = xlsx.read(file.data, { type: "buffer" }); // for browser
      const workbook = xlsx.read(file, { type: 'buffer' }); // for postman

      // FIND THE INDEX OF THE REQUESTED SHEET NAME
      const targetIndex = workbook.SheetNames.indexOf(sheetName);

      // READ THE SHEET AT THE TARGET INDEX AND STORE AS OBJECT[]
      let result = xlsx.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[targetIndex]],
        {
          defval: null, // or null, if you prefer
          // Use header: 0 to return an array of objects and range: 1 to start from the second row (so that the first row is the header)
          // header: 0,    // Uses first row as keys for all rows
          // range: 1      // Starts reading from second row (skips header row)
        }
      );

      // TRANSFORM THE RESULT ARRAY OF OBJECTS TO THE PRISMA FORMAT
      // console.log("RESULT PRE TRANSFORM: ", result[0]);
    return result = result.map((row) => transformKeys(row as Record<string, unknown>)) as ExcelRow[];

  } catch (error) {
      throw error;
    }
  },
};

const transformKeys = (row: Record<string, unknown>): ExcelRow => {
  try {
    return Object.entries(row).reduce<ExcelRow>((acc, [key, value]) => {
      const prismaKey = fieldMap[key];
      if (prismaKey) {
        // if key contains 'Date' then convert to date to ISO string? (.toISOString())
        // if key is dob then convert to date to ISO string? (.toISOString())

        if (
          prismaKey.includes('Date') ||
          prismaKey === 'date' ||
          prismaKey === 'dob'
        ) {
          if (value) {
            // Handle Excel date format
            if (typeof value === 'number') {
              // Convert Excel serial number to JavaScript date
              const excelDate = new Date((value - 25569) * 86400 * 1000);
              acc[prismaKey] = excelDate.toISOString();
            } else {
              // Handle string date format
              acc[prismaKey] = new Date(value as string).toISOString();
            }
          }
        } else if (prismaKey.includes('PolicyNumber')) {
          acc[prismaKey] = value ? String(value) : null;
        } else if (
          ['insuranceBalance', 'patientBalance', 'totalBalance'].includes(
            prismaKey
          )
        ) {
          acc[prismaKey] = value != null ? String(value) : null;
        } else if (prismaKey.includes('ZipCode')) {
          acc[prismaKey] =
            value && typeof value === 'string' ? value.slice(0, 5) : null;
        } else {
          acc[prismaKey] = value;
        }
      }
      return acc;
    }, {});
  } catch (error) {
    throw new Error(`Error transforming keys: ${error}`);
  }
};

export default excelServices;
