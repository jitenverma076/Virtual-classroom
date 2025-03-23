import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { AccountDialog } from '@/components/account-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="border-b relative">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-xl font-semibold">
                        Virtual Classroom
                    </Link>
                    <div className="hidden md:flex items-center gap-4">
                        {user && (
                            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                                Dashboard
                            </Link>
                        )}
                        <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                            About
                        </Link>
                        <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                            Contact
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>

                    <div className="hidden md:block">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon" className="relative">
                                            <User className="h-4 w-4" />
                                            {user.displayName && (
                                                <span className="sr-only">{user.displayName}</span>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        {user.displayName && (
                                            <>
                                                <div className="flex items-center justify-start gap-2 p-2">
                                                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                                <DropdownMenuSeparator />
                                            </>
                                        )}
                                        <DropdownMenuItem onClick={() => navigate('/profile')}>
                                            Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                                            Dashboard
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <AccountDialog />
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 inset-x-0 bg-background border-b shadow-lg z-50">
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        {user && (
                            <Link
                                to="/dashboard"
                                className="block text-sm text-muted-foreground hover:text-foreground"
                                onClick={closeMobileMenu}
                            >
                                Dashboard
                            </Link>
                        )}
                        <Link
                            to="/about"
                            className="block text-sm text-muted-foreground hover:text-foreground"
                            onClick={closeMobileMenu}
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            className="block text-sm text-muted-foreground hover:text-foreground"
                            onClick={closeMobileMenu}
                        >
                            Contact
                        </Link>
                        <div className="pt-4 border-t">
                            {user ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span className="text-sm">{user.displayName || user.email}</span>
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="block text-sm text-muted-foreground hover:text-foreground"
                                        onClick={closeMobileMenu}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            closeMobileMenu();
                                        }}
                                        className="text-sm text-destructive hover:text-destructive/90"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-4">
                                    <AccountDialog />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
} 