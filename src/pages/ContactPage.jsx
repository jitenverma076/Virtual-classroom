import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AppContext';
import { Loader2, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import { Footer } from '@/components/Footer';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const { toast } = useToast();
    const { user } = useAuth();

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            message: ''
        });
        setIsSubmitted(false);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const docRef = await addDoc(collection(db, 'contact_submissions'), {
                ...formData,
                userId: user?.uid || null,
                timestamp: new Date().toISOString()
            });

            if (!docRef?.id) {
                throw new Error('Failed to submit message');
            }

            setIsSubmitted(true);
            toast({
                title: 'Success!',
                description: 'Your message has been sent successfully. We will get back to you soon.',
                duration: 5000,
            });

            // Reset form after a delay to show success state
            setTimeout(resetForm, 3000);

        } catch (error) {
            console.error('Contact submission error:', error);
            setError('Failed to send message. Please try again.');
            toast({
                title: 'Error',
                description: 'Failed to send message. Please try again.',
                variant: 'destructive',
                duration: 5000,
            });
        } finally {
            // Delay setting isLoading to false to prevent UI flicker
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Get in Touch Section */}
                    <div className="bg-card rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold mb-8">Get in Touch</h2>
                        <div className="space-y-8">
                            <div className="flex items-start space-x-4 p-4 hover:bg-muted/50 rounded-lg transition-colors">
                                <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                                    <MapPin className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-medium mb-2">Location</h3>
                                    <p className="text-muted-foreground">
                                        Bangalore, Karnataka<br />
                                        India
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 p-4 hover:bg-muted/50 rounded-lg transition-colors">
                                <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                                    <Phone className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-medium mb-2">Phone</h3>
                                    <p className="text-muted-foreground">+91 98765-43210</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 p-4 hover:bg-muted/50 rounded-lg transition-colors">
                                <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                                    <Mail className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-medium mb-2">Email</h3>
                                    <p className="text-muted-foreground">support@virtualclassroom.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-card rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
                        {error && (
                            <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg">
                                {error}
                            </div>
                        )}
                        {isSubmitted ? (
                            <div className="flex flex-col items-center justify-center space-y-4 py-8">
                                <CheckCircle className="h-16 w-16 text-green-500" />
                                <h3 className="text-xl font-semibold">Message Sent!</h3>
                                <p className="text-center text-muted-foreground">
                                    Thank you for contacting us. We'll get back to you soon.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={resetForm}
                                    className="mt-4"
                                >
                                    Send Another Message
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Input
                                        placeholder="Your Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                        className="bg-background"
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="email"
                                        placeholder="Your Email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                        className="bg-background"
                                    />
                                </div>
                                <div>
                                    <Textarea
                                        placeholder="Your Message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                        className="min-h-[150px] bg-background"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading || !formData.name || !formData.email || !formData.message}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
} 