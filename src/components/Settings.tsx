import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../store/settingsStore';
import { useThemeStore } from '../store/themeStore';
import { supabase } from '../lib/supabase';
import TimezoneSelect from 'react-timezone-select';
import Switch from 'react-switch';
import toast from 'react-hot-toast';
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  Globe,
  Accessibility,
  Link as LinkIcon,
  Database,
  Palette,
  Eye,
  Mail,
  Clock,
  Shield,
  Languages,
  MessageSquare,
  Key,
  Trash2,
  AlertTriangle,
  Save,
  RotateCcw
} from 'lucide-react';

const sections = [
  { id: 'account', icon: SettingsIcon, label: 'Account Settings' },
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'privacy', icon: Lock, label: 'Privacy & Security' },
  { id: 'communication', icon: Globe, label: 'Communication' },
  { id: 'accessibility', icon: Accessibility, label: 'Accessibility' },
  { id: 'connected', icon: LinkIcon, label: 'Connected Accounts' },
  { id: 'backup', icon: Database, label: 'Backup & Recovery' }
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('account');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { settings, loading, error, fetchSettings, updateSettings, resetSettings } = useSettingsStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSettingChange = async (section: string, key: string, value: any) => {
    try {
      await updateSettings(section as any, {
        ...settings?.[section as keyof typeof settings],
        [key]: value
      });
      toast.success('Setting updated successfully');
    } catch (error) {
      toast.error('Failed to update setting');
    }
  };

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (error) throw error;
      toast.success('Password updated successfully');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id!
      );

      if (error) throw error;
      await supabase.auth.signOut();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error loading settings: {error}
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white resize-none"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Change Password</h3>
              <div>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white mb-2"
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white mb-2"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white"
                />
              </div>
              <button
                onClick={handlePasswordChange}
                className="apple-button-primary"
              >
                Update Password
              </button>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h3 className="text-lg font-medium text-red-500 mb-2">Danger Zone</h3>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-4">
                Theme
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                  className={`px-4 py-2 rounded-lg ${
                    settings?.appearance.theme === 'light'
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-white/80'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                  className={`px-4 py-2 rounded-lg ${
                    settings?.appearance.theme === 'dark'
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-white/80'
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => handleSettingChange('appearance', 'theme', 'system')}
                  className={`px-4 py-2 rounded-lg ${
                    settings?.appearance.theme === 'system'
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-white/80'
                  }`}
                >
                  System
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-4">
                Layout
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleSettingChange('appearance', 'layout', 'standard')}
                  className={`px-4 py-2 rounded-lg ${
                    settings?.appearance.layout === 'standard'
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-white/80'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => handleSettingChange('appearance', 'layout', 'compact')}
                  className={`px-4 py-2 rounded-lg ${
                    settings?.appearance.layout === 'compact'
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-white/80'
                  }`}
                >
                  Compact
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-4">
                Accent Color
              </label>
              <input
                type="color"
                value={settings?.appearance.accent_color}
                onChange={(e) => handleSettingChange('appearance', 'accent_color', e.target.value)}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-4">
                Font Size
              </label>
              <div className="flex space-x-4">
                {['small', 'medium', 'large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSettingChange('appearance', 'font_size', size)}
                    className={`px-4 py-2 rounded-lg ${
                      settings?.appearance.font_size === size
                        ? 'bg-primary text-white'
                        : 'bg-white/10 text-white/80'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {Object.entries(settings?.notifications.email || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-white/80">
                      {key.charAt(0).toUpperCase() + key.slice(1)} emails
                    </span>
                    <Switch
                      checked={value as boolean}
                      onChange={(checked) =>
                        handleSettingChange('notifications', 'email', {
                          ...settings?.notifications.email,
                          [key]: checked
                        })
                      }
                      onColor="#0071e3"
                      offColor="#374151"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">In-App Notifications</h3>
              <div className="space-y-4">
                {Object.entries(settings?.notifications.in_app || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-white/80">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                    <Switch
                      checked={value as boolean}
                      onChange={(checked) =>
                        handleSettingChange('notifications', 'in_app', {
                          ...settings?.notifications.in_app,
                          [key]: checked
                        })
                      }
                      onColor="#0071e3"
                      offColor="#374151"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Digest Frequency</h3>
              <div className="flex space-x-4">
                {['never', 'daily', 'weekly'].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => handleSettingChange('notifications', 'digest', freq)}
                    className={`px-4 py-2 rounded-lg ${
                      settings?.notifications.digest === freq
                        ? 'bg-primary text-white'
                        : 'bg-white/10 text-white/80'
                    }`}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Quiet Hours</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Enable Quiet Hours</span>
                  <Switch
                    checked={settings?.notifications.quiet_hours.enabled || false}
                    onChange={(checked) =>
                      handleSettingChange('notifications', 'quiet_hours', {
                        ...settings?.notifications.quiet_hours,
                        enabled: checked
                      })
                    }
                    onColor="#0071e3"
                    offColor="#374151"
                  />
                </div>
                {settings?.notifications.quiet_hours.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white/80 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={settings?.notifications.quiet_hours.start}
                        onChange={(e) =>
                          handleSettingChange('notifications', 'quiet_hours', {
                            ...settings?.notifications.quiet_hours,
                            start: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/80 mb-1">End Time</label>
                      <input
                        type="time"
                        value={settings?.notifications.quiet_hours.end}
                        onChange={(e) =>
                          handleSettingChange('notifications', 'quiet_hours', {
                            ...settings?.notifications.quiet_hours,
                            end: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Data Sharing</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Allow data sharing</span>
                  <Switch
                    checked={settings?.privacy.data_sharing || false}
                    onChange={(checked) =>
                      handleSettingChange('privacy', 'data_sharing', checked)
                    }
                    onColor="#0071e3"
                    offColor="#374151"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Message Privacy</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Show read receipts</span>
                  <Switch
                    checked={settings?.privacy.read_receipts || false}
                    onChange={(checked) =>
                      handleSettingChange('privacy', 'read_receipts', checked)
                    }
                    onColor="#0071e3"
                    offColor="#374151"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Show activity status</span>
                  <Switch
                    checked={settings?.privacy.activity_status || false}
                    onChange={(checked) =>
                      handleSettingChange('privacy', 'activity_status', checked)
                    }
                    onColor="#0071e3"
                    offColor="#374151"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Active Sessions</h3>
              <div className="space-y-4">
                {/* Add session management UI here */}
              </div>
            </div>
          </div>
        );

      case 'communication':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-4">
                Language
              </label>
              <select
                value={settings?.communication.language}
                onChange={(e) =>
                  handleSettingChange('communication', 'language', e.target.value)
                }
                className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="ru">Russian</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-4">
                Time Zone
              </label>
              <TimezoneSelect
                value={settings?.communication.timezone}
                onChange={(timezone) =>
                  handleSettingChange('communication', 'timezone', timezone.value)
                }
                className="text-black"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Auto-Reply</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Enable Auto-Reply</span>
                  <Switch
                    checked={settings?.communication.auto_reply.enabled || false}
                    onChange={(checked) =>
                      handleSettingChange('communication', 'auto_reply', {
                        ...settings?.communication.auto_reply,
                        enabled: checked
                      })
                    }
                    onColor="#0071e3"
                    offColor="#374151"
                  />
                </div>
                {settings?.communication.auto_reply.enabled && (
                  <textarea
                    value={settings?.communication.auto_reply.message}
                    onChange={(e) =>
                      handleSettingChange('communication', 'auto_reply', {
                        ...settings?.communication.auto_reply,
                        message: e.target.value
                      })
                    }
                    placeholder="Enter your auto-reply message"
                    rows={4}
                    className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white resize-none"
                  />
                )}
              </div>
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Visual Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">High Contrast Mode</span>
                  <Switch
                    checked={settings?.appearance.high_contrast || false}
                    onChange={(checked) =>
                      handleSettingChange('appearance', 'high_contrast', checked)
                    }
                    onColor="#0071e3"
                    offColor="#374151"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Reduced Motion</span>
                  <Switch
                    checked={settings?.appearance.reduced_motion || false}
                    onChange={(checked) =>
                      handleSettingChange('appearance', 'reduced_motion', checked)
                    }
                    onColor="#0071e3"
                    offColor="#374151"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Screen Reader</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Enable Screen Reader</span>
                  <Switch
                    checked={settings?.accessibility.screen_reader || false}
                    onChange={(checked) =>
                      handleSettingChange('accessibility', 'screen_reader', checked)
                    }
                    onColor="#0071e3"
                    offColor="#374151"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Keyboard Navigation</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Enable Keyboard Navigation</span>
                  <Switch
                    checked={settings?.accessibility.keyboard_nav || false}
                    onChange={(checked) =>
                      handleSettingChange('accessibility', 'keyboard_nav', checked)
                    }
                    onColor="#0071e3"
                    offColor="#374151"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'connected':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Connected Accounts</h3>
              {/* Add connected accounts UI here */}
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">API Keys</h3>
              {/* Add API key management UI here */}
            </div>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Backup Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Auto Backup</span>
                  <Switch
                    checked={settings?.backup.auto_backup || false}
                    onChange={(checked) =>
                      handleSettingChange('backup', 'auto_backup', checked)
                    }
                    onColor="#0071e3"
                    offColor="#374151"
                  />
                </div>
                {settings?.backup.auto_backup && (
                  <div>
                    <label className="block text-sm text-white/80 mb-2">
                      Backup Frequency
                    </label>
                    <select
                      value={settings?.backup.frequency}
                      onChange={(e) =>
                        handleSettingChange('backup', 'frequency', e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Data Export</h3>
              <button className="apple-button-primary">
                Export Personal Data
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[--dashboard-bg] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white/10 backdrop-blur-xl rounded-lg border border-white/10 p-4">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <section.icon className="h-5 w-5" />
                    <span>{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-white/10 backdrop-blur-xl rounded-lg border border-white/10 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">
                  {sections.find((s) => s.id === activeSection)?.label}
                </h2>
                <div className="flex space-x-4">
                  <button
                    onClick={resetSettings}
                    className="apple-button-secondary inline-flex items-center"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </button>
                  <button className="apple-button-primary inline-flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>

              {renderSection()}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-lg border border-white/10 p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-2 text-red-500 mb-4">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-xl font-semibold">Delete Account</h3>
            </div>
            <p className="text-white/80 mb-6">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}