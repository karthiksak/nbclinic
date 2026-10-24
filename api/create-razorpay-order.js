module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { planId, planTitle, amount = 25 } = req.body || {};

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_Trixn1lBJT41Iz';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'kT8KP957I1TTRi7pukzmFdTE';

    if (!keyId || !keySecret) {
      return res.status(500).json({ error: 'Razorpay keys not configured' });
    }

    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const orderPayload = {
      amount: Math.round(amount * 100), // paise (₹25 = 2500 paise)
      currency: 'INR',
      receipt: `nhc_diet_${Date.now().toString().slice(-8)}`,
      notes: {
        planId: planId || 'diet-plan',
        planTitle: planTitle || 'Clinical Diet Plan'
      }
    };

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(orderPayload)
    });

    const orderData = await response.json();

    if (!response.ok) {
      console.error('Razorpay Order API Error:', orderData);
      return res.status(response.status).json({ error: orderData.error?.description || 'Failed to create Razorpay order' });
    }

    return res.status(200).json({
      success: true,
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      keyId: keyId
    });

  } catch (error) {
    console.error('Create Razorpay Order Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
