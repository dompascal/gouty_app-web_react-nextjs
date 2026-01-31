'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase';
import { addDiaryEntry } from '@/firebase/firestore/actions';
import { useToast } from '@/hooks/use-toast';
import type { FoodItem, PurineLevel } from '@/lib/types';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
    name: z.string().min(2, {
        message: 'Name must be at least 2 characters.',
    }),
    purines: z.coerce.number().min(0).optional().or(z.literal('')),
    purineLevel: z.enum(['Low', 'Medium', 'High', 'Very High'] as const),
    category: z.string().min(1, {
        message: 'Please select a category.',
    }),
    servingSize: z.coerce.number().min(1, {
        message: 'Serving size must be at least 1g.',
    }).default(100),
});

const PURINE_LEVELS: PurineLevel[] = ['Low', 'Medium', 'High', 'Very High'];
const CATEGORIES = [
    'Meat',
    'Seafood',
    'Vegetables',
    'Fruit',
    'Dairy',
    'Grains',
    'Beverages',
    'Legumes',
    'Nuts',
    'Other',
];

export function AddCustomEntryDialog() {
    const [open, setOpen] = useState(false);
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            purines: '',
            purineLevel: 'Low',
            category: '',
            servingSize: 100,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) return;

        try {
            const foodItem: FoodItem = {
                name: values.name,
                purines: values.purines === '' || values.purines === undefined ? null : Number(values.purines),
                purineLevel: values.purineLevel,
                category: values.category,
            };

            await addDiaryEntry(firestore, user.uid, foodItem, values.servingSize);

            toast({
                title: 'Entry added',
                description: `${values.name} has been added to your diary.`,
            });
            setOpen(false);
            form.reset();
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to add entry. Please try again.',
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Custom Entry
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Custom Entry</DialogTitle>
                    <DialogDescription>
                        Add a food item that isn't in our database.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Food Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Grandma's Stew" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {CATEGORIES.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="purineLevel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Purine Level</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {PURINE_LEVELS.map((level) => (
                                                    <SelectItem key={level} value={level}>
                                                        {level}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="purines"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Purines (mg) <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Unknown" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="servingSize"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Serving Size (g)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Adding...' : 'Add Entry'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
