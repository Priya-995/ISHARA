import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [disabilityType, setDisabilityType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google successfully!");
      navigate('/dashboard');
    } catch (error) {
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!disabilityType) {
        toast.error("Please select a disability type.");
        return;
    }

    setIsLoading(true);
    try {
      await signup(email, password, name, disabilityType);
      toast.success("Account created successfully!");
      navigate('/dashboard');
    } catch (error: any)
    {
      toast.error(error.message || "An error occurred during sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Link to="/" className="inline-block mb-6">
                <img src="/lk5GFyFTTvqYupHbQQDAQQ-removebg-preview.png" alt="Ishara Logo" className="w-20 h-20" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Join the ISHARA Community
            </h1>
            <p className="mt-2 text-gray-600">
              Create your account to start breaking barriers.
            </p>
          </motion.div>

          <Card className="border-none shadow-2xl shadow-gray-200/50">
            <CardContent className="p-8 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input id="name" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-12" />
                      </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input id="email" type="email" placeholder="john.doe@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="disabilityType">Disability Type</Label>
                    <Select onValueChange={setDisabilityType} value={disabilityType}>
                        <SelectTrigger className="h-12">
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


                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-12 pr-10" />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 h-12 pr-10" />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-ishara-gradient text-white font-bold py-3 text-base" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button variant="outline" className="w-full font-semibold py-3 text-base" onClick={handleGoogleSignIn}>
                <svg className="mr-2 h-5 w-5" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.196C34.908 5.743 29.814 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                    <path fill="#FF3D00" d="M6.306 14.691L11.54 19.165C13.253 14.534 18.17 11 24 11c3.059 0 5.842 1.154 7.961 3.039L38.804 9.196C34.908 5.743 29.814 4 24 4C16.92 4 10.743 7.828 6.306 14.691z" />
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192L32.64 34.338C30.34 36.333 27.34 37 24 37c-5.83 0-10.747-3.534-12.46-8.835L6.306 33.309C10.743 40.172 16.92 44 24 44z" />
                    <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.16-4.082 5.571L40.257 41.64C45.948 36.945 48 29.71 48 24c0-1.341-.138-2.65-.389-3.917z" />
                </svg>
                Sign up with Google
              </Button>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold leading-6 text-ishara-blue hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:block relative">
        <img
          src="https://images.unsplash.com/photo-1516549655169-98e4a33f15d6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Abstract background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ishara-dark-blue/60" />
        <div className="relative flex items-center justify-center h-full">
            <div className="text-white text-center p-8">
                <h2 className="text-4xl font-bold">A New Era of Communication</h2>
                <p className="mt-4 text-lg max-w-lg">Our platform is designed to be intuitive, powerful, and accessible for everyone.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
