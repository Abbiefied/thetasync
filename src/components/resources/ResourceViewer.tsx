import React from 'react';
import { X, ExternalLink, Download } from 'lucide-react';
import { Resource } from '../../types';
import Button from '../common/Button';

interface ResourceViewerProps {
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResourceViewer({ resource, isOpen, onClose }: ResourceViewerProps) {
  if (!isOpen) return null;

  const handleOpenResource = () => {
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  const getEmbedContent = () => {
    if (resource.type === 'video') {
      // Handle YouTube URLs
      if (resource.url.includes('youtube.com') || resource.url.includes('youtu.be')) {
        let videoId = '';
        if (resource.url.includes('youtube.com/watch?v=')) {
          videoId = resource.url.split('v=')[1]?.split('&')[0];
        } else if (resource.url.includes('youtu.be/')) {
          videoId = resource.url.split('youtu.be/')[1]?.split('?')[0];
        }
        
        if (videoId) {
          return (
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title={resource.title}
              />
            </div>
          );
        }
      }
      
      // Handle Vimeo URLs
      if (resource.url.includes('vimeo.com')) {
        const videoId = resource.url.split('vimeo.com/')[1]?.split('?')[0];
        if (videoId) {
          return (
            <div className="aspect-video w-full">
              <iframe
                src={`https://player.vimeo.com/video/${videoId}`}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title={resource.title}
              />
            </div>
          );
        }
      }
    }

    if (resource.type === 'image') {
      return (
        <div className="w-full">
          <img
            src={resource.url}
            alt={resource.title}
            className="w-full h-auto rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      );
    }

    // For documents and other links, show a preview message
    return (
      <div className="bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
        <div className="text-neutral-600 mb-4">
          <p className="text-lg font-medium mb-2">Preview not available</p>
          <p className="text-sm">Click "Open Resource" to view this {resource.type} in a new tab.</p>
        </div>
        <Button onClick={handleOpenResource}>
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Resource
        </Button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex-1 mr-4">
            <h2 className="text-xl font-semibold text-neutral-900 mb-1">
              {resource.title}
            </h2>
            <p className="text-neutral-600 text-sm">
              {resource.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {getEmbedContent()}
          
          <div className="mt-6 flex flex-wrap gap-2 mb-4">
            {resource.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-neutral-500 mb-6">
            <span>Uploaded by {resource.uploadedBy}</span>
            <span>{new Date(resource.uploadedAt).toLocaleDateString()}</span>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleOpenResource} className="flex-1">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Resource
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}