import React, { useState } from "react";
import { X, Heart, Info, MessageCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard, JobData } from "@/components/ui/job-card";
import { AppHeader } from "@/components/layout/app-header";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Mock job data
const mockJobs: JobData[] = [
  {
    id: "1",
    title: "Full Stack Developer Intern",
    company: {
      name: "TechCorp Inc.",
      size: "500-1000",
      industry: "Technology",
      website: "https://techcorp.com"
    },
    location: "San Francisco, CA",
    workType: "Hybrid",
    salary: { min: 85000, max: 120000 },
    distance: 2.3,
    categories: ["Full Stack", "React", "Node.js", "TypeScript"],
    userCategories: ["Full Stack", "React"],
    description: "Join our dynamic team as a Full Stack Developer Intern! You'll work on cutting-edge web applications using React, Node.js, and TypeScript. This role offers mentorship from senior developers and real-world project experience.",
    requirements: [
      "Currently pursuing CS degree or equivalent experience",
      "Strong foundation in JavaScript/TypeScript",
      "Experience with React and modern frontend frameworks",
      "Familiarity with Node.js and backend development"
    ],
    techStack: ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Docker"],
    benefits: [
      "Competitive intern salary",
      "Mentorship program",
      "Flexible work arrangements",
      "Professional development opportunities"
    ]
  },
  {
    id: "2", 
    title: "Data Science Intern",
    company: {
      name: "DataFlow Analytics", 
      size: "50-200",
      industry: "Data Analytics"
    },
    location: "Austin, TX",
    workType: "Remote",
    salary: { min: 70000, max: 95000 },
    distance: 5.7,
    categories: ["Data Science", "Python", "Machine Learning", "Analytics"],
    userCategories: ["Data Science", "Machine Learning"],
    description: "Exciting opportunity to work with cutting-edge ML models and big data pipelines. You'll contribute to real client projects while learning from industry experts.",
    requirements: [
      "Strong background in statistics and mathematics",
      "Proficiency in Python and data science libraries",
      "Experience with machine learning frameworks",
      "Excellent analytical and problem-solving skills"
    ],
    techStack: ["Python", "TensorFlow", "PyTorch", "Pandas", "Jupyter", "AWS"],
    benefits: [
      "Remote-first culture",
      "Learning stipend", 
      "Conference attendance",
      "Equity participation"
    ]
  },
  {
    id: "3",
    title: "Product Manager Intern", 
    company: {
      name: "InnovateLab",
      size: "100-500",
      industry: "Product"
    },
    location: "Seattle, WA", 
    workType: "On-site",
    salary: { min: 90000, max: 115000 },
    distance: 8.2,
    categories: ["Product Management", "Strategy", "Analytics", "Leadership"],
    userCategories: ["Analytics"],
    description: "Lead product initiatives from conception to launch. Work directly with engineering and design teams to deliver impactful features for millions of users.",
    requirements: [
      "Strong analytical and strategic thinking skills",
      "Experience with product management tools",
      "Excellent communication and leadership abilities", 
      "Understanding of user experience principles"
    ],
    techStack: ["Figma", "Jira", "Slack", "Google Analytics", "Mixpanel", "SQL"],
    benefits: [
      "Direct CEO mentorship",
      "Product launch ownership", 
      "Cross-functional exposure",
      "Full-time conversion opportunity"
    ]
  }
];

