import React from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/');
  };

  return <Dashboard onSignOut={handleSignOut} />;
}