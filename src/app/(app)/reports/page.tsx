
'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart as LucideBarChart, PieChart as LucidePieChart, LineChart as LucideLineChartIcon } from 'lucide-react'; // Renamed PieChart to avoid conflict, Renamed BarChart, Renamed LineChart
import Image from 'next/image';
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, Line, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RechartsPieChart, BarChart, LineChart } from 'recharts';


// Placeholder data for charts
const spendingByCategoryData = [
  { name: 'Food', value: 400 },
  { name: 'Transport', value: 300 },
  { name: 'Entertainment', value: 200 },
  { name: 'Utilities', value: 150 },
  { name: 'Other', value: 100 },
];

const incomeVsExpenseData = [
  { month: 'Jan', income: 4000, expense: 2200 },
  { month: 'Feb', income: 3000, expense: 1900 },
  { month: 'Mar', income: 5000, expense: 2500 },
  { month: 'Apr', income: 4500, expense: 2100 },
  { month: 'May', income: 4800, expense: 2300 },
  { month: 'Jun', income: 5200, expense: 2800 },
];

const chartConfig = {
  income: { label: "Income", color: "hsl(var(--chart-1))" },
  expense: { label: "Expense", color: "hsl(var(--chart-2))" },
  food: { label: "Food", color: "hsl(var(--chart-1))" },
  transport: { label: "Transport", color: "hsl(var(--chart-2))" },
  entertainment: { label: "Entertainment", color: "hsl(var(--chart-3))" },
  utilities: { label: "Utilities", color: "hsl(var(--chart-4))" },
  other: { label: "Other", color: "hsl(var(--chart-5))" },
};


export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Financial Reports"
        description="Visualize your spending, income, and financial trends."
      />

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LucidePieChart className="mr-2 h-5 w-5 text-primary" /> Spending by Category
            </CardTitle>
            <CardDescription>Breakdown of your expenses for the current month.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-square h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name"/>} />
                  <Pie data={spendingByCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                     {spendingByCategoryData.map((entry, index) => {
                        const colorKey = entry.name.toLowerCase().replace(/ & /g, '-'); // handle "Food & Dining"
                        return <Cell key={`cell-${index}`} fill={`var(--color-${colorKey})`} />;
                      })}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LucideBarChart className="mr-2 h-5 w-5 text-primary" /> Income vs. Expense
            </CardTitle>
            <CardDescription>Comparison over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeVsExpenseData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                  <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LucideLineChartIcon className="mr-2 h-5 w-5 text-primary" /> Spending Trend
            </CardTitle>
            <CardDescription>Your overall spending trend over time.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incomeVsExpenseData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Line type="monotone" dataKey="expense" stroke="var(--color-expense)" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
             </ChartContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Spending Predictions</CardTitle>
            <CardDescription>Forecasted expenses based on your history. (Illustrative)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Our AI predicts your spending for the next quarter. This can help you plan ahead.
            </p>
            <Image src="https://placehold.co/800x300.png" alt="Spending Prediction Chart" width={800} height={300} className="rounded-md" data-ai-hint="financial forecast chart" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

