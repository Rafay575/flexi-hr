import React, { useState } from 'react';
import { TemplateLibrary } from './TemplateLibrary';
import { PatternBuilder } from './PatternBuilder';
import { RosterTemplate } from './types';

export const RosterTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<RosterTemplate[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [builderMode, setBuilderMode] = useState<'create' | 'edit'>('create');
  const [selectedTemplate, setSelectedTemplate] = useState<RosterTemplate | null>(null);

  const handleViewTemplate = (template: RosterTemplate) => {
    // In a real app, you might open a detailed view modal
    console.log('View template:', template);
    alert(`Viewing template: ${template.name}\n\nThis would open a detailed view in a real implementation.`);
  };

  const handleEditTemplate = (template: RosterTemplate) => {
    setSelectedTemplate(template);
    setBuilderMode('edit');
    setShowBuilder(true);
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setBuilderMode('create');
    setShowBuilder(true);
  };

  const handleSaveTemplate = (templateData: Omit<RosterTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: RosterTemplate = {
      ...templateData,
      id: `TMP-${Math.floor(Math.random() * 9000) + 1000}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (builderMode === 'edit' && selectedTemplate) {
      // Update existing template
      setTemplates(prev => prev.map(t => 
        t.id === selectedTemplate.id ? { ...newTemplate, id: selectedTemplate.id } : t
      ));
    } else {
      // Add new template
      setTemplates(prev => [newTemplate, ...prev]);
    }

    setShowBuilder(false);
    setSelectedTemplate(null);
  };

  const handleCloseBuilder = () => {
    if (window.confirm('Are you sure you want to discard your changes?')) {
      setShowBuilder(false);
      setSelectedTemplate(null);
    }
  };

  return (
    <>
      <TemplateLibrary
        onViewTemplate={handleViewTemplate}
        onEditTemplate={handleEditTemplate}
        onCreateTemplate={handleCreateTemplate}
      />

      {showBuilder && (
        <PatternBuilder
          template={selectedTemplate || undefined}
          onSave={handleSaveTemplate}
          onClose={handleCloseBuilder}
          mode={builderMode}
        />
      )}
    </>
  );
};