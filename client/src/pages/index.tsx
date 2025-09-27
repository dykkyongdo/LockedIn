// LockedIn Landing Page - Welcome users and guide them to create their profile

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, Heart, Target, Users, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const handleGetStarted = () => {
    window.location.href = "/create-profile";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-primary overflow-hidden min-h-[90vh] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Get{" "}
              <span className="gradient-text-secondary bg-gradient-accent bg-clip-text text-transparent">
                LockedIn
              </span>{" "}
              to Your Dream Job 🚀
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Swipe right on opportunities that match your vibe. 
              It's like Tinder, but for landing your perfect internship or job.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                variant="hero"
                size="xl"
                onClick={handleGetStarted}
                className="text-lg px-8 py-4"
              >
                Get Started Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="clean"
                size="xl"
                className="text-lg px-8 py-4 bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
              >
                See How It Works
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-white/80">Active Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">10k+</div>
                <div className="text-white/80">Job Matches Made</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">95%</div>
                <div className="text-white/80">Match Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text-primary mb-4">
            Why Students Love LockedIn
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We've reimagined job searching for the TikTok generation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 text-center border-0 shadow-card hover:shadow-card-hover transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Lightning Fast Matching</h3>
            <p className="text-muted-foreground">
              Swipe through opportunities in seconds. Our AI learns your preferences and shows you better matches.
            </p>
          </Card>

          <Card className="p-8 text-center border-0 shadow-card hover:shadow-card-hover transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Perfect Cultural Fit</h3>
            <p className="text-muted-foreground">
              Match based on personality, work style, and company culture — not just skills and experience.
            </p>
          </Card>

          <Card className="p-8 text-center border-0 shadow-card hover:shadow-card-hover transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Direct Applications</h3>
            <p className="text-muted-foreground">
              Skip the cover letters and boring applications. Send your personality directly to hiring managers.
            </p>
          </Card>
        </div>

        {/* How it Works */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold gradient-text-primary mb-8">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Create Your Profile</h3>
              <p className="text-sm text-muted-foreground">
                Upload your resume or fill out your info. Add personality tags to stand out.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-secondary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Swipe on Jobs</h3>
              <p className="text-sm text-muted-foreground">
                Browse curated opportunities. Swipe right to apply, left to pass.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Get Matched</h3>
              <p className="text-sm text-muted-foreground">
                Companies see your personality and skills. Get interviews faster.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-subtle rounded-card p-12">
          <h2 className="text-3xl font-bold gradient-text-primary mb-4">
            Ready to Find Your Dream Role?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students who've found their perfect match
          </p>
          <Button 
            variant="hero"
            size="xl"
            onClick={handleGetStarted}
          >
            Create Your Profile
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;