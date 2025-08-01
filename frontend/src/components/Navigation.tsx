import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, FileText, Users } from "lucide-react";

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-full">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">
                HealthAdvocate
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Heart className="h-4 w-4" />
              Login
            </Button>
            
            <Button
              variant={isActive('/patient-portal') ? 'default' : 'ghost'}
              onClick={() => navigate('/patient-portal')}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Patient Portal
            </Button>
            
            <Button
              variant={isActive('/dashboard') ? 'default' : 'ghost'}
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Professional Dashboard
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}