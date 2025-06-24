import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Google and Apple SVG icons
const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.196C34.908 5.743 29.814 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306 14.691L11.54 19.165C13.253 14.534 18.17 11 24 11c3.059 0 5.842 1.154 7.961 3.039L38.804 9.196C34.908 5.743 29.814 4 24 4C16.92 4 10.743 7.828 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192L32.64 34.338C30.34 36.333 27.34 37 24 37c-5.83 0-10.747-3.534-12.46-8.835L6.306 33.309C10.743 40.172 16.92 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.16-4.082 5.571L40.257 41.64C45.948 36.945 48 29.71 48 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);

const AppleIcon = () => (
    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.3,4.9C17.2,4.8,15,5.9,13.7,7.6c-1.3,1.8-2.4,4.5-2,7.3c1.8,0.2,3.9-1,5.2-2.7C18.1,10.7,19,8.5,19.3,4.9z M12,10.6C12,8,9.9,6.5,7.6,6.5c-2.6,0-4.6,1.8-4.6,4.4c0,2.9,2.1,6.5,4.5,6.5c2.5,0,3.3-1.6,4.7-1.6c1.4,0,2.1,1.6,4.6,1.6s4.2-3.6,4.2-3.6S12,15.9,12,10.6z"></path>
    </svg>
);

const SignUp = () => {
    const [step, setStep] = useState('initial'); // 'initial' or 'form'
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

    const handleAppleSignIn = () => {
        toast.info("Sign up with Apple is not yet available.");
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
        } catch (error: any) {
            toast.error(error.message || "An error occurred during sign up.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderInitialStep = () => (
        <div className="w-full max-w-sm">
             <header className="mb-10 text-center">
                <img src="/lk5GFyFTTvqYupHbQQDAQQ-removebg-preview.png" alt="Ishara Logo" className="w-16 h-16 mx-auto" />
            </header>

            <main className='px-4'>
                <h1 className="text-3xl font-extrabold mb-8 text-center">Create an account</h1>
                <div className="space-y-3">
                    <Button onClick={handleGoogleSignIn} className="w-full bg-white text-black dark:text-gray-900 font-semibold rounded-full h-11 justify-start px-6 items-center flex hover:bg-gray-200">
                        <GoogleIcon />Sign up with Google
                    </Button>
                    <Button onClick={handleAppleSignIn} className="w-full bg-white text-black dark:text-gray-900 font-semibold rounded-full h-11 justify-start px-6 items-center flex hover:bg-gray-200">
                        <AppleIcon />Sign up with Apple
                    </Button>
                    
                    <div className="flex items-center py-2">
                        <div className="flex-grow border-t border-gray-700"></div>
                        <span className="mx-4 text-gray-400">OR</span>
                        <div className="flex-grow border-t border-gray-700"></div>
                    </div>

                    <Button onClick={() => setStep('form')} className="w-full bg-white text-black dark:text-gray-900 font-bold rounded-full h-11 justify-center hover:bg-gray-200">
                        Create account
                    </Button>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                    By signing up, you agree to the{' '}
                    <Link to="/terms" className="text-blue-400 hover:underline">Terms of Service</Link> and{' '}
                    <Link to="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>, including{' '}
                    <Link to="/cookie-use" className="text-blue-400 hover:underline">Cookie Use</Link>.
                </p>
            </main>

            <footer className="mt-16 text-center px-4">
                <h2 className="font-bold text-lg mb-4">Already have an account?</h2>
                <Button onClick={() => navigate('/login')} variant="outline" className="w-full text-blue-400 font-bold rounded-full h-11 justify-center border-gray-500 hover:bg-gray-900 hover:text-blue-400">
                    Sign in
                </Button>
            </footer>
        </div>
    );

    const renderFormStep = () => (
        <div className="w-full max-w-sm">
             <header className="mb-4 flex items-center justify-center relative w-full">
                <Button variant="ghost" size="icon" className="absolute left-0" onClick={() => setStep('initial')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <img src="/lk5GFyFTTvqYupHbQQDAQQ-removebg-preview.png" alt="Ishara Logo" className="w-10 h-10" />
            </header>
            
            <div className="w-full text-left px-4">
                <h1 className="text-3xl font-bold mb-6">Create your account</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                         <Input id="name" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent border-gray-700 rounded-md h-14 px-3 text-lg focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                        <Input id="email" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent border-gray-700 rounded-md h-14 px-3 text-lg" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="disabilityType">Disability Type</Label>
                        <Select onValueChange={setDisabilityType} value={disabilityType}>
                            <SelectTrigger className="h-14 bg-transparent border-gray-700 rounded-md text-lg">
                                <SelectValue placeholder="Select your disability type" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 text-white border-gray-700">
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="deaf">Deaf</SelectItem>
                                <SelectItem value="mute">Mute</SelectItem>
                                <SelectItem value="blind">Blind</SelectItem>
                                <SelectItem value="deaf-mute">Deaf-Mute</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-black border-t border-gray-800 flex justify-end">
                        <Button type="submit" className="bg-white text-black dark:text-gray-900 font-bold rounded-full h-12 px-8 text-base" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Account"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <div className="bg-black text-white flex justify-center items-center min-h-screen p-4">
             <motion.div
                key={step}
                initial={{ opacity: 0, x: step === 'form' ? 100 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex justify-center"
            >
                {step === 'initial' ? renderInitialStep() : renderFormStep()}
             </motion.div>
        </div>
    );
};

export default SignUp;
