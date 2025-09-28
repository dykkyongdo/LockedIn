import React, { useState, useEffect } from "react";
import { X, Heart, Info, MessageCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard, JobData } from "@/components/ui/job-card";
import { AppHeader } from "@/components/layout/app-header";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getJobs, swipeJob, Job } from "@/lib/api";

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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "User", avatar: "" });

  // Load user data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          setUser({
            name: parsedProfile.name || "User",
            avatar: parsedProfile.photo || ""
          });
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
    };

    // Load on mount
    loadUserData();

    // Listen for storage changes (when profile is updated in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userProfile') {
        loadUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for focus events to refresh when user comes back to tab
    const handleFocus = () => {
      loadUserData();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  
  // Convert API Job to JobCard JobData
  const convertJobToJobData = (job: Job): JobData => {
    // Generate realistic data based on job type
    const isTechJob = job.interests.some(interest => 
      ['Full Stack', 'Back-end', 'Front-end', 'ML', 'QA', 'Data Analysis'].includes(interest)
    );
    
    const companySizes = ["10-50", "50-200", "200-500", "500-1000", "1000+"];
    const industries = isTechJob ? ["Technology", "Software", "AI/ML", "Data Analytics"] : ["Business", "Finance", "Consulting", "Marketing"];
    const workTypes = ["Remote", "Hybrid", "On-site"];
    
    // Generate salary based on job type and company
    const baseSalary = isTechJob ? 70000 : 50000;
    const salaryRange = Math.random() * 30000;
    
    // Generate tech stack based on job interests
    const techStacks = {
      'Full Stack': ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
      'Back-end': ['Python', 'Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
      'Front-end': ['React', 'Vue.js', 'CSS3', 'Webpack', 'Jest'],
      'ML': ['Python', 'TensorFlow', 'PyTorch', 'Pandas', 'Scikit-learn'],
      'QA': ['Selenium', 'Jest', 'Cypress', 'Postman', 'Git'],
      'Data Analysis': ['Python', 'SQL', 'Tableau', 'Power BI', 'Excel']
    };
    
    const techStack = job.interests.flatMap(interest => techStacks[interest] || []).slice(0, 6);
    
    // Generate requirements based on job type
    const requirements = isTechJob ? [
      `Currently pursuing ${isTechJob ? 'Computer Science' : 'Business'} degree or equivalent experience`,
      `Strong problem-solving and analytical skills`,
      `Experience with modern development tools and practices`,
      `Excellent communication and teamwork abilities`
    ] : [
      `Currently pursuing Business degree or equivalent experience`,
      `Strong analytical and communication skills`,
      `Experience with data analysis and reporting tools`,
      `Ability to work in a fast-paced environment`
    ];
    
    // Generate benefits
    const benefits = [
      "Competitive salary and benefits package",
      "Professional development opportunities",
      "Flexible work arrangements",
      "Mentorship and career growth support"
    ];
    
    return {
      id: job.id.toString(),
      title: job.job_name,
      company: {
        name: job.company_name,
        logo: job.company_photo,
        size: companySizes[Math.floor(Math.random() * companySizes.length)],
        industry: industries[Math.floor(Math.random() * industries.length)],
      },
      location: job.location,
      workType: workTypes[Math.floor(Math.random() * workTypes.length)],
      salary: { 
        min: Math.round(baseSalary + salaryRange), 
        max: Math.round(baseSalary + salaryRange + 20000) 
      },
      distance: Math.round((Math.random() * 20 + 1) * 10) / 10, // 1-21 km
      categories: job.interests,
      userCategories: job.interests, // For now, show all as matched
      description: job.description,
      requirements: requirements,
      techStack: techStack,
      benefits: benefits
    };
  };

  const currentJob = jobs[currentJobIndex] ? convertJobToJobData(jobs[currentJobIndex]) : null;

  // Load jobs from API
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const jobsData = await getJobs();
        setJobs(jobsData);
      } catch (error) {
        console.error("Failed to load jobs:", error);
        toast({
          title: "Failed to load jobs",
          description: "Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [toast]);

  const handleApply = async (jobId: string) => {
    try {
      const result = await swipeJob(parseInt(jobId), 'right');
      const job = jobs.find(j => j.id.toString() === jobId);
      
      if (job) {
        toast({
          title: result.matched ? "It's a match! 💖" : "Application submitted! 💼",
          description: result.matched 
            ? `You matched with ${job.company_name}!` 
            : `Applied to ${job.job_name} at ${job.company_name}`,
        });
      }
      nextJob();
    } catch (error) {
      console.error("Failed to apply:", error);
      toast({
        title: "Failed to apply",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePass = async (jobId: string) => {
    try {
      await swipeJob(parseInt(jobId), 'left');
      const job = jobs.find(j => j.id.toString() === jobId);
      
      if (job) {
        toast({
          title: "Passed",
          description: `Passed on ${job.job_name} at ${job.company_name}`,
        });
      }
      nextJob();
    } catch (error) {
      console.error("Failed to pass:", error);
      toast({
        title: "Failed to pass",
        description: "Please try again.",
        variant: "destructive"
      });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader user={user} onProfileClick={() => {}} />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold gradient-text-primary mb-4">
              Loading opportunities...
            </h2>
            <p className="text-muted-foreground">
              Finding the perfect jobs for you!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader user={user} onProfileClick={() => {}} />
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
      <AppHeader user={user} onProfileClick={() => window.location.href = "/profile"} />
      
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