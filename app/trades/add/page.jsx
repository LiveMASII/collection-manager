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
import { Textarea } from '@/components/ui/textarea';
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

const tradeSchema = z.object({
  cardName: z.string().min(1, 'Card name is required'),
  set: z.string().min(1, 'Set name is required'),
  condition: z.string().min(1, 'Condition is required'),
  type: z.string().min(1, 'Card type is required'),
  lookingFor: z.string().min(1, 'Please specify what you are looking for'),
});

export default function AddTrade() {
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
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      condition: 'Near Mint',
      type: 'Pokemon',
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
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          user: user.username
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success('Trade listing created successfully');
        router.push('/trades');
      } else {
        toast.error(result.message || 'Failed to create trade listing');
      }
    } catch (error) {
      console.error('Error creating trade listing:', error);
      toast.error('An error occurred while creating the trade listing');
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
          <Link href="/trades">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Trade Listings
            </Button>
          </Link>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Add Trade Listing</CardTitle>
            <CardDescription>
              Create a new trade listing for a card you'd like to trade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="add-trade-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Card Name</Label>
                  <Input
                    id="cardName"
                    placeholder="Enter card name"
                    {...register('cardName')}
                    className={errors.cardName ? 'border-red-500' : ''}
                  />
                  {errors.cardName && (
                    <p className="text-red-500 text-sm">{errors.cardName.message}</p>
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lookingFor">Looking For</Label>
                <Textarea
                  id="lookingFor"
                  placeholder="Describe what you're looking to trade for..."
                  {...register('lookingFor')}
                  className={errors.lookingFor ? 'border-red-500' : ''}
                  rows={4}
                />
                {errors.lookingFor && (
                  <p className="text-red-500 text-sm">{errors.lookingFor.message}</p>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push('/trades')}>Cancel</Button>
            <Button type="submit" form="add-trade-form" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Listing
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}