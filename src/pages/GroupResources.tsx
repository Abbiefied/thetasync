import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, ChevronLeft } from 'lucide-react';
import { Resource } from '../types';
import { useAuth } from '../context/AuthContext';
import { useResources } from '../hooks/useResources';
import { getStudyGroupById } from '../lib/api';
import Button from '../components/common/Button';
import ResourceCard from '../components/resources/ResourceCard';
import ResourceModal from '../components/resources/ResourceModal';
import ResourceViewer from '../components/resources/ResourceViewer';

export default function GroupResources() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { resources, isLoading, fetchGroupResources, createResource, deleteResource } = useResources();
  
  const [groupName, setGroupName] = useState('');
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchGroupResources(id);
      
      // Fetch group name
      getStudyGroupById(id).then(({ data }) => {
        if (data) {
          setGroupName(data.name);
        }
      });
    }
  }, [id]);

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

  const handleUploadResource = async (resourceData: Omit<Resource, 'id' | 'uploaded_by' | 'uploaded_at'>) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await createResource(resourceData);
      
      if (!error) {
        setShowUploadModal(false);
        setEditingResource(null);
      }
    } catch (error) {
      console.error('Error uploading resource:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      await deleteResource(resourceId);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const isResourceOwner = (resource: Resource) => {
    return resource.uploaded_by === user?.id;
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
        {/* Back Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/group/${id}`)}
            className="flex items-center text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Group
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {groupName} Resources
          </h1>
          <p className="text-neutral-600">
            Shared study materials, notes, and learning resources for your group.
          </p>
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

            <Button onClick={() => setShowUploadModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Upload Resource
            </Button>
          </div>

          {/* Tag Filters */}
          {allTags.length > 0 && (
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
          )}
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
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isOwner={isResourceOwner(resource)}
                onEdit={setEditingResource}
                onDelete={handleDeleteResource}
                onView={setViewingResource}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No resources found</h3>
            <p className="text-neutral-600 mb-6">
              {searchTerm || selectedType || selectedTags.length > 0
                ? 'Try adjusting your search criteria or upload a new resource.'
                : 'Be the first to share a resource with your group!'
              }
            </p>
            <Button onClick={() => setShowUploadModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Upload First Resource
            </Button>
          </div>
        )}

        {/* Upload/Edit Modal */}
        <ResourceModal
          isOpen={showUploadModal || !!editingResource}
          onClose={() => {
            setShowUploadModal(false);
            setEditingResource(null);
          }}
          onSubmit={handleUploadResource}
          resource={editingResource || undefined}
          isLoading={isSubmitting}
          groupId={id || ''}
        />

        {/* Resource Viewer */}
        {viewingResource && (
          <ResourceViewer
            resource={viewingResource}
            isOpen={!!viewingResource}
            onClose={() => setViewingResource(null)}
          />
        )}
      </div>
    </div>
  );
}