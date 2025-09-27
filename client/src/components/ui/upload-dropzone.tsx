import React, { useCallback, useState } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  onFileSelect?: (file: File) => void;
  onRemove?: () => void;
  loading?: boolean;
  uploadedFile?: File | null;
  accept?: string;
  className?: string;
}

export function UploadDropzone({
  onFileSelect,
  onRemove,
  loading = false,
  uploadedFile = null,
  accept = ".pdf,.png,.jpg,.jpeg",
  className
}: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && onFileSelect) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && onFileSelect) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  if (uploadedFile) {
    return (
      <Card className={cn(
        "p-6 bg-gradient-subtle border border-electric-purple/20 relative",
        className
      )}>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">
              {uploadedFile.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>
          {loading ? (
            <Loader2 className="h-5 w-5 text-electric-purple animate-spin" />
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {loading && (
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Parsing resume...
            </p>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className={cn(
      "relative transition-all duration-300",
      isDragOver 
        ? "border-2 border-dashed border-electric-purple bg-gradient-subtle scale-[1.02]" 
        : "border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50",
      className
    )}>
      <label className="cursor-pointer block">
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="sr-only"
        />
        <div
          className="p-8 text-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={cn(
            "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-300",
            isDragOver 
              ? "bg-gradient-primary text-white scale-110" 
              : "bg-muted text-muted-foreground"
          )}>
            <Upload className="h-8 w-8" />
          </div>
          
          <h3 className="font-semibold text-lg text-foreground mb-2">
            {isDragOver ? "Drop your resume here" : "Upload your resume"}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4">
            Drop your PDF, PNG, or JPG file here, or click to browse
          </p>
          
          <Button 
            variant={isDragOver ? "gradient-primary" : "outline"}
            size="sm"
            type="button"
          >
            Choose File
          </Button>
          
          <p className="text-xs text-muted-foreground mt-3">
            We'll parse your name, email, summary, year & skills
          </p>
        </div>
      </label>
    </Card>
  );
}