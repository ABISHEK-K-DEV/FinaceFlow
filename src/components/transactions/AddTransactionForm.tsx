
'use client';

import type { SubmitHandler} from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { DEFAULT_CATEGORIES } from '@/lib/constants';
import type { Transaction } from '@/lib/types';
import { useState, useEffect } from 'react';

const transactionSchema = z.object({
  description: z.string().min(1, { message: 'Description is required' }),
  amount: z.coerce.number().positive({ message: 'Amount must be a positive number' }),
  date: z.date({ required_error: 'Date is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  type: z.enum(['income', 'expense'], { required_error: 'Type is required' }),
});

export type AddTransactionFormInputs = z.infer<typeof transactionSchema>;

interface AddTransactionFormProps {
  onSubmit: (data: AddTransactionFormInputs) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<AddTransactionFormInputs>; // For editing later
  isLoading?: boolean;
}

export function AddTransactionForm({ onSubmit, onCancel, initialData, isLoading }: AddTransactionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddTransactionFormInputs>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialData 
      ? { ...initialData, date: initialData.date ? new Date(initialData.date) : new Date() } 
      : {
          type: 'expense',
          date: new Date(),
          description: '',
          amount: undefined, // Or use a specific number like 0 if preferred for empty state
          category: '',
        },
  });

  const selectedType = watch('type');
  const [availableCategories, setAvailableCategories] = useState(() => 
    DEFAULT_CATEGORIES.filter(c => c.type === (initialData?.type || 'expense') || c.type === 'shared')
  );

  useEffect(() => {
    const newCategories = DEFAULT_CATEGORIES.filter(c => c.type === selectedType || c.type === 'shared');
    setAvailableCategories(newCategories);

    const currentCategoryValue = watch('category');
    if (currentCategoryValue && !newCategories.some(cat => cat.name === currentCategoryValue)) {
      setValue('category', '', { shouldValidate: true });
    }
  }, [selectedType, setValue, watch]);

  const handleFormSubmit: SubmitHandler<AddTransactionFormInputs> = async (data) => {
    await onSubmit(data);
    // Reset to clean slate for new transaction, using the default values logic from useForm
    reset({ 
      type: 'expense',
      date: new Date(),
      description: '',
      amount: undefined,
      category: '',
    }); 
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="type">Type</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value);
                // No need to call setValue for 'category' here, useEffect for selectedType handles it
              }}
              defaultValue={field.value}
              className="flex space-x-4 pt-2"
              id="type"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="type-expense" />
                <Label htmlFor="type-expense">Expense</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="type-income" />
                <Label htmlFor="type-income">Income</Label>
              </div>
            </RadioGroup>
          )}
        />
        {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          {...register('description')}
          className={errors.description ? 'border-destructive' : ''}
          aria-invalid={errors.description ? "true" : "false"}
        />
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          {...register('amount')}
          className={errors.amount ? 'border-destructive' : ''}
          aria-invalid={errors.amount ? "true" : "false"}
        />
        {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="category">Category</Label>
        <Controller
            name="category"
            control={control}
            render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value} // Ensure value is controlled
                  defaultValue={field.value}
                >
                    <SelectTrigger id="category" className={errors.category ? 'border-destructive' : ''} aria-invalid={errors.category ? "true" : "false"}>
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableCategories.map(cat => (
                            <SelectItem key={cat.name} value={cat.name}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        />
        {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${errors.date ? 'border-destructive' : ''
                    }`}
                  aria-invalid={errors.date ? "true" : "false"}
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
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Save Transaction'}
        </Button>
      </div>
    </form>
  );
}

