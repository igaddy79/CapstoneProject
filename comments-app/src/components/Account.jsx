import React, { useState, useEffect } from "react";
import { getUserInfo } from "../api-logic";

export default function Account({ token }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const buildUserInfo = async () => {
      try {
        const result = await getUserInfo(token);
        setUser(result);
      } catch (error) {
        console.error("Error fetching user info:", error);
        return <p>you must be logged in to view this page</p>;
      }
    };
    buildUserInfo();
  }, [token]);

  return (
    <div>
      <h2>My Account</h2>
      {user ? (
        <p>Email: {user.email}</p>
      ) : (
        <p>you must be logged in to view this page</p>
      )}
    </div>
  );
}
