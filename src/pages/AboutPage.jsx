import React from 'react';
import { Footer } from '@/components/Footer';

export default function AboutPage() {
    return (
        <>
            <div className="flex flex-col min-h-[calc(100vh-4rem)]">
                <main className="flex-1">
                    <div className="container mx-auto py-12 px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl font-bold mb-8">About Virtual Classroom</h1>

                            <div className="space-y-12">
                                <section className="space-y-4">
                                    <h2 className="text-2xl font-semibold">Our Mission</h2>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        Virtual Classroom is dedicated to making education accessible and interactive for everyone.
                                        We believe in creating an engaging learning environment that bridges the gap between traditional
                                        classroom experiences and digital innovation.
                                    </p>
                                </section>

                                <section className="space-y-6">
                                    <h2 className="text-2xl font-semibold">Key Features</h2>
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="p-6 rounded-lg border bg-card hover:bg-card/80 transition-colors">
                                            <h3 className="text-xl font-medium mb-3">Real-time Collaboration</h3>
                                            <p className="text-muted-foreground">
                                                Interactive whiteboard and chat features for seamless communication between teachers and students.
                                            </p>
                                        </div>
                                        <div className="p-6 rounded-lg border bg-card hover:bg-card/80 transition-colors">
                                            <h3 className="text-xl font-medium mb-3">Video Conferencing</h3>
                                            <p className="text-muted-foreground">
                                                High-quality video calls with screen sharing capabilities for an immersive learning experience.
                                            </p>
                                        </div>
                                        <div className="p-6 rounded-lg border bg-card hover:bg-card/80 transition-colors">
                                            <h3 className="text-xl font-medium mb-3">Resource Sharing</h3>
                                            <p className="text-muted-foreground">
                                                Easy file sharing and resource management for course materials and assignments.
                                            </p>
                                        </div>
                                        <div className="p-6 rounded-lg border bg-card hover:bg-card/80 transition-colors">
                                            <h3 className="text-xl font-medium mb-3">Classroom Management</h3>
                                            <p className="text-muted-foreground">
                                                Efficient tools for managing virtual classrooms, attendance, and student participation.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-2xl font-semibold">Our Vision</h2>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        We envision a future where quality education knows no boundaries. Our platform aims to
                                        create an inclusive learning environment that adapts to various teaching styles and
                                        learning needs, making education more accessible and effective for everyone.
                                    </p>
                                </section>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
} 