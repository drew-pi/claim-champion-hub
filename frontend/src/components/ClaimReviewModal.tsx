import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { FileText, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

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
  patient?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface ClaimReviewModalProps {
  claim: Claim;
  onStatusUpdate: (claimId: string, newStatus: string, notes?: string) => void;
  children: React.ReactNode;
}

export default function ClaimReviewModal({ claim, onStatusUpdate, children }: ClaimReviewModalProps) {
  const [reviewStatus, setReviewStatus] = useState("under_review");
  const [reviewNotes, setReviewNotes] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmitReview = () => {
    if (reviewStatus !== claim.status) {
      onStatusUpdate(claim.id, reviewStatus, reviewNotes);
      toast({
        title: "Review Submitted",
        description: `Claim status updated to ${reviewStatus.replace('_', ' ')}`,
      });
      setIsOpen(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'denied':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'under_review':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'denied':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'under_review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'urgent' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700';
  };

  const assessmentCriteria = [
    {
      title: "Medical Necessity",
      status: claim.claim_amount > 5000 ? "verified" : "standard",
      description: "Treatment deemed medically necessary"
    },
    {
      title: "Policy Coverage",
      status: "verified",
      description: "Procedure covered under current policy"
    },
    {
      title: "Documentation",
      status: "complete",
      description: "All required documentation provided"
    },
    {
      title: "Provider Network",
      status: "in-network",
      description: "Healthcare provider is in-network"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Claim Review - {claim.policy_number}
          </DialogTitle>
          <DialogDescription>
            Review claim details and update status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {getStatusIcon(claim.status)}
                <Badge className={getStatusColor(claim.status)}>
                  {claim.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(claim.priority)}>
                  {claim.priority.toUpperCase()} PRIORITY
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Patient & Claim Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-muted-foreground">
                    {claim.patient?.first_name} {claim.patient?.last_name}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{claim.patient?.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Employer</Label>
                  <p className="text-sm text-muted-foreground">{claim.employer_name}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Claim Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Claim Amount</Label>
                  <p className="text-lg font-semibold text-foreground">
                    ${claim.claim_amount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Service Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(claim.claim_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Provider</Label>
                  <p className="text-sm text-muted-foreground">{claim.healthcare_provider_name}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Claim Description */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Claim Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {claim.claim_description}
              </p>
            </CardContent>
          </Card>

          {/* Assessment Criteria */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Assessment Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assessmentCriteria.map((criteria, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{criteria.title}</p>
                      <p className="text-xs text-muted-foreground">{criteria.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Review Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Review Decision</CardTitle>
              <CardDescription>
                Update the claim status and add review notes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">New Status</Label>
                <Select value={reviewStatus} onValueChange={setReviewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="pending">Pending Additional Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Review Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about your review decision..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmitReview}
                  disabled={reviewStatus === claim.status}
                  className="flex-1"
                >
                  Submit Review
                </Button>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}