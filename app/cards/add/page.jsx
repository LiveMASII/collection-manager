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

const cardSchema = z.object({
  name: z.string().min(1, 'Card name is required'),
  set: z.string().min(1, 'Set name is required'),
  condition: z.string().min(1, 'Condition is required'),
  price: z.string().min(1, 'Price is required').refine(val => !isNaN(parseFloat(val)), {
    message: 'Price must be a valid number',
  }),
  type: z.string().min(1, 'Card type is required'),
  rarity: z.string().optional(),
  image: z.string().optional(),
});

export default function AddCard() {
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
    resolver: zodResolver(cardSchema),
    defaultValues: {
      condition: 'Near Mint',
      type: 'Pokemon',
      rarity: 'Common',
      image: '/images/default-card.jpg'
    }
  });

  const watchType = watch('type');
  const watchCondition = watch('condition');

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
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
          user: user.username
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success('Card added to collection successfully');
        router.push('/cards');
      } else {
        toast.error(result.message || 'Failed to add card');
      }
    } catch (error) {
      console.error('Error adding card:', error);
      toast.error('An error occurred while adding the card');
    } finally {
      setIsSubmitting(false);
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
          <Link href="/cards">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Collection
            </Button>
          </Link>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Add New Card</CardTitle>
            <CardDescription>
              Add a new card to your collection with details about its condition, value, and more.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="add-card-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="text"
                    placeholder="Enter price"
                    {...register('price')}
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">{errors.price.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rarity">Rarity</Label>
                  <Select 
                    onValueChange={(value) => setValue('rarity', value)}
                    defaultValue="Common"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rarity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Common">Common</SelectItem>
                      <SelectItem value="Uncommon">Uncommon</SelectItem>
                      <SelectItem value="Rare">Rare</SelectItem>
                      <SelectItem value="Ultra Rare">Ultra Rare</SelectItem>
                      <SelectItem value="Secret Rare">Secret Rare</SelectItem>
                      <SelectItem value="Promo">Promo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push('/cards')}>Cancel</Button>
            <Button type="submit" form="add-card-form" disabled={isSubmitting}>
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
                  Save Card
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}