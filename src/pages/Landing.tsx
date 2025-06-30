import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Brain, Target, Zap, ArrowRight, Star, BookOpen, MessageCircle, Trophy, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export default function Landing() {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  // Only redirect authenticated users with profiles to homepage
  useEffect(() => {
    if (!loading && user && userProfile) {
      console.log('Landing: Authenticated user with profile detected, redirecting to homepage');
      navigate('/homepage');
    }
  }, [user, userProfile, loading, navigate]);

  // Don't show loading for unauthenticated users - show the landing page immediately
  // Only show loading if we have a user but are still checking for their profile
  if (loading && user) {
    console.log('Landing: Loading user profile...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 text-primary-600 font-bold text-xl">
              <Users className="w-8 h-8" />
              <span>StudyCircle</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-neutral-600 hover:text-primary-600 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-neutral-600 hover:text-primary-600 font-medium transition-colors">How it Works</a>
              <a href="#testimonials" className="text-neutral-600 hover:text-primary-600 font-medium transition-colors">Success Stories</a>
            </nav>
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 mb-6 animate-fade-in">
              Find Your Circle
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 mb-4 animate-slide-up">
              Where Great Minds Learn Alike
            </p>
            <p className="text-lg text-neutral-500 mb-12 max-w-2xl mx-auto animate-slide-up">
              Connect with like-minded students, form study groups, and achieve academic success together. 
              Join thousands of students already learning smarter, not harder.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <Link to="/signup">
                <Button size="lg" className="group">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="animate-fade-in">
                <div className="text-3xl font-bold text-primary-600">10K+</div>
                <div className="text-neutral-500">Active Students</div>
              </div>
              <div className="animate-fade-in">
                <div className="text-3xl font-bold text-secondary-600">500+</div>
                <div className="text-neutral-500">Study Groups</div>
              </div>
              <div className="animate-fade-in">
                <div className="text-3xl font-bold text-accent-600">95%</div>
                <div className="text-neutral-500">Success Rate</div>
              </div>
              <div className="animate-fade-in">
                <div className="text-3xl font-bold text-primary-600">4.9★</div>
                <div className="text-neutral-500">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Everything You Need to Study Better
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Our platform provides all the tools and features you need to create, join, and manage effective study groups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card hover className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Smart Matching</h3>
              <p className="text-neutral-600">
                AI-powered algorithm matches you with students who share your learning style, schedule, and academic goals.
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Real-time Collaboration</h3>
              <p className="text-neutral-600">
                Chat, share resources, and work together in real-time with your study group members.
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Goal Tracking</h3>
              <p className="text-neutral-600">
                Set study goals, track progress, and celebrate achievements with your group members.
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Resource Library</h3>
              <p className="text-neutral-600">
                Share and access study materials, notes, and resources in one organized library.
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Interactive Quizzes</h3>
              <p className="text-neutral-600">
                Create and take quizzes to test knowledge and reinforce learning within your study groups.
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Achievements</h3>
              <p className="text-neutral-600">
                Earn badges and compete on leaderboards to stay motivated and engaged in your studies.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Join StudyCircle and start your collaborative learning journey today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Create Your Account</h3>
              <p className="text-neutral-600">
                Sign up with your email or Google account. Verify your email to get started securely.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Complete Your Profile</h3>
              <p className="text-neutral-600">
                Tell us about your academic focus, learning preferences, and availability to get personalized recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Start Learning Together</h3>
              <p className="text-neutral-600">
                Find or create study groups, collaborate with peers, and achieve your academic goals together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              What Students Are Saying
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Join thousands of students who have improved their academic performance with StudyCircle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-neutral-600 mb-6 italic">
                "StudyCircle helped me find the perfect study group for my computer science courses. My grades improved by 15% in just one semester!"
              </p>
              <div className="text-sm">
                <div className="font-semibold text-neutral-900">Alex Chen</div>
                <div className="text-neutral-500">CS Major, Stanford University</div>
              </div>
            </Card>

            <Card className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-neutral-600 mb-6 italic">
                "The collaborative features are amazing. Being able to share resources and take practice quizzes together made studying so much more effective."
              </p>
              <div className="text-sm">
                <div className="font-semibold text-neutral-900">Maria Rodriguez</div>
                <div className="text-neutral-500">Biology Major, UC Berkeley</div>
              </div>
            </Card>

            <Card className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-neutral-600 mb-6 italic">
                "I was struggling with organic chemistry until I joined a StudyCircle group. The peer support and shared knowledge made all the difference."
              </p>
              <div className="text-sm">
                <div className="font-semibold text-neutral-900">David Kim</div>
                <div className="text-neutral-500">Pre-Med, Harvard University</div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Study Experience?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already studying smarter and achieving better results together.
          </p>
          <Link to="/signup">
            <Button variant="outline" size="lg" className="bg-white text-primary-600 hover:bg-neutral-50 border-white">
              Start Your Journey Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Built on Bolt Badge */}
      <div className="fixed bottom-4 right-4 z-50">
        <span className="bg-primary-600 text-white px-3 py-2 rounded-full text-sm font-medium shadow-lg">
          Built on Bolt
        </span>
      </div>
    </div>
  );
}