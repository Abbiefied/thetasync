import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { createUserProfile } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const ACADEMIC_FOCUSES = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Engineering', 'Medicine', 'Business', 'Economics', 'Psychology',
  'Literature', 'History', 'Philosophy', 'Political Science', 'Sociology',
  'Art & Design', 'Music', 'Law', 'Education', 'Environmental Science'
];

const INSTITUTIONS = [
  'Stanford University', 'Harvard University', 'MIT', 'UC Berkeley', 'UCLA',
  'University of Washington', 'Carnegie Mellon University', 'Yale University',
  'Princeton University', 'Columbia University', 'University of Chicago',
  'Northwestern University', 'Duke University', 'University of Pennsylvania',
  'Cornell University', 'Other'
];

const DEGREE_LEVELS = [
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'masters', label: 'Master\'s' },
  { value: 'phd', label: 'PhD' },
  { value: 'postdoc', label: 'Post-Doc' }
];

const UNDERGRADUATE_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year+'];
const GRADUATE_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year+'];

const LEARNING_PREFERENCES = [
  { value: 'Visual', description: 'Learn best with diagrams, charts, and visual aids' },
  { value: 'Verbal', description: 'Learn best through discussion and verbal explanation' },
  { value: 'Kinesthetic', description: 'Learn best through hands-on practice and movement' }
];

const GENERAL_INTERESTS = [
  'Research', 'Industry Applications', 'Teaching/Tutoring', 'Entrepreneurship',
  'Academic Competitions', 'Open Source Projects', 'Internships', 'Networking',
  'Conference Presentations', 'Publication Writing', 'Skill Development',
  'Career Preparation', 'Creative Projects', 'Community Service'
];

const STUDY_GOALS = [
  'Improve GPA', 'Prepare for Exams', 'Master Difficult Concepts', 'Research Collaboration',
  'Interview Preparation', 'Skill Building', 'Peer Learning', 'Academic Writing',
  'Project Collaboration', 'Knowledge Sharing', 'Study Accountability',
  'Time Management', 'Test Preparation', 'Career Development'
];

const TIME_SLOTS = [
  'Monday 9:00-11:00', 'Monday 14:00-16:00', 'Monday 19:00-21:00',
  'Tuesday 9:00-11:00', 'Tuesday 14:00-16:00', 'Tuesday 19:00-21:00',
  'Wednesday 9:00-11:00', 'Wednesday 14:00-16:00', 'Wednesday 19:00-21:00',
  'Thursday 9:00-11:00', 'Thursday 14:00-16:00', 'Thursday 19:00-21:00',
  'Friday 9:00-11:00', 'Friday 14:00-16:00', 'Friday 19:00-21:00',
  'Saturday 10:00-12:00', 'Saturday 14:00-16:00',
  'Sunday 10:00-12:00', 'Sunday 14:00-16:00'
];

interface ValidationErrors {
  [key: string]: string;
}

interface OnboardingData {
  // Step 1: Basic Information
  name: string;
  institution: string;
  customInstitution: string;
  
  // Step 2: Academic Information
  courseOfStudy: string;
  degreeLevel: 'undergraduate' | 'masters' | 'phd' | 'postdoc' | '';
  year: string;
  academicFocus: string[];
  
  // Step 3: Personal Information
  bio: string;
  learningPreference: 'Visual' | 'Verbal' | 'Kinesthetic' | '';
  generalInterests: string[];
  studyGoals: string[];
  
