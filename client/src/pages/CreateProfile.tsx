import React, { useState, useEffect } from "react";
import { Upload, User, Mail, GraduationCap, Calendar, Target, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagChip } from "@/components/ui/tag-chip";
import { UploadDropzone } from "@/components/ui/upload-dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { summarizeResume, ResumeSummary, uploadProfilePhoto, register } from "@/lib/api";

interface ProfileData {
  name: string;
  email: string;
  major: "CS" | "BUS" | "";
  year: number | "";
  experience: number | "";
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

export default function CreateProfile() {
  const { toast } = useToast();
  const [useResume, setUseResume] = useState(true);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    major: "",
    year: "",
    experience: "",
    focusAreas: "",
    summary: "",
    selectedTags: []
  });

  // Load saved profile data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfileData(parsedProfile);
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    }
  }, []);

  // Save to localStorage whenever profileData changes
  useEffect(() => {
    // Only save if there's meaningful data (not just empty initial state)
    if (profileData.name || profileData.email || profileData.major) {
      localStorage.setItem('userProfile', JSON.stringify(profileData));
    }
  }, [profileData]);

  const availableTags = profileData.major === "CS" ? CS_TAGS : profileData.major === "BUS" ? BUS_TAGS : [];

  const handleResumeUpload = async (file: File) => {
    setResumeFile(file);
    setResumeLoading(true);
    
    try {
      const resumeData: ResumeSummary = await summarizeResume(file);
      
      // Map API response to our profile data structure
      const newProfileData = {
        ...profileData,
        name: resumeData.name || "",
        email: resumeData.email || "",
        major: (resumeData.skills.some(skill => 
          ['javascript', 'python', 'java', 'react', 'node', 'typescript', 'programming', 'coding'].includes(skill.toLowerCase())
        ) ? "CS" : "BUS") as "CS" | "BUS", // Simple heuristic to determine major
        year: resumeData.yearOfStudy === -1 ? -1 : resumeData.yearOfStudy,
        experience: resumeData.yearsExperience || 0,
        focusAreas: resumeData.skills.slice(0, 5).join(", "), // Use first 5 skills as focus areas
        summary: resumeData.short_description || ""
      };
      
      setProfileData(newProfileData);
      
      // Save to localStorage for persistence
      localStorage.setItem('userProfile', JSON.stringify(newProfileData));
      
      setResumeLoading(false);
      toast({
        title: "Resume parsed successfully!",
        description: "Your information has been extracted. You can edit any details below.",
      });
    } catch (error) {
      console.error("Resume parsing error:", error);
      setResumeLoading(false);
      toast({
        title: "Resume parsing failed",
        description: error instanceof Error ? error.message : "Failed to parse resume. Please try again or fill out manually.",
        variant: "destructive"
      });
    }
  };

  const handlePhotoUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, GIF, or WebP image file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setPhotoFile(file);
    setPhotoLoading(true);

    try {
      const result = await uploadProfilePhoto(file);
      
      setProfileData(prev => ({
        ...prev,
        photo: result.photoUrl
      }));

      // Save to localStorage for persistence
      const updatedProfile = { ...profileData, photo: result.photoUrl };
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

      setPhotoLoading(false);
      toast({
        title: "Photo uploaded successfully!",
        description: "Your profile photo has been updated.",
      });
    } catch (error) {
      console.error("Photo upload error:", error);
      setPhotoFile(null);
      setPhotoLoading(false);
      toast({
        title: "Photo upload failed",
        description: error instanceof Error ? error.message : "Failed to upload photo. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePhotoRemove = () => {
    setPhotoFile(null);
    setProfileData(prev => ({
      ...prev,
      photo: undefined
    }));
    
    // Update localStorage
    const updatedProfile = { ...profileData, photo: undefined };
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

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

  const generateSummary = () => {
    const { major, year, experience, focusAreas } = profileData;
    if (!major || !year) return "";
    
    const yearText = year === -1 ? "Alumni" : `${year}${getOrdinalSuffix(year)}-year student`;
    const expText = experience ? `, ${experience} years of experience` : "";
    const focusText = focusAreas ? `, focuses on ${focusAreas}` : "";
    
    return `${yearText} at University${expText}${focusText}.`;
  };

  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  const handleSubmit = async () => {
    if (!profileData.name || !profileData.email || !profileData.major) {
      toast({
        title: "Please fill required fields",
        description: "Name, email, and major are required.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate a temporary password for demo purposes
      const tempPassword = "temp123"; // In production, you'd want a proper password flow
      
      // Split name into first and last name
      const nameParts = profileData.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      // Register the user
      const result = await register({
        first_name: firstName,
        last_name: lastName,
        email: profileData.email,
        password: tempPassword,
        role: 'applicant',
        university: 'University', // You might want to make this configurable
        year_of_study: typeof profileData.year === 'number' ? profileData.year : undefined,
        graduated: profileData.year === -1,
        major: profileData.major === 'CS' ? 'CMPT' : 'BUS',
        description: profileData.summary,
        profile_picture: profileData.photo
      });

      // Store the token for future API calls
      localStorage.setItem('token', result.token);
      localStorage.setItem('userProfile', JSON.stringify(profileData));

      toast({
        title: "Profile created successfully!",
        description: "Welcome to LockedIn! Let's find you some amazing opportunities.",
      });
      
      // Navigate to main seeking page
      window.location.href = "/seeking";
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-primary overflow-hidden py-16">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get <span className="text-yellow-300">LockedIn</span> 💖
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Create your profile and start swiping on opportunities
            </p>
          </div>

          {/* Resume Upload Card */}
          <Card className="max-w-2xl mx-auto p-8 bg-white/95 backdrop-blur border-0 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Apply with a Resume
              </h2>
              <p className="text-muted-foreground">
                Upload PDF/PNG/JPG — we'll parse name, email, summary, year & skills. You can edit anything.
              </p>
            </div>

            {useResume ? (
              <div className="space-y-4">
                <UploadDropzone
                  onFileSelect={handleResumeUpload}
                  onRemove={() => setResumeFile(null)}
                  loading={resumeLoading}
                  uploadedFile={resumeFile}
                />
                <div className="text-center">
                  <button 
                    onClick={() => setUseResume(false)}
                    className="text-sm text-muted-foreground hover:text-foreground underline"
                  >
                    Fill out manually instead
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Button 
                  variant="hero"
                  size="lg"
                  onClick={() => setUseResume(true)}
                  className="mb-4"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Resume Instead
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Manual Form Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {!useResume && (
            <div className="text-center mb-8">
              <div className="w-full h-px bg-border mb-8"></div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Or fill it out manually
              </h2>
            </div>
          )}

          <Card className="p-8 shadow-card border-0">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold">Name *</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    onKeyDown={(e) => {
                      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Delete, Backspace
                      if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
                        return; // Allow default behavior
                      }
                    }}
                    placeholder="Your full name"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-semibold">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    onKeyDown={(e) => {
                      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Delete, Backspace
                      if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
                        return; // Allow default behavior
                      }
                    }}
                    placeholder="your.email@university.edu"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold">Major *</Label>
                  <Select value={profileData.major} onValueChange={(value) => setProfileData(prev => ({ ...prev, major: value as "CS" | "BUS" }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select your major" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CS">Computer Science (CS)</SelectItem>
                      <SelectItem value="BUS">Business (BUS)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="year" className="text-sm font-semibold">Year (student/alumni)</Label>
                  <Input
                    id="year"
                    type="number"
                    value={profileData.year === "" ? "" : profileData.year}
                    onChange={(e) => {
                      const value = e.target.value;
                      setProfileData(prev => ({ 
                        ...prev, 
                        year: value === "" ? "" : parseInt(value) || ""
                      }));
                    }}
                    placeholder="1-8 or -1 for Alumni"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Use -1 for Alumni, 1-8 for current students</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="experience" className="text-sm font-semibold">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={profileData.experience === "" ? "" : profileData.experience}
                    onChange={(e) => {
                      const value = e.target.value;
                      setProfileData(prev => ({ 
                        ...prev, 
                        experience: value === "" ? "" : parseInt(value) || ""
                      }));
                    }}
                    placeholder="0-10"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="focusAreas" className="text-sm font-semibold">Focus Areas</Label>
                  <Input
                    id="focusAreas"
                    value={profileData.focusAreas}
                    onChange={(e) => setProfileData(prev => ({ ...prev, focusAreas: e.target.value }))}
                    onKeyDown={(e) => {
                      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Delete, Backspace
                      if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
                        return; // Allow default behavior
                      }
                    }}
                    placeholder="Data Science, QA, ML"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Comma-separated list of your interests</p>
                </div>

                <div>
                  <Label htmlFor="summary" className="text-sm font-semibold">Summary</Label>
                  <Textarea
                    id="summary"
                    value={profileData.summary || generateSummary()}
                    onChange={(e) => setProfileData(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    className="mt-2 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold">Profile Photo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage 
                        src={profileData.photo ? 
                          (profileData.photo.startsWith('http') ? 
                            profileData.photo : 
                            `http://localhost:3001${profileData.photo}`
                          ) : undefined
                        } 
                      />
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {profileData.name ? profileData.name.charAt(0) : <Camera className="h-6 w-6" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload(file);
                        }}
                        className="hidden"
                        id="photo-upload"
                        disabled={photoLoading}
                      />
                      <label htmlFor="photo-upload">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          asChild
                          disabled={photoLoading}
                        >
                          <span>
                            <Camera className="h-4 w-4 mr-2" />
                            {photoLoading ? "Uploading..." : "Upload Photo"}
                          </span>
                        </Button>
                      </label>
                      {profileData.photo && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handlePhotoRemove}
                          disabled={photoLoading}
                        >
                          Remove Photo
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a JPEG, PNG, GIF, or WebP image (max 5MB)
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Tags Section */}
          {profileData.major && (
            <Card className="mt-8 p-8 shadow-card border-0">
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

              <div className="mt-6 flex items-center gap-2">
                <Input 
                  placeholder="Add custom tag" 
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value && profileData.selectedTags.length < 5) {
                      handleTagToggle(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button variant="outline" size="sm">
                  Add Tag
                </Button>
              </div>
            </Card>
          )}

          {/* Submit Button */}
          <div className="text-center mt-8">
            <Button 
              variant="hero"
              size="xl"
              onClick={handleSubmit}
              disabled={!profileData.name || !profileData.email || !profileData.major}
            >
              Create Account & Start Matching!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}