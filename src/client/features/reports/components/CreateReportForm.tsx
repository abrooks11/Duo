import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import TemplateSelector from './TemplateSelector';
import type { ReportTemplate, ReportFolder } from '../../../context/types/state';

interface CreateReportFormProps {
  isOpen: boolean;
  folders: ReportFolder[];
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: { name: string; description: string; folderId?: string }) => Promise<void>;
  onCancel: () => void;
  onOpen: () => void;
}

const DEFAULT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'annual-recall',
    label: 'Annual Recall',
    description: 'Patients seen in 2025 who do not have a 2026 appointment scheduled',
  },
  {
    id: 'no-future-appointment',
    label: 'No Future Appt',
    description: 'Patients with appointments in the past 12 months but no future appointments',
  },
  {
    id: 'inactive-patients',
    label: 'Inactive 90d',
    description: 'Patients who have not been seen in the last 90 days',
  },
  {
    id: 'new-patients',
    label: 'New This Month',
    description: 'Patients whose first appointment was within the current month',
  },
];

const CreateReportForm = ({
  isOpen,
  folders,
  isLoading,
  error,
  onSubmit,
  onCancel,
  onOpen,
}: CreateReportFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [folderId, setFolderId] = useState('');
  const [suggestedName, setSuggestedName] = useState('');

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
      setFolderId('');
      setSuggestedName('');
    }
  }, [isOpen]);

  const handleTemplateSelect = (template: ReportTemplate) => {
    setDescription(template.description);
    setSuggestedName(template.label);
    if (!name) {
      setName(template.label);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    await onSubmit({
      name: name.trim() || suggestedName || 'Untitled Report',
      description: description.trim(),
      ...(folderId ? { folderId } : {}),
    });
  };

  if (!isOpen) {
    return (
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onOpen}
          fullWidth
          sx={{ mb: 2 }}
        >
          New Report
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Create Report
        </Typography>
        <Button size="small" onClick={onCancel} sx={{ minWidth: 'auto', p: 0.5 }}>
          <CloseIcon fontSize="small" />
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Report Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={suggestedName || 'AI will suggest a name...'}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />

      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the report you want to generate..."
        multiline
        rows={3}
        fullWidth
        required
        size="small"
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Folder</InputLabel>
        <Select
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
          label="Folder"
        >
          <MenuItem value="">
            <em>Uncategorized</em>
          </MenuItem>
          {folders.map((folder) => (
            <MenuItem key={folder.id} value={folder.id}>
              {folder.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TemplateSelector templates={DEFAULT_TEMPLATES} onSelect={handleTemplateSelect} />

      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Button variant="outlined" onClick={onCancel} fullWidth disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!description.trim() || isLoading}
        >
          {isLoading ? <CircularProgress size={20} /> : 'Create'}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateReportForm;
