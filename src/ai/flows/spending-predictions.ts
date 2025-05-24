// src/ai/flows/spending-predictions.ts
'use server';

/**
 * @fileOverview Predicts future expenses based on past spending habits.
 *
 * - predictFutureExpenses - Predicts future expenses for a user.
 * - PredictFutureExpensesInput - The input type for the predictFutureExpenses function.
 * - PredictFutureExpensesOutput - The return type for the predictFutureExpenses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictFutureExpensesInputSchema = z.object({
  spendingHistory: z
    .string()
    .describe(
      'A detailed history of the users spending, including categories and amounts.'
    ),
  forecastHorizon: z
    .string()
    .describe('The time period for which to forecast expenses (e.g., next month, next quarter).'),
});

export type PredictFutureExpensesInput = z.infer<typeof PredictFutureExpensesInputSchema>;

const PredictFutureExpensesOutputSchema = z.object({
  predictedExpenses: z
    .string()
    .describe('A detailed forecast of expenses for the specified time period.'),
  savingsSuggestions: z
    .string()
    .describe('Suggestions for areas where the user could potentially save money.'),
});

export type PredictFutureExpensesOutput = z.infer<typeof PredictFutureExpensesOutputSchema>;

export async function predictFutureExpenses(
  input: PredictFutureExpensesInput
): Promise<PredictFutureExpensesOutput> {
  return predictFutureExpensesFlow(input);
}

const predictFutureExpensesPrompt = ai.definePrompt({
  name: 'predictFutureExpensesPrompt',
  input: {schema: PredictFutureExpensesInputSchema},
  output: {schema: PredictFutureExpensesOutputSchema},
  prompt: `Analyze the users spending history and forecast their expenses for the specified time period.

Spending History: {{{spendingHistory}}}
Forecast Horizon: {{{forecastHorizon}}}

Based on this analysis, provide a detailed forecast of expenses and suggest potential areas for savings.
`, // Corrected the typo here
});

const predictFutureExpensesFlow = ai.defineFlow(
  {
    name: 'predictFutureExpensesFlow',
    inputSchema: PredictFutureExpensesInputSchema,
    outputSchema: PredictFutureExpensesOutputSchema,
  },
  async input => {
    const {output} = await predictFutureExpensesPrompt(input);
    return output!;
  }
);
