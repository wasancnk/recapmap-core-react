import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useNodeStore } from '../../stores/nodeStore';

export const PresentationPanel: React.FC = () => {
  const { 
    ui, 
    togglePresentationMode, 
    updatePresentationSettings,
    setTheme
  } = useUIStore();
  const { nodes } = useNodeStore();

  const { isPresentationMode, presentationSettings } = ui;
  // Get presentation nodes (nodes that can be used in presentations)
  const presentationNodes = nodes.filter(node => 
    node.type === 'view' || 
    node.type === 'note' ||
    node.type === 'case' ||
    node.type === 'interface'
  );

  const handleTogglePresentationMode = () => {
    togglePresentationMode();
    
    // Apply presentation theme when entering presentation mode
    if (!isPresentationMode && presentationSettings.presentationTheme === 'bright') {
      setTheme('bright');
    } else if (isPresentationMode) {
      // Return to previous theme when exiting presentation mode
      setTheme('dark');
    }
  };

  const handleSettingChange = (key: keyof typeof presentationSettings, value: any) => {
    updatePresentationSettings({ [key]: value });
  };

  return (
    <div className="p-4 h-full overflow-y-auto scrollbar-dark">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <span>📽️</span>
          Presentation Mode
        </h3>
        
        {/* Main Toggle */}
        <button
          onClick={handleTogglePresentationMode}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isPresentationMode
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-surface-secondary text-text-secondary border border-surface-border hover:bg-surface-elevated'
          }`}
        >
          {isPresentationMode ? 'Exit Presentation' : 'Start Presentation'}
        </button>
      </div>

      {/* Status */}
      <div className="mb-6 p-3 rounded-lg bg-surface-secondary border border-surface-border">
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-2 h-2 rounded-full ${isPresentationMode ? 'bg-green-500' : 'bg-gray-500'}`}></span>
          <span className="text-sm font-medium text-text-primary">
            {isPresentationMode ? 'Presentation Active' : 'Presentation Inactive'}
          </span>
        </div>
        <div className="text-xs text-text-secondary">
          {presentationNodes.length} presentation-ready nodes available
        </div>
      </div>

      {/* Presentation Settings */}
      <div className="space-y-6">
        
        {/* Slide Management */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">Slide Management</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs text-text-secondary">Current Slide</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSettingChange('currentSlide', Math.max(1, presentationSettings.currentSlide - 1))}
                  className="w-6 h-6 bg-surface-elevated text-text-primary rounded text-xs hover:bg-surface-border"
                  disabled={presentationSettings.currentSlide <= 1}
                >
                  ‹
                </button>
                <span className="text-sm text-text-primary min-w-[3rem] text-center">
                  {presentationSettings.currentSlide} / {presentationSettings.totalSlides}
                </span>
                <button
                  onClick={() => handleSettingChange('currentSlide', Math.min(presentationSettings.totalSlides, presentationSettings.currentSlide + 1))}
                  className="w-6 h-6 bg-surface-elevated text-text-primary rounded text-xs hover:bg-surface-border"
                  disabled={presentationSettings.currentSlide >= presentationSettings.totalSlides}
                >
                  ›
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs text-text-secondary">Total Slides</label>
              <input
                type="number"
                min="1"
                max="100"
                value={presentationSettings.totalSlides}
                onChange={(e) => handleSettingChange('totalSlides', parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 bg-surface-primary border border-surface-border text-text-primary rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Display Options */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">Display Options</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Show Page Numbers</span>
              <input
                type="checkbox"
                checked={presentationSettings.showPageNumbers}
                onChange={(e) => handleSettingChange('showPageNumbers', e.target.checked)}
                className="rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Show Timestamp</span>
              <input
                type="checkbox"
                checked={presentationSettings.showTimestamp}
                onChange={(e) => handleSettingChange('showTimestamp', e.target.checked)}
                className="rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Hide Toolbar</span>
              <input
                type="checkbox"
                checked={presentationSettings.hideToolbar}
                onChange={(e) => handleSettingChange('hideToolbar', e.target.checked)}
                className="rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Hide Panels</span>
              <input
                type="checkbox"
                checked={presentationSettings.hidePanels}
                onChange={(e) => handleSettingChange('hidePanels', e.target.checked)}
                className="rounded"
              />
            </label>
          </div>
        </div>

        {/* Auto Advance */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">Auto Advance</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Enable Auto Advance</span>
              <input
                type="checkbox"
                checked={presentationSettings.autoAdvance}
                onChange={(e) => handleSettingChange('autoAdvance', e.target.checked)}
                className="rounded"
              />
            </label>

            {presentationSettings.autoAdvance && (
              <div className="flex items-center justify-between">
                <label className="text-xs text-text-secondary">Interval (seconds)</label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={presentationSettings.autoAdvanceInterval}
                  onChange={(e) => handleSettingChange('autoAdvanceInterval', parseInt(e.target.value) || 30)}
                  className="w-16 px-2 py-1 bg-surface-primary border border-surface-border text-text-primary rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Theme Selection */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">Presentation Theme</h4>
          <div className="space-y-2">
            {(['bright', 'dark', 'custom'] as const).map((theme) => (
              <label key={theme} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="presentationTheme"
                  value={theme}
                  checked={presentationSettings.presentationTheme === theme}
                  onChange={(e) => handleSettingChange('presentationTheme', e.target.value)}
                  className="text-blue-500"
                />
                <span className="text-xs text-text-secondary capitalize">{theme}</span>
              </label>
            ))}
          </div>

          {presentationSettings.presentationTheme === 'custom' && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-text-secondary">Background Color</label>
                <input
                  type="color"
                  value={presentationSettings.backgroundColor || '#ffffff'}
                  onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                  className="w-8 h-6 border border-surface-border rounded cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Available Nodes */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">
            Available Nodes ({presentationNodes.length})
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
            {presentationNodes.map((node) => (
              <div
                key={node.id}
                className="flex items-center gap-2 p-2 bg-surface-secondary rounded border border-surface-border"
              >                <span className="text-sm">                  {node.type === 'view' && '📽️'}
                  {node.type === 'note' && '🖊️'}
                  {node.type === 'case' && '🎯'}
                  {node.type === 'interface' && '📱'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-text-primary truncate">
                    {node.title}
                  </div>
                  <div className="text-xs text-text-secondary capitalize">
                    {node.type}
                  </div>
                </div>
              </div>
            ))}
            
            {presentationNodes.length === 0 && (
              <div className="text-xs text-text-muted text-center py-4">
                No presentation-ready nodes found.
                <br />
                Create some View, Note, Case, or Interface nodes.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
