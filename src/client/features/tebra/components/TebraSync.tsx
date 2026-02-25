import { useState } from 'react';
import {
  Button,
  TextField,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { fetchTebraAppointments } from '../services/tebraApi';

export default function TebraSync() {
  // Set default date range (current year)
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any>(null);

  const handleFetch = async () => {
    // Reset previous state
    setError(null);
    setAppointments(null);
    setLoading(true);

    try {
      const data = await fetchTebraAppointments(startDate, endDate);
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Extract appointment count from response
  const getAppointmentCount = () => {
    if (!appointments?.data) return 0;

    try {
      // Navigate the parsed XML structure
      // The structure will be: s:Envelope > s:Body > GetAppointmentsResponse > GetAppointmentsResult > Appointments
      const envelope = appointments.data['s:Envelope'];
      const body = envelope?.['s:Body']?.[0];
      const response = body?.['GetAppointmentsResponse']?.[0];
      const result = response?.['GetAppointmentsResult']?.[0];
      const appointmentArray = result?.['Appointments']?.[0]?.['Appointment'];

      return Array.isArray(appointmentArray) ? appointmentArray.length : 0;
    } catch {
      return 0;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tebra Appointments Sync
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Fetch appointments from Tebra API for a specified date range. This is a
        proof-of-concept interface - appointments are displayed but not saved
        to the database.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={handleFetch}
            disabled={loading || !startDate || !endDate}
            sx={{ height: 56 }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Fetching...
              </>
            ) : (
              'Fetch Appointments'
            )}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {appointments && !error && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Successfully fetched {getAppointmentCount()} appointment(s) from
            Tebra API
          </Alert>
        )}
      </Paper>

      {appointments && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Raw Response Data
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This is the parsed XML response from the Tebra SOAP API. In a
            production implementation, this would be transformed and saved to
            the database.
          </Typography>
          <Box
            component="pre"
            sx={{
              backgroundColor: '#f5f5f5',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: '500px',
              fontSize: '0.875rem',
            }}
          >
            {JSON.stringify(appointments, null, 2)}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
