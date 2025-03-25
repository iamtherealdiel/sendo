import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { MessageSquare, BarChart2, Settings as SettingsIcon, Send } from 'lucide-react';
import UsernamePrompt from '../components/UsernamePrompt';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import TutorialOverlay from '../components/TutorialOverlay';
import Settings from '../components/Settings';
import { supabase } from '../lib/supabase';

export default function UserDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('messages');
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();
          
        if (data && !data.onboarding_completed) {
          setShowTutorial(true);
        }
      }
    };

    if (user && !user.user_metadata?.username) {
      setShowUsernamePrompt(true);
    } else {
      checkOnboarding();
    }
  }, [user]);

  const campaigns = [
    { id: 1, name: 'Summer Campaign', status: 'Active', views: 1234, engagement: '5.7%' },
    { id: 2, name: 'Product Launch', status: 'Scheduled', views: 0, engagement: '0%' }
  ];

  const handleRestartTutorial = async () => {
    if (user) {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: false })
        .eq('id', user.id);
      setShowTutorial(true);
    }
  };

  return (
    <div className="space-y-6">
      {showUsernamePrompt && (
        <UsernamePrompt onClose={() => {
          setShowUsernamePrompt(false);
          setShowTutorial(true);
        }} />
      )}

      {showTutorial && (
        <TutorialOverlay onComplete={() => setShowTutorial(false)} />
      )}

      {/* User Welcome Section */}
      <div className="bg-white/10 backdrop-blur-xl rounded-lg p-6 border border-white/10">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-2xl text-primary font-semibold">
              {user?.user_metadata?.full_name?.[0] || 'U'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Welcome back, {user?.user_metadata?.full_name || 'User'}!
            </h1>
            <p className="text-white/60">
              {user?.user_metadata?.username ? `@${user.user_metadata.username}` : user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/10 backdrop-blur-xl rounded-lg overflow-hidden border border-white/10">
        <div className="border-b border-white/10">
          <nav className="flex -mb-px">
            <button
              data-tutorial="messages"
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-4 text-sm font-medium flex items-center space-x-2 ${
                activeTab === 'messages'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </button>
            <button
              data-tutorial="campaigns"
              onClick={() => setActiveTab('campaigns')}
              className={`px-6 py-4 text-sm font-medium flex items-center space-x-2 ${
                activeTab === 'campaigns'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <BarChart2 className="h-5 w-5" />
              <span>Campaigns</span>
            </button>
            <button
              data-tutorial="settings"
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-4 text-sm font-medium flex items-center space-x-2 ${
                activeTab === 'settings'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <SettingsIcon className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Support Chat</h3>
              </div>
              <MessageList />
              <MessageInput />
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Active Campaigns</h3>
                <button className="apple-button-primary">Create Campaign</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Views</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Engagement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{campaign.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            campaign.status === 'Active'
                              ? 'bg-green-900/20 text-green-400 border border-green-900/50'
                              : 'bg-yellow-900/20 text-yellow-400 border border-yellow-900/50'
                          }`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{campaign.views}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{campaign.engagement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && <Settings />}
        </div>
      </div>
    </div>
  );
}