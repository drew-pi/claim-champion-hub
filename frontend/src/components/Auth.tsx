import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Shield, Heart, Users } from "lucide-react";

interface AuthProps {
  onAuthStateChange?: (type?: 'patient' | 'professional') => void;
}

export default function Auth({ onAuthStateChange }: AuthProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<"patient" | "advocate" | "admin">("patient");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role,
          },
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: "Account Already Exists",
            description: "This email is already registered. Please try signing in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registration Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Registration Successful",
          description: "Please check your email for a confirmation link to complete your registration.",
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Sign In Failed",
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive",
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Not Confirmed",
            description: "Please check your email and click the confirmation link before signing in.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign In Error",
            description: error.message,
            variant: "destructive",
          });
        }
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          onAuthStateChange?.('professional');
        }
    } catch (error) {
      console.error('Signin error:', error);
      toast({
        title: "Sign In Error",
        description: "An unexpected error occurred during sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePatientQuickAccess = () => {
    // For patients, navigate to patient portal
    onAuthStateChange?.('patient');
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Heart className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">HealthAdvocate</h1>
          <p className="text-muted-foreground mt-2">
            Professional healthcare claim advocacy services
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Access Your Portal</CardTitle>
            <CardDescription>
              Choose how you'd like to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="patient" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="patient" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Patient
                </TabsTrigger>
                <TabsTrigger value="professional" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Professional
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patient" className="space-y-4">
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Get started immediately with your claim submission
                  </p>
                  <Button
                    onClick={handlePatientQuickAccess}
                    className="w-full"
                    size="lg"
                  >
                    Submit a Claim
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="professional" className="space-y-4">
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Register</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin">
                    <div className="space-y-4">
                      <div className="text-center space-y-3 p-4 bg-secondary/50 rounded-lg">
                        <p className="text-sm text-muted-foreground font-medium">
                          Demo Login - Choose Your Role:
                        </p>
                        <div className="space-y-2">
                          <Button
                            onClick={() => {
                              setEmail("advocate@demo.com");
                              setPassword("demo123");
                              setTimeout(() => {
                                // Simulate successful login for advocate
                                toast({
                                  title: "Demo Login Successful",
                                  description: "Logged in as Patient Advocate",
                                });
                                onAuthStateChange?.('professional');
                              }, 500);
                            }}
                            className="w-full"
                            variant="outline"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Login as Patient Advocate
                          </Button>
                          <Button
                            onClick={() => {
                              setEmail("admin@demo.com");
                              setPassword("demo123");
                              setTimeout(() => {
                                // Simulate successful login for admin
                                toast({
                                  title: "Demo Login Successful",
                                  description: "Logged in as Administrator",
                                });
                                onAuthStateChange?.('professional');
                              }, 500);
                            }}
                            className="w-full"
                            variant="outline"
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Login as Administrator
                          </Button>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or use custom credentials
                          </span>
                        </div>
                      </div>
                      
                      <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? "Signing in..." : "Sign In"}
                        </Button>
                      </form>
                    </div>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={role} onValueChange={(value: "patient" | "advocate" | "admin") => setRole(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="advocate">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Patient Advocate
                              </div>
                            </SelectItem>
                            <SelectItem value="admin">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Administrator
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}