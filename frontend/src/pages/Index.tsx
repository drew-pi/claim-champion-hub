import React from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to auth page as the main entry point
  return <Navigate to="/" replace />;
};

export default Index;
