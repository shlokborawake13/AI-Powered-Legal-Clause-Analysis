// Implemented the LLM decision logic flow using Genkit to provide decision justification based on retrieved clauses and return a structured JSON.

'use server';
/**
 * @fileOverview Implements the LLM decision logic for decision justification based on retrieved clauses.
 *
 * - llmDecisionLogic - A function that processes the retrieved clauses and returns a structured JSON with decision and justification.
 * - LLMDecisionLogicInput - The input type for the llmDecisionLogic function.
 * - LLMDecisionLogicOutput - The return type for the llmDecisionLogic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LLMDecisionLogicInputSchema = z.object({
  query: z.string().describe('The user query.'),
  retrievedClauses: z.array(z.string()).describe('The relevant clauses retrieved from the documents.'),
});
export type LLMDecisionLogicInput = z.infer<typeof LLMDecisionLogicInputSchema>;

const LLMDecisionLogicOutputSchema = z.object({
  decision: z.string().describe('The decision made based on the query and retrieved clauses.'),
  amount: z.number().optional().describe('The payout amount, if any.'),
  justification: z.string().describe('The detailed justification for the decision, referencing specific clauses.'),
  mappedClauses: z.array(z.string()).describe('The specific clauses from the document that support the decision.'),
});
export type LLMDecisionLogicOutput = z.infer<typeof LLMDecisionLogicOutputSchema>;

export async function llmDecisionLogic(input: LLMDecisionLogicInput): Promise<LLMDecisionLogicOutput> {
  return llmDecisionLogicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'llmDecisionLogicPrompt',
  input: {schema: LLMDecisionLogicInputSchema},
  output: {schema: LLMDecisionLogicOutputSchema},
  prompt: `Based on the user query and the following clauses retrieved from the document, provide a decision, a justification, and the specific clauses that support the decision.  If there is a payout amount involved, then extract it. Make sure to include it in the response.

User Query: {{{query}}}

Retrieved Clauses:
{{#each retrievedClauses}}
- {{{this}}}
{{/each}}

Return a JSON object with the following structure:
{
  "decision": "The decision made.",
  "amount": "The payout amount if any (omit if not applicable).",
  "justification": "Detailed justification for the decision, referencing specific clauses.",
  "mappedClauses": ["List of specific clauses that support the decision"]
}
`,
});

const llmDecisionLogicFlow = ai.defineFlow(
  {
    name: 'llmDecisionLogicFlow',
    inputSchema: LLMDecisionLogicInputSchema,
    outputSchema: LLMDecisionLogicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
