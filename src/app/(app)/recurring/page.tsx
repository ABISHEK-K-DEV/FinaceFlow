'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit2, Trash2, Play, Pause } from 'lucide-react';
import { useState } from 'react';
import type { RecurringPayment } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

// Placeholder data
const initialRecurringPayments: RecurringPayment[] = [
  { id: '1', userId: 'user1', type: 'expense', amount: 15.99, category: 'Subscriptions', description: 'Netflix', frequency: 'monthly', startDate: '2024-01-20', nextDueDate: '2024-08-20', isActive: true, createdAt: '', updatedAt: '' },
  { id: '2', userId: 'user1', type: 'income', amount: 2500.00, category: 'Salary', description: 'Monthly Paycheck', frequency: 'monthly', startDate: '2024-01-25', nextDueDate: '2024-08-25', isActive: true, createdAt: '', updatedAt: '' },
  { id: '3', userId: 'user1', type: 'expense', amount: 50.00, category: 'Utilities', description: 'Internet Bill', frequency: 'monthly', startDate: '2024-02-01', nextDueDate: '2024-08-01', isActive: true, createdAt: '', updatedAt: '' },
  { id: '4', userId: 'user1', type: 'expense', amount: 10.00, category: 'Software', description: 'Cloud Storage', frequency: 'yearly', startDate: '2024-03-15', nextDueDate: '2025-03-15', isActive: false, createdAt: '', updatedAt: '' },
];

export default function RecurringPaymentsPage() {
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>(initialRecurringPayments);

  const handleAddRecurringPayment = () => {
    console.log('Add new recurring payment');
    // Placeholder for form/modal
  };

  const handleEditRecurringPayment = (id: string) => {
    console.log('Edit recurring payment:', id);
  };

  const handleDeleteRecurringPayment = (id: string) => {
    console.log('Delete recurring payment:', id);
    setRecurringPayments(prev => prev.filter(rp => rp.id !== id));
  };

  const toggleActiveState = (id: string) => {
    setRecurringPayments(prev => 
      prev.map(rp => rp.id === id ? { ...rp, isActive: !rp.isActive } : rp)
    );
  };

  return (
    <>
      <PageHeader
        title="Recurring Payments"
        description="Manage your scheduled income and expenses."
        actions={
          <Button onClick={handleAddRecurringPayment}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Recurring Payment
          </Button>
        }
      />

      {recurringPayments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recurringPayments.map((rp) => (
            <Card key={rp.id} className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${!rp.isActive ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{rp.description}</CardTitle>
                        <CardDescription>
                            {rp.category} - ${rp.amount.toFixed(2)} / {rp.frequency}
                        </CardDescription>
                    </div>
                    <Badge variant={rp.isActive ? 'default' : 'outline'} className={rp.isActive ? 'bg-green-100 text-green-700' : 'bg-muted'}>
                        {rp.isActive ? 'Active' : 'Paused'}
                    </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Next Due: {new Date(rp.nextDueDate).toLocaleDateString()}
                </p>
                <p className={`text-lg font-semibold mt-1 ${rp.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {rp.type === 'income' ? '+' : '-'}${rp.amount.toFixed(2)}
                </p>
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => toggleActiveState(rp.id)}>
                    {rp.isActive ? <Pause className="mr-1 h-3 w-3" /> : <Play className="mr-1 h-3 w-3" />}
                    {rp.isActive ? 'Pause' : 'Resume'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditRecurringPayment(rp.id)}>
                    <Edit2 className="mr-1 h-3 w-3" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteRecurringPayment(rp.id)}>
                    <Trash2 className="mr-1 h-3 w-3" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm py-12 text-center">
          <Image src="https://placehold.co/300x200.png" alt="No recurring payments" width={300} height={200} className="mb-4 rounded-md" data-ai-hint="empty state calendar" />
          <h3 className="text-xl font-semibold mb-2">No Recurring Payments</h3>
          <p className="text-muted-foreground mb-4">
            Add payments or income that occur regularly.
          </p>
          <Button onClick={handleAddRecurringPayment}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Recurring Payment
          </Button>
        </div>
      )}
    </>
  );
}
