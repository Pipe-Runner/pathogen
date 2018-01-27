import api from '../../api';

export const fetchMedicineNameApi = data =>
  fetch(`${api}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });
