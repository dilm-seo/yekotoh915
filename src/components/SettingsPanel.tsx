import React, { useState } from 'react';
import { Settings } from '../types';
import { Settings as SettingsIcon, Save, Key } from 'lucide-react';

interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof Settings, value: string) => {
    setIsDirty(true);
    setIsSaved(false);
    onSettingsChange({ ...settings, [field]: value });
  };

  const handleSave = () => {
    localStorage.setItem('forex-settings', JSON.stringify(settings));
    setIsDirty(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-lg rounded-full"></div>
          <SettingsIcon className="w-6 h-6 text-purple-400 relative" />
        </div>
        <h2 className="text-xl font-semibold text-gray-100">Configuration</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <Key className="w-4 h-4" />
            Clé API OpenAI
          </label>
          <input
            type="password"
            value={settings.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                     text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 
                     focus:ring-blue-500/30 transition-all duration-200"
            placeholder="sk-..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Modèle OpenAI
          </label>
          <select
            value={settings.model}
            onChange={(e) => handleChange('model', e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                     text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 
                     transition-all duration-200"
          >
            <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`glass-button w-full flex items-center justify-center gap-2 ${
            !isDirty && 'opacity-50 cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4" />
          {isSaved ? 'Configuration sauvegardée!' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  );
}