import React, { useState } from 'react';
import { Users, BarChart2, MessageSquare, Settings, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import MessageComposer from '../components/MessageComposer';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('messages');
  const [showMessageComposer, setShowMessageComposer] = useState(false);
  const { isAdmin } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  // Mock data
  const messages = [
    { id: 1, from: 'john_doe', content: 'Need help with my account', time: '2 hours ago' },
    { id: 2, from: 'jane_smith', content: 'Having issues with login', time: '1 day ago' }
  ];

  const campaigns = [
    { id: 1, name: 'Summer Sale', owner: 'John Doe', status: 'Active', engagement: '12%' },
    { id: 2, name: 'Holiday Special', owner: 'Jane Smith', status: 'Draft', engagement: '0%' },
  ];

  return (
    <div className="space-y-6">
      {showMessageComposer && (
        <MessageComposer onClose={() => setShowMessageComposer(false)} />
      )}

      <div className="bg-white/10 backdrop-blur-xl rounded-lg p-6 border border-white/10">
        <h1 className="text-2xl font-semibold text-white">
          Admin Dashboard
        </h1>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-lg overflow-hidden border border-white/10">
        <div className="border-b border-white/10">
          <nav className="flex -mb-px">
            <button
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
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-4 text-sm font-medium flex items-center space-x-2 ${
                activeTab === 'settings'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Support Messages</h3>
                <button
                  onClick={() => setShowMessageComposer(true)}
                  className="apple-button-primary inline-flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>New Message</span>
                </button>
              </div>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-white">@{message.from}</span>
                      <span className="text-sm text-white/60">{message.time}</span>
                    </div>
                    <p className="mt-1 text-white/80">{message.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Campaign Management</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Campaign</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Engagement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{campaign.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{campaign.owner}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            campaign.status === 'Active'
                              ? 'bg-green-900/20 text-green-400 border border-green-900/50'
                              : 'bg-yellow-900/20 text-yellow-400 border border-yellow-900/50'
                          }`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{campaign.engagement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/80">
                    Admin Settings
                  </label>
                  <p className="mt-1 text-sm text-white/60">
                    Configure admin dashboard settings and preferences.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}