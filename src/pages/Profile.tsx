
import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, User } from 'lucide-react';

const avatarOptions = {
  skin: [
    { value: 'light', label: 'Light' },
    { value: 'medium', label: 'Medium' },
    { value: 'dark', label: 'Dark' },
  ],
  clothing: [
    { value: 'casual', label: 'Casual' },
    { value: 'formal', label: 'Formal' },
    { value: 'sporty', label: 'Sporty' },
  ],
  background: [
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'purple', label: 'Purple' },
    { value: 'orange', label: 'Orange' },
    { value: 'pink', label: 'Pink' },
  ],
  gender: [
    { value: 'neutral', label: 'Neutral' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ],
};

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [biography, setBiography] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatarSettings, setAvatarSettings] = useState({
    skin: 'medium',
    clothing: 'casual',
    background: 'blue', 
    gender: 'neutral',
  });
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  // Fetch profile data
  const { data: profileData, isLoading, error, refetch } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (userError) throw userError;
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') throw profileError;
      
      return {
        user: userData,
        profile: profileData || { id: user.id }
      };
    },
    enabled: !!user?.id && isAuthenticated,
  });

  // Update form values when profile data is loaded
  useEffect(() => {
    if (profileData) {
      setBiography(profileData.profile.biography || '');
      setDisplayName(profileData.user.full_name || '');
      setAvatarSettings({
        skin: profileData.profile.avatar_skin || 'medium',
        clothing: profileData.profile.avatar_clothing || 'casual',
        background: profileData.profile.avatar_background || 'blue',
        gender: profileData.profile.avatar_gender || 'neutral',
      });
      setSaveButtonDisabled(true);
    }
  }, [profileData]);

  // Enable save button when form values change
  useEffect(() => {
    if (profileData) {
      const hasProfileChanges = 
        biography !== (profileData.profile.biography || '') ||
        avatarSettings.skin !== (profileData.profile.avatar_skin || 'medium') ||
        avatarSettings.clothing !== (profileData.profile.avatar_clothing || 'casual') ||
        avatarSettings.background !== (profileData.profile.avatar_background || 'blue') ||
        avatarSettings.gender !== (profileData.profile.avatar_gender || 'neutral');
      
      const hasUserChanges = displayName !== (profileData.user.full_name || '');
      
      setSaveButtonDisabled(!(hasProfileChanges || hasUserChanges));
    }
  }, [biography, displayName, avatarSettings, profileData]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) return;
    
    try {
      // Update user data
      const { error: userError } = await supabase
        .from('users')
        .update({ 
          full_name: displayName,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (userError) throw userError;
      
      // Update profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          biography: biography,
          avatar_skin: avatarSettings.skin,
          avatar_clothing: avatarSettings.clothing,
          avatar_background: avatarSettings.background,
          avatar_gender: avatarSettings.gender,
          updated_at: new Date().toISOString()
        });
      
      if (profileError) throw profileError;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      refetch();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Generate avatar URL based on settings
  const getAvatarUrl = () => {
    const baseUrl = `https://api.dicebear.com/7.x/personas/svg`;
    const seed = user?.id || 'default';
    const params = new URLSearchParams({
      seed,
      backgroundColor: avatarSettings.background,
      skinTone: avatarSettings.skin,
      clothing: avatarSettings.clothing,
      gender: avatarSettings.gender,
    });
    
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-16">
          <div className="container py-16 max-w-4xl">
            <h1 className="text-3xl font-bold text-forest-800 mb-8">My Profile</h1>
            
            {!isAuthenticated ? (
              <div className="text-center py-16">
                <User className="mx-auto h-16 w-16 text-forest-300 mb-4" />
                <h2 className="text-2xl font-bold text-forest-800 mb-2">Please Sign In</h2>
                <p className="text-forest-600 mb-6">You need to sign in to access your profile</p>
                <Button asChild>
                  <a href="/">Go to Homepage</a>
                </Button>
              </div>
            ) : isLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin h-12 w-12 border-4 border-forest-600 rounded-full border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-forest-800 mb-2">Error Loading Profile</h2>
                <p className="text-forest-600 mb-6">There was a problem loading your profile. Please try again.</p>
                <Button onClick={() => refetch()}>Retry</Button>
              </div>
            ) : (
              <Tabs defaultValue="profile">
                <TabsList className="mb-8">
                  <TabsTrigger value="profile">Profile Information</TabsTrigger>
                  <TabsTrigger value="avatar">Avatar Customization</TabsTrigger>
                </TabsList>
                
                <form onSubmit={handleSubmit}>
                  <TabsContent value="profile" className="space-y-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                          Update your personal details and public profile information.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-forest-700 mb-1">
                            Email Address
                          </label>
                          <Input 
                            id="email" 
                            value={user?.email || ''} 
                            disabled 
                            className="bg-forest-50"
                          />
                          <p className="text-xs text-forest-500 mt-1">
                            Email cannot be changed.
                          </p>
                        </div>

                        <div>
                          <label htmlFor="displayName" className="block text-sm font-medium text-forest-700 mb-1">
                            Display Name
                          </label>
                          <Input 
                            id="displayName" 
                            value={displayName} 
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Enter your display name"
                          />
                        </div>

                        <div>
                          <label htmlFor="biography" className="block text-sm font-medium text-forest-700 mb-1">
                            Biography
                          </label>
                          <Textarea 
                            id="biography" 
                            value={biography} 
                            onChange={(e) => setBiography(e.target.value)}
                            placeholder="Tell us about yourself..."
                            rows={5}
                            className="resize-y"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="avatar" className="space-y-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Avatar Customization</CardTitle>
                        <CardDescription>
                          Customize your avatar appearance by selecting different features.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col space-y-6">
                            <div>
                              <label htmlFor="avatarSkin" className="block text-sm font-medium text-forest-700 mb-1">
                                Skin Tone
                              </label>
                              <Select
                                value={avatarSettings.skin}
                                onValueChange={(value) => setAvatarSettings({...avatarSettings, skin: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select skin tone" />
                                </SelectTrigger>
                                <SelectContent>
                                  {avatarOptions.skin.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <label htmlFor="avatarClothing" className="block text-sm font-medium text-forest-700 mb-1">
                                Clothing Style
                              </label>
                              <Select
                                value={avatarSettings.clothing}
                                onValueChange={(value) => setAvatarSettings({...avatarSettings, clothing: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select clothing style" />
                                </SelectTrigger>
                                <SelectContent>
                                  {avatarOptions.clothing.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <label htmlFor="avatarBackground" className="block text-sm font-medium text-forest-700 mb-1">
                                Background Color
                              </label>
                              <Select
                                value={avatarSettings.background}
                                onValueChange={(value) => setAvatarSettings({...avatarSettings, background: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select background color" />
                                </SelectTrigger>
                                <SelectContent>
                                  {avatarOptions.background.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <label htmlFor="avatarGender" className="block text-sm font-medium text-forest-700 mb-1">
                                Gender Appearance
                              </label>
                              <Select
                                value={avatarSettings.gender}
                                onValueChange={(value) => setAvatarSettings({...avatarSettings, gender: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender appearance" />
                                </SelectTrigger>
                                <SelectContent>
                                  {avatarOptions.gender.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-forest-200 mb-4">
                              <img 
                                src={getAvatarUrl()} 
                                alt="Avatar Preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-sm text-forest-600">Avatar Preview</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <div className="mt-8 flex justify-end">
                    <Button type="submit" disabled={saveButtonDisabled}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Tabs>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default Profile;
