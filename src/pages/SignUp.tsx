import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { signUp, signInWithGoogle } from '../lib/supabase';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function SignUp() {
  const navigate = useNavigate();
  const [data, setData] = useState<SignUpData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!data.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!data.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0]; // Show first error
      }
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setIsLoading(true);
      
      try {
        const { data: authData, error } = await signUp(data.email, data.password, {
          full_name: '',
          email_confirm: true
        });
        
        if (error) {
          if (error.message.includes('already registered')) {
            setErrors({ email: 'An account with this email already exists. Please sign in instead.' });
          } else {
            setErrors({ general: error.message });
          }
        } else {
          setUserEmail(data.email);
          setShowConfirmation(true);
        }
      } catch (error) {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        setErrors({ general: error.message });
        setIsGoogleLoading(false);
      }
      // If successful, the auth state change will handle navigation
    } catch (error) {
      setErrors({ general: 'Google sign-up failed. Please try again.' });
      setIsGoogleLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    const validation = validatePassword(password);
    if (!password) return { strength: 0, label: '', color: '' };
    
    const score = 5 - validation.errors.length;
    
    if (score <= 1) return { strength: 20, label: 'Very Weak', color: 'bg-red-500' };
    if (score === 2) return { strength: 40, label: 'Weak', color: 'bg-orange-500' };
    if (score === 3) return { strength: 60, label: 'Fair', color: 'bg-yellow-500' };
    if (score === 4) return { strength: 80, label: 'Good', color: 'bg-blue-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(data.password);
  const passwordValidation = validatePassword(data.password);

  const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
      <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
        <AlertCircle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    );
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="text-center animate-slide-up">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Check Your Email</h1>
            <p className="text-neutral-600 mb-6">
              We've sent a confirmation link to <strong>{userEmail}</strong>. 
              Please check your email and click the link to verify your account.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
                <h3 className="font-medium text-blue-900 mb-2">What's next?</h3>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Check your email inbox (and spam folder)</li>
                  <li>2. Click the confirmation link</li>
                  <li>3. Complete your profile setup</li>
                  <li>4. Start studying with others!</li>
                </ol>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button
                  onClick={() => {
                    setShowConfirmation(false);
                    setData({ email: '', password: '', confirmPassword: '' });
                    setErrors({});
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Sign Up with Different Email
                </Button>
                
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    Already have an account? Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 text-primary-600 font-bold text-2xl mb-4">
              <Users className="w-8 h-8" />
              <span>ThetaSync</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Create Your Account</h1>
            <p className="text-neutral-600">Join thousands of students learning together</p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <ErrorMessage error={errors.general} />
            </div>
          )}

          {/* Google Sign Up */}
          <div className="mb-6">
            <Button
              onClick={handleGoogleSignUp}
              variant="outline"
              className="w-full"
              isLoading={isGoogleLoading}
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">Or sign up with email</span>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={data.email}
                  onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-300' : 'border-neutral-300'
                  }`}
                  placeholder="Enter your email"
                  autoComplete="email"
                  autoFocus
                />
              </div>
              <ErrorMessage error={errors.email} />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={data.password}
                  onChange={(e) => setData(prev => ({ ...prev, password: e.target.value }))}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-300' : 'border-neutral-300'
                  }`}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {data.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-neutral-600">Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength.strength >= 80 ? 'text-green-600' :
                      passwordStrength.strength >= 60 ? 'text-blue-600' :
                      passwordStrength.strength >= 40 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Password Requirements */}
              {data.password && !passwordValidation.isValid && (
                <div className="mt-2 p-3 bg-neutral-50 rounded-lg">
                  <p className="text-xs font-medium text-neutral-700 mb-2">Password must contain:</p>
                  <ul className="text-xs space-y-1">
                    <li className={`flex items-center ${/^.{8,}$/.test(data.password) ? 'text-green-600' : 'text-neutral-500'}`}>
                      <span className="mr-2">{/^.{8,}$/.test(data.password) ? '✓' : '○'}</span>
                      At least 8 characters
                    </li>
                    <li className={`flex items-center ${/[a-z]/.test(data.password) ? 'text-green-600' : 'text-neutral-500'}`}>
                      <span className="mr-2">{/[a-z]/.test(data.password) ? '✓' : '○'}</span>
                      One lowercase letter
                    </li>
                    <li className={`flex items-center ${/[A-Z]/.test(data.password) ? 'text-green-600' : 'text-neutral-500'}`}>
                      <span className="mr-2">{/[A-Z]/.test(data.password) ? '✓' : '○'}</span>
                      One uppercase letter
                    </li>
                    <li className={`flex items-center ${/[0-9]/.test(data.password) ? 'text-green-600' : 'text-neutral-500'}`}>
                      <span className="mr-2">{/[0-9]/.test(data.password) ? '✓' : '○'}</span>
                      One number
                    </li>
                    <li className={`flex items-center ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(data.password) ? 'text-green-600' : 'text-neutral-500'}`}>
                      <span className="mr-2">{/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(data.password) ? '✓' : '○'}</span>
                      One special character
                    </li>
                  </ul>
                </div>
              )}
              
              <ErrorMessage error={errors.password} />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={data.confirmPassword}
                  onChange={(e) => setData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.confirmPassword ? 'border-red-300' : 'border-neutral-300'
                  }`}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <ErrorMessage error={errors.confirmPassword} />
            </div>

            {/* Terms and Privacy */}
            <div className="text-sm text-neutral-600">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Privacy Policy
              </a>
              .
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isGoogleLoading}
            >
              Create Account
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-neutral-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}