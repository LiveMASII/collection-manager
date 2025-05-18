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
  Trash2, 
  Loader2, 
  Filter,
  SortAsc, 
  SortDesc 
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export default function Trades() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
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

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Mint': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Near Mint': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'Excellent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Good': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Fair': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Poor': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  useEffect(() => {
    // Redirect if not logged in and not loading
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchTrades = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/trades?user=${user.username}`);
          const data = await response.json();
          setTrades(data.trades || []);
        } catch (error) {
          console.error('Error fetching trades:', error);
          toast.error('Failed to load your trades');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTrades();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/trades/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTrades(trades.filter(trade => trade._id !== id));
        toast.success('Trade listing removed');
      } else {
        toast.error('Failed to delete trade listing');
      }
    } catch (error) {
      console.error('Error deleting trade:', error);
      toast.error('An error occurred');
    }
  };

  const filteredAndSortedTrades = [...trades]
    .filter(trade => {
      // Apply search filter
      const matchesSearch = trade.cardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          trade.set.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          trade.lookingFor.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply type filter
      const matchesType = filterType ? trade.type === filterType : true;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      // Handle sorting
      if (sortField === 'cardName') {
        return sortDirection === 'asc' 
          ? a.cardName.localeCompare(b.cardName) 
          : b.cardName.localeCompare(a.cardName);
      } else if (sortField === 'condition') {
        const conditionOrder = { 'Mint': 1, 'Near Mint': 2, 'Excellent': 3, 'Good': 4, 'Fair': 5, 'Poor': 6 };
        return sortDirection === 'asc' 
          ? conditionOrder[a.condition] - conditionOrder[b.condition]
          : conditionOrder[b.condition] - conditionOrder[a.condition];
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
          <h1 className="text-3xl font-bold mb-2 md:mb-0">My Trade Listings</h1>
          
          <Link href="/trades/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Listing
            </Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by card name, set, or looking for..."
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
                    <DialogTitle>Filter Trades</DialogTitle>
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
                  onClick={() => handleSort('cardName')}
                  className={sortField === 'cardName' ? 'bg-gray-100 dark:bg-gray-700' : ''}
                >
                  Name
                  {sortField === 'cardName' && (
                    sortDirection === 'asc' ? 
                      <SortAsc className="ml-2 h-4 w-4" /> : 
                      <SortDesc className="ml-2 h-4 w-4" />
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSort('condition')}
                  className={sortField === 'condition' ? 'bg-gray-100 dark:bg-gray-700' : ''}
                >
                  Condition
                  {sortField === 'condition' && (
                    sortDirection === 'asc' ? 
                      <SortAsc className="ml-2 h-4 w-4" /> : 
                      <SortDesc className="ml-2 h-4 w-4" />
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSort('createdAt')}
                  className={sortField === 'createdAt' ? 'bg-gray-100 dark:bg-gray-700' : ''}
                >
                  Date Added
                  {sortField === 'createdAt' && (
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
        ) : filteredAndSortedTrades.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔄</div>
            <h3 className="text-2xl font-medium mb-2">No trade listings found</h3>
            {trades.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You haven't created any trade listings yet.
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                No trades match your current search or filters.
              </p>
            )}
            <Link href="/trades/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Trade Listing
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedTrades.map((trade) => (
              <Card key={trade._id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <span>{getTypeIcon(trade.type)}</span>
                        <Badge variant="outline" className="text-xs">
                          {trade.type}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{trade.cardName}</CardTitle>
                    </div>
                    <Badge className={`${getConditionColor(trade.condition)}`}>
                      {trade.condition}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Set:</span>
                      <span className="font-medium">{trade.set}</span>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400 mb-1">Looking For:</div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                        {trade.lookingFor}
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end pt-2">
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
                        Are you sure you want to remove the trade listing for <strong>{trade.cardName}</strong>? 
                        This action cannot be undone.
                      </p>
                      <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button 
                          variant="destructive" 
                          onClick={() => {
                            handleDelete(trade._id);
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