import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState('');
  const [disabilityType, setDisabilityType] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setDisabilityType(user.disabilityType || 'none');
      setPhotoPreview(user.photoURL || null);
    }
  }, [user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const hasChanged =
      displayName !== (user.displayName || '') ||
      disabilityType !== (user.disabilityType || 'none') ||
      photoFile !== null;

    if (!hasChanged) {
      toast.info('No changes to update.');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({
        displayName,
        disabilityType,
        photoFile: photoFile || undefined,
      });
      toast.success('Profile updated successfully!');
      setPhotoFile(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-none">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                My Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={photoPreview || "/avatar-placeholder.png"} alt={displayName || "User"} />
                    <AvatarFallback className="text-4xl">{displayName ? displayName.charAt(0) : 'U'}</AvatarFallback>
                  </Avatar>
                  <Input id="photoUpload" type="file" onChange={handlePhotoChange} className="hidden" />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('photoUpload')?.click()}>
                    Change Photo
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" value={user.email || ''} readOnly className="bg-gray-100" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disabilityType">Disability Type</Label>
                  <Select onValueChange={setDisabilityType} value={disabilityType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your disability type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="deaf">Deaf</SelectItem>
                      <SelectItem value="mute">Mute</SelectItem>
                      <SelectItem value="blind">Blind</SelectItem>
                      <SelectItem value="deaf-mute">Deaf-Mute</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full bg-ishara-gradient text-white" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile; 