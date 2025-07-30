import { config } from 'dotenv';
config();

import '@/ai/flows/semantic-clause-retrieval.ts';
import '@/ai/flows/llm-decision-logic.ts';
import '@/ai/flows/query-parsing.ts';