import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail,
  Pencil, 
  Settings, 
  Moon, 
  Volume2, 
  Save
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    disabilityType: user?.disabilityType || '',
    photo: null as File | null,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.photoURL || null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, disabilityType: value }));
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    try {
      await updateProfile({
        displayName: formData.name,
        disabilityType: formData.disabilityType,
        photoFile: formData.photo || undefined
      });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-ishara-blue">Profile</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Manage your account settings and track your ISL learning progress
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel: Profile Card */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-lg h-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center"><User className="mr-2"/> Profile</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                  <Pencil className="h-5 w-5"/>
                </Button>
              </CardHeader>
              <CardContent className="text-center">
                <Avatar className="w-28 h-28 mx-auto mb-4 border-4 border-ishara-blue">
                  <AvatarImage src={photoPreview || user.photoURL || undefined} alt={user.name || ''} />
                  <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                {isEditing ? (
                  <div className="mb-4">
                    <Input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    <label htmlFor="photo-upload" className="cursor-pointer text-sm text-ishara-blue hover:underline">Change Photo</label>
                  </div>
                ) : (
                  <>
                    <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                      Intermediate
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long' }) : 'N/A'}
                    </p>
                  </>
                )}
                
                <div className="text-left mt-8 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    {isEditing ? (
                      <Input name="name" value={formData.name} onChange={handleInputChange} />
                    ) : (
                      <p className="text-lg">{user.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-lg">{user.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Disability Type</label>
                    {isEditing ? (
                      <Select value={formData.disabilityType || ''} onValueChange={handleSelectChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select disability type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Deaf">Deaf</SelectItem>
                          <SelectItem value="Hard of Hearing">Hard of Hearing</SelectItem>
                          <SelectItem value="Mute">Mute</SelectItem>
                          <SelectItem value="Deaf-Mute">Deaf-Mute</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="None">None</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-lg">{user.disabilityType || 'Not specified'}</p>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <Button onClick={handleSubmit} disabled={isSaving} className="w-full mt-6 bg-ishara-gradient text-white">
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Panel: Stats and Settings */}
          <motion.div 
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Learning Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-3xl font-bold text-blue-500">127</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Signs Learned</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <p className="text-3xl font-bold text-green-500">23</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <p className="text-3xl font-bold text-purple-500">145</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Minutes Practiced</p>
                  </div>
                  <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                    <p className="text-3xl font-bold text-orange-500">3</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center"><Settings className="mr-2"/> Settings</CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-200 dark:divide-gray-700">
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h3 className="font-medium flex items-center"><Moon className="mr-3 h-5 w-5"/> Dark Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark theme</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h3 className="font-medium flex items-center"><Volume2 className="mr-3 h-5 w-5"/> Voice Output</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enable text-to-speech</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h3 className="font-medium flex items-center"><Save className="mr-3 h-5 w-5"/> Auto-save Translations</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Automatically save your translations</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 