  // Step 4: Availability
  availability: string[];
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, userProfile, loading, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [data, setData] = useState<OnboardingData>({
    name: '',
    institution: '',
    customInstitution: '',
    courseOfStudy: '',
    degreeLevel: '',
    year: '',
    academicFocus: [],
    bio: '',
    learningPreference: '',
    generalInterests: [],
    studyGoals: [],
    availability: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 4;

  // Handle redirects and initial data
  useEffect(() => {
    console.log('Onboarding useEffect:', { loading, user: !!user, userProfile: !!userProfile });
    
    if (loading) {
      console.log('Still loading auth state...');
      return;
    }

    if (!user) {
      console.log('No user found, redirecting to signup');
      navigate('/signup');
      return;
    }

    // If user already has a profile, redirect to homepage
    if (userProfile) {
      console.log('User already has profile, redirecting to homepage');
      navigate('/homepage');
      return;
    }

    // Pre-fill user data from auth
    if (user && !userProfile) {
      console.log('Setting up onboarding for user:', user.email);
      setData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || '',
      }));
    }
  }, [user, userProfile, loading, navigate]);

  // Validation functions
  const validateStep = (step: number): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    switch (step) {
      case 1:
        if (!data.name.trim()) {
          newErrors.name = 'Full name is required';
        } else if (data.name.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        }

        if (!data.institution) {
          newErrors.institution = 'Institution is required';
        }

        if (data.institution === 'Other' && !data.customInstitution.trim()) {
          newErrors.customInstitution = 'Please specify your institution';
        }
        break;

      case 2:
        if (!data.courseOfStudy.trim()) {
          newErrors.courseOfStudy = 'Course of study is required';
        }

        if (!data.degreeLevel) {
          newErrors.degreeLevel = 'Degree level is required';
        }

        if (!data.year) {
          newErrors.year = 'Year is required';
        }

        if (data.academicFocus.length === 0) {
          newErrors.academicFocus = 'Please select at least one academic focus';
        }
        break;

      case 3:
        if (!data.learningPreference) {
          newErrors.learningPreference = 'Learning preference is required';
        }

        if (data.generalInterests.length === 0) {
          newErrors.generalInterests = 'Please select at least one general interest';
        }

        if (data.studyGoals.length === 0) {
          newErrors.studyGoals = 'Please select at least one study goal';
        }

        if (data.bio.length > 500) {
          newErrors.bio = 'Bio must be 500 characters or less';
        }
        break;

      case 4:
        if (data.availability.length === 0) {
          newErrors.availability = 'Please select at least one available time slot';
        }
        break;
    }

    return newErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep);
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setErrors({ general: 'User session not found. Please sign in again.' });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Creating profile for user:', user.email);
      
      // Prepare profile data
      const profileData = {
        name: data.name,
        email: user.email!,
        institution: data.institution === 'Other' ? data.customInstitution : data.institution,
        course_of_study: data.courseOfStudy,
        academic_focus: data.academicFocus,
        degree_level: data.degreeLevel,
        year: data.year,
        bio: data.bio || null,
        learning_preference: data.learningPreference,
        general_interests: data.generalInterests,
        study_goals: data.studyGoals,
        availability: data.availability.map(slot => {
          const [day, time] = slot.split(' ');
          const [start, end] = time.split('-');
          return { day, startTime: start, endTime: end };
        })
      };

      console.log('Creating user profile with data:', profileData);
      const { error: profileError } = await createUserProfile(user.id, profileData);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        setErrors({ general: 'Failed to create profile. Please try again.' });
        return;
      }

      console.log('Profile created successfully, refreshing profile...');
      // Refresh the profile in context
      const newProfile = await refreshProfile();
      
      if (newProfile) {
        console.log('Profile refresh successful, navigating to homepage');
        navigate('/homepage');
      } else {
        console.error('Profile refresh failed');
        setErrors({ general: 'Profile created but failed to load. Please refresh the page.' });
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      setErrors({ general: 'An unexpected error occurred while creating your profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvailabilityToggle = (slot: string) => {
    setData(prev => ({
      ...prev,
      availability: prev.availability.includes(slot)
        ? prev.availability.filter(s => s !== slot)
        : [...prev.availability, slot]
    }));
  };

  const handleAcademicFocusToggle = (focus: string) => {
    setData(prev => ({
      ...prev,
      academicFocus: prev.academicFocus.includes(focus)
        ? prev.academicFocus.filter(f => f !== focus)
        : prev.academicFocus.length < 3
        ? [...prev.academicFocus, focus]
        : prev.academicFocus
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setData(prev => ({
      ...prev,
      generalInterests: prev.generalInterests.includes(interest)
        ? prev.generalInterests.filter(i => i !== interest)
        : [...prev.generalInterests, interest]
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setData(prev => ({
      ...prev,
      studyGoals: prev.studyGoals.includes(goal)
        ? prev.studyGoals.filter(g => g !== goal)
        : [...prev.studyGoals, goal]
    }));
  };

  const getYearOptions = () => {
    return data.degreeLevel === 'undergraduate' ? UNDERGRADUATE_YEARS : GRADUATE_YEARS;
  };

  const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
      <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
        <AlertCircle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    );
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-neutral-900">Complete Your Profile</h1>
            <span className="text-sm text-neutral-500">Step {currentStep} of {totalSteps}</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="animate-slide-up">
          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <ErrorMessage error={errors.general} />
            </div>
          )}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Basic Information</h2>
              <p className="text-neutral-600 mb-6">Let's start with your basic details to set up your profile.</p>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      errors.name ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="Enter your full name"
                    autoFocus
                  />
                  <ErrorMessage error={errors.name} />
                </div>

                <div>
                  <label htmlFor="institution" className="block text-sm font-medium text-neutral-700 mb-2">
                    Institution *
                  </label>
                  <select
                    id="institution"
                    value={data.institution}
                    onChange={(e) => setData(prev => ({ ...prev, institution: e.target.value, customInstitution: '' }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      errors.institution ? 'border-red-300' : 'border-neutral-300'
                    }`}
                  >
                    <option value="">Select your institution</option>
                    {INSTITUTIONS.map(institution => (
                      <option key={institution} value={institution}>{institution}</option>
                    ))}
                  </select>
                  <ErrorMessage error={errors.institution} />
                </div>

                {data.institution === 'Other' && (
                  <div>
                    <label htmlFor="customInstitution" className="block text-sm font-medium text-neutral-700 mb-2">
                      Institution Name *
                    </label>
                    <input
                      type="text"
                      id="customInstitution"
                      value={data.customInstitution}
                      onChange={(e) => setData(prev => ({ ...prev, customInstitution: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                        errors.customInstitution ? 'border-red-300' : 'border-neutral-300'
                      }`}
                      placeholder="Enter your institution name"
                    />
                    <ErrorMessage error={errors.customInstitution} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Academic Information */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Academic Information</h2>
              <p className="text-neutral-600 mb-6">Tell us about your academic background and focus areas.</p>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="courseOfStudy" className="block text-sm font-medium text-neutral-700 mb-2">
                    Course of Study *
                  </label>
                  <input
                    type="text"
                    id="courseOfStudy"
                    value={data.courseOfStudy}
                    onChange={(e) => setData(prev => ({ ...prev, courseOfStudy: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      errors.courseOfStudy ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="e.g., Computer Science, Mechanical Engineering, Psychology"
                  />
                  <ErrorMessage error={errors.courseOfStudy} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Degree Level *
                    </label>
                    <div className="space-y-2">
                      {DEGREE_LEVELS.map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => setData(prev => ({ ...prev, degreeLevel: level.value as any, year: '' }))}
                          className={`w-full p-3 text-left rounded-lg border transition-all ${
                            data.degreeLevel === level.value
                              ? 'bg-primary-50 border-primary-300 text-primary-700'
                              : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{level.label}</span>
                            {data.degreeLevel === level.value && (
                              <Check className="w-4 h-4" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    <ErrorMessage error={errors.degreeLevel} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Current Year *
                    </label>
                    <div className="space-y-2">
                      {data.degreeLevel && getYearOptions().map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={() => setData(prev => ({ ...prev, year }))}
                          className={`w-full p-3 text-left rounded-lg border transition-all ${
                            data.year === year
                              ? 'bg-primary-50 border-primary-300 text-primary-700'
                              : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{year}</span>
                            {data.year === year && (
                              <Check className="w-4 h-4" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    <ErrorMessage error={errors.year} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Academic Focus * (Select up to 3)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ACADEMIC_FOCUSES.map((focus) => (
                      <button
                        key={focus}
                        type="button"
                        onClick={() => handleAcademicFocusToggle(focus)}
                        disabled={!data.academicFocus.includes(focus) && data.academicFocus.length >= 3}
                        className={`p-3 text-sm rounded-lg border transition-all ${
                          data.academicFocus.includes(focus)
                            ? 'bg-primary-50 border-primary-300 text-primary-700'
                            : !data.academicFocus.includes(focus) && data.academicFocus.length >= 3
                            ? 'bg-neutral-50 border-neutral-200 text-neutral-400 cursor-not-allowed'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        {focus}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-neutral-500">
                      Selected {data.academicFocus.length} of 3 focus areas
                    </p>
                    {data.academicFocus.length >= 3 && (
                      <p className="text-sm text-amber-600">Maximum selections reached</p>
                    )}
                  </div>
                  <ErrorMessage error={errors.academicFocus} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Personal Information */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Personal Information</h2>
              <p className="text-neutral-600 mb-6">Help us understand your learning style and goals.</p>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-2">
                    Bio (Optional)
                  </label>
                  <textarea
                    id="bio"
                    value={data.bio}
                    onChange={(e) => setData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
                      errors.bio ? 'border-red-300' : 'border-neutral-300'
                    }`}
                    placeholder="Tell us a bit about yourself, your academic interests, and what you hope to achieve..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    <ErrorMessage error={errors.bio} />
                    <span className={`text-sm ${data.bio.length > 500 ? 'text-red-500' : 'text-neutral-500'}`}>
                      {data.bio.length}/500 characters
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Learning Preference *
                  </label>
                  <div className="space-y-3">
                    {LEARNING_PREFERENCES.map((pref) => (
                      <button
                        key={pref.value}
                        type="button"
                        onClick={() => setData(prev => ({ ...prev, learningPreference: pref.value as any }))}
                        className={`w-full p-4 text-left rounded-lg border transition-all ${
                          data.learningPreference === pref.value
                            ? 'bg-primary-50 border-primary-300'
                            : 'bg-white border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-neutral-900">{pref.value} Learner</div>
                            <div className="text-sm text-neutral-600 mt-1">{pref.description}</div>
                          </div>
                          {data.learningPreference === pref.value && (
                            <Check className="w-5 h-5 text-primary-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <ErrorMessage error={errors.learningPreference} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    General Interests * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {GENERAL_INTERESTS.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`p-3 text-sm rounded-lg border transition-all ${
                          data.generalInterests.includes(interest)
                            ? 'bg-primary-50 border-primary-300 text-primary-700'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-neutral-500 mt-2">
                    Selected {data.generalInterests.length} interests
                  </p>
                  <ErrorMessage error={errors.generalInterests} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Study Goals * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {STUDY_GOALS.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => handleGoalToggle(goal)}
                        className={`p-3 text-sm rounded-lg border transition-all ${
                          data.studyGoals.includes(goal)
                            ? 'bg-primary-50 border-primary-300 text-primary-700'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-neutral-500 mt-2">
                    Selected {data.studyGoals.length} goals
                  </p>
                  <ErrorMessage error={errors.studyGoals} />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Availability */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Availability</h2>
              <p className="text-neutral-600 mb-6">When are you available for group study sessions?</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Available Time Slots * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-neutral-200 rounded-lg p-4">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleAvailabilityToggle(slot)}
                        className={`p-3 text-sm text-left rounded-lg border transition-all ${
                          data.availability.includes(slot)
                            ? 'bg-primary-50 border-primary-300 text-primary-700'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{slot}</span>
                          {data.availability.includes(slot) && (
                            <Check className="w-4 h-4" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-neutral-500 mt-2">
                    Selected {data.availability.length} time slots
                  </p>
                  <ErrorMessage error={errors.availability} />
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">💡 Profile Summary</h4>
                  <div className="text-sm text-neutral-600 space-y-1">
                    <p><strong>Name:</strong> {data.name || 'Not provided'}</p>
                    <p><strong>Institution:</strong> {data.institution === 'Other' ? data.customInstitution : data.institution || 'Not provided'}</p>
                    <p><strong>Study:</strong> {data.courseOfStudy || 'Not provided'} ({data.degreeLevel} {data.year})</p>
                    <p><strong>Focus:</strong> {data.academicFocus.length > 0 ? data.academicFocus.join(', ') : 'Not provided'}</p>
                    <p><strong>Learning Style:</strong> {data.learningPreference || 'Not provided'}</p>
                    <p><strong>Interests:</strong> {data.generalInterests.length > 0 ? data.generalInterests.join(', ') : 'None selected'}</p>
                    <p><strong>Goals:</strong> {data.studyGoals.length} selected</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              isLoading={isLoading}
              className="flex items-center"
            >
              {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
              {currentStep < totalSteps && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}