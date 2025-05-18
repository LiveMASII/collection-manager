'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Heart, Plus, Shuffle, StickyNote, PlusCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    cards: 0,
    wishlist: 0,
    trades: 0
  });

  useEffect(() => {
    // Redirect if not logged in and not loading
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // Fetch statistics
      const fetchStats = async () => {
        try {
          const [cardsRes, wishlistRes, tradesRes] = await Promise.all([
            fetch('/api/cards/count'),
            fetch('/api/wishlist/count'),
            fetch('/api/trades/count')
          ]);
          
          const [cardsData, wishlistData, tradesData] = await Promise.all([
            cardsRes.json(),
            wishlistRes.json(),
            tradesRes.json()
          ]);
          
          setStats({
            cards: cardsData.count,
            wishlist: wishlistData.count,
            trades: tradesData.count
          });
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      };
      
      fetchStats();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.username}!</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your collection, wishlist, and trades from this dashboard.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Layers className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                Collection
              </CardTitle>
              <CardDescription>Manage your collectible cards</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.cards}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">cards in collection</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/cards">
                <Button variant="outline">View All</Button>
              </Link>
              <Link href="/cards/add">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Card
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-pink-600 dark:text-pink-400" />
                Wishlist
              </CardTitle>
              <CardDescription>Track cards you want to acquire</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.wishlist}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">items in wishlist</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/wishlist">
                <Button variant="outline">View All</Button>
              </Link>
              <Link href="/wishlist/add">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Shuffle className="mr-2 h-5 w-5 text-orange-600 dark:text-orange-400" />
                Trades
              </CardTitle>
              <CardDescription>Manage your trade listings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.trades}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">active trade listings</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/trades">
                <Button variant="outline">View All</Button>
              </Link>
              <Link href="/trades/add">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Listing
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/cards/add">
                  <Button variant="outline" className="w-full justify-start">
                    <PlusCircle className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Add to Collection
                  </Button>
                </Link>
                <Link href="/wishlist/add">
                  <Button variant="outline" className="w-full justify-start">
                    <PlusCircle className="mr-2 h-4 w-4 text-pink-600 dark:text-pink-400" />
                    Add to Wishlist
                  </Button>
                </Link>
                <Link href="/trades/add">
                  <Button variant="outline" className="w-full justify-start">
                    <PlusCircle className="mr-2 h-4 w-4 text-orange-600 dark:text-orange-400" />
                    Create Trade Listing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}