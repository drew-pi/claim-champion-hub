import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PatientFormSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function PatientFormSection({ 
  title, 
  description, 
  icon, 
  children, 
  className = "" 
}: PatientFormSectionProps) {
  return (
    <Card className={`mb-6 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {icon}
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}