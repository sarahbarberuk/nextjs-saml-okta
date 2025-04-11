"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // calls the Node.js /profile endpoint (to check if the user is logged in)
    fetch("http://localhost:4000/profile", {
      credentials: "include", // sends session cookie ID to IdP so it can work out if they're logged in
    })
      .then((res) => (res.ok ? res.json() : null)) // If session exists, parse the JSON profile data and display it
      .then((data) => setUser(data))
      .catch(() => setUser(null)); // If session doesn't exist, assume unauthenticated
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Welcome to the Next.js SAML App</h1>
      {/* If user is logged in, show their name and a logout link */}
      {user ? (
        <>
          <p>
            You are logged in as <strong>{user.nameID}</strong>
          </p>
          <a href="http://localhost:4000/logout">Logout</a>
        </>
      ) : (
        // If user is not logged in, show a login button
        <>
          <p>You're not logged in.</p>
          <a
            href="http://localhost:4000/login"
            style={{
              display: "inline-block",
              padding: "0.6rem 1.2rem",
              backgroundColor: "#0070f3",
              color: "#fff",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: "bold",
              marginTop: "1rem",
            }}
          >
            Login with SAML
          </a>
        </>
      )}
    </main>
  );
}
