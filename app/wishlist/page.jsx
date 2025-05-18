'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import Header from '@/components/layout/Header';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Loader2, 
  Filter, 
  SortAsc, 
  SortDesc 
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export default function Wishlist() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('priority');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterType, setFilterType] = useState('');

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleSort = (field) => {
    if (sortField === field) {
      toggleSortDirection();
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Pokemon': return '🐲';
      case 'Yu-Gi-Oh': return '👹';
      case 'Magic: The Gathering': return '✨';
      case 'Comic Book': return '📚';
      default: return '🃏';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 2: return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 3: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 4: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 5: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 1: return 'Critical';
      case 2: return 'High';
      case 3: return 'Medium';
      case 4: return 'Low';
      case 5: return 'Optional';
      default: return 'Medium';
    }
  };

  useEffect(() => {
    // Redirect if not logged in and not loading
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/wishlist?user=${user.username}`);
          const data = await response.json();
          setWishlistItems(data.wishlistItems || []);
        } catch (error) {
          console.error('Error fetching wishlist:', error);
          toast.error('Failed to load your wishlist');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchWishlist();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/wishlist/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setWishlistItems(wishlistItems.filter(item => item._id !== id));
        toast.success('Item removed from wishlist');
      } else {
        toast.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
      toast.error('An error occurred');
    }
  };

  const filteredAndSortedItems = [...wishlistItems]
    .filter(item => {
      // Apply search filter
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.set.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply type filter
      const matchesType = filterType ? item.type === filterType : true;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      // Handle sorting
      if (sortField === 'maxPrice') {
        return sortDirection === 'asc' ? a.maxPrice - b.maxPrice : b.maxPrice - a.maxPrice;
      } else if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortField === 'priority') {
        return sortDirection === 'asc' 
          ? a.priority - b.priority
          : b.priority - a.priority;
      } else { // createdAt
        return sortDirection === 'asc' 
          ? new Date(a.createdAt) - new Date(b.createdAt) 
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold mb-2 md:mb-0">My Wishlist</h1>
          
          <Link href="/wishlist/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by name or set..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter size={18} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Filter Wishlist</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Card Type</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge 
                          variant={filterType === '' ? 'default' : 'outline'} 
                          className="cursor-pointer"
                          onClick={() => setFilterType('')}
                        >
                          All
                        </Badge>
                        <Badge 
                          variant={filterType === 'Pokemon' ? 'default' : 'outline'} 
                          className="cursor-pointer"
                          onClick={() => setFilterType('Pokemon')}
                        >
                          Pokémon
                        </Badge>
                        <Badge 
                          variant={filterType === 'Yu-Gi-Oh' ? 'default' : 'outline'} 
                          className="cursor-pointer"
                          onClick={() => setFilterType('Yu-Gi-Oh')}
                        >
                          Yu-Gi-Oh!
                        </Badge>
                        <Badge 
                          variant={filterType === 'Magic: The Gathering' ? 'default' : 'outline'} 
                          className="cursor-pointer"
                          onClick={() => setFilterType('Magic: The Gathering')}
                        >
                          Magic: The Gathering
                        </Badge>
                        <Badge 
                          variant={filterType === 'Comic Book' ? 'default' : 'outline'} 
                          className="cursor-pointer"
                          onClick={() => setFilterType('Comic Book')}
                        >
                          Comic Book
                        </Badge>
                        <Badge 
                          variant={filterType === 'Other' ? 'default' : 'outline'} 
                          className="cursor-pointer"
                          onClick={() => setFilterType('Other')}
                        >
                          Other
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DialogClose asChild>
                    <Button>Apply Filters</Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
              
              <div className="flex">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSort('name')}
                  className={sortField === 'name' ? 'bg-gray-100 dark:bg-gray-700' : ''}
                >
                  Name
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? 
                      <SortAsc className="ml-2 h-4 w-4" /> : 
                      <SortDesc className="ml-2 h-4 w-4" />
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSort('maxPrice')}
                  className={sortField === 'maxPrice' ? 'bg-gray-100 dark:bg-gray-700' : ''}
                >
                  Max Price
                  {sortField === 'maxPrice' && (
                    sortDirection === 'asc' ? 
                      <SortAsc className="ml-2 h-4 w-4" /> : 
                      <SortDesc className="ml-2 h-4 w-4" />
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSort('priority')}
                  className={sortField === 'priority' ? 'bg-gray-100 dark:bg-gray-700' : ''}
                >
                  Priority
                  {sortField === 'priority' && (
                    sortDirection === 'asc' ? 
                      <SortAsc className="ml-2 h-4 w-4" /> : 
                      <SortDesc className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-2xl font-medium mb-2">Your wishlist is empty</h3>
            {wishlistItems.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You haven't added any items to your wishlist yet.
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                No items match your current search or filters.
              </p>
            )}
            <Link href="/wishlist/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Item
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedItems.map((item) => (
              <Card key={item._id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <span>{getTypeIcon(item.type)}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </div>
                    <Badge className={`${getPriorityColor(item.priority)}`}>
                      {getPriorityLabel(item.priority)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Set:</span>
                      <span className="font-medium">{item.set}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Condition:</span>
                      <span className="font-medium">{item.condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Max Budget:</span>
                      <span className="font-medium">${item.maxPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-2">
                  <Link href={`/wishlist/edit/${item._id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                      </DialogHeader>
                      <p className="py-4">
                        Are you sure you want to remove <strong>{item.name}</strong> from your wishlist? 
                        This action cannot be undone.
                      </p>
                      <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button 
                          variant="destructive" 
                          onClick={() => {
                            handleDelete(item._id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}