
'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Edit2, Trash2, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import type { Budget } from '@/lib/types';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AddBudgetForm, type AddBudgetFormInputs } from '@/components/budgets/AddBudgetForm';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";

// Placeholder data
const initialBudgets: Budget[] = [
  { id: '1', userId: 'user1', category: 'Food & Dining', limit: 500, spentAmount: 350, startDate: '2024-07-01', endDate: '2024-07-31', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', userId: 'user1', category: 'Entertainment', limit: 200, spentAmount: 120, startDate: '2024-07-01', endDate: '2024-07-31', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', userId: 'user1', category: 'Shopping', limit: 300, spentAmount: 310, startDate: '2024-07-01', endDate: '2024-07-31', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };
  
  const handleSaveBudget = async (data: AddBudgetFormInputs) => {
    setFormLoading(true);
    try {
      // In a real app, you would save to Firestore here.
      // For now, we'll simulate an async operation and add to local state.
      await new Promise(resolve => setTimeout(resolve, 500)); 

      const newBudget: Budget = {
        id: String(Date.now()), // Temporary ID
        userId: user?.uid || 'user1', // Use actual user ID or placeholder
        category: data.category,
        limit: data.limit,
        spentAmount: 0, // New budgets start with 0 spent
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setBudgets(prev => [newBudget, ...prev].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setIsAddDialogOpen(false); 
      toast({
          title: "Budget Created",
          description: `Budget for ${data.category} has been successfully created.`,
      });
    } catch (error) {
      console.error("Failed to save budget:", error);
      toast({
          title: "Error",
          description: "Could not save budget. Please try again.",
          variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditBudget = (id: string) => {
    console.log('Edit budget:', id);
    toast({
        title: "Edit Action",
        description: "Edit budget functionality is not yet implemented.",
        variant: "destructive"
    });
  };

  const handleDeleteBudget = (id: string) => {
    console.log('Delete budget:', id);
    setBudgets(prev => prev.filter(b => b.id !== id));
    toast({
        title: "Budget Deleted",
        description: "The budget has been removed.",
    });
  };


  return (
    <>
      <PageHeader
        title="Budgets"
        description="Manage your spending limits and track progress."
        actions={
          <Button onClick={handleOpenAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Budget
          </Button>
        }
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              Define a spending limit for a category over a period of time.
            </DialogDescription>
          </DialogHeader>
          <AddBudgetForm
            onSubmit={handleSaveBudget}
            onCancel={() => setIsAddDialogOpen(false)}
            isLoading={formLoading}
          />
        </DialogContent>
      </Dialog>


      {budgets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const progress = budget.limit > 0 ? Math.min((budget.spentAmount / budget.limit) * 100, 100) : 0;
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Period: {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                  </p>
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
          <Button onClick={handleOpenAddDialog}>
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
