"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/Button";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Textarea } from "@/components/Textarea";

export function QuestionBox({
  onAsk,
}: {
  onAsk: (question: string) => Promise<void>;
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onAsk(question);
      setQuestion("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to ask question.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4 rounded-lg border border-slate-200 bg-white p-5" onSubmit={handleSubmit}>
      <ErrorMessage message={error} />
      <Textarea
        label="Ask about this codebase"
        className="min-h-32"
        placeholder="Where does this app start?"
        required
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
      />
      <Button disabled={loading || !question.trim()}>{loading ? "Asking..." : "Ask question"}</Button>
    </form>
  );
}
