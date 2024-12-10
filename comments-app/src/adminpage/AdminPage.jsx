import { checkAuth } from "../api-logic";
import { useEffect } from "react";

const AdminPage = () => {
  useEffect(() => {
    checkAuth();
  });

  return (
    <div>
      <div>heyyya</div>
      <h1>WHATS UP</h1>
    </div>
  );
};

export default AdminPage;
