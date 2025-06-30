import { useState } from 'react';
import { useApp, useNotifications } from '../context/AppContext';
import * as api from '../lib/api';
import { Resource } from '../types';

export function useResources() {
  const { state, dispatch } = useApp();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch resources for a specific group
  const fetchGroupResources = async (groupId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await api.getGroupResources(groupId);
      if (error) throw error;
      
      dispatch({ type: 'SET_RESOURCES', payload: data || [] });
    } catch (error) {
      console.error('Error fetching group resources:', error);
      addNotification('error', 'Failed to load resources');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all resources
  const fetchAllResources = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await api.getAllResources();
      if (error) throw error;
      
      dispatch({ type: 'SET_RESOURCES', payload: data || [] });
    } catch (error) {
      console.error('Error fetching all resources:', error);
      addNotification('error', 'Failed to load resources');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new resource
  const createResource = async (resourceData: {
    title: string;
    description: string;
    type: 'document' | 'video' | 'link' | 'image';
    url: string;
    tags: string[];
    group_id: string;
  }) => {
    setIsLoading(true);
    try {
      const { data, error } = await api.createResource(resourceData);
      if (error) throw error;
      
      dispatch({ type: 'ADD_RESOURCE', payload: data });
      addNotification('success', 'Resource uploaded successfully!');
      return { data, error: null };
    } catch (error) {
      console.error('Error creating resource:', error);
      addNotification('error', 'Failed to upload resource');
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Update a resource
  const updateResource = async (resourceId: string, updates: {
    title?: string;
    description?: string;
    type?: 'document' | 'video' | 'link' | 'image';
    url?: string;
    tags?: string[];
  }) => {
    setIsLoading(true);
    try {
      const { data, error } = await api.updateResource(resourceId, updates);
      if (error) throw error;
      
      // Update the resource in the state
      dispatch({ 
        type: 'UPDATE_RESOURCE', 
        payload: { id: resourceId, updates } 
      });
      
      addNotification('success', 'Resource updated successfully!');
      return { data, error: null };
    } catch (error) {
      console.error('Error updating resource:', error);
      addNotification('error', 'Failed to update resource');
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a resource
  const deleteResource = async (resourceId: string) => {
    setIsLoading(true);
    try {
      const { error } = await api.deleteResource(resourceId);
      if (error) throw error;
      
      dispatch({ type: 'REMOVE_RESOURCE', payload: resourceId });
      addNotification('success', 'Resource deleted successfully!');
      return { error: null };
    } catch (error) {
      console.error('Error deleting resource:', error);
      addNotification('error', 'Failed to delete resource');
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resources: state.resources,
    isLoading,
    fetchGroupResources,
    fetchAllResources,
    createResource,
    updateResource,
    deleteResource
  };
}