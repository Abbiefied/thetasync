import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Database, User, Key } from 'lucide-react';
import { supabase, getCurrentUser } from '../../lib/supabase';
import Button from '../common/Button';
import Card from '../common/Card';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: string;
}

export default function SupabaseTest() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Environment Variables', status: 'pending', message: 'Checking...' },
    { name: 'Database Connection', status: 'pending', message: 'Checking...' },
    { name: 'Authentication Service', status: 'pending', message: 'Checking...' },
    { name: 'User Profile Table', status: 'pending', message: 'Checking...' }
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (index: number, status: TestResult['status'], message: string, details?: string) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message, details } : test
    ));
  };

  const runTests = async () => {
    setIsRunning(true);
    
    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending', message: 'Checking...' })));

    // Test 1: Environment Variables
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        updateTest(0, 'error', 'Missing environment variables', 
          'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found');
      } else if (supabaseUrl.includes('your_supabase_project_url') || supabaseAnonKey.includes('your_supabase_anon_key')) {
        updateTest(0, 'error', 'Placeholder values detected', 
          'Environment variables contain placeholder values. Please connect to Supabase.');
      } else {
        updateTest(0, 'success', 'Environment variables configured', 
          `URL: ${supabaseUrl.substring(0, 30)}...`);
      }
    } catch (error) {
      updateTest(0, 'error', 'Failed to check environment variables', String(error));
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 2: Database Connection
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        updateTest(1, 'error', 'Database connection failed', error.message);
      } else {
        updateTest(1, 'success', 'Database connection successful', 
          `Connected to ThetaSync database`);
      }
    } catch (error) {
      updateTest(1, 'error', 'Database connection error', String(error));
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 3: Authentication Service
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error && error.message !== 'Auth session missing!') {
        updateTest(2, 'error', 'Authentication service error', error.message);
      } else {
        updateTest(2, 'success', 'Authentication service working', 
          user ? `Logged in as: ${user.email}` : 'No user logged in (service working)');
      }
    } catch (error) {
      updateTest(2, 'error', 'Authentication service error', String(error));
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 4: User Profile Table
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
      
      if (error) {
        if (error.code === 'PGRST116') {
          updateTest(3, 'error', 'User profile table not found', 
            'The user_profiles table does not exist. Please run the database migration.');
        } else {
          updateTest(3, 'error', 'User profile table error', error.message);
        }
      } else {
        updateTest(3, 'success', 'User profile table accessible', 
          `Table exists and is accessible`);
      }
    } catch (error) {
      updateTest(3, 'error', 'User profile table error', String(error));
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600 animate-pulse" />;
    }
  };

  const getTestIcon = (index: number) => {
    const icons = [
      <Key className="w-4 h-4" />,
      <Database className="w-4 h-4" />,
      <User className="w-4 h-4" />,
      <Database className="w-4 h-4" />
    ];
    return icons[index];
  };

  const allTestsPassed = tests.every(test => test.status === 'success');
  const hasErrors = tests.some(test => test.status === 'error');

  return (
    <div className="min-h-screen bg-neutral-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">ThetaSync Connection Test</h1>
          <p className="text-neutral-600">
            Testing the connection to Supabase and verifying all services are working correctly.
          </p>
        </div>

        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Connection Tests</h2>
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              isLoading={isRunning}
            >
              Run Tests Again
            </Button>
          </div>

          <div className="space-y-4">
            {tests.map((test, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border border-neutral-200 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getTestIcon(index)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-neutral-900">{test.name}</h3>
                    {getStatusIcon(test.status)}
                  </div>
                  
                  <p className={`text-sm ${
                    test.status === 'success' ? 'text-green-700' :
                    test.status === 'error' ? 'text-red-700' :
                    'text-yellow-700'
                  }`}>
                    {test.message}
                  </p>
                  
                  {test.details && (
                    <p className="text-xs text-neutral-500 mt-1">{test.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!isRunning && (
            <div className={`mt-6 p-4 rounded-lg ${
              allTestsPassed ? 'bg-green-50 border border-green-200' :
              hasErrors ? 'bg-red-50 border border-red-200' :
              'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-center space-x-2">
                {allTestsPassed ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">All tests passed!</span>
                  </>
                ) : hasErrors ? (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">Some tests failed</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Tests in progress...</span>
                  </>
                )}
              </div>
              
              {allTestsPassed && (
                <p className="text-sm text-green-700 mt-2">
                  Your ThetaSync connection is working correctly. All services are accessible and functioning properly.
                </p>
              )}
              
              {hasErrors && (
                <div className="text-sm text-red-700 mt-2">
                  <p className="mb-2">Please check the following:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Ensure you've clicked "Connect to Supabase" in the top right</li>
                    <li>Verify your Supabase project is active and accessible</li>
                    <li>Check that the database migration has been run</li>
                    <li>Confirm your environment variables are properly set</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Database Migration SQL */}
        <Card>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Database Migration</h2>
          <p className="text-neutral-600 mb-4">
            If the user profile table test failed, you need to run this SQL migration in your Supabase SQL editor:
          </p>
          
          <div className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
{`/*
  # Create user profiles table

  1. New Tables
    - \`user_profiles\`
      - \`id\` (uuid, primary key, references auth.users)
      - \`name\` (text)
      - \`email\` (text)
      - \`institution\` (text)
      - \`course_of_study\` (text)
      - \`academic_focus\` (text array)
      - \`degree_level\` (text)
      - \`year\` (text)
      - \`bio\` (text, optional)
      - \`learning_preference\` (text)
      - \`general_interests\` (text array)
      - \`study_goals\` (text array)
      - \`availability\` (jsonb)
      - \`created_at\` (timestamp)
      - \`updated_at\` (timestamp)

  2. Security
    - Enable RLS on \`user_profiles\` table
    - Add policies for authenticated users to manage their own profiles
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  institution text NOT NULL,
  course_of_study text NOT NULL,
  academic_focus text[] DEFAULT '{}',
  degree_level text NOT NULL CHECK (degree_level IN ('undergraduate', 'masters', 'phd', 'postdoc')),
  year text NOT NULL,
  bio text DEFAULT '',
  learning_preference text NOT NULL CHECK (learning_preference IN ('Visual', 'Verbal', 'Kinesthetic')),
  general_interests text[] DEFAULT '{}',
  study_goals text[] DEFAULT '{}',
  availability jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();`}
            </pre>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> Copy the SQL above and paste it into your Supabase SQL Editor, then click "Run" to create the required table and policies.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}