import { PageHeader } from '@/components/shared/PageHeader';
import { DataCard } from '@/components/shared/DataCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, DollarSign, CreditCard, TrendingDown, AlertTriangle, Lightbulb, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Placeholder data - replace with actual data fetching
const summaryData = {
  balance: '$12,345.67',
  incomeThisMonth: '$5,000.00',
  expensesThisMonth: '$2,345.67',
  savingsRate: '25%',
};

const recentTransactions = [
  { id: '1', description: 'Groceries', amount: '-$75.20', date: '2024-07-28', category: 'Food' },
  { id: '2', description: 'Salary', amount: '+$2,500.00', date: '2024-07-25', category: 'Income' },
  { id: '3', description: 'Netflix Subscription', amount: '-$15.99', date: '2024-07-20', category: 'Subscription' },
];

const budgetStatus = [
  { id: '1', category: 'Food & Dining', spent: '$350', limit: '$500', progress: 70 },
  { id: '2', category: 'Entertainment', spent: '$120', limit: '$200', progress: 60 },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's your financial overview."
        actions={
          <Link href="/transactions/new" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <DataCard title="Current Balance" value={summaryData.balance} icon={DollarSign} description="Total across all accounts" />
        <DataCard title="Income This Month" value={summaryData.incomeThisMonth} icon={ArrowUpRight} description="+5.2% from last month" />
        <DataCard title="Expenses This Month" value={summaryData.expensesThisMonth} icon={TrendingDown} description="-2.1% from last month" />
        <DataCard title="Savings Rate" value={summaryData.savingsRate} icon={CreditCard} description="Your target is 30%" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Transactions */}
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentTransactions.map(tx => (
                <li key={tx.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-muted-foreground">{tx.date} - {tx.category}</p>
                  </div>
                  <span className={`font-semibold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount}
                  </span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/transactions">View All Transactions</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Budget Overview */}
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle>Budget Status</CardTitle>
            <CardDescription>Track your spending against your budgets.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {budgetStatus.map(budget => (
                <li key={budget.id}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{budget.category}</span>
                    <span className="text-sm text-muted-foreground">{budget.spent} / {budget.limit}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${budget.progress}%` }}></div>
                  </div>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/budgets">Manage Budgets</Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Spending Predictions & AI Suggestions */}
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
              AI Insights
            </CardTitle>
            <CardDescription>Personalized financial advice.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Spending Prediction</h4>
              <p className="text-sm text-muted-foreground">
                Based on your habits, you might spend an additional $300 on dining out this month.
              </p>
              <Image src="https://placehold.co/600x300.png" alt="Spending Prediction Chart" width={600} height={300} className="mt-2 rounded-md" data-ai-hint="finance chart" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Optimization Suggestion</h4>
              <p className="text-sm text-muted-foreground">
                Consider reducing your 'Entertainment' budget by 10% to meet your savings goal faster.
              </p>
              <Button variant="secondary" size="sm" className="mt-2">Explore Suggestion</Button>
            </div>
             <AlertTriangle className="h-4 w-4 text-amber-500 inline mr-1" /> 
             <span className="text-xs text-muted-foreground">AI features are illustrative.</span>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
