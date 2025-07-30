'use client';

import { useFormStatus } from 'react-dom';
import type { LLMDecisionLogicOutput } from '@/ai/flows/llm-decision-logic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, FileText, CircleDollarSign, CheckCircle2 } from 'lucide-react';

type FormState = {
  data: LLMDecisionLogicOutput | null;
  error: string | null;
  fieldErrors?: Record<string, string[] | undefined>;
};

type ResultsDisplayProps = {
  state: FormState;
};

const LoadingSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </CardContent>
  </Card>
);

const InitialState = () => (
    <Card className="flex flex-col items-center justify-center text-center p-8 h-full min-h-[500px] border-dashed">
        <CardHeader>
            <div className="mx-auto bg-secondary p-4 rounded-full">
                <Lightbulb className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl mt-4">Awaiting Your Input</CardTitle>
            <CardDescription>
                Your analysis results will appear here once you submit a query and document.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
                The AI provides a clear decision, justification, and the exact clauses used.
            </p>
        </CardContent>
    </Card>
);


export function ResultsDisplay({ state }: ResultsDisplayProps) {
  const { pending } = useFormStatus();
  const { data } = state;

  if (pending) {
    return <LoadingSkeleton />;
  }

  if (!data) {
    return <InitialState />;
  }

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <CheckCircle2 className="text-green-500 h-7 w-7" />
          Analysis Complete
        </CardTitle>
        <CardDescription>Here is the breakdown of the AI's findings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium text-muted-foreground">Decision</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xl font-bold font-headline text-foreground">{data.decision}</p>
                </CardContent>
            </Card>
            {data.amount != null && (
                 <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-center gap-2 text-muted-foreground">
                            <CircleDollarSign className="h-5 w-5" />
                            Amount
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-bold font-headline text-foreground">${data.amount.toLocaleString()}</p>
                    </CardContent>
                </Card>
            )}
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Justification
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">{data.justification}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Referenced Clauses
                </CardTitle>
                <CardDescription>
                    These are the specific clauses from your document that support the decision.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {data.mappedClauses && data.mappedClauses.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                        {data.mappedClauses.map((clause, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-left hover:no-underline text-base">
                                <span className="font-medium">Clause {index + 1}</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <blockquote className="border-l-4 border-primary pl-4 py-2 bg-secondary/50 text-secondary-foreground text-base">
                                    {clause}
                                </blockquote>
                            </AccordionContent>
                        </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <p className="text-muted-foreground">No specific clauses were mapped.</p>
                )}
            </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
