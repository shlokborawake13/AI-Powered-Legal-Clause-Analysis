"use client";

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useToast } from "@/hooks/use-toast";
import { processQueryAction } from '@/app/actions';
import type { LLMDecisionLogicOutput } from '@/ai/flows/llm-decision-logic';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ResultsDisplay } from '@/components/ResultsDisplay';

type FormState = {
  data: LLMDecisionLogicOutput | null;
  error: string | null;
  fieldErrors?: Record<string, string[] | undefined>;
};

const initialState: FormState = {
  data: null,
  error: null,
  fieldErrors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full font-bold text-base py-6">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Send className="mr-2 h-5 w-5" />
          Analyze Clauses
        </>
      )}
    </Button>
  );
}

export default function Home() {
  const [state, formAction] = useFormState(processQueryAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error && !state.fieldErrors) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: state.error,
      });
    }
  }, [state, toast]);
  
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto">
          <Logo />
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">AI-Powered Legal Clause Analysis</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Simply paste your legal query and the full text of your document below. Our AI will semantically analyze the content to provide a clear decision, justification, and highlight the exact clauses that matter.
          </p>
        </div>

        <form action={formAction} ref={formRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card className="lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Input</CardTitle>
                <CardDescription>Enter your query and document text.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="query" className="font-bold text-base">Your Query</Label>
                    <Textarea
                      id="query"
                      name="query"
                      placeholder="e.g., 'Am I covered for a flight cancellation due to a strike?'"
                      className="min-h-[100px] text-base"
                      required
                      aria-invalid={!!state.fieldErrors?.query}
                      aria-describedby="query-error"
                    />
                    {state.fieldErrors?.query && (
                      <p id="query-error" className="text-sm text-destructive">{state.fieldErrors.query[0]}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentText" className="font-bold text-base">Document Text</Label>
                    <Textarea
                      id="documentText"
                      name="documentText"
                      placeholder="Paste the full text of your legal document, insurance policy, or contract here."
                      className="min-h-[300px] text-base"
                      required
                      aria-invalid={!!state.fieldErrors?.documentText}
                      aria-describedby="document-error"
                    />
                    {state.fieldErrors?.documentText && (
                      <p id="document-error" className="text-sm text-destructive">{state.fieldErrors.documentText[0]}</p>
                    )}
                  </div>
                  <SubmitButton />
                </div>
              </CardContent>
            </Card>

            <ResultsDisplay state={state} />
        </form>
      </main>
      <footer className="text-center p-4 border-t text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Clause Companion. All rights reserved.</p>
      </footer>
    </div>
  );
}
