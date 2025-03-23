import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Virtual Classroom</h3>
                        <p className="text-sm text-muted-foreground">
                            Making education accessible and interactive for everyone through innovative digital solutions.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Connect</h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Email: support@virtualclassroom.com
                        </p>
                    </div>
                </div>

                <div className="mt-8 border-t pt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Virtual Classroom. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
} 