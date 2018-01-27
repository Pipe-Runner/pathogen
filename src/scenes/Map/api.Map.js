import api from '../../api';

export const fetchNearbyShops = data =>
  fetch(`${api}/nearby`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });
