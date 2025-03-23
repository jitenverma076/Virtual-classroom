import React from 'react';
import { Layout, Users, Video, BookOpen, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccountDialog } from '@/components/account-dialog';
import { useAuth } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // If user is already logged in, redirect to dashboard
    React.useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center space-y-12 text-center py-16">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                        Welcome to Virtual Classroom
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        An interactive platform for online learning and collaboration.
                        Transform your teaching and learning experience with our comprehensive virtual classroom solution.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                        <AccountDialog buttonText="Get Started" />
                        <Button variant="outline" size="lg" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div id="features" className="py-16 bg-muted/50">
                <div className="container">
                    <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6">
                            <Layout className="h-12 w-12 text-primary" />
                            <h3 className="text-xl font-semibold">Interactive Whiteboard</h3>
                            <p className="text-muted-foreground text-center">
                                Collaborate in real-time with our digital whiteboard tools. Share ideas and work together seamlessly.
                            </p>
                        </div>

                        <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6">
                            <Video className="h-12 w-12 text-primary" />
                            <h3 className="text-xl font-semibold">Video Conferencing</h3>
                            <p className="text-muted-foreground text-center">
                                Connect face-to-face with high-quality video calls. Share screens and engage in interactive discussions.
                            </p>
                        </div>

                        <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6">
                            <Users className="h-12 w-12 text-primary" />
                            <h3 className="text-xl font-semibold">Group Collaboration</h3>
                            <p className="text-muted-foreground text-center">
                                Work together seamlessly with your team or class. Share resources and communicate effectively.
                            </p>
                        </div>

                        <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6">
                            <BookOpen className="h-12 w-12 text-primary" />
                            <h3 className="text-xl font-semibold">Resource Library</h3>
                            <p className="text-muted-foreground text-center">
                                Access and share educational materials, documents, and multimedia content in one place.
                            </p>
                        </div>

                        <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6">
                            <Globe className="h-12 w-12 text-primary" />
                            <h3 className="text-xl font-semibold">Global Access</h3>
                            <p className="text-muted-foreground text-center">
                                Learn and teach from anywhere in the world. Break down geographical barriers.
                            </p>
                        </div>

                        <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6">
                            <Shield className="h-12 w-12 text-primary" />
                            <h3 className="text-xl font-semibold">Secure Platform</h3>
                            <p className="text-muted-foreground text-center">
                                Enterprise-grade security ensures your data and communications are protected.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-auto border-t">
                <div className="container py-6">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <p className="text-sm text-muted-foreground">
                            © 2024 Virtual Classroom. All rights reserved.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-sm text-muted-foreground hover:underline">Privacy Policy</a>
                            <a href="#" className="text-sm text-muted-foreground hover:underline">Terms of Service</a>
                            <a href="#" className="text-sm text-muted-foreground hover:underline">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}