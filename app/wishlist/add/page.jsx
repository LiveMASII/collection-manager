'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/components/providers/AuthProvider';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

const wishlistSchema = z.object({
  name: z.string().min(1, 'Card name is required'),
  set: z.string().min(1, 'Set name is required'),
  condition: z.string().min(1, 'Condition is required'),
  maxPrice: z.string().min(1, 'Max price is required').refine(val => !isNaN(parseFloat(val)), {
    message: 'Max price must be a valid number',
  }),
  type: z.string().min(1, 'Card type is required'),
  priority: z.number().min(1).max(5).optional(),
});

export default function AddWishlistItem() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(wishlistSchema),
    defaultValues: {
      condition: 'Any',
      type: 'Pokemon',
      priority: 3
    }
  });

  const watchType = watch('type');
  const watchCondition = watch('condition');
  const watchPriority = watch('priority');

  useEffect(() => {
    // Redirect if not logged in and not loading
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const onSubmit = async (data) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          maxPrice: parseFloat(data.maxPrice),
          user: user.username
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success('Item added to wishlist successfully');
        router.push('/wishlist');
      } else {
        toast.error(result.message || 'Failed to add item');
      }
    } catch (error) {
      console.error('Error adding wishlist item:', error);
      toast.error('An error occurred while adding the item');
    } finally {
      setIsSubmitting(false);
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
        <div className="mb-6">
          <Link href="/wishlist">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Wishlist
            </Button>
          </Link>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Add Wishlist Item</CardTitle>
            <CardDescription>
              Add a new item to your wishlist with details about what you're looking for.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="add-wishlist-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Card Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter card name"
                    {...register('name')}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="set">Set Name</Label>
                  <Input
                    id="set"
                    placeholder="Enter set name"
                    {...register('set')}
                    className={errors.set ? 'border-red-500' : ''}
                  />
                  {errors.set && (
                    <p className="text-red-500 text-sm">{errors.set.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Card Type</Label>
                  <Select 
                    onValueChange={(value) => setValue('type', value)} 
                    defaultValue={watchType}
                  >
                    <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pokemon">Pokémon</SelectItem>
                      <SelectItem value="Yu-Gi-Oh">Yu-Gi-Oh!</SelectItem>
                      <SelectItem value="Magic: The Gathering">Magic: The Gathering</SelectItem>
                      <SelectItem value="Comic Book">Comic Book</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-red-500 text-sm">{errors.type.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select 
                    onValueChange={(value) => setValue('condition', value)}
                    defaultValue={watchCondition}
                  >
                    <SelectTrigger className={errors.condition ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">Any Condition</SelectItem>
                      <SelectItem value="Mint">Mint</SelectItem>
                      <SelectItem value="Near Mint">Near Mint</SelectItem>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.condition && (
                    <p className="text-red-500 text-sm">{errors.condition.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Max Budget ($)</Label>
                  <Input
                    id="maxPrice"
                    type="text"
                    placeholder="Enter maximum price"
                    {...register('maxPrice')}
                    className={errors.maxPrice ? 'border-red-500' : ''}
                  />
                  {errors.maxPrice && (
                    <p className="text-red-500 text-sm">{errors.maxPrice.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    onValueChange={(value) => setValue('priority', parseInt(value))}
                    defaultValue={watchPriority?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Critical</SelectItem>
                      <SelectItem value="2">2 - High</SelectItem>
                      <SelectItem value="3">3 - Medium</SelectItem>
                      <SelectItem value="4">4 - Low</SelectItem>
                      <SelectItem value="5">5 - Optional</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Current priority: {getPriorityLabel(watchPriority)}
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push('/wishlist')}>Cancel</Button>
            <Button type="submit" form="add-wishlist-form" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Item
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}