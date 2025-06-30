import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen, Video, Link, Image, Download, Star, Plus, ArrowLeft } from 'lucide-react';
import { Resource } from '../types';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Advanced Algorithms Handbook',
    description: 'Comprehensive guide covering sorting, searching, and graph algorithms with implementation examples.',
    type: 'document',
    url: '#',
    tags: ['Algorithms', 'Data Structures', 'Reference'],
    groupId: '1',
    uploadedBy: 'Alex Chen',
    uploadedAt: new Date('2025-01-10')
  },
  {
    id: '2',
    title: 'Dynamic Programming Masterclass',
    description: 'Video series explaining DP concepts from basic to advanced level with practical examples.',
    type: 'video',
    url: '#',
    tags: ['Dynamic Programming', 'Tutorial', 'Video'],
    groupId: '1',
    uploadedBy: 'Sarah Kim',
    uploadedAt: new Date('2025-01-12')
  },
  {
    id: '3',
    title: 'LeetCode Pattern Recognition',
    description: 'Interactive guide to identifying and solving common coding interview patterns.',
    type: 'link',
    url: '#',
    tags: ['Interview Prep', 'Problem Solving', 'Patterns'],
    groupId: '2',
    uploadedBy: 'Mike Johnson',
    uploadedAt: new Date('2025-01-08')
  },
  {
    id: '4',
    title: 'Big O Complexity Chart',
    description: 'Visual reference for algorithm complexity analysis and performance comparison.',
    type: 'image',
    url: '#',
    tags: ['Big O', 'Complexity', 'Reference'],
    groupId: '1',
    uploadedBy: 'Emily Davis',
    uploadedAt: new Date('2025-01-05')
  },
  {
    id: '5',
    title: 'Machine Learning Fundamentals',
    description: 'Complete course materials for understanding ML algorithms and their applications.',
    type: 'document',
    url: '#',
    tags: ['Machine Learning', 'AI', 'Course Materials'],
    groupId: '3',
    uploadedBy: 'David Wilson',
    uploadedAt: new Date('2025-01-15')
  },
  {
    id: '6',
    title: 'Python Data Structures Implementation',
    description: 'Video walkthrough of implementing common data structures in Python.',
    type: 'video',
    url: '#',
    tags: ['Python', 'Data Structures', 'Implementation'],
    groupId: '2',
    uploadedBy: 'Lisa Brown',
    uploadedAt: new Date('2025-01-14')
  }
];

export default function Resources() {
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setResources(MOCK_RESOURCES);
      setFilteredResources(MOCK_RESOURCES);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedType) {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(resource =>
        selectedTags.some(tag => resource.tags.includes(tag))
      );
    }

    setFilteredResources(filtered);
  }, [resources, searchTerm, selectedType, selectedTags]);

  const allTags = [...new Set(resources.flatMap(resource => resource.tags))];
  const resourceTypes = ['document', 'video', 'link', 'image'];

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'document': return BookOpen;
      case 'video': return Video;
      case 'link': return Link;
      case 'image': return Image;
    }
  };

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-600';
      case 'video': return 'bg-red-100 text-red-600';
      case 'link': return 'bg-green-100 text-green-600';
      case 'image': return 'bg-purple-100 text-purple-600';
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-neutral-200">
                  <div className="h-6 bg-neutral-200 rounded mb-3"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Resource Library</h1>
          <p className="text-neutral-600">Discover and share study materials, notes, and learning resources.</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources, topics, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              {resourceTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}s
                </option>
              ))}
            </select>

            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Resource
            </Button>
          </div>

          {/* Tag Filters */}
          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-3">Filter by Topics:</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-neutral-600">
            {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredResources.map((resource) => {
              const TypeIcon = getTypeIcon(resource.type);
              return (
                <Card key={resource.id} hover className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(resource.type)}`}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-neutral-400 hover:text-yellow-500 transition-colors">
                        <Star className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-neutral-500 capitalize">{resource.type}</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
                      {resource.title}
                    </h3>
                    
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                      {resource.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {resource.tags.length > 3 && (
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs">
                          +{resource.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-4 mt-4">
                    <div className="flex items-center justify-between text-sm text-neutral-500 mb-3">
                      <span>By {resource.uploadedBy}</span>
                      <span>{resource.uploadedAt.toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No resources found</h3>
            <p className="text-neutral-600 mb-6">
              Try adjusting your search criteria or upload a new resource.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload First Resource
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}