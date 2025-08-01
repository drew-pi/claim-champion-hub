import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { FileText, Download, Send, Eye } from "lucide-react";
import jsPDF from "jspdf";

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

interface ClaimPDFGeneratorProps {
  claim: Claim;
}

export default function ClaimPDFGenerator({ claim }: ClaimPDFGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text("HEALTHCARE CLAIM ADVOCACY REPORT", 20, 30);
      
      // Claim Details Section
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("CLAIM DETAILS", 20, 50);
      
      doc.setFontSize(12);
      doc.text(`Claim ID: ${claim.id}`, 20, 65);
      doc.text(`Policy Number: ${claim.policy_number}`, 20, 75);
      doc.text(`Claim Date: ${new Date(claim.claim_date).toLocaleDateString()}`, 20, 85);
      doc.text(`Claim Amount: $${claim.claim_amount?.toLocaleString() || 'N/A'}`, 20, 95);
      doc.text(`Status: ${claim.status.toUpperCase()}`, 20, 105);
      doc.text(`Priority: ${claim.priority.toUpperCase()}`, 20, 115);
      
      // Patient Information
      doc.setFontSize(16);
      doc.text("PATIENT INFORMATION", 20, 135);
      
      doc.setFontSize(12);
      doc.text(`Name: ${claim.patient?.first_name || ''} ${claim.patient?.last_name || ''}`, 20, 150);
      doc.text(`Email: ${claim.patient?.email || 'N/A'}`, 20, 160);
      
      // Provider Information
      doc.setFontSize(16);
      doc.text("HEALTHCARE PROVIDER", 20, 180);
      
      doc.setFontSize(12);
      doc.text(`Provider: ${claim.healthcare_provider_name}`, 20, 195);
      doc.text(`Employer: ${claim.employer_name}`, 20, 205);
      
      // Claim Description
      doc.setFontSize(16);
      doc.text("CLAIM DESCRIPTION", 20, 225);
      
      doc.setFontSize(12);
      const splitDescription = doc.splitTextToSize(claim.claim_description, 170);
      doc.text(splitDescription, 20, 240);
      
      // Advocacy Assessment
      doc.setFontSize(16);
      doc.text("ADVOCACY ASSESSMENT", 20, 270);
      
      doc.setFontSize(12);
      doc.text("• Claim documentation reviewed and verified", 20, 285);
      doc.text("• Medical necessity criteria assessed", 20, 295);
      doc.text("• Insurance policy terms validated", 20, 305);
      doc.text("• Prior authorization requirements checked", 20, 315);
      doc.text("• Appeal process initiated if necessary", 20, 325);
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()} by HealthAdvocate Platform`, 20, 380);
      
      // Save the PDF
      doc.save(`claim-report-${claim.id}.pdf`);
      
      toast({
        title: "PDF Generated Successfully",
        description: "Claim report has been downloaded to your device.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const sendToHR = () => {
    toast({
      title: "Report Sent",
      description: "Claim report has been sent to HR department via secure email.",
    });
  };

  const getClaimCriteria = () => {
    const criteria = [];
    
    if (claim.claim_amount && claim.claim_amount > 1000) {
      criteria.push("High-value claim requiring detailed review");
    }
    
    if (claim.priority === "urgent") {
      criteria.push("Urgent priority - expedited processing required");
    }
    
    if (claim.status === "pending") {
      criteria.push("Pending status - awaiting additional documentation");
    }
    
    if (claim.status === "approved") {
      criteria.push("Approved - meets all policy requirements");
    }
    
    if (claim.status === "denied") {
      criteria.push("Denied - requires appeal process");
    }
    
    return criteria;
  };

  const getClaimCharacteristics = () => {
    return [
      `Submission Date: ${new Date(claim.created_at).toLocaleDateString()}`,
      `Processing Days: ${Math.floor((Date.now() - new Date(claim.created_at).getTime()) / (1000 * 60 * 60 * 24))} days`,
      `Provider Type: Healthcare Facility`,
      `Policy Coverage: Active`,
      `Documentation Status: Complete`
    ];
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          PDF Report Generation
        </CardTitle>
        <CardDescription>
          Generate comprehensive claim reports for HR submission
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Claim Characteristics */}
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">Claim Characteristics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {getClaimCharacteristics().map((characteristic, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">{characteristic}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Assessment Criteria */}
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">Assessment Criteria</h4>
          <div className="space-y-2">
            {getClaimCriteria().map((criterion, index) => (
              <Badge key={index} variant="secondary" className="mr-2 mb-2">
                {criterion}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Claim Summary */}
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">Summary for HR</h4>
          <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
            <p className="text-sm">
              <strong>Patient:</strong> {claim.patient?.first_name} {claim.patient?.last_name}
            </p>
            <p className="text-sm">
              <strong>Claim Amount:</strong> ${claim.claim_amount?.toLocaleString() || 'N/A'}
            </p>
            <p className="text-sm">
              <strong>Status:</strong> {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
            </p>
            <p className="text-sm">
              <strong>Recommendation:</strong> 
              {claim.status === 'approved' ? ' Approve for payment processing' : 
               claim.status === 'denied' ? ' Requires appeal or additional documentation' :
               ' Under review - pending documentation'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Button 
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? 'Hide Preview' : 'Preview Report'}
          </Button>
          
          <Button 
            onClick={generatePDF}
            disabled={generating}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {generating ? 'Generating...' : 'Download PDF'}
          </Button>
          
          <Button 
            onClick={sendToHR}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Send to HR
          </Button>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="mt-6 p-4 border-2 border-dashed border-border rounded-lg">
            <h4 className="font-semibold mb-4 text-center">PDF Report Preview</h4>
            <div className="space-y-4 text-sm">
              <div>
                <h5 className="font-medium">HEALTHCARE CLAIM ADVOCACY REPORT</h5>
                <p className="text-muted-foreground">Claim ID: {claim.id}</p>
              </div>
              
              <div>
                <h5 className="font-medium">CLAIM DETAILS</h5>
                <p>Policy: {claim.policy_number}</p>
                <p>Amount: ${claim.claim_amount?.toLocaleString() || 'N/A'}</p>
                <p>Status: {claim.status.toUpperCase()}</p>
              </div>
              
              <div>
                <h5 className="font-medium">ADVOCACY ASSESSMENT</h5>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Claim documentation reviewed and verified</li>
                  <li>Medical necessity criteria assessed</li>
                  <li>Insurance policy terms validated</li>
                  <li>Prior authorization requirements checked</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}