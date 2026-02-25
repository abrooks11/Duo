import { toast } from 'react-toastify';

const baseURL = 'http://localhost:3000/api';

export const updateAppointmentNote = async (id: number, notes: string) => {
  const response = await fetch(`${baseURL}/appointments/${id}/notes`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes }),
  });
  if (response.status === 200) {
    toast.success('Note saved');
  }
  return { status: response.status };
};

export const updateCopay = async (id:number, copay:number) => {
  const response = await fetch(`${baseURL}/appointments/copay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        id: id, 
        copay: copay
    })
  });

  const result = await response.json()
  console.log(result)
  return
};


