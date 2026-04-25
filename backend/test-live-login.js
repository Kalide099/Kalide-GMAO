const axios = require('axios');

async function testLogin() {
    try {
        console.log("🚀 Testing Live Login...");
        const response = await axios.post('https://kgmao.com/api/v1/auth/login', {
            email: 'root@kgmao.com',
            password: 'RootMaster2026!'
        });
        
        console.log("✅ Status:", response.status);
        console.log("✅ Data:", JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.error("❌ Login Failed:");
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", err.response.data);
        } else {
            console.error("Error:", err.message);
        }
    }
}

testLogin();