export default function MainSeeking() {
  const { toast } = useToast();
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [showColdMessage, setShowColdMessage] = useState(false);
  const [showCompanyInfo, setShowCompanyInfo] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<JobData["company"] | null>(null);
  const [coldMessage, setColdMessage] = useState("");
  const [jobs] = useState(mockJobs);
  
  const currentJob = jobs[currentJobIndex];
  const mockUser = { name: "Alex Thompson", avatar: "" };

  const handleApply = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      toast({
        title: "Application submitted! 💼",
        description: `Applied to ${job.title} at ${job.company.name}`,
      });
      nextJob();
    }
  };

  const handlePass = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      toast({
        title: "Passed",
        description: `Passed on ${job.title} at ${job.company.name}`,
      });
      nextJob();
    }
  };

  const nextJob = () => {
    if (currentJobIndex < jobs.length - 1) {
      setCurrentJobIndex(prev => prev + 1);
    } else {
      // Show end of deck message
      toast({
        title: "That's all for now! 🎉",
        description: "Check back later for more opportunities or refresh to see the deck again.",
      });
    }
  };

  const handleColdMessage = (jobId: string) => {
    setShowColdMessage(true);
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setColdMessage(`Hi ${job.company.name}, I'm ${mockUser.name} — 3rd-year CS student at University, 2 years of experience, focuses on Data Science, Machine Learning, Backend Development. I'm interested in ${job.title} because `);
    }
  };

  const sendColdMessage = () => {
    toast({
      title: "Message sent! ✉️", 
      description: "Your introduction has been sent to the company.",
    });
    setShowColdMessage(false);
    setColdMessage("");
  };

  const handleCompanyInfo = (company: JobData["company"]) => {
    setSelectedCompany(company);
    setShowCompanyInfo(true);
  };

  const refreshDeck = () => {
    setCurrentJobIndex(0);
    toast({
      title: "Deck refreshed! 🔄",
      description: "Starting over with fresh opportunities.",
    });
  };

  if (!currentJob) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader user={mockUser} onProfileClick={() => {}} />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold gradient-text-primary mb-4">
              That's all for now!
            </h2>
            <p className="text-muted-foreground mb-6">
              You've seen all available opportunities. Check back later for more amazing jobs!
            </p>
            <Button variant="hero" onClick={refreshDeck}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Start Over
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={mockUser} onProfileClick={() => window.location.href = "/profile"} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Job Counter */}
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              Job {currentJobIndex + 1} of {jobs.length}
            </p>
            <div className="w-full bg-muted rounded-full h-1 mt-2">
              <div 
                className="bg-gradient-primary h-1 rounded-full transition-all duration-500"
                style={{ width: `${((currentJobIndex + 1) / jobs.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Main Job Card */}
          <JobCard 
            job={currentJob}
            onApply={handleApply}
            onPass={handlePass}
            onCompanyInfo={handleCompanyInfo}
            onColdMessage={handleColdMessage}
          />

          {/* Bottom Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePass(currentJob.id)}
              className="h-16 w-16 rounded-full border-destructive/20 text-destructive hover:bg-destructive hover:text-white"
            >
              <X className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCompanyInfo(currentJob.company)}
              className="h-12 w-12 rounded-full"
            >
              <Info className="h-6 w-6" />
            </Button>

            <Button
              variant="gradient-primary"
              size="icon"
              onClick={() => handleApply(currentJob.id)}
              className="h-16 w-16 rounded-full"
            >
              <Heart className="h-8 w-8" />
            </Button>
          </div>

          <div className="text-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleColdMessage(currentJob.id)}
              className="text-electric-purple hover:text-electric-purple/80"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Send Cold Message
            </Button>
          </div>
        </div>
      </div>

      {/* Cold Message Modal */}
      <Dialog open={showColdMessage} onOpenChange={setShowColdMessage}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send a Quick Intro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                value={coldMessage}
                onChange={(e) => setColdMessage(e.target.value)}
                placeholder="Write your introduction..."
                className="mt-2 min-h-[120px]"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowColdMessage(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="gradient-primary" onClick={sendColdMessage} className="flex-1">
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Company Info Modal */}
      <Dialog open={showCompanyInfo} onOpenChange={setShowCompanyInfo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedCompany?.name}</DialogTitle>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-muted-foreground">Size:</span>
                  <p>{selectedCompany.size || "50-200"} employees</p>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Industry:</span>
                  <p>{selectedCompany.industry || "Technology"}</p>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Founded:</span>
                  <p>2018</p>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">CEO:</span>
                  <p>Sarah Johnson</p>
                </div>
              </div>
              
              <div>
                <span className="font-semibold text-muted-foreground">About:</span>
                <p className="text-sm mt-1">
                  A fast-growing company focused on innovation and creating impactful solutions. 
                  We value creativity, collaboration, and continuous learning.
                </p>
              </div>

              {selectedCompany.website && (
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowCompanyInfo(false)}>
                    Close
                  </Button>
                  <Button 
                    variant="gradient-primary" 
                    className="flex-1"
                    onClick={() => window.open(selectedCompany.website, "_blank")}
                  >
                    Visit Website
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}