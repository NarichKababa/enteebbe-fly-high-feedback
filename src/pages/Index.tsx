import React from 'react';
import { Link } from 'react-router-dom';
import { FeedbackForm } from '@/components/FeedbackForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Star, Users, MessageSquare, Shield, MapPin, Clock, Wifi } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Easy Feedback",
      description: "Quick and simple feedback submission process"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Rating System",
      description: "Rate your experience across different categories"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Anonymous Option",
      description: "Submit feedback anonymously if preferred"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your feedback is handled with utmost privacy"
    }
  ];

  const services = [
    { icon: <Plane className="h-5 w-5" />, name: "Flight Operations" },
    { icon: <MapPin className="h-5 w-5" />, name: "Terminal Services" },
    { icon: <Clock className="h-5 w-5" />, name: "24/7 Operations" },
    { icon: <Wifi className="h-5 w-5" />, name: "Free WiFi" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Plane className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Entebbe International Airport</h1>
                <p className="text-sm text-muted-foreground">Your Gateway to East Africa</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="hidden md:flex">
                <Clock className="h-3 w-3 mr-1" />
                24/7 Service
              </Badge>
              <Link to="/auth">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              Share Your Experience
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Help us improve our services by sharing your feedback about your experience at Entebbe International Airport. 
              Your voice matters in making travel better for everyone.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {services.map((service, index) => (
                <Card key={index} className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
                  <CardContent className="p-0 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full mb-2 text-primary">
                      {service.icon}
                    </div>
                    <p className="text-sm font-medium">{service.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Your Feedback Matters</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We continuously strive to enhance our services based on passenger experiences and suggestions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-[var(--shadow-card)] transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4 text-primary">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Form Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Submit Your Feedback</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Take a moment to share your experience and help us serve you better
            </p>
          </div>
          
          <FeedbackForm onSuccess={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Plane className="h-6 w-6 text-primary" />
                <span className="font-semibold">Entebbe International Airport</span>
              </div>
              <p className="text-sm text-muted-foreground">
                East Africa's premier international gateway, serving millions of passengers annually with world-class facilities and services.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Information</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📧 feedback@entebbe-airport.com</p>
                <p>📞 +256 414 353 000</p>
                <p>🌐 www.caa.co.ug</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Operating Hours</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Terminal: 24/7</p>
                <p>Customer Service: 6:00 AM - 10:00 PM</p>
                <p>Duty Free: 5:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Entebbe International Airport. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
