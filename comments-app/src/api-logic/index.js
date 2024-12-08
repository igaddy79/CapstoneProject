const API_URL = "http://localhost:3000";

export const addNewUser = async (userInfo) => {
  try {
    await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    });
  } catch (error) {
    console.log("Error adding user:", error);
  }
};
