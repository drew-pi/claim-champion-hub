import React from "react";
import { useNavigate } from "react-router-dom";
import PatientPortal from "@/components/PatientPortal";

export default function PatientPortalPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return <PatientPortal onBack={handleBack} />;
}