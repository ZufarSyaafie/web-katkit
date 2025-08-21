// pages/api/playfab/data.js
export default async function handler(req, res) {
  const { method, headers, body } = req;
  const sessionTicket = headers.authorization?.replace('Bearer ', '');

  if (!sessionTicket) {
    return res.status(401).json({ message: 'Session ticket required' });
  }

  try {
    if (method === 'GET') {
      // Get user data
      const { keys } = req.query; // Pass keys as query parameter
      const response = await fetch(`${process.env.PLAYFAB_BASE_URL}/GetUserData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authentication': sessionTicket
        },
        body: JSON.stringify({
          Keys: keys ? keys.split(',') : undefined
        })
      });

      const data = await response.json();
      res.status(response.status).json(data);

    } else if (method === 'POST') {
      // Update user data
      const response = await fetch(`${process.env.PLAYFAB_BASE_URL}/UpdateUserData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authentication': sessionTicket
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('PlayFab API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}