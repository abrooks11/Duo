// import { Chip, Box, Typography } from '@mui/material';
// import type { ReportTemplate } from '../../../context/types/state';

// interface TemplateSelectorProps {
//   templates: ReportTemplate[];
//   onSelect: (template: ReportTemplate) => void;
// }

// const TemplateSelector = ({ templates, onSelect }: TemplateSelectorProps) => {
//   return (
//     <Box sx={{ mt: 2 }}>
//       <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
//         Quick Templates:
//       </Typography>
//       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//         {templates.map((template) => (
//           <Chip
//             key={template.id}
//             label={template.label}
//             onClick={() => onSelect(template)}
//             size="small"
//             variant="outlined"
//             sx={{
//               cursor: 'pointer',
//               '&:hover': {
//                 backgroundColor: 'primary.light',
//                 color: 'primary.contrastText',
//               },
//             }}
//           />
//         ))}
//       </Box>
//     </Box>
//   );
// };

// export default TemplateSelector;
