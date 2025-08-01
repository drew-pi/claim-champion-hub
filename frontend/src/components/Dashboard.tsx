import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  LogOut,
  FileText,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import ClaimPDFGenerator from "./ClaimPDFGenerator";
import ClaimReviewModal from "./ClaimReviewModal";

interface Claim {
  id: string;
  policy_number: string;
  employer_name: string;
  healthcare_provider_name: string;
  claim_description: string;
  claim_amount: number;
  claim_date: string;
  status: string;
  priority: string;
  created_at: string;
  is_denial_claim?: boolean; // Flag to indicate denial/refuting payment claims
  patient?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface Profile {
  id: string;
  role: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface DashboardProps {
  onSignOut: () => void;
}

export default function Dashboard({ onSignOut }: DashboardProps) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [currentClaimToFlag, setCurrentClaimToFlag] = useState<string | null>(
    null
  );
  const [flagReason, setFlagReason] = useState("");

  useEffect(() => {
    getCurrentUser();
    loadClaims();
  }, []);

  const getCurrentUser = async () => {
    // For demo purposes, set up mock user data
    const mockUser = { id: "demo-user", email: "advocate@demo.com" };
    const mockProfile = {
      id: "demo-profile",
      role: "advocate",
      first_name: "Sarah",
      last_name: "Johnson",
      email: "advocate@demo.com",
    };

    setUser(mockUser);
    setProfile(mockProfile);
  };

  const loadClaims = async () => {
    setLoading(true);
    try {
      // Mock claims data for demo with proper UUIDs
      const mockClaims: Claim[] = [
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          policy_number: "POL-2024-001",
          employer_name: "TechCorp Inc",
          healthcare_provider_name: "Metro General Hospital",
          claim_description:
            "Emergency surgery for appendicitis requiring immediate medical intervention and 3-day hospital stay",
          claim_amount: 15750,
          claim_date: "2024-01-15",
          status: "pending",
          priority: "urgent",
          created_at: "2024-01-15T10:30:00Z",
          patient: {
            first_name: "John",
            last_name: "Smith",
            email: "john.smith@email.com",
          },
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          policy_number: "POL-2024-002",
          employer_name: "Global Solutions LLC",
          healthcare_provider_name: "City Medical Center",
          claim_description:
            "Physical therapy sessions following knee reconstruction surgery",
          claim_amount: 3200,
          claim_date: "2024-01-20",
          status: "approved",
          priority: "normal",
          created_at: "2024-01-20T14:15:00Z",
          patient: {
            first_name: "Maria",
            last_name: "Garcia",
            email: "maria.garcia@email.com",
          },
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440003",
          policy_number: "POL-2024-003",
          employer_name: "Innovation Labs",
          healthcare_provider_name: "Specialty Care Clinic",
          claim_description:
            "Specialist consultation and diagnostic imaging for chronic back pain",
          claim_amount: 890,
          claim_date: "2024-01-25",
          status: "denied",
          priority: "normal",
          created_at: "2024-01-25T09:45:00Z",
          is_denial_claim: true, // This is a denial claim
          patient: {
            first_name: "David",
            last_name: "Wilson",
            email: "david.wilson@email.com",
          },
        },
      ];

      setClaims(mockClaims);
    } catch (error) {
      console.error("Error loading claims:", error);
      toast({
        title: "Error",
        description: "Failed to load claims",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateClaimStatus = async (
    claimId: string,
    newStatus: string,
    notes?: string
  ) => {
    try {
      // For demo, update local state instead of database
      setClaims((prevClaims) =>
        prevClaims.map((claim) =>
          claim.id === claimId ? { ...claim, status: newStatus } : claim
        )
      );

      // Show success message
      toast({
        title: "Status Updated",
        description: `Claim has been marked as ${newStatus.replace("_", " ")}`,
      });

      // Log the action for history
      console.log(
        `Claim ${claimId} status updated to ${newStatus} by ${profile?.first_name} ${profile?.last_name}`
      );
      if (notes) {
        console.log(`Review notes: ${notes}`);
      }
    } catch (error) {
      console.error("Error updating claim status:", error);
      toast({
        title: "Error",
        description: "Failed to update claim status",
        variant: "destructive",
      });
    }
  };

  const handleFlagClaim = (claimId: string) => {
    setCurrentClaimToFlag(claimId);
    setFlagDialogOpen(true);
  };

  const confirmFlagClaim = () => {
    if (currentClaimToFlag && flagReason.trim()) {
      updateClaimStatus(currentClaimToFlag, "flagged", flagReason);
      setFlagDialogOpen(false);
      setCurrentClaimToFlag(null);
      setFlagReason("");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "denied":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "flagged":
        return <XCircle className="h-4 w-4 text-orange-600" />;
      case "under_review":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "validated":
        return "bg-green-100 text-green-800";
      case "denied":
        return "bg-red-100 text-red-800";
      case "flagged":
        return "bg-orange-100 text-orange-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "appealed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Filter claims based on selected filters
  const filteredClaims = claims.filter((claim) => {
    if (statusFilter) {
      // Map UI filter values to actual status values
      const actualStatus =
        statusFilter === "validated" ? "approved" : statusFilter;
      if (claim.status !== actualStatus) return false;
    }
    if (priorityFilter && claim.priority !== priorityFilter) return false;
    return true;
  });

  const clearFilters = () => {
    setStatusFilter(null);
    setPriorityFilter(null);
  };

  const stats = {
    total: claims.length,
    pending: claims.filter((c) => c.status === "pending").length,
    approved: claims.filter((c) => c.status === "approved").length,
    denied: claims.filter((c) => c.status === "denied").length,
    flagged: claims.filter((c) => c.status === "flagged").length,
    under_review: claims.filter((c) => c.status === "under_review").length,
    urgent: claims.filter((c) => c.priority === "urgent").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  const isAdmin = profile?.role === "admin";
  const isAdvocate = profile?.role === "advocate" || isAdmin;

  return (
    <div className="min-h-screen bg-secondary/20">
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-foreground">
                HealthAdvocate Dashboard
              </h1>
              {profile && (
                <Badge variant="outline" className="ml-4 capitalize">
                  {profile.role}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {profile?.first_name} {profile?.last_name}
              </span>
              <Button variant="outline" onClick={onSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === null ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setStatusFilter(null)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Claims
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                All submitted claims
              </p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "pending" ? "ring-2 ring-yellow-500" : ""
            }`}
            onClick={() =>
              setStatusFilter(statusFilter === "pending" ? null : "pending")
            }
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "validated" ? "ring-2 ring-green-500" : ""
            }`}
            onClick={() =>
              setStatusFilter(statusFilter === "validated" ? null : "validated")
            }
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Validated</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Ready for payment</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "flagged" ? "ring-2 ring-orange-500" : ""
            }`}
            onClick={() =>
              setStatusFilter(statusFilter === "flagged" ? null : "flagged")
            }
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.flagged}</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Claims Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Claims Management</CardTitle>
                <CardDescription>
                  Review and manage health insurance claims
                  {(statusFilter || priorityFilter) && (
                    <span className="ml-2">
                      • Filtered by {statusFilter && `status: ${statusFilter}`}
                      {statusFilter && priorityFilter && ", "}
                      {priorityFilter && `priority: ${priorityFilter}`}
                    </span>
                  )}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {/* Additional Filters */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={
                      priorityFilter === "urgent" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setPriorityFilter(
                        priorityFilter === "urgent" ? null : "urgent"
                      )
                    }
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Urgent ({stats.urgent})
                  </Button>
                  <Button
                    variant={
                      statusFilter === "under_review" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setStatusFilter(
                        statusFilter === "under_review" ? null : "under_review"
                      )
                    }
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Under Review ({stats.under_review})
                  </Button>
                  {(statusFilter || priorityFilter) && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <XCircle className="h-4 w-4 mr-1" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredClaims.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Showing {filteredClaims.length} of {claims.length} claims
                </p>
              )}

              {filteredClaims.map((claim) => (
                <div key={claim.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {claim.patient?.first_name} {claim.patient?.last_name}
                        </h3>
                        <Badge variant="outline">{claim.policy_number}</Badge>
                        {claim.is_denial_claim && (
                          <Badge variant="destructive" className="text-xs">
                            Denial/Refute
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {claim.patient?.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(claim.status)}
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status === "flagged"
                          ? "flagged"
                          : claim.status === "approved"
                          ? "validated"
                          : claim.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Provider:</span>
                      <p className="text-muted-foreground">
                        {claim.healthcare_provider_name}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span>
                      <p className="text-muted-foreground">
                        ${claim.claim_amount}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Date of Service:</span>
                      <p className="text-muted-foreground">
                        {new Date(claim.claim_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="font-medium text-sm">Description:</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {claim.claim_description}
                    </p>
                  </div>

                  {isAdvocate && (
                    <div className="flex gap-2 pt-2">
                      <ClaimReviewModal
                        claim={claim}
                        onStatusUpdate={updateClaimStatus}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Clock className="h-4 w-4" />
                          Review
                        </Button>
                      </ClaimReviewModal>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => updateClaimStatus(claim.id, "approved")}
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Validate
                      </Button>
                      <Dialog
                        open={flagDialogOpen}
                        onOpenChange={setFlagDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleFlagClaim(claim.id)}
                            className="flex items-center gap-1"
                          >
                            <XCircle className="h-4 w-4" />
                            Flag
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Flag Claim</DialogTitle>
                            <DialogDescription>
                              Please provide a reason for flagging this claim.
                              This will help identify specific issues that need
                              to be addressed.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="flagReason">
                                Reason for flagging
                              </Label>
                              <Textarea
                                id="flagReason"
                                placeholder="e.g., Formatting issues, missing documentation, unclear wording, etc."
                                value={flagReason}
                                onChange={(e) => setFlagReason(e.target.value)}
                                className="min-h-[100px]"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setFlagDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={confirmFlagClaim}
                              disabled={!flagReason.trim()}
                            >
                              Flag Claim
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          setSelectedClaim(
                            selectedClaim?.id === claim.id ? null : claim
                          )
                        }
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Generate Report
                      </Button>
                    </div>
                  )}

                  {selectedClaim?.id === claim.id && (
                    <ClaimPDFGenerator claim={selectedClaim} />
                  )}
                </div>
              ))}

              {filteredClaims.length === 0 && claims.length > 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">
                    No claims match your filters
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filter criteria or clear all filters
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </div>
              )}

              {claims.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No claims found</p>
                  <p className="text-muted-foreground">
                    Claims will appear here once submitted
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
