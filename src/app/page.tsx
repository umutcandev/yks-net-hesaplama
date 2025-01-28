"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

interface SubjectScores {
  correct: number;
  incorrect: number;
}

interface TYTScores {
  turkish: SubjectScores;
  social: SubjectScores;
  math: SubjectScores;
  science: SubjectScores;
}

interface SubjectResults {
  net: number;
  correct: number;
  incorrect: number;
}

interface TYTResults {
  turkish: SubjectResults;
  social: SubjectResults;
  math: SubjectResults;
  science: SubjectResults;
  total: number;
  percentage: number;
}

const MAX_QUESTIONS = {
  turkish: 40,
  social: 20,
  math: 40,
  science: 20,
} as const;

export default function Home() {
  const [scores, setScores] = useState<TYTScores>({
    turkish: { correct: 0, incorrect: 0 },
    social: { correct: 0, incorrect: 0 },
    math: { correct: 0, incorrect: 0 },
    science: { correct: 0, incorrect: 0 },
  });

  const [results, setResults] = useState<TYTResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (
    subject: keyof TYTScores,
    type: keyof SubjectScores,
    value: string
  ) => {
    try {
      const numValue = value === "" ? 0 : Math.max(0, parseInt(value) || 0);
      const maxQuestions = MAX_QUESTIONS[subject];

      const validatedValue = Math.min(numValue, maxQuestions);
      const otherType = type === "correct" ? "incorrect" : "correct";
      const currentOtherValue = scores[subject][otherType];
      const total = validatedValue + currentOtherValue;
      const newOtherValue = total > maxQuestions ? maxQuestions - validatedValue : currentOtherValue;

      setScores((prev) => {
        const newScores = {
          ...prev,
          [subject]: {
            ...prev[subject],
            [type]: validatedValue,
            [otherType]: newOtherValue,
          },
        };
        return newScores;
      });

      if (results) {
        setResults(null);
      }
    } catch (error) {
      console.error('Error updating scores:', error);
    }
  };

  const hasAnyInput = () => {
    return Object.values(scores).some(
      (subject) => subject.correct > 0 || subject.incorrect > 0
    );
  };

  const handleClear = () => {
    try {
      const initialScores = {
        turkish: { correct: 0, incorrect: 0 },
        social: { correct: 0, incorrect: 0 },
        math: { correct: 0, incorrect: 0 },
        science: { correct: 0, incorrect: 0 },
      };
      
      setScores(initialScores);
      if (results) {
        setResults(null);
      }
    } catch (error) {
      console.error('Error clearing scores:', error);
    }
  };

  const calculateNet = () => {
    try {
      if (!hasAnyInput() || isCalculating) {
        return;
      }

      setIsCalculating(true);

      setTimeout(() => {
        const calculateSubjectNet = (correct: number, incorrect: number): number => {
          return correct - (incorrect / 4);
        };

        const results: TYTResults = {
          turkish: {
            correct: scores.turkish.correct,
            incorrect: scores.turkish.incorrect,
            net: calculateSubjectNet(scores.turkish.correct, scores.turkish.incorrect),
          },
          social: {
            correct: scores.social.correct,
            incorrect: scores.social.incorrect,
            net: calculateSubjectNet(scores.social.correct, scores.social.incorrect),
          },
          math: {
            correct: scores.math.correct,
            incorrect: scores.math.incorrect,
            net: calculateSubjectNet(scores.math.correct, scores.math.incorrect),
          },
          science: {
            correct: scores.science.correct,
            incorrect: scores.science.incorrect,
            net: calculateSubjectNet(scores.science.correct, scores.science.incorrect),
          },
          total: 0,
          percentage: 0,
        };

        results.total = results.turkish.net + results.social.net + results.math.net + results.science.net;
        results.percentage = (results.total / 120) * 100;
        
        setResults(results);
        setIsCalculating(false);
      }, 1000);
    } catch (error) {
      console.error('Error calculating net:', error);
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-8 sm:px-16 lg:px-32 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-primary">TYT</h2>
            <p className="text-muted-foreground">
              Temel Yeterlilik Testi puanını hesaplamak istediğiniz öğrencinin sınav bölümlerinde doğru ve yanlış
              cevaplamış olduğu soru sayılarını girdikten sonra net hesapla butonuna basınız.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-[calc(88px+2rem)] md:mb-0">
            {/* Türkçe */}
            <div className="rounded-xl border border-primary/10 bg-background p-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-base font-medium">Türkçe</h3>
                <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                  {MAX_QUESTIONS.turkish} Soru
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <Input
                    type="number"
                    min={0}
                    max={MAX_QUESTIONS.turkish}
                    value={scores.turkish.correct || ""}
                    onChange={(e) => handleInputChange("turkish", "correct", e.target.value)}
                    className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                    placeholder="Doğru"
                  />
                </div>
                <span className="text-muted-foreground">/</span>
                <div className="flex-1">
                  <Input
                    type="number"
                    min={0}
                    max={MAX_QUESTIONS.turkish}
                    value={scores.turkish.incorrect || ""}
                    onChange={(e) => handleInputChange("turkish", "incorrect", e.target.value)}
                    className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                    placeholder="Yanlış"
                  />
                </div>
              </div>
            </div>

            {/* Sosyal Bilimler */}
            <div className="rounded-xl border border-primary/10 bg-background p-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-base font-medium">Sosyal Bilimler</h3>
                <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                  {MAX_QUESTIONS.social} Soru
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <Input
                    type="number"
                    min={0}
                    max={MAX_QUESTIONS.social}
                    value={scores.social.correct || ""}
                    onChange={(e) => handleInputChange("social", "correct", e.target.value)}
                    className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                    placeholder="Doğru"
                  />
                </div>
                <span className="text-muted-foreground">/</span>
                <div className="flex-1">
                  <Input
                    type="number"
                    min={0}
                    max={MAX_QUESTIONS.social}
                    value={scores.social.incorrect || ""}
                    onChange={(e) => handleInputChange("social", "incorrect", e.target.value)}
                    className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                    placeholder="Yanlış"
                  />
                </div>
              </div>
            </div>

            {/* Temel Matematik */}
            <div className="rounded-xl border border-primary/10 bg-background p-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-base font-medium whitespace-nowrap">Temel Matematik</h3>
                <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                  {MAX_QUESTIONS.math} Soru
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <Input
                    type="number"
                    min={0}
                    max={MAX_QUESTIONS.math}
                    value={scores.math.correct || ""}
                    onChange={(e) => handleInputChange("math", "correct", e.target.value)}
                    className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                    placeholder="Doğru"
                  />
                </div>
                <span className="text-muted-foreground">/</span>
                <div className="flex-1">
                  <Input
                    type="number"
                    min={0}
                    max={MAX_QUESTIONS.math}
                    value={scores.math.incorrect || ""}
                    onChange={(e) => handleInputChange("math", "incorrect", e.target.value)}
                    className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                    placeholder="Yanlış"
                  />
                </div>
              </div>
            </div>

            {/* Fen Bilimleri */}
            <div className="rounded-xl border border-primary/10 bg-background p-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-base font-medium">Fen Bilimleri</h3>
                <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                  {MAX_QUESTIONS.science} Soru
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <Input
                    type="number"
                    min={0}
                    max={MAX_QUESTIONS.science}
                    value={scores.science.correct || ""}
                    onChange={(e) => handleInputChange("science", "correct", e.target.value)}
                    className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                    placeholder="Doğru"
                  />
                </div>
                <span className="text-muted-foreground">/</span>
                <div className="flex-1">
                  <Input
                    type="number"
                    min={0}
                    max={MAX_QUESTIONS.science}
                    value={scores.science.incorrect || ""}
                    onChange={(e) => handleInputChange("science", "incorrect", e.target.value)}
                    className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                    placeholder="Yanlış"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="fixed md:relative bottom-0 left-0 right-0 md:left-auto md:right-auto p-4 md:p-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-primary/10 md:border-none flex justify-start gap-3 z-50">
            <Button 
              size="lg" 
              className="flex-1 md:flex-initial px-8 py-2 text-base bg-white text-black hover:bg-white/90 rounded-lg flex items-center gap-2 justify-center"
              onClick={calculateNet}
              disabled={!hasAnyInput() || isCalculating}
            >
              {isCalculating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Net </span>
              Hesapla
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="flex-1 md:flex-initial px-8 py-2 text-base rounded-lg"
              onClick={handleClear}
              disabled={isCalculating}
            >
              Temizle
            </Button>
          </div>

          {results && (
            <div className="border-l-[3px] border-[#00FF00]/20 pl-6 py-4 bg-[#00FF00]/[0.03]">
              <div className="space-y-2 px-1">
                <p className="text-base">TYT Türkçe: <span className="font-bold">{results.turkish.net.toFixed(2)} net</span></p>
                <p className="text-base">TYT Sosyal Bilimler: <span className="font-bold">{results.social.net.toFixed(2)} net</span></p>
                <p className="text-base">TYT Temel Matematik: <span className="font-bold">{results.math.net.toFixed(2)} net</span></p>
                <p className="text-base">TYT Fen Bilimleri: <span className="font-bold">{results.science.net.toFixed(2)} net</span></p>
              </div>
              <div className="mt-6 pt-4 px-1 border-t border-[#00FF00]/10">
                <p className="text-lg">
                  TYT Toplam: <span className="font-bold">{results.total.toFixed(2)} net</span> / 120 soru 
                  <span className="text-muted-foreground ml-2">(%{results.percentage.toFixed(1)})</span>
                </p>
              </div>
            </div>
          )}
          <div className="h-[120px] md:hidden" aria-hidden="true" />
        </div>
      </main>
    </div>
  );
}
