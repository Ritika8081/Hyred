'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Project } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AIRewriteButton from '@/components/ui/ai-rewrite-button';
import ImageUpload from '@/components/ui/image-upload';

interface ProjectManagerProps {
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
}

export default function ProjectManager({ projects, onUpdate }: ProjectManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setIsEditing(true);
  };

  const handleAdd = () => {
    const newProject: Partial<Project> = {
      id: Date.now().toString(),
      title: '',
      description: '',
      longDescription: '',
      technologies: [],
      image: '',
      images: [],
      category: 'web',
      featured: false,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'planned'
    };
    setEditingProject(null);
    setFormData(newProject);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description) return;

    const projectToSave = {
      ...formData,
      technologies: typeof formData.technologies === 'string' 
        ? (formData.technologies as string).split(',').map((t: string) => t.trim())
        : formData.technologies || [],
      images: typeof formData.images === 'string'
        ? (formData.images as string).split(',').map((i: string) => i.trim())
        : formData.images || [],
      challenges: typeof formData.challenges === 'string'
        ? (formData.challenges as string).split(',').map((c: string) => c.trim())
        : formData.challenges || [],
      learnings: typeof formData.learnings === 'string'
        ? (formData.learnings as string).split(',').map((l: string) => l.trim())
        : formData.learnings || []
    } as Project;

    let updatedProjects;
    if (editingProject) {
      // Update existing project
      updatedProjects = projects.map(p => 
        p.id === editingProject.id ? projectToSave : p
      );
    } else {
      // Add new project
      updatedProjects = [...projects, projectToSave];
    }

    onUpdate(updatedProjects);
    setIsEditing(false);
    setFormData({});
    setEditingProject(null);
  };

  const handleDelete = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      onUpdate(updatedProjects);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
    setEditingProject(null);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isEditing) {
    return (
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-xl font-bold">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h3>
          <div className="flex space-x-2">
            <Button onClick={handleSave} size="sm">
              <Save size={16} className="mr-1" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X size={16} className="mr-1" />
              Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={formData.title || ''}
                onChange={(e) => updateFormData('title', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={formData.category || 'web'}
                onChange={(e) => updateFormData('category', e.target.value)}
              >
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="desktop">Desktop</option>
                <option value="ai">AI</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Short Description *</label>
              <AIRewriteButton
                value={formData.description || ''}
                onResult={(v) => updateFormData('description', v)}
                context={`Short project description for: ${formData.title || 'a project'}. Tech: ${Array.isArray(formData.technologies) ? formData.technologies.join(', ') : (formData.technologies || '')}`}
              />
            </div>
            <textarea
              className="w-full p-2 border rounded-lg"
              rows={2}
              value={formData.description || ''}
              onChange={(e) => updateFormData('description', e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Long Description</label>
              <AIRewriteButton
                value={formData.longDescription || ''}
                onResult={(v) => updateFormData('longDescription', v)}
                context={`Long project description for: ${formData.title || 'a project'}.`}
              />
            </div>
            <textarea
              className="w-full p-2 border rounded-lg"
              rows={4}
              value={formData.longDescription || ''}
              onChange={(e) => updateFormData('longDescription', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <ImageUpload
                label="Main project image"
                value={formData.image || ''}
                onChange={(v) => updateFormData('image', v)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={formData.status || 'planned'}
                onChange={(e) => updateFormData('status', e.target.value)}
              >
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">GitHub URL</label>
              <input
                type="url"
                className="w-full p-2 border rounded-lg"
                value={formData.githubUrl || ''}
                onChange={(e) => updateFormData('githubUrl', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Live Demo URL</label>
              <input
                type="url"
                className="w-full p-2 border rounded-lg"
                value={formData.liveUrl || ''}
                onChange={(e) => updateFormData('liveUrl', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Demo Video URL <span className="text-xs text-gray-500 font-normal">(YouTube, Vimeo, Drive, Loom — replaces hero image on detail page)</span>
            </label>
            <input
              type="url"
              className="w-full p-2 border rounded-lg"
              value={formData.videoUrl || ''}
              onChange={(e) => updateFormData('videoUrl', e.target.value)}
              placeholder="https://youtu.be/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Impact <span className="text-xs text-gray-500 font-normal">(measurable outcome — recruiters scan for this)</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={formData.impact || ''}
              onChange={(e) => updateFormData('impact', e.target.value)}
              placeholder="e.g. Reduced inference latency from 80ms to 9ms; used by 200+ researchers"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : formData.technologies || ''}
              onChange={(e) => updateFormData('technologies', e.target.value)}
              placeholder="Next.js, TypeScript, TailwindCSS"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Images (comma-separated URLs)</label>
            <textarea
              className="w-full p-2 border rounded-lg"
              rows={2}
              value={Array.isArray(formData.images) ? formData.images.join(', ') : formData.images || ''}
              onChange={(e) => updateFormData('images', e.target.value)}
              placeholder="image1.jpg, image2.jpg, image3.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Created Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded-lg"
                value={formData.createdDate || ''}
                onChange={(e) => updateFormData('createdDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Completed Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded-lg"
                value={formData.completedDate || ''}
                onChange={(e) => updateFormData('completedDate', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.featured || false}
                onChange={(e) => updateFormData('featured', e.target.checked)}
              />
              Featured Project
            </label>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Project Manager</h2>
        <Button onClick={handleAdd}>
          <Plus size={16} className="mr-1" />
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg truncate">{project.title}</h3>
                <div className="flex space-x-1">
                  <Button
                    onClick={() => handleEdit(project)}
                    variant="ghost"
                    size="sm"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(project.id)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {project.description}
              </p>
              <div className="flex justify-between text-xs text-gray-500">
                <span className="capitalize">{project.category}</span>
                <span className="capitalize">{project.status.replace('-', ' ')}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{project.technologies.length - 3} more
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}