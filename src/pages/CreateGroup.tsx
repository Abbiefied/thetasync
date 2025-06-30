import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Users, Calendar, Tag, Lock, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const SUBJECTS = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Engineering', 'Medicine', 'Business', 'Economics', 'Psychology',
  'Literature', 'History', 'Philosophy', 'Political Science', 'Sociology'
];

const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const TIME_SLOTS = [
  'Monday 9:00-11:00', 'Monday 14:00-16:00', 'Monday 19:00-21:00',
  'Tuesday 9:00-11:00', 'Tuesday 14:00-16:00', 'Tuesday 19:00-21:00',
  'Wednesday 9:00-11:00', 'Wednesday 14:00-16:00', 'Wednesday 19:00-21:00',
  'Thursday 9:00-11:00', 'Thursday 14:00-16:00', 'Thursday 19:00-21:00',
  'Friday 9:00-11:00', 'Friday 14:00-16:00', 'Friday 19:00-21:00',
  'Saturday 10:00-12:00', 'Saturday 14:00-16:00',
  'Sunday 10:00-12:00', 'Sunday 14:00-16:00'
];

interface GroupData {
  name: string;
  subject: string;
  description: string;
  maxMembers: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | '';
  tags: string[];
  schedule: string[];
  isPrivate: boolean;
}

export default function CreateGroup() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<GroupData>({
    name: '',
    subject: '',
    description: '',
    maxMembers: 6,
    difficulty: '',
    tags: [],
    schedule: [],
    isPrivate: false
  });
  const [customTag, setCustomTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create new group (in real app, this would be an API call)
    const newGroup = {
      id: Date.now().toString(),
      name: data.name,
      subject: data.subject,
      description: data.description,
      members: [
        { userId: '1', name: 'You', role: 'Owner' as const, expertise: 'Intermediate' as const, joinedAt: new Date() }
      ],
      maxMembers: data.maxMembers,
      schedule: data.schedule.map(slot => {
        const [day, time] = slot.split(' ');
        const [start, end] = time.split('-');
        return { day, startTime: start, endTime: end };
      }),
      tags: data.tags,
      difficulty: data.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
      isPrivate: data.isPrivate,
      createdBy: '1',
      createdAt: new Date()
    };

    setIsLoading(false);
    navigate('/my-groups');
  };

  const handleScheduleToggle = (slot: string) => {
    setData(prev => ({
      ...prev,
      schedule: prev.schedule.includes(slot)
        ? prev.schedule.filter(s => s !== slot)
        : [...prev.schedule, slot]
    }));
  };

  const addCustomTag = () => {
    if (customTag.trim() && !data.tags.includes(customTag.trim())) {
      setData(prev => ({
        ...prev,
        tags: [...prev.tags, customTag.trim()]
      }));
      setCustomTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return data.name.trim() && data.subject && data.description.trim();
      case 2:
        return data.difficulty && data.maxMembers >= 2;
      case 3:
        return data.tags.length > 0;
      case 4:
        return data.schedule.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/discover')}
            className="flex items-center text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Discover
          </button>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create Study Group</h1>
          <p className="text-neutral-600">Set up your study group and start collaborating with other students.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-neutral-700">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-neutral-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="animate-slide-up">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Basic Information</h2>
              <p className="text-neutral-600 mb-6">Tell us about your study group and what you'll be focusing on.</p>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="e.g., Advanced Algorithms Study Circle"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    value={data.subject}
                    onChange={(e) => setData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select a subject</option>
                    {SUBJECTS.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Describe what your group will focus on, goals, and what members can expect..."
                  />
                  <p className="text-sm text-neutral-500 mt-1">{data.description.length}/500 characters</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Group Settings */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Group Settings</h2>
              <p className="text-neutral-600 mb-6">Configure your group's difficulty level and member capacity.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Difficulty Level *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {DIFFICULTY_LEVELS.map((level) => (
                      <button
                        key={level}
                        onClick={() => setData(prev => ({ ...prev, difficulty: level as any }))}
                        className={`p-4 text-left rounded-lg border transition-all ${
                          data.difficulty === level
                            ? 'bg-primary-50 border-primary-300 text-primary-700'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <div className="font-medium">{level}</div>
                        <div className="text-sm text-neutral-500 mt-1">
                          {level === 'Beginner' && 'New to the subject, learning fundamentals'}
                          {level === 'Intermediate' && 'Some experience, building on basics'}
                          {level === 'Advanced' && 'Strong foundation, tackling complex topics'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="maxMembers" className="block text-sm font-medium text-neutral-700 mb-2">
                    Maximum Members
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      id="maxMembers"
                      min="2"
                      max="15"
                      value={data.maxMembers}
                      onChange={(e) => setData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                      className="flex-1"
                    />
                    <div className="flex items-center space-x-2 min-w-0">
                      <Users className="w-4 h-4 text-neutral-500" />
                      <span className="font-medium text-neutral-900">{data.maxMembers} members</span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-500 mt-2">
                    Smaller groups (2-6) are more intimate, larger groups (7-15) offer more diverse perspectives.
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={data.isPrivate}
                      onChange={(e) => setData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <div className="flex items-center space-x-2">
                      {data.isPrivate ? <Lock className="w-4 h-4 text-neutral-500" /> : <Globe className="w-4 h-4 text-neutral-500" />}
                      <span className="text-sm font-medium text-neutral-700">
                        {data.isPrivate ? 'Private Group' : 'Public Group'}
                      </span>
                    </div>
                  </label>
                  <p className="text-sm text-neutral-500 mt-1 ml-7">
                    {data.isPrivate 
                      ? 'Only invited members can join. You\'ll need to send invitations.'
                      : 'Anyone can discover and request to join your group.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Tags */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Topics & Tags</h2>
              <p className="text-neutral-600 mb-6">Add tags to help others find your group and understand what you'll cover.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Add Custom Tag
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                      className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Interview Prep, Problem Solving..."
                    />
                    <Button onClick={addCustomTag} disabled={!customTag.trim()}>
                      <Tag className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                {data.tags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Selected Tags ({data.tags.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {data.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-primary-500 hover:text-primary-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">💡 Tag Suggestions</h4>
                  <p className="text-sm text-neutral-600">
                    Good tags help others find your group: specific topics (e.g., "Dynamic Programming"), 
                    goals (e.g., "Exam Prep"), or formats (e.g., "Problem Solving Sessions").
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Schedule */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Meeting Schedule</h2>
              <p className="text-neutral-600 mb-6">When will your group meet? Select all time slots that work for you.</p>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => handleScheduleToggle(slot)}
                      className={`p-3 text-sm text-left rounded-lg border transition-all ${
                        data.schedule.includes(slot)
                          ? 'bg-primary-50 border-primary-300 text-primary-700'
                          : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{slot}</span>
                        {data.schedule.includes(slot) && (
                          <Calendar className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-neutral-600" />
                    <span className="text-sm font-medium text-neutral-700">
                      Selected {data.schedule.length} time slot{data.schedule.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    You can always adjust the schedule later. Members will be notified of any changes.
                  </p>
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
              disabled={!isStepValid()}
              isLoading={isLoading}
              className="flex items-center"
            >
              {currentStep === totalSteps ? 'Create Group' : 'Next'}
              {currentStep < totalSteps && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}