import React, { useState } from "react";
import { MapPin, Heart, X, MessageCircle, Info, Building } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TagChip } from "@/components/ui/tag-chip";
import { cn } from "@/lib/utils";

export interface JobData {
  id: string;
  title: string;
  company: {
    name: string;
    logo?: string;
    size?: string;
    industry?: string;
    website?: string;
  };
  location: string;
  workType: "Remote" | "Hybrid" | "On-site";
  salary: {
    min: number;
    max: number;
  };
  distance: number;
  categories: string[];
  userCategories: string[]; // User's matched categories for highlighting
  description?: string;
  requirements?: string[];
  techStack?: string[];
  benefits?: string[];
}

interface JobCardProps {
  job: JobData;
  onApply?: (jobId: string) => void;
  onPass?: (jobId: string) => void;
  onCompanyInfo?: (company: JobData["company"]) => void;
  onColdMessage?: (jobId: string) => void;
  className?: string;
}

export function JobCard({ 
  job, 
  onApply, 
  onPass, 
  onCompanyInfo, 
  onColdMessage,
  className 
}: JobCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleApply = () => {
    onApply?.(job.id);
  };

  const handlePass = () => {
    onPass?.(job.id);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={cn("relative w-full max-w-sm mx-auto perspective-1000", className)}>
      <div className={cn(
        "relative w-full h-[600px] transition-transform duration-700 preserve-3d cursor-pointer",
        isFlipped && "rotate-y-180"
      )} onClick={handleFlip}>
        
        {/* Front of card */}
        <Card className={cn(
          "absolute inset-0 w-full h-full backface-hidden card-interactive rounded-card border-0 bg-white shadow-card overflow-hidden"
        )}>
          <div className="p-6 flex flex-col h-full">
            {/* Header with company info */}
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-subtle rounded-xl flex items-center justify-center border">
                {job.company.logo ? (
                  <img src={job.company.logo} alt={job.company.name} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <Building className="w-8 h-8 text-electric-purple" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-2">
                  {job.title}
                </h3>
                <p className="text-muted-foreground font-medium">
                  {job.company.name}
                </p>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {job.categories.slice(0, 4).map((category) => (
                  <TagChip
                    key={category}
                    label={category}
                    selected={job.userCategories.includes(category)}
                    variant="outline"
                  />
                ))}
                {job.categories.length > 4 && (
                  <span className="text-sm text-muted-foreground">
                    +{job.categories.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Job details */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-electric-purple" />
                <span className="text-foreground">{job.location} • {job.workType}</span>
              </div>
              
              <div className="text-sm">
                <span className="font-semibold text-foreground">
                  ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                </span>
                <span className="text-muted-foreground"> /year</span>
              </div>

              {job.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePass();
                }}
                className="flex-1 border-destructive/20 text-destructive hover:bg-destructive hover:text-white"
              >
                <X className="h-4 w-4 mr-1" />
                Pass
              </Button>
              <Button 
                variant="gradient-primary" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleApply();
                }}
                className="flex-1"
              >
                <Heart className="h-4 w-4 mr-1" />
                Apply
              </Button>
            </div>

            {/* Tap to flip indicator */}
            <p className="text-xs text-muted-foreground text-center mt-3">
              Tap to see details
            </p>
          </div>
        </Card>

        {/* Back of card */}
        <Card className={cn(
          "absolute inset-0 w-full h-full backface-hidden card-interactive rounded-card border-0 bg-white shadow-card overflow-hidden rotate-y-180"
        )}>
          <div className="p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-foreground">
                  {job.title}
                </h3>
                <p className="text-muted-foreground font-medium">
                  {job.company.name}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCompanyInfo?.(job.company);
                }}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>

            {/* Detailed content */}
            <div className="flex-1 space-y-4 overflow-y-auto">
              {/* Job Description */}
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-2">Job Description</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Company Information */}
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-2">Company Info</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Building className="h-3 w-3 mr-2" />
                    <span>{job.company.name}</span>
                  </div>
                  {job.company.size && (
                    <div className="text-xs text-muted-foreground">
                      Company Size: {job.company.size}
                    </div>
                  )}
                  {job.company.industry && (
                    <div className="text-xs text-muted-foreground">
                      Industry: {job.company.industry}
                    </div>
                  )}
                </div>
              </div>

              {/* Job Categories/Interests */}
              {job.categories && job.categories.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-2">Job Categories</h4>
                  <div className="flex flex-wrap gap-1">
                    {job.categories.slice(0, 6).map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Type & Location */}
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-2">Work Details</h4>
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Work Type: {job.workType}
                  </div>
                  {job.salary && (
                    <div className="text-xs text-muted-foreground">
                      Salary: ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Requirements (if available) */}
              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-2">Requirements</h4>
                  <ul className="space-y-1">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-start">
                        <span className="w-1 h-1 bg-primary-blue rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack (if available) */}
              {job.techStack && job.techStack.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-1">
                    {job.techStack.slice(0, 6).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits (if available) */}
              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-2">Benefits</h4>
                  <ul className="space-y-1">
                    {job.benefits.slice(0, 3).map((benefit, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-start">
                        <span className="w-1 h-1 bg-accent-blue rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="space-y-2 mt-4">
              <Button 
                variant="gradient-secondary" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onColdMessage?.(job.id);
                }}
                className="w-full"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Send Cold Message
              </Button>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePass();
                  }}
                  className="flex-1 border-destructive/20 text-destructive hover:bg-destructive hover:text-white"
                >
                  <X className="h-4 w-4 mr-1" />
                  Pass
                </Button>
                <Button 
                  variant="gradient-primary" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply();
                  }}
                  className="flex-1"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Apply
                </Button>
              </div>
            </div>

            {/* Tap to flip back */}
            <p className="text-xs text-muted-foreground text-center mt-3">
              Tap to go back
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}