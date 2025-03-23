import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export function AccountDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, signup, user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const getErrorMessage = (error) => {
        switch (error.code) {
            case 'auth/email-already-in-use':
                return 'An account with this email already exists. Please sign in instead.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters long.';
            case 'auth/user-not-found':
                return 'No account found with this email. Please sign up instead.';
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again.';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later.';
            default:
                return error.message || 'An error occurred. Please try again.';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
                toast.success('Welcome back!');
            } else {
                if (password.length < 6) {
                    throw new Error('Password must be at least 6 characters long');
                }
                await signup(email, password);
                toast.success('Account created successfully!');
            }
            setIsOpen(false);
            setEmail('');
            setPassword('');
            // Redirect to dashboard after successful login/signup
            navigate('/dashboard');
        } catch (err) {
            console.error('Auth error:', err);
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // If user is logged in, show different button content
    const buttonContent = user ? (
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Dashboard
        </Button>
    ) : (
        <Button variant="outline">Account</Button>
    );

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                {buttonContent}
            </Dialog.Trigger>
            {!user && (
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-8 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                        <div className="space-y-6">
                            <Dialog.Title className="text-2xl font-semibold leading-none tracking-tight text-center">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </Dialog.Title>
                            <Dialog.Description className="text-sm text-center text-muted-foreground">
                                {isLogin
                                    ? 'Enter your credentials to access your account'
                                    : 'Sign up to start using Virtual Classroom'}
                            </Dialog.Description>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium leading-none">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        className={cn(
                                            "flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        )}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium leading-none">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        className={cn(
                                            "flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        )}
                                        placeholder="Enter your password"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded">
                                    {error}
                                </p>
                            )}

                            <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {isLogin ? 'Signing In...' : 'Signing Up...'}
                                    </>
                                ) : (
                                    isLogin ? 'Sign In' : 'Sign Up'
                                )}
                            </Button>

                            <p className="text-sm text-center text-muted-foreground">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                    }}
                                    className="text-primary hover:underline font-medium"
                                    disabled={isLoading}
                                >
                                    {isLogin ? 'Sign Up' : 'Sign In'}
                                </button>
                            </p>
                        </form>

                        <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            )}
        </Dialog.Root>
    );
} 