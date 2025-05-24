// budget-optimization-suggestions.ts
'use server';

/**
 * @fileOverview AI agent that analyzes spending patterns and provides budget optimization suggestions.
 *
 * - getBudgetOptimizationSuggestions - A function that retrieves budget optimization suggestions based on spending data.
 * - BudgetOptimizationSuggestionsInput - The input type for the getBudgetOptimizationSuggestions function.
 * - BudgetOptimizationSuggestionsOutput - The return type for the getBudgetOptimizationSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetOptimizationSuggestionsInputSchema = z.object({
  spendingData: z
    .string()
    .describe(
      'A JSON string containing the user historical spending data, including categories, amounts, and dates. Example: [{\