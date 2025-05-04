'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { 
  Layers, 
  Heart, 
  Shuffle, 
  Menu, 
  X, 
  LogOut, 
  User
} from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const isActive = (path) => pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Layers className="h-4 w-4 mr-2" /> },
    { path: '/cards', label: 'Collection', icon: <Layers className="h-4 w-4 mr-2" /> },
    { path: '/wishlist', label: 'Wishlist', icon: <Heart className="h-4 w-4 mr-2" /> },
    { path: '/trades', label: 'Trades', icon: <Shuffle className="h-4 w-4 mr-2" /> },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Collection Tracker
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                  isActive(item.path) 
                    ? 'text-blue-600 dark:text-blue-400 font-medium' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center mr-4">
              <User className="h-5 w-5 mr-1 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-600 dark:text-gray-300">{user.username}</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 dark:text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4 pb-4">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                    isActive(item.path) 
                      ? 'text-blue-600 dark:text-blue-400 font-medium' 
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                <User className="h-5 w-5 mr-1 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-600 dark:text-gray-300">{user.username}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="w-full justify-center">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}