import React from "react";
import { useNavigate } from "react-router-dom";
import Auth from "@/components/Auth";

export default function AuthPage() {
  const navigate = useNavigate();

  const handleAuthStateChange = (type?: 'patient' | 'professional') => {
    if (type === 'patient') {
      navigate('/patient-portal');
    } else {
      navigate('/dashboard');
    }
  };

  return <Auth onAuthStateChange={handleAuthStateChange} />;
}