import React, { useState } from 'react';
import { Moon, Bell, Globe, Shield, Save } from 'lucide-react';

export default function SettingsModule() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    language: 'English',
    twoFactorAuth: false
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl mx-auto text-left">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="font-display text-title-md text-ivory">System Settings</h2>
        <p className="text-body-sm text-cream/60">Manage your portal preferences and configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Preferences */}
        <div className="border border-gold/20 bg-[#1F1108]/60 p-6 rounded-[2px]">
          <h3 className="text-body-lg font-display text-gold mb-4 border-b border-gold/10 pb-2">Preferences</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/10 rounded-full"><Bell className="w-4 h-4 text-gold" /></div>
                <div>
                  <p className="text-body-sm text-ivory font-bold">Push Notifications</p>
                  <p className="text-label-xs text-cream/50">Receive alerts for new orders</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggle('notifications')}
                className={`w-10 h-5 rounded-full relative transition-colors ${settings.notifications ? 'bg-gold' : 'bg-charcoal border border-gold/30'}`}
              >
                <div className={`w-3.5 h-3.5 bg-ivory rounded-full absolute top-0.5 transition-transform ${settings.notifications ? 'translate-x-5.5 left-[2px]' : 'translate-x-0.5 left-[2px]'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/10 rounded-full"><Moon className="w-4 h-4 text-gold" /></div>
                <div>
                  <p className="text-body-sm text-ivory font-bold">Dark Mode</p>
                  <p className="text-label-xs text-cream/50">Toggle system appearance</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggle('darkMode')}
                className={`w-10 h-5 rounded-full relative transition-colors ${settings.darkMode ? 'bg-gold' : 'bg-charcoal border border-gold/30'}`}
              >
                <div className={`w-3.5 h-3.5 bg-ivory rounded-full absolute top-0.5 transition-transform ${settings.darkMode ? 'translate-x-5.5 left-[2px]' : 'translate-x-0.5 left-[2px]'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/10 rounded-full"><Globe className="w-4 h-4 text-gold" /></div>
                <div>
                  <p className="text-body-sm text-ivory font-bold">Language</p>
                  <p className="text-label-xs text-cream/50">Interface language</p>
                </div>
              </div>
              <select 
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                className="bg-[#1A0A00] border border-gold/30 text-body-sm text-ivory py-1 px-2 rounded-[2px] outline-none"
              >
                <option>English</option>
                <option>Arabic</option>
                <option>Urdu</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="border border-gold/20 bg-[#1F1108]/60 p-6 rounded-[2px]">
          <h3 className="text-body-lg font-display text-gold mb-4 border-b border-gold/10 pb-2">Security</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/10 rounded-full"><Shield className="w-4 h-4 text-gold" /></div>
                <div>
                  <p className="text-body-sm text-ivory font-bold">Two-Factor Auth</p>
                  <p className="text-label-xs text-cream/50">Enhanced account security</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggle('twoFactorAuth')}
                className={`w-10 h-5 rounded-full relative transition-colors ${settings.twoFactorAuth ? 'bg-gold' : 'bg-charcoal border border-gold/30'}`}
              >
                <div className={`w-3.5 h-3.5 bg-ivory rounded-full absolute top-0.5 transition-transform ${settings.twoFactorAuth ? 'translate-x-5.5 left-[2px]' : 'translate-x-0.5 left-[2px]'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#C9952A] hover:bg-[#E8BA5A] text-[#1A0A00] text-label-xs font-bold uppercase tracking-widest rounded-full transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
