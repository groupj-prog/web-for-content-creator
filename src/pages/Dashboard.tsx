import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Youtube, Facebook, AlertCircle, CheckCircle2, ArrowRight, Image, Video, Type, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

type SocialAccount = {
  platform: 'facebook' | 'youtube';
  connected: boolean;
  username?: string;
};

type ContentType = 'text' | 'photo' | 'video';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    { platform: 'facebook', connected: false },
    { platform: 'youtube', connected: false },
  ]);
  const [contentType, setContentType] = useState<ContentType>('text');
  const [postText, setPostText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
    };

    checkUser();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
    }
  };

  const handleConnect = (platform: 'facebook' | 'youtube') => {
    setSocialAccounts(accounts =>
      accounts.map(account =>
        account.platform === platform
          ? { ...account, connected: true, username: `demo_${platform}_user` }
          : account
      )
    );
    toast.success(`Connected to ${platform} successfully!`);
  };

  const handleDisconnect = (platform: 'facebook' | 'youtube') => {
    setSocialAccounts(accounts =>
      accounts.map(account =>
        account.platform === platform
          ? { ...account, connected: false, username: undefined }
          : account
      )
    );
    setSelectedPlatforms(prev => {
      const next = new Set(prev);
      next.delete(platform);
      return next;
    });
    toast.success(`Disconnected from ${platform}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      toast.success(`${file.name} selected`);
    }
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => {
      const next = new Set(prev);
      if (next.has(platform)) {
        next.delete(platform);
      } else {
        next.add(platform);
      }
      return next;
    });
  };

  const handlePost = async () => {
    if (!postText && !mediaFile) {
      toast.error('Please add some content to post');
      return;
    }

    if (selectedPlatforms.size === 0) {
      toast.error('Please select at least one platform to post to');
      return;
    }

    setIsPosting(true);
    try {
      // Simulate posting delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Content posted successfully to ${Array.from(selectedPlatforms).join(' and ')}!`);
      setPostText('');
      setMediaFile(null);
      setContentType('text');
      setSelectedPlatforms(new Set());
    } catch (error) {
      toast.error('Failed to post content');
    } finally {
      setIsPosting(false);
    }
  };

  if (!user) return null;

  const connectedAccounts = socialAccounts.filter(account => account.connected);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Welcome to Your Dashboard</h2>
            <p className="text-purple-200 mt-1">Create and manage your content</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-purple-200 hover:text-white transition duration-300"
          >
            Sign Out
          </button>
        </div>

        <div className="space-y-6">
          {/* Content Creation Section */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Create New Post</h3>
            <div className="space-y-4">
              {/* Content Type Selection */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setContentType('text')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-300 ${
                    contentType === 'text'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-purple-200 hover:bg-white/10'
                  }`}
                >
                  <Type className="h-5 w-5" />
                  <span>Text</span>
                </button>
                <button
                  onClick={() => setContentType('photo')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-300 ${
                    contentType === 'photo'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-purple-200 hover:bg-white/10'
                  }`}
                >
                  <Image className="h-5 w-5" />
                  <span>Photo</span>
                </button>
                <button
                  onClick={() => setContentType('video')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-300 ${
                    contentType === 'video'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-purple-200 hover:bg-white/10'
                  }`}
                >
                  <Video className="h-5 w-5" />
                  <span>Video</span>
                </button>
              </div>

              {/* Text Input */}
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full h-32 px-4 py-3 rounded-lg bg-white/5 border border-purple-400/30 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 resize-none"
              />

              {/* File Upload */}
              {contentType !== 'text' && (
                <div className="space-y-2">
                  <label
                    htmlFor="file-upload"
                    className="block w-full px-4 py-3 text-center border-2 border-dashed border-purple-400/30 rounded-lg cursor-pointer hover:border-purple-400/50 transition duration-300"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      {contentType === 'photo' ? <Image className="h-6 w-6 text-purple-300" /> : <Video className="h-6 w-6 text-purple-300" />}
                      <span className="text-purple-200">
                        {mediaFile ? mediaFile.name : `Upload ${contentType === 'photo' ? 'Photo' : 'Video'}`}
                      </span>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      accept={contentType === 'photo' ? 'image/*' : 'video/*'}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Platform Selection */}
              {connectedAccounts.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Select platforms to post to:</h4>
                  <div className="flex flex-wrap gap-3">
                    {connectedAccounts.map(account => (
                      <button
                        key={account.platform}
                        onClick={() => togglePlatform(account.platform)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition duration-300 ${
                          selectedPlatforms.has(account.platform)
                            ? 'bg-purple-500 border-purple-400 text-white'
                            : 'bg-white/5 border-purple-400/30 text-purple-200 hover:bg-white/10'
                        }`}
                      >
                        {account.platform === 'youtube' ? (
                          <Youtube className="h-5 w-5" />
                        ) : (
                          <Facebook className="h-5 w-5" />
                        )}
                        <span className="capitalize">{account.platform}</span>
                        {selectedPlatforms.has(account.platform) && (
                          <CheckCircle2 className="h-4 w-4 ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-3 text-purple-200 bg-white/5 rounded-lg">
                  <p>Connect to platforms above to start posting</p>
                </div>
              )}

              {/* Post Button */}
              <button
                onClick={handlePost}
                disabled={isPosting || (!postText && !mediaFile) || selectedPlatforms.size === 0}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
                <span>
                  {isPosting 
                    ? 'Posting...' 
                    : selectedPlatforms.size > 0 
                      ? `Post to ${Array.from(selectedPlatforms).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' & ')}` 
                      : 'Post Now'
                  }
                </span>
              </button>
            </div>
          </div>

          {/* Connected Platforms Section */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Connected Platforms</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {socialAccounts.map(account => (
                <div
                  key={account.platform}
                  className="bg-white/5 rounded-lg p-6 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {account.platform === 'youtube' ? (
                        <Youtube className="h-6 w-6 text-red-400" />
                      ) : (
                        <Facebook className="h-6 w-6 text-blue-400" />
                      )}
                      <span className="text-white capitalize">{account.platform}</span>
                    </div>
                    {account.connected ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                    )}
                  </div>

                  <div className="space-y-3">
                    {account.connected ? (
                      <>
                        <p className="text-purple-200">
                          Connected as: <span className="text-white">{account.username}</span>
                        </p>
                        <button
                          onClick={() => handleDisconnect(account.platform)}
                          className="w-full px-4 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg transition duration-300"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleConnect(account.platform)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg transition duration-300"
                      >
                        <span>Connect {account.platform}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Information Section */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Account Information</h3>
            <div className="text-purple-200">
              <p>Email: {user.email}</p>
              <p>Member since: {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}