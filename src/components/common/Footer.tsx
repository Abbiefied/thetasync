import React from 'react';
import { Heart, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">StudyCircle</h3>
            <p className="text-neutral-400 mb-4 max-w-md">
              Connect with like-minded students, form study groups, and achieve academic success together. 
              Built for the next generation of learners.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Discover Groups</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Create Group</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Resources</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Quizzes</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm">
            © 2025 StudyCircle. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <span className="text-neutral-400 text-sm">Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-neutral-400 text-sm">on</span>
            <span className="bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
              Built on Bolt
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}