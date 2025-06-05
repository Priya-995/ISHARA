import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Camera, User, Mail, Accessibility } from 'lucide-react';

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
      
      <main className="py-10">
        <div className="container mx-auto px-4">
          <div className="relative h-48 bg-ishara-gradient rounded-lg">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={photoPreview || "/avatar-placeholder.png"} alt={displayName || "User"} />
                <AvatarFallback className="text-4xl">{displayName ? displayName.charAt(0) : 'U'}</AvatarFallback>
              </Avatar>
              <Input id="photoUpload" type="file" onChange={handlePhotoChange} className="hidden" />
              <Button 
                size="icon" 
                className="absolute bottom-2 right-2 rounded-full h-8 w-8 bg-white/80 hover:bg-white"
                onClick={() => document.getElementById('photoUpload')?.click()}
              >
                <Camera className="h-4 w-4 text-gray-700" />
              </Button>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <h1 className="text-3xl font-bold">{displayName}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>

          <div className="max-w-2xl mx-auto mt-10">
            <Card className="shadow-xl border-none">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information here.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="pl-10 h-12" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input id="email" value={user.email || ''} readOnly className="pl-10 h-12 bg-gray-100" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="disabilityType">Disability Type</Label>
                    <div className="relative">
                        <Accessibility className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Select onValueChange={setDisabilityType} value={disabilityType}>
                            <SelectTrigger className="w-full pl-10 h-12">
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
                  </div>

                  <Button type="submit" className="w-full bg-ishara-gradient text-white font-bold py-3 text-base" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile; 