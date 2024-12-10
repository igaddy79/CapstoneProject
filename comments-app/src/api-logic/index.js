const API_URL = "http://localhost:3000";

//signup
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

export const login = async (userInfo) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      //converting response into json data
      const data = await response.json();
      return data.token;
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log("Error logging in:", error);
  }
};

export const checkAuth = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        authorization: window.localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    });
    console.log("hey");
    //converting response into json data
    console.log("THIS IS OUR DATA", await response.json());
    return response;
  } catch (error) {
    console.log("Error checking auth:", error);
  }
};
