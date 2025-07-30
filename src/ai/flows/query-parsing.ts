// This file implements the Genkit flow for parsing user queries and recognizing key entities relevant to clauses.

'use server';

/**
 * @fileOverview Parses user queries to identify key entities relevant to clauses.
 *
 * - parseQuery - A function that parses the query and returns identified entities.
 * - ParseQueryInput - The input type for the parseQuery function.
 * - ParseQueryOutput - The return type for the parseQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseQueryInputSchema = z.object({
  query: z.string().describe('The user query to parse.'),
  uploadedDocumentSummary: z.string().describe('Summary of uploaded documents for context.'),
});
export type ParseQueryInput = z.infer<typeof ParseQueryInputSchema>;

const ParseQueryOutputSchema = z.object({
  entities: z
    .array(
      z.object({
        entity: z.string().describe('The identified entity.'),
        type: z.string().describe('The type of the entity.'),
      })
    )
    .describe('The entities recognized in the query.'),
});
export type ParseQueryOutput = z.infer<typeof ParseQueryOutputSchema>;

export async function parseQuery(input: ParseQueryInput): Promise<ParseQueryOutput> {
  return parseQueryFlow(input);
}

const parseQueryPrompt = ai.definePrompt({
  name: 'parseQueryPrompt',
  input: {schema: ParseQueryInputSchema},
  output: {schema: ParseQueryOutputSchema},
  prompt: `You are an expert at identifying key entities in user queries related to legal documents. Based on the query and summary of uploaded document, extract the relevant entities. These entities will be used to find relevant clauses in the documents.

Uploaded Document Summary: {{{uploadedDocumentSummary}}}

Query: {{{query}}}

Return a JSON array of the identified entities and their types, for example:

[{
  "entity": "Breach of Contract",
  "type": "Legal Issue"
},
{
  "entity": "10000",
  "type": "Monetary Value"
}]`,
});

const parseQueryFlow = ai.defineFlow(
  {
    name: 'parseQueryFlow',
    inputSchema: ParseQueryInputSchema,
    outputSchema: ParseQueryOutputSchema,
  },
  async input => {
    const {output} = await parseQueryPrompt(input);
    return output!;
  }
);
