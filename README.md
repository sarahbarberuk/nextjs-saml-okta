# Next.js project with SAML and Okta

A SAML authentication example with Okta as the Identity provider and a this project as the Service Provider.

The nodejs-auth-server.js acts as the Service Provider, handling the SAML protocol, sessions, callback, and user verification.

The rest of the Next.js project provides the frontend of the app, forwarding login requests to the auth server.

## Set up

1. Add the Next.js app to Okta

- Set up Okta account and log into Admin panel
- Go to Applications --> Create App Integration --> SAML 2.0
- App Name: "Next.js SAML app" --> Click "Next"
- "Configure SAML" tab
  - Single sign-on URL: "http://localhost:4000/login/callback"
  - Audience URI (SP Entity ID): "nextjs-saml-app"
  - Name ID format: "EmailAddress"
  - Application username: "Email"
  - Click "Next"
- "Feedback" tab
  - Click "Finish"
- Click on "Assignments" tab for your app in Okta.
  - Add yourself as a user: Assign --> Assign to People --> find yourself and click "Assign" --> "Save and go back" --> "Done"

2. Create a .env.local file in the root of this Next.js repo

Add the following lines:

```
OKTA_ENTRY_POINT=<OKTA_ENTRY_POINT>
OKTA_ISSUER=nextjs-saml-app
OKTA_CERT=<OKTA_CERT>
SAML_CALLBACK_URL=http://localhost:4000/login/callback
```

You need to add the OKTA_ENTRY_POINT and OKTA_CERT. You will find the values for these in Okta...

- In your application in Okta, go to the "Sign On" tab.
- Click "View SAML setup instructions"
- Copy the value of the Identity Provider Single Sign-On URL and use it to replace <OKTA_ENTRY_POINT> in your .env.local
- Copy the value of the X.509 Certificate and use it to replace <OKTA_CERT>

## To run the code:

Please note the Node.js auth server code wont run without Okta certificates. You'll need to follow the previous setup section before you can run the server.

### Install dependencies:

`npm install express passport passport-saml express-session dotenv`

### Start Node.js auth server:

`node src/nodejs-auth-server.js`

### Start Next.js project for the front end:

`npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
