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
  SortDesc,
  StickyNote,
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

export default function CardsCollection() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterType, setFilterType] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Pokemon': return '🐲';
      case 'Yu-Gi-Oh': return '👹';
      case 'Magic: The Gathering': return '✨';
      case 'Comic Book': return '📚';
      default: return '🃏';
    }
  };

  useEffect(() => {
    // Redirect if not logged in and not loading
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchCards = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/cards?user=${user.username}`);
          const data = await response.json();
          setCards(data.cards || []);
        } catch (error) {
          console.error('Error fetching cards:', error);
          toast.error('Failed to load your collection');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCards();
  }, [user]);

  const fetchNotes = async (cardId) => {
    if (!user || !cardId) return;
    
    try {
      setIsLoadingNotes(true);
      const response = await fetch(`/api/notes?cardId=${cardId}&user=${user.username}`);
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const handleAddNote = async () => {
    if (!user || !selectedCard || !newNote.trim()) return;
    
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: selectedCard._id,
          content: newNote.trim(),
          user: user.username
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setNotes([result.note, ...notes]);
        setNewNote('');
        toast.success('Note added successfully');
      } else {
        toast.error('Failed to add note');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('An error occurred');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setNotes(notes.filter(note => note._id !== noteId));
        toast.success('Note deleted successfully');
      } else {
        toast.error('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/cards/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCards(cards.filter(card => card._id !== id));
        toast.success('Card removed from collection');
      } else {
        toast.error('Failed to delete card');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('An error occurred');
    }
  };

  const filteredAndSortedCards = [...cards]
    .filter(card => {
      // Apply search filter
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          card.set.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply type filter
      const matchesType = filterType ? card.type === filterType : true;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      // Handle sorting
      if (sortField === 'price') {
        return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
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
          <h1 className="text-3xl font-bold mb-2 md:mb-0">My Collection</h1>
          
          <Link href="/cards/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Card
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
                    <DialogTitle>Filter Cards</DialogTitle>
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
                  onClick={() => handleSort('price')}
                  className={sortField === 'price' ? 'bg-gray-100 dark:bg-gray-700' : ''}
                >
                  Price
                  {sortField === 'price' && (
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
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredAndSortedCards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🃏</div>
            <h3 className="text-2xl font-medium mb-2">No cards found</h3>
            {cards.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You haven't added any cards to your collection yet.
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                No cards match your current search or filters.
              </p>
            )}
            <Link href="/cards/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Card
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedCards.map((card) => (
              <Card key={card._id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <span>{getTypeIcon(card.type)}</span>
                        <Badge variant="outline" className="text-xs">
                          {card.type}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{card.name}</CardTitle>
                    </div>
                    <Badge className={`${getConditionColor(card.condition)}`}>
                      {card.condition}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Set:</span>
                      <span className="font-medium">{card.set}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Rarity:</span>
                      <span className="font-medium">{card.rarity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Price:</span>
                      <span className="font-medium">${card.price.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-2">
                  <div className="flex gap-2">
                    <Link href={`/cards/edit/${card._id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    
                    <Dialog onOpenChange={(open) => {
                      if (open) {
                        setSelectedCard(card);
                        fetchNotes(card._id);
                      } else {
                        setSelectedCard(null);
                        setNotes([]);
                        setNewNote('');
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <StickyNote className="h-4 w-4 mr-2" />
                          Notes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Notes for {card.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Add a note..."
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              maxLength={200}
                              rows={3}
                            />
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">
                                {newNote.length}/200 characters
                              </span>
                              <Button 
                                size="sm" 
                                onClick={handleAddNote}
                                disabled={!newNote.trim()}
                              >
                                Add Note
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {isLoadingNotes ? (
                              <div className="flex justify-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                              </div>
                            ) : notes.length === 0 ? (
                              <p className="text-center text-gray-500 py-4">
                                No notes yet. Add your first note above.
                              </p>
                            ) : (
                              notes.map((note) => (
                                <div 
                                  key={note._id} 
                                  className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md space-y-2"
                                >
                                  <p className="text-sm">{note.content}</p>
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">
                                      {new Date(note.createdAt).toLocaleDateString()}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                      onClick={() => handleDeleteNote(note._id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
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
                        Are you sure you want to remove <strong>{card.name}</strong> from your collection? 
                        This action cannot be undone.
                      </p>
                      <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button 
                          variant="destructive" 
                          onClick={() => {
                            handleDelete(card._id);
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