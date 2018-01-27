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

export const fetchSubstituteListApi = data =>
  fetch(`${api}/substitute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });
