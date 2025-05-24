'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Edit2, Trash2, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import type { Budget } from '@/lib/types';
import Image from 'next/image';

// Placeholder data
const initialBudgets: Budget[] = [
  { id: '1', userId: 'user1', category: 'Food & Dining', limit: 500, spentAmount: 350, startDate: '2024-07-01', endDate: '2024-07-31', createdAt: '', updatedAt: '' },
  { id: '2', userId: 'user1', category: 'Entertainment', limit: 200, spentAmount: 120, startDate: '2024-07-01', endDate: '2024-07-31', createdAt: '', updatedAt: '' },
  { id: '3', userId: 'user1', category: 'Shopping', limit: 300, spentAmount: 310, startDate: '2024-07-01', endDate: '2024-07-31', createdAt: '', updatedAt: '' },
];

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);

  const handleCreateBudget = () => {
    console.log('Create new budget');
    // Placeholder for form/modal
  };
  
  const handleEditBudget = (id: string) => {
    console.log('Edit budget:', id);
  };

  const handleDeleteBudget = (id: string) => {
    console.log('Delete budget:', id);
    setBudgets(prev => prev.filter(b => b.id !== id));
  };


  return (
    <>
      <PageHeader
        title="Budgets"
        description="Manage your spending limits and track progress."
        actions={
          <Button onClick={handleCreateBudget}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Budget
          </Button>
        }
      />

      {budgets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const progress = Math.min((budget.spentAmount / budget.limit) * 100, 100);
            const remaining = budget.limit - budget.spentAmount;
            const isOverBudget = budget.spentAmount > budget.limit;

            return (
              <Card key={budget.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{budget.category}</CardTitle>
                      <CardDescription>
                        Limit: ${budget.limit.toFixed(2)}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditBudget(budget.id)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteBudget(budget.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className={`mb-2 ${isOverBudget ? 'progress-destructive' : ''}`} />
                  <style jsx global>{`
                    .progress-destructive .bg-primary {
                      background-color: hsl(var(--destructive));
                    }
                  `}</style>
                  <div className="flex justify-between text-sm">
                    <span>Spent: ${budget.spentAmount.toFixed(2)}</span>
                    <span className={isOverBudget ? 'text-destructive font-semibold' : 'text-muted-foreground'}>
                      {isOverBudget ? `Over: $${(-remaining).toFixed(2)}` : `Remaining: $${remaining.toFixed(2)}`}
                    </span>
                  </div>
                  {isOverBudget && (
                     <p className="text-xs text-destructive mt-1">You've exceeded your budget for {budget.category}.</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
         <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm py-12 text-center">
          <Image src="https://placehold.co/300x200.png" alt="No budgets" width={300} height={200} className="mb-4 rounded-md" data-ai-hint="empty state finance" />
          <h3 className="text-xl font-semibold mb-2">No Budgets Set</h3>
          <p className="text-muted-foreground mb-4">
            Create budgets to track your spending by category.
          </p>
          <Button onClick={handleCreateBudget}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Budget
          </Button>
        </div>
      )}

      {/* AI Budget Optimization Suggestions Placeholder */}
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
            AI Budget Optimizer
          </CardTitle>
          <CardDescription>
            Get smart suggestions to improve your budgeting strategy. (Illustrative)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Our AI is analyzing your spending patterns to provide optimization tips. Check back soon!
            For example, you could re-allocate $50 from 'Entertainment' to 'Savings' this month.
          </p>
          {/* Placeholder for AI suggestions UI */}
          <Image src="https://placehold.co/600x200.png" alt="AI budget suggestions" width={600} height={200} className="mt-4 rounded-md" data-ai-hint="ai suggestions interface"/>
        </CardContent>
      </Card>
    </>
  );
}
