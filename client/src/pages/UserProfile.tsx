import React, { useState } from "react";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagChip } from "@/components/ui/tag-chip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppHeader } from "@/components/layout/app-header";
import { useToast } from "@/hooks/use-toast";
import { summarizeResume, ResumeSummary } from "@/lib/api";

interface ProfileData {
  name: string;
  email: string;
  major: "CS" | "BUS";
  year: number;
  experience: number;
  focusAreas: string;
  summary: string;
  photo?: string;
  selectedTags: string[];
}

const CS_TAGS = [
  "vibe coder", "hate to be outside", "caffeine addicted", "sleep deprived", "6'7\"", 
  "terminal enjoyer", "leetcode grinder", "dark mode zealot", "tab over spaces", "vim curious", 
  "docker enjoyer", "low-latency fiend", "devops dabbler", "gpu hungry", "ml enjoyer", 
  "bug whisperer", "night owl", "api tinkerer", "open source fan", "pair programming pro"
];

const BUS_TAGS = [
  "deck master", "spreadsheet ninja", "networking pro", "pitch perfect", "coffee chat enjoyer", 
  "ops optimizer", "market whisperer", "brand savvy", "finance curious", "ops hacksmith", 
  "growth hacker", "kpi keeper", "sales sprinter", "analyst brain", "pm in training", 
  "case crack addict", "marketing mind", "gantt guru", "people person", "scrum friendly"
];

export default function UserProfile() {
  const { toast } = useToast();
  const [resumeLoading, setResumeLoading] = useState(false);
  
  // Mock existing user data
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Alex Thompson",
    email: "alex.thompson@university.edu",
    major: "CS",
    year: 3,
    experience: 2,
    focusAreas: "Data Science, Machine Learning, Backend Development",
    summary: "3rd-year CS student at University, 2 years of experience, focuses on Data Science, Machine Learning, Backend Development.",
    selectedTags: ["vibe coder", "caffeine addicted", "ml enjoyer", "night owl"]
  });

  const availableTags = profileData.major === "CS" ? CS_TAGS : BUS_TAGS;

  const handleTagToggle = (tag: string) => {
    setProfileData(prev => {
      const isSelected = prev.selectedTags.includes(tag);
      const newTags = isSelected 
        ? prev.selectedTags.filter(t => t !== tag)
        : prev.selectedTags.length < 5 
          ? [...prev.selectedTags, tag]
          : prev.selectedTags;
      return { ...prev, selectedTags: newTags };
    });
  };

  const handleSave = () => {
    toast({
      title: "Profile updated successfully! ✅",
      description: "Your changes have been saved.",
    });
  };

  const handleReuploadResume = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.png,.jpg,.jpeg';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setResumeLoading(true);
        try {
          const resumeData: ResumeSummary = await summarizeResume(file);
          
          // Map API response to our profile data structure
          setProfileData(prev => ({
            ...prev,
            name: resumeData.name || prev.name,
            email: resumeData.email || prev.email,
            major: resumeData.skills.some(skill => 
              ['javascript', 'python', 'java', 'react', 'node', 'typescript', 'programming', 'coding'].includes(skill.toLowerCase())
            ) ? "CS" : "BUS",
            year: resumeData.yearOfStudy === -1 ? -1 : resumeData.yearOfStudy,
            experience: resumeData.yearsExperience || prev.experience,
            focusAreas: resumeData.skills.slice(0, 5).join(", "),
            summary: resumeData.short_description || prev.summary
          }));
          
          setResumeLoading(false);
          toast({
            title: "Resume parsed successfully!",
            description: "Your profile has been updated with the new information.",
          });
        } catch (error) {
          console.error("Resume parsing error:", error);
          setResumeLoading(false);
          toast({
            title: "Resume parsing failed",
            description: error instanceof Error ? error.message : "Failed to parse resume. Please try again.",
            variant: "destructive"
          });
        }
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        user={{ name: profileData.name, avatar: profileData.photo }} 
        onProfileClick={() => {}} 
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text-primary">
                Edit Profile
              </h1>
              <p className="text-muted-foreground">
                Keep your information up to date to get better matches
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <Card className="p-8 shadow-card border-0 mb-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold">Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold">Major</Label>
                  <Select value={profileData.major} onValueChange={(value) => setProfileData(prev => ({ ...prev, major: value as "CS" | "BUS" }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CS">Computer Science (CS)</SelectItem>
                      <SelectItem value="BUS">Business (BUS)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="year" className="text-sm font-semibold">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={profileData.year}
                    onChange={(e) => setProfileData(prev => ({ ...prev, year: parseInt(e.target.value) || 0 }))}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="experience" className="text-sm font-semibold">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={profileData.experience}
                    onChange={(e) => setProfileData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="focusAreas" className="text-sm font-semibold">Focus Areas</Label>
                  <Input
                    id="focusAreas"
                    value={profileData.focusAreas}
                    onChange={(e) => setProfileData(prev => ({ ...prev, focusAreas: e.target.value }))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="summary" className="text-sm font-semibold">Summary</Label>
                  <Textarea
                    id="summary"
                    value={profileData.summary}
                    onChange={(e) => setProfileData(prev => ({ ...prev, summary: e.target.value }))}
                    className="mt-2 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold">Profile Photo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profileData.photo} />
                      <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                        {profileData.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tags Section */}
          <Card className="p-8 shadow-card border-0 mb-6">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Personality & Fun Tags
            </h3>
            <p className="text-muted-foreground mb-6">
              Pick up to 5 tags that describe you ({profileData.selectedTags.length}/5 selected)
            </p>

            <div className="flex flex-wrap gap-3">
              {availableTags.map((tag) => (
                <TagChip
                  key={tag}
                  label={tag}
                  selected={profileData.selectedTags.includes(tag)}
                  onClick={() => handleTagToggle(tag)}
                  disabled={!profileData.selectedTags.includes(tag) && profileData.selectedTags.length >= 5}
                  variant="gradient"
                />
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline"
              size="lg"
              onClick={handleReuploadResume}
              disabled={resumeLoading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {resumeLoading ? "Parsing Resume..." : "Reupload Resume"}
            </Button>
            
            <Button 
              variant="hero"
              size="lg"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
