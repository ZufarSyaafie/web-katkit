// pages/api/playfab/login.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password harus diisi' });
  }

  try {
    // Gunakan environment variables tanpa NEXT_PUBLIC_
    const response = await fetch(`${process.env.PLAYFAB_BASE_URL}/LoginWithEmailAddress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        TitleId: process.env.PLAYFAB_TITLE_ID,
        Email: email,
        Password: password,
        CreateAccount: false
      })
    });

    const data = await response.json();

    if (data.code === 200) {
      // Return session ticket dan user info
      res.status(200).json({
        success: true,
        sessionTicket: data.data.SessionTicket,
        playFabId: data.data.PlayFabId,
        email: email
      });
    } else {
      // Handle error responses
      let errorMessage = 'Login gagal';
      if (data.error === 'AccountNotFound') {
        errorMessage = 'Akun tidak ditemukan';
      } else if (data.error === 'InvalidEmailOrPassword') {
        errorMessage = 'Email atau password salah';
      }
      
      res.status(401).json({ 
        success: false, 
        message: errorMessage 
      });
    }
  } catch (error) {
    console.error('Login API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan server' 
    });
  }
}