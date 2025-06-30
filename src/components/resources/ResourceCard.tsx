import React, { useState } from 'react';
import { BookOpen, Video, Link, Image, Edit, Trash2, Download, Star, MoreVertical } from 'lucide-react';
import { Resource } from '../../types';
import Button from '../common/Button';

interface ResourceCardProps {
  resource: Resource;
  isOwner: boolean;
  onEdit: (resource: Resource) => void;
  onDelete: (resourceId: string) => void;
  onDownload: (resource: Resource) => void;
}

export default function ResourceCard({ resource, isOwner, onEdit, onDelete, onDownload }: ResourceCardProps) {
  const [showMenu, setShowMenu] = useState(false);

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

  const TypeIcon = getTypeIcon(resource.type);

  const formatDate = (date: string | Date) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        return 'Unknown date';
      }
      return dateObj.toLocaleDateString();
    } catch (error) {
      return 'Unknown date';
    }
  };

  const getUploaderName = (uploadedBy: string) => {
    // Handle both user ID and name formats
    if (uploadedBy && uploadedBy.length > 20) {
      // Likely a UUID, show as "Unknown User"
      return 'Unknown User';
    }
    return uploadedBy || 'Unknown User';
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-all duration-200 relative">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(resource.type)}`}>
          <TypeIcon className="w-5 h-5" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-neutral-500 capitalize">{resource.type}</span>
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-10 min-w-32">
                  <button
                    onClick={() => {
                      onEdit(resource);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete(resource.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
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
          <span>By {getUploaderName(resource.uploaded_by)}</span>
          <span>{formatDate(resource.uploaded_at)}</span>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onDownload(resource)}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="ghost" size="sm">
            <Star className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}