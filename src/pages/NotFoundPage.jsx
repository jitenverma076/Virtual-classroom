import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
            <h1 className="text-7xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
                Sorry, we couldn't find the page you're looking for. Please check the URL or return to the homepage.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => navigate(-1)}>Go Back</Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                    Return Home
                </Button>
            </div>
        </div>
    );
}