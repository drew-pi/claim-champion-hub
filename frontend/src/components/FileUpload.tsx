import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DocumentUpload {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

interface FileUploadProps {
  onFilesChange: (files: DocumentUpload[]) => void;
  uploadedFiles: DocumentUpload[];
  acceptedTypes?: string;
  maxFiles?: number;
  maxSizeInMB?: number;
}

export default function FileUpload({
  onFilesChange,
  uploadedFiles,
  acceptedTypes = ".pdf,.jpg,.jpeg,.png",
  maxFiles = 5,
  maxSizeInMB = 10
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);

  const uploadFile = useCallback(async (file: File): Promise<DocumentUpload | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { data, error } = await supabase.storage
        .from('patient-documents')
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('patient-documents')
        .getPublicUrl(filePath);

      return {
        id: fileName,
        name: file.name,
        type: file.type,
        url: publicUrl,
        uploadedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('File upload error:', error);
      return null;
    }
  }, []);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (uploadedFiles.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const newUploads: DocumentUpload[] = [];

    for (const file of Array.from(files)) {
      // Check file size
      if (file.size > maxSizeInMB * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds ${maxSizeInMB}MB limit`,
          variant: "destructive",
        });
        continue;
      }

      const uploadedFile = await uploadFile(file);
      if (uploadedFile) {
        newUploads.push(uploadedFile);
      } else {
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      }
    }

    if (newUploads.length > 0) {
      const updatedFiles = [...uploadedFiles, ...newUploads];
      onFilesChange(updatedFiles);
      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${newUploads.length} file(s)`,
      });
    }

    setUploading(false);
    // Reset input
    event.target.value = '';
  }, [uploadedFiles, maxFiles, maxSizeInMB, uploadFile, onFilesChange]);

  const removeFile = useCallback(async (fileId: string) => {
    const fileToRemove = uploadedFiles.find(f => f.id === fileId);
    if (fileToRemove) {
      try {
        // Remove from storage
        const filePath = `documents/${fileId}`;
        await supabase.storage
          .from('patient-documents')
          .remove([filePath]);
      } catch (error) {
        console.error('Error removing file from storage:', error);
      }
    }

    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    onFilesChange(updatedFiles);
    
    toast({
      title: "File removed",
      description: "Document has been removed",
    });
  }, [uploadedFiles, onFilesChange]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file-upload" className="text-sm font-medium">
          Upload Supporting Documents
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          Upload denial letters, medical records, or other supporting documents (PDF, JPG, PNG - max {maxSizeInMB}MB each)
        </p>
        
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <div className="space-y-2">
            <Button 
              type="button" 
              variant="outline" 
              disabled={uploading || uploadedFiles.length >= maxFiles}
              className="relative"
            >
              <input
                id="file-upload"
                type="file"
                multiple
                accept={acceptedTypes}
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading || uploadedFiles.length >= maxFiles}
              />
              {uploading ? "Uploading..." : "Choose Files"}
            </Button>
            <p className="text-sm text-muted-foreground">
              {uploadedFiles.length}/{maxFiles} files uploaded
            </p>
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Uploaded Documents</Label>
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{file.name}</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file.id)}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}