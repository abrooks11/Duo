const baseURL = 'http://localhost:3000/api';

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


