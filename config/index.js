module.exports = {
    chatbot: {
        MICROSOFT_APP_ID: process.env.MICROSOFT_APP_ID,
        MICROSOFT_APP_PASSWORD: process.env.MICROSOFT_APP_PASSWORD
    },
    port: process.env.PORT || 3000,
    google: {
        web: {
            'client_id': '558806506091-6bhl7siku8d0gk4fr0b1v1r8ljrkfecb.apps.googleusercontent.com',
            'project_id': 'peppy-winter-203422',
            'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
            'token_uri': 'https://accounts.google.com/o/oauth2/token',
            'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
            'client_secret': 'M-rQ04ME8KBWbo844xcwEdC8',
            'redirect_uris': ['http://localhost:3000/api']
        },
        token: {
            'access_token': 'ya29.Glu0BUpMjuJcLB9wkXE_BZMg-xA4-Krh--zNtcXA0zANuYmcH0djrnOYZ6cuTj5NWGU3QiX-W0hwTn5M9xB_pMLDlC-qdsGinu64o6b7dSTaOowzoHHK50VzF7c3',
            'token_type': 'Bearer',
            'refresh_token': '1/3rFjrncAzpSNPAU6FIlLtVFQAFiqi5ckQaOwoM6roPc',
            'expiry_date': 1525736016331
        }
    }
};
