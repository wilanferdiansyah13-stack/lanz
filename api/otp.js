export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    
    // 1. Token Paradox (SAMAIN SAMA SCRIPT PYTHON)
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

    // 2. TOKEN FONNTE KAMU
    const FONNTE_TOKEN = "DHDnFBG1rPvaLwwAAcCh"; 

    try {
        const response = await fetch("https://api.fonnte.com/send", {
            method: 'POST',
            headers: {
                'Authorization': FONNTE_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'target': nomor,
                'message': `Kode OTP Anda adalah ${Math.floor(100000 + Math.random() * 900000)}. JANGAN berikan kode ini kepada siapa pun.`
            })
        });

        const data = await response.json();
        
        return res.status(200).json({ 
            status: true,
            message: 'Pesan WA Berhasil Dikirim via Fonnte',
            fonnte_response: data
        });
    } catch (error) {
        return res.status(500).json({ 
            status: false,
            message: 'Gagal mengirim pesan',
            error: error.message
        });
    }
}
