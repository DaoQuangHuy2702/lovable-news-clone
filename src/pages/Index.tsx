import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to news page as main content
    navigate("/news");
  }, [navigate]);

  return null;
};

export default Index;
