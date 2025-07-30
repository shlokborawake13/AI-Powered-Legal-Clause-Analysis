'use server';

import { z } from 'zod';
import { semanticClauseRetrieval } from '@/ai/flows/semantic-clause-retrieval';
import { llmDecisionLogic, type LLMDecisionLogicOutput } from '@/ai/flows/llm-decision-logic';

const QuerySchema = z.object({
  query: z.string().min(10, "Query must be at least 10 characters long."),
  documentText: z.string().min(50, "Document text must be at least 50 characters long."),
});

type FormState = {
  data: LLMDecisionLogicOutput | null;
  error: string | null;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function processQueryAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawData = {
    query: formData.get('query'),
    documentText: formData.get('documentText'),
  };

  const validationResult = QuerySchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      data: null,
      error: 'Invalid input. Please check the fields.',
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { query, documentText } = validationResult.data;

  try {
    const clauseRetrievalOutput = await semanticClauseRetrieval({ query, documentText });
    
    if (!clauseRetrievalOutput || !clauseRetrievalOutput.relevantClauses || clauseRetrievalOutput.relevantClauses.length === 0) {
      return { data: null, error: 'Could not find any relevant clauses in the document for the given query.' };
    }

    const decisionLogicOutput = await llmDecisionLogic({
      query,
      retrievedClauses: clauseRetrievalOutput.relevantClauses,
    });
    
    if (!decisionLogicOutput) {
        return { data: null, error: 'Could not generate a decision based on the retrieved clauses.' };
    }

    return { data: decisionLogicOutput, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred. Please try again.';
    return { data: null, error: `Processing failed: ${errorMessage}` };
  }
}
