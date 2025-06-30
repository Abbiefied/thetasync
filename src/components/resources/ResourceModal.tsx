import React, { useState, useEffect } from 'react';
import { X, Upload, Link, AlertCircle } from 'lucide-react';
import { Resource } from '../../types';
import Button from '../common/Button';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (resourceData: Omit<Resource, 'id' | 'uploadedBy' | 'uploadedAt'>) => void;
  resource?: Resource;
  isLoading: boolean;
  groupId: string;
}

const RESOURCE_TYPES = [
  { value: 'document', label: 'Document', description: 'PDF, Word, PowerPoint, etc.' },
  { value: 'video', label: 'Video', description: 'YouTube, Vimeo, or direct video links' },
  { value: 'link', label: 'Link', description: 'Websites, articles, online resources' },
  { value: 'image', label: 'Image', description: 'Diagrams, charts, screenshots' }
];

export default function ResourceModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  resource, 
  isLoading, 
  groupId 
}: ResourceModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'document' as Resource['type'],
    url: '',
    tags: [] as string[],
    groupId: groupId
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title,
        description: resource.description,
        type: resource.type,
        url: resource.url,
        tags: resource.tags,
        groupId: resource.groupId
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'document',
        url: '',
        tags: [],
        groupId: groupId
      });
    }
    setTagInput('');
    setErrors({});
  }, [resource, groupId, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">
            {resource ? 'Edit Resource' : 'Upload New Resource'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                errors.title ? 'border-red-300' : 'border-neutral-300'
              }`}
              placeholder="Enter resource title"
            />
            {errors.title && (
              <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.title}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
                errors.description ? 'border-red-300' : 'border-neutral-300'
              }`}
              placeholder="Describe what this resource contains and how it's useful"
            />
            {errors.description && (
              <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.description}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Resource Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RESOURCE_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value as Resource['type'] }))}
                  className={`p-4 text-left rounded-lg border transition-all ${
                    formData.type === type.value
                      ? 'bg-primary-50 border-primary-300 text-primary-700'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <div className="font-medium">{type.label}</div>
                  <div className="text-sm text-neutral-500 mt-1">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-neutral-700 mb-2">
              URL *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="url"
                id="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.url ? 'border-red-300' : 'border-neutral-300'
                }`}
                placeholder="https://example.com/resource"
              />
            </div>
            {errors.url && (
              <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.url}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tags * (Help others find this resource)
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Add a tag and press Enter"
              />
              <Button type="button" onClick={addTag} disabled={!tagInput.trim()}>
                Add
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-primary-500 hover:text-primary-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {errors.tags && (
              <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.tags}</span>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-6 border-t border-neutral-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={isLoading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {resource ? 'Update Resource' : 'Upload Resource'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}