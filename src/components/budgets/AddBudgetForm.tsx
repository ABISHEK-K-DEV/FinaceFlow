
'use client';

import type { SubmitHandler } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { DEFAULT_CATEGORIES } from '@/lib/constants';

const budgetSchema = z.object({
  category: z.string().min(1, { message: 'Category is required' }),
  limit: z.coerce.number().positive({ message: 'Limit must be a positive number' }),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date cannot be earlier than start date.",
  path: ["endDate"],
});

export type AddBudgetFormInputs = z.infer<typeof budgetSchema>;

interface AddBudgetFormProps {
  onSubmit: (data: AddBudgetFormInputs) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const expenseCategories = DEFAULT_CATEGORIES.filter(c => c.type === 'expense' || c.type === 'shared');

export function AddBudgetForm({ onSubmit, onCancel, isLoading }: AddBudgetFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AddBudgetFormInputs>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: '',
      limit: undefined,
      startDate: new Date(),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), // End of current month
    },
  });

  const handleFormSubmit: SubmitHandler<AddBudgetFormInputs> = async (data) => {
    await onSubmit(data);
    // Reset to clean slate for new budget, using the default values logic from useForm
    reset({
      category: '',
      limit: undefined,
      startDate: new Date(),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="category">Category</Label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={field.value}
            >
              <SelectTrigger id="category" className={errors.category ? 'border-destructive' : ''} aria-invalid={errors.category ? "true" : "false"}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map(cat => (
                  <SelectItem key={cat.name} value={cat.name}>
                    {cat.name} ({cat.icon ? `${cat.icon}` : ''})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
      </div>

      <div>
        <Label htmlFor="limit">Limit Amount</Label>
        <Input
          id="limit"
          type="number"
          step="0.01"
          placeholder="e.g., 500"
          {...register('limit')}
          className={errors.limit ? 'border-destructive' : ''}
          aria-invalid={errors.limit ? "true" : "false"}
        />
        {errors.limit && <p className="text-sm text-destructive mt-1">{errors.limit.message}</p>}
      </div>

      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="startDate"
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${errors.startDate ? 'border-destructive' : ''}`}
                  aria-invalid={errors.startDate ? "true" : "false"}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.startDate && <p className="text-sm text-destructive mt-1">{errors.startDate.message}</p>}
      </div>

      <div>
        <Label htmlFor="endDate">End Date</Label>
        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="endDate"
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${errors.endDate ? 'border-destructive' : ''}`}
                  aria-invalid={errors.endDate ? "true" : "false"}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.endDate && <p className="text-sm text-destructive mt-1">{errors.endDate.message}</p>}
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Save Budget'}
        </Button>
      </div>
    </form>
  );
}
