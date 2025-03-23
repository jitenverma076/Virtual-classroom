import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AppContext';
import { ThemeToggle } from '@/components/theme-toggle';
import { AccountDialog } from '@/components/account-dialog';
import { Button } from '@/components/ui/button';
import { Layout } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="border-b">
            <div className="container flex h-16 items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <Layout className="h-6 w-6 text-primary" />
                    <span className="text-xl font-semibold">Virtual Classroom</span>
                </Link>

                <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    {user ? (
                        <>
                            <Link to="/dashboard">
                                <Button variant="ghost">Dashboard</Button>
                            </Link>
                            <Button variant="outline" onClick={logout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <AccountDialog />
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;