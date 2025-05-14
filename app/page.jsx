import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, Layers, Heart, Shuffle, StickyNote } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Collection Tracker</h1>
          <div className="space-x-2">
            <Link href="/auth/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Track Your Collectibles with Ease
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Manage your collection, create wishlists, arrange trades, and keep notes on your collectible items.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="animate-pulse">
                Get Started <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-14 h-14 flex items-center justify-center">
                <Layers className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Collection Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Add, view, edit, and delete cards in your collection. Track name, set, condition, price and more.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="mb-4 p-3 bg-pink-100 dark:bg-pink-900 rounded-full w-14 h-14 flex items-center justify-center">
                <Heart className="h-8 w-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Wishlist Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create and manage a wishlist of items you want to collect. Set priorities and budgets.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="mb-4 p-3 bg-orange-100 dark:bg-orange-900 rounded-full w-14 h-14 flex items-center justify-center">
                <Shuffle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trade Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                List cards you want to trade and what you're looking for in return. Remove listings once trades complete.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 rounded-full w-14 h-14 flex items-center justify-center">
                <StickyNote className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Card Notes</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Leave short notes on your cards such as "needs grading" or "found at local shop" to keep track of details.
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Perfect for collectors of Pokémon cards, Yu-Gi-Oh! cards, Magic: The Gathering, comic books, and more!
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
          <p>© 2025 Collection Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}