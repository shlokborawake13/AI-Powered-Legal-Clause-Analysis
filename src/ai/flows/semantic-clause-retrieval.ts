'use server';
/**
 * @fileOverview This file implements the Semantic Clause Retrieval flow.
 *
 * It allows users to upload documents and query them to find relevant clauses using semantic search.
 *
 * @exports {
 *   semanticClauseRetrieval,
 *   SemanticClauseRetrievalInput,
 *   SemanticClauseRetrievalOutput
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SemanticClauseRetrievalInputSchema = z.object({
  query: z.string().describe('The query to search for relevant clauses.'),
  documentText: z.string().describe('The text content of the uploaded document.'),
});
export type SemanticClauseRetrievalInput = z.infer<typeof SemanticClauseRetrievalInputSchema>;

const SemanticClauseRetrievalOutputSchema = z.object({
  relevantClauses: z.array(z.string()).describe('The relevant clauses found in the document.'),
  justification: z.string().describe('The justification for why these clauses are relevant.'),
});
export type SemanticClauseRetrievalOutput = z.infer<typeof SemanticClauseRetrievalOutputSchema>;

export async function semanticClauseRetrieval(input: SemanticClauseRetrievalInput): Promise<SemanticClauseRetrievalOutput> {
  return semanticClauseRetrievalFlow(input);
}

const semanticClauseRetrievalPrompt = ai.definePrompt({
  name: 'semanticClauseRetrievalPrompt',
  input: {
    schema: SemanticClauseRetrievalInputSchema,
  },
  output: {
    schema: SemanticClauseRetrievalOutputSchema,
  },
  prompt: `You are a legal expert tasked with identifying relevant clauses in a document based on a user's query.\n\n  User Query: {{{query}}}\n  Document Text: {{{documentText}}}\n\n  Identify the clauses that are most relevant to the query and provide a justification for their relevance.\n  Return the relevant clauses and justification in the following JSON format:\n  {
    "relevantClauses": ["clause 1", "clause 2", ...],
    "justification": "Explanation of why these clauses are relevant."
  }`,
});

const semanticClauseRetrievalFlow = ai.defineFlow(
  {
    name: 'semanticClauseRetrievalFlow',
    inputSchema: SemanticClauseRetrievalInputSchema,
    outputSchema: SemanticClauseRetrievalOutputSchema,
  },
  async input => {
    const {output} = await semanticClauseRetrievalPrompt(input);
    return output!;
  }
);
