'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlusCircle, Filter, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { Transaction } from '@/lib/types'; // Assuming you have this type
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

// Placeholder data - replace with actual data fetching and state management
const initialTransactions: Transaction[] = [
  { id: '1', userId: 'user1', type: 'expense', amount: 75.20, category: 'Food & Dining', description: 'Supermarket run', date: '2024-07-28', createdAt: '', updatedAt: '' },
  { id: '2', userId: 'user1', type: 'income', amount: 2500.00, category: 'Salary', description: 'Monthly paycheck', date: '2024-07-25', createdAt: '', updatedAt: '' },
  { id: '3', userId: 'user1', type: 'expense', amount: 15.99, category: 'Subscriptions', description: 'Netflix', date: '2024-07-20', createdAt: '', updatedAt: '' },
  { id: '4', userId: 'user1', type: 'expense', amount: 22.50, category: 'Transportation', description: 'Gasoline', date: '2024-07-19', createdAt: '', updatedAt: '' },
  { id: '5', userId: 'user1', type: 'income', amount: 300.00, category: 'Freelance', description: 'Web design project', date: '2024-07-15', createdAt: '', updatedAt: '' },
];

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions); // State for transactions

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx =>
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  const handleAddTransaction = () => {
    // Placeholder for add transaction modal/form
    console.log('Add new transaction');
    // Example: Adding a new transaction (in real app, this would come from a form)
    // const newTx: Transaction = { id: String(transactions.length + 1), userId: 'user1', type: 'expense', amount: 50, category: 'New Category', description: 'New Item', date: new Date().toISOString().split('T')[0] };
    // setTransactions(prev => [newTx, ...prev]);
  };
  
  const handleEditTransaction = (id: string) => {
    console.log('Edit transaction:', id);
  };

  const handleDeleteTransaction = (id: string) => {
    console.log('Delete transaction:', id);
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };


  return (
    <>
      <PageHeader
        title="Transactions"
        description="Manage your income and expenses."
        actions={
          <Button onClick={handleAddTransaction}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        }
      />

      <div className="mb-6 flex items-center justify-between gap-4">
        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>

      {filteredTransactions.length > 0 ? (
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{tx.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{tx.category}</Badge>
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={tx.type === 'income' ? 'default' : 'outline'} className={tx.type === 'income' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}>
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditTransaction(tx.id)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteTransaction(tx.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm py-12 text-center">
          <Image src="https://placehold.co/300x200.png" alt="No transactions" width={300} height={200} className="mb-4 rounded-md" data-ai-hint="empty state finance" />
          <h3 className="text-xl font-semibold mb-2">No Transactions Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try adjusting your search or filter." : "Get started by adding your first transaction."}
          </p>
          <Button onClick={handleAddTransaction}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        </div>
      )}
    </>
  );
}
