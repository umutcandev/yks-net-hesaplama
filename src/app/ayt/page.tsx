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

interface AYTScores {
  math: SubjectScores;
  physics: SubjectScores;
  chemistry: SubjectScores;
  biology: SubjectScores;
  tdeSos1: SubjectScores;
  socialSciences2: SubjectScores;
  foreignLanguage: SubjectScores;
}

interface SubjectResults {
  net: number;
  correct: number;
  incorrect: number;
}

interface AYTResults {
  math: SubjectResults;
  physics: SubjectResults;
  chemistry: SubjectResults;
  biology: SubjectResults;
  tdeSos1: SubjectResults;
  socialSciences2: SubjectResults;
  foreignLanguage: SubjectResults;
  sayisal: {
    total: number;
    percentage: number;
  };
  sozel: {
    total: number;
    percentage: number;
  };
  esitagirlik: {
    total: number;
    percentage: number;
  };
  dil: {
    total: number;
    percentage: number;
  };
}

const MAX_QUESTIONS = {
  math: 40,
  physics: 14,
  chemistry: 13,
  biology: 13,
  tdeSos1: 40,
  socialSciences2: 40,
  foreignLanguage: 80,
} as const;

export default function AYT() {
  const [scores, setScores] = useState<AYTScores>({
    math: { correct: 0, incorrect: 0 },
    physics: { correct: 0, incorrect: 0 },
    chemistry: { correct: 0, incorrect: 0 },
    biology: { correct: 0, incorrect: 0 },
    tdeSos1: { correct: 0, incorrect: 0 },
    socialSciences2: { correct: 0, incorrect: 0 },
    foreignLanguage: { correct: 0, incorrect: 0 },
  });

  const [results, setResults] = useState<AYTResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (
    subject: keyof AYTScores,
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
        math: { correct: 0, incorrect: 0 },
        physics: { correct: 0, incorrect: 0 },
        chemistry: { correct: 0, incorrect: 0 },
        biology: { correct: 0, incorrect: 0 },
        tdeSos1: { correct: 0, incorrect: 0 },
        socialSciences2: { correct: 0, incorrect: 0 },
        foreignLanguage: { correct: 0, incorrect: 0 },
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

        const results: AYTResults = {
          math: {
            correct: scores.math.correct,
            incorrect: scores.math.incorrect,
            net: calculateSubjectNet(scores.math.correct, scores.math.incorrect),
          },
          physics: {
            correct: scores.physics.correct,
            incorrect: scores.physics.incorrect,
            net: calculateSubjectNet(scores.physics.correct, scores.physics.incorrect),
          },
          chemistry: {
            correct: scores.chemistry.correct,
            incorrect: scores.chemistry.incorrect,
            net: calculateSubjectNet(scores.chemistry.correct, scores.chemistry.incorrect),
          },
          biology: {
            correct: scores.biology.correct,
            incorrect: scores.biology.incorrect,
            net: calculateSubjectNet(scores.biology.correct, scores.biology.incorrect),
          },
          tdeSos1: {
            correct: scores.tdeSos1.correct,
            incorrect: scores.tdeSos1.incorrect,
            net: calculateSubjectNet(scores.tdeSos1.correct, scores.tdeSos1.incorrect),
          },
          socialSciences2: {
            correct: scores.socialSciences2.correct,
            incorrect: scores.socialSciences2.incorrect,
            net: calculateSubjectNet(scores.socialSciences2.correct, scores.socialSciences2.incorrect),
          },
          foreignLanguage: {
            correct: scores.foreignLanguage.correct,
            incorrect: scores.foreignLanguage.incorrect,
            net: calculateSubjectNet(scores.foreignLanguage.correct, scores.foreignLanguage.incorrect),
          },
          sayisal: {
            total: 0,
            percentage: 0,
          },
          sozel: {
            total: 0,
            percentage: 0,
          },
          esitagirlik: {
            total: 0,
            percentage: 0,
          },
          dil: {
            total: 0,
            percentage: 0,
          },
        };

        // Sayısal puan hesaplama (Matematik + Fen Bilimleri)
        const sayisalNet = results.math.net + results.physics.net + results.chemistry.net + results.biology.net;
        results.sayisal.total = sayisalNet;
        results.sayisal.percentage = (sayisalNet / 80) * 100;

        // Sözel puan hesaplama (TDE/SOS1 + Sosyal-2)
        const sozelNet = results.tdeSos1.net + results.socialSciences2.net;
        results.sozel.total = sozelNet;
        results.sozel.percentage = (sozelNet / 80) * 100;

        // Eşit Ağırlık puan hesaplama (Matematik + TDE/SOS1)
        const esitagirlikNet = results.math.net + results.tdeSos1.net;
        results.esitagirlik.total = esitagirlikNet;
        results.esitagirlik.percentage = (esitagirlikNet / 80) * 100;

        // Dil puanı hesaplama (Yabancı Dil)
        const dilNet = results.foreignLanguage.net;
        results.dil.total = dilNet;
        results.dil.percentage = (dilNet / 80) * 100;
        
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
            <h2 className="text-3xl font-bold text-primary">AYT</h2>
            <p className="text-muted-foreground">
              Alan Yeterlilik Testi puanını hesaplamak istediğiniz öğrencinin sınav bölümlerinde doğru ve yanlış
              cevaplamış olduğu soru sayılarını girdikten sonra net hesapla butonuna basınız.
            </p>
          </div>

          {/* Sayısal Bölüm */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">Sayısal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Matematik */}
              <div className="rounded-xl border border-primary/10 bg-background p-4">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-base font-medium">Matematik</h3>
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

              {/* Fizik */}
              <div className="rounded-xl border border-primary/10 bg-background p-4">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-base font-medium">Fizik</h3>
                  <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                    {MAX_QUESTIONS.physics} Soru
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={0}
                      max={MAX_QUESTIONS.physics}
                      value={scores.physics.correct || ""}
                      onChange={(e) => handleInputChange("physics", "correct", e.target.value)}
                      className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                      placeholder="Doğru"
                    />
                  </div>
                  <span className="text-muted-foreground">/</span>
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={0}
                      max={MAX_QUESTIONS.physics}
                      value={scores.physics.incorrect || ""}
                      onChange={(e) => handleInputChange("physics", "incorrect", e.target.value)}
                      className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                      placeholder="Yanlış"
                    />
                  </div>
                </div>
              </div>

              {/* Kimya */}
              <div className="rounded-xl border border-primary/10 bg-background p-4">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-base font-medium">Kimya</h3>
                  <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                    {MAX_QUESTIONS.chemistry} Soru
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={0}
                      max={MAX_QUESTIONS.chemistry}
                      value={scores.chemistry.correct || ""}
                      onChange={(e) => handleInputChange("chemistry", "correct", e.target.value)}
                      className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                      placeholder="Doğru"
                    />
                  </div>
                  <span className="text-muted-foreground">/</span>
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={0}
                      max={MAX_QUESTIONS.chemistry}
                      value={scores.chemistry.incorrect || ""}
                      onChange={(e) => handleInputChange("chemistry", "incorrect", e.target.value)}
                      className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                      placeholder="Yanlış"
                    />
                  </div>
                </div>
              </div>

              {/* Biyoloji */}
              <div className="rounded-xl border border-primary/10 bg-background p-4">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-base font-medium">Biyoloji</h3>
                  <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                    {MAX_QUESTIONS.biology} Soru
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={0}
                      max={MAX_QUESTIONS.biology}
                      value={scores.biology.correct || ""}
                      onChange={(e) => handleInputChange("biology", "correct", e.target.value)}
                      className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                      placeholder="Doğru"
                    />
                  </div>
                  <span className="text-muted-foreground">/</span>
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={0}
                      max={MAX_QUESTIONS.biology}
                      value={scores.biology.incorrect || ""}
                      onChange={(e) => handleInputChange("biology", "incorrect", e.target.value)}
                      className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                      placeholder="Yanlış"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Eşit Ağırlık Bölüm */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">Eşit Ağırlık</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Matematik */}
              <div className="rounded-xl border border-primary/10 bg-background p-4">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-base font-medium">Matematik</h3>
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

              {/* TDE/SOS1 */}
              <div className="rounded-xl border border-primary/10 bg-background p-4">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-base font-medium">
                    <span className="hidden md:inline">Türk Dili ve Edebiyatı - Sosyal Bilimler 1</span>
                    <span className="md:hidden">Türk Dili ve Ed...</span>
                  </h3>
                  <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                    {MAX_QUESTIONS.tdeSos1} Soru
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={0}
                      max={MAX_QUESTIONS.tdeSos1}
                      value={scores.tdeSos1.correct || ""}
                      onChange={(e) => handleInputChange("tdeSos1", "correct", e.target.value)}
                      className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                      placeholder="Doğru"
                    />
                  </div>
                  <span className="text-muted-foreground">/</span>
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={0}
                      max={MAX_QUESTIONS.tdeSos1}
                      value={scores.tdeSos1.incorrect || ""}
                      onChange={(e) => handleInputChange("tdeSos1", "incorrect", e.target.value)}
                      className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                      placeholder="Yanlış"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sözel Bölüm */}
          <div className="space-y-4 mb-[calc(88px+2rem)] md:mb-0">
            <h2 className="text-lg font-semibold text-primary">Sözel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* TDE/SOS1 */}
              <div className="rounded-xl border border-primary/10 bg-background p-4">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-base font-medium">
                    <span className="hidden md:inline">Türk Dili ve Edebiyatı - Sosyal Bilimler 1</span>
                    <span className="md:hidden">Türk Dili ve Ed...</span>
                  </h3>
                  <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                    {MAX_QUESTIONS.tdeSos1} Soru
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={0}
                      max={MAX_QUESTIONS.tdeSos1}
                      value={scores.tdeSos1.correct || ""}
                      onChange={(e) => handleInputChange("tdeSos1", "correct", e.target.value)}
                      className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                      placeholder="Doğru"
                    />
                  </div>
                  <span className="text-muted-foreground">/</span>
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={0}
                      max={MAX_QUESTIONS.tdeSos1}
                      value={scores.tdeSos1.incorrect || ""}
                      onChange={(e) => handleInputChange("tdeSos1", "incorrect", e.target.value)}
                      className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                      placeholder="Yanlış"
                    />
                  </div>
                </div>
              </div>

              {/* Sosyal Bilimler-2 */}
              <div className="rounded-xl border border-primary/10 bg-background p-4">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-base font-medium">Sosyal Bilimler-2</h3>
                  <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                    {MAX_QUESTIONS.socialSciences2} Soru
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={0}
                      max={MAX_QUESTIONS.socialSciences2}
                      value={scores.socialSciences2.correct || ""}
                      onChange={(e) => handleInputChange("socialSciences2", "correct", e.target.value)}
                      className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                      placeholder="Doğru"
                    />
                  </div>
                  <span className="text-muted-foreground">/</span>
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={0}
                      max={MAX_QUESTIONS.socialSciences2}
                      value={scores.socialSciences2.incorrect || ""}
                      onChange={(e) => handleInputChange("socialSciences2", "incorrect", e.target.value)}
                      className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                      placeholder="Yanlış"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Yabancı Dil Bölüm */}
          <div className="space-y-4 mb-[calc(88px+2rem)] md:mb-0">
            <h2 className="text-lg font-semibold text-primary">Yabancı Dil</h2>
            <div className="grid grid-cols-1 gap-4">
              {/* Yabancı Dil */}
              <div className="rounded-xl border border-primary/10 bg-background p-4">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-base font-medium">Yabancı Dil</h3>
                  <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                    {MAX_QUESTIONS.foreignLanguage} Soru
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={0}
                      max={MAX_QUESTIONS.foreignLanguage}
                      value={scores.foreignLanguage.correct || ""}
                      onChange={(e) => handleInputChange("foreignLanguage", "correct", e.target.value)}
                      className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                      placeholder="Doğru"
                    />
                  </div>
                  <span className="text-muted-foreground">/</span>
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={0}
                      max={MAX_QUESTIONS.foreignLanguage}
                      value={scores.foreignLanguage.incorrect || ""}
                      onChange={(e) => handleInputChange("foreignLanguage", "incorrect", e.target.value)}
                      className="border-primary/10 bg-muted/30 text-left placeholder:text-muted-foreground/50 pl-3"
                      placeholder="Yanlış"
                    />
                  </div>
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
              <div className="space-y-6">
                {/* Sayısal Sonuçlar */}
                {(results.math.correct > 0 || results.math.incorrect > 0 ||
                  results.physics.correct > 0 || results.physics.incorrect > 0 ||
                  results.chemistry.correct > 0 || results.chemistry.incorrect > 0 ||
                  results.biology.correct > 0 || results.biology.incorrect > 0) && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-primary">Sayısal</h3>
                    <div className="space-y-1 px-1">
                      {(results.math.correct > 0 || results.math.incorrect > 0) && (
                        <p className="text-base">Matematik: <span className="font-bold">{results.math.net.toFixed(2)} net</span></p>
                      )}
                      {(results.physics.correct > 0 || results.physics.incorrect > 0) && (
                        <p className="text-base">Fizik: <span className="font-bold">{results.physics.net.toFixed(2)} net</span></p>
                      )}
                      {(results.chemistry.correct > 0 || results.chemistry.incorrect > 0) && (
                        <p className="text-base">Kimya: <span className="font-bold">{results.chemistry.net.toFixed(2)} net</span></p>
                      )}
                      {(results.biology.correct > 0 || results.biology.incorrect > 0) && (
                        <p className="text-base">Biyoloji: <span className="font-bold">{results.biology.net.toFixed(2)} net</span></p>
                      )}
                      <div className="mt-2 pt-2 border-t border-[#00FF00]/10">
                        <p className="text-lg">
                          Sayısal Toplam: <span className="font-bold">{results.sayisal.total.toFixed(2)} net</span> / 80 soru
                          <span className="text-muted-foreground ml-2">(%{results.sayisal.percentage.toFixed(1)})</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Eşit Ağırlık Sonuçlar */}
                {(results.math.correct > 0 || results.math.incorrect > 0 ||
                  results.tdeSos1.correct > 0 || results.tdeSos1.incorrect > 0) && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-primary">Eşit Ağırlık</h3>
                    <div className="space-y-1 px-1">
                      {(results.math.correct > 0 || results.math.incorrect > 0) && (
                        <p className="text-base">Matematik: <span className="font-bold">{results.math.net.toFixed(2)} net</span></p>
                      )}
                      {(results.tdeSos1.correct > 0 || results.tdeSos1.incorrect > 0) && (
                        <p className="text-base">
                          <span className="hidden md:inline">Türk Dili ve Edebiyatı - Sosyal Bilimler 1</span>
                          <span className="md:hidden">Türk Dili ve Ed...</span>
                          : <span className="font-bold">{results.tdeSos1.net.toFixed(2)} net</span>
                        </p>
                      )}
                      <div className="mt-2 pt-2 border-t border-[#00FF00]/10">
                        <p className="text-lg">
                          Eşit Ağırlık Toplam: <span className="font-bold">{results.esitagirlik.total.toFixed(2)} net</span> / 80 soru
                          <span className="text-muted-foreground ml-2">(%{results.esitagirlik.percentage.toFixed(1)})</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sözel Sonuçlar */}
                {(results.tdeSos1.correct > 0 || results.tdeSos1.incorrect > 0 ||
                  results.socialSciences2.correct > 0 || results.socialSciences2.incorrect > 0) && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-primary">Sözel</h3>
                    <div className="space-y-1 px-1">
                      {(results.tdeSos1.correct > 0 || results.tdeSos1.incorrect > 0) && (
                        <p className="text-base">
                          <span className="hidden md:inline">Türk Dili ve Edebiyatı - Sosyal Bilimler 1</span>
                          <span className="md:hidden">Türk Dili ve Ed...</span>
                          : <span className="font-bold">{results.tdeSos1.net.toFixed(2)} net</span>
                        </p>
                      )}
                      {(results.socialSciences2.correct > 0 || results.socialSciences2.incorrect > 0) && (
                        <p className="text-base">Sosyal Bilimler-2: <span className="font-bold">{results.socialSciences2.net.toFixed(2)} net</span></p>
                      )}
                      <div className="mt-2 pt-2 border-t border-[#00FF00]/10">
                        <p className="text-lg">
                          Sözel Toplam: <span className="font-bold">{results.sozel.total.toFixed(2)} net</span> / 80 soru
                          <span className="text-muted-foreground ml-2">(%{results.sozel.percentage.toFixed(1)})</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Yabancı Dil Sonuçlar */}
                {(results.foreignLanguage.correct > 0 || results.foreignLanguage.incorrect > 0) && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-primary">Yabancı Dil</h3>
                    <div className="space-y-1 px-1">
                      {(results.foreignLanguage.correct > 0 || results.foreignLanguage.incorrect > 0) && (
                        <p className="text-base">Yabancı Dil: <span className="font-bold">{results.foreignLanguage.net.toFixed(2)} net</span></p>
                      )}
                      <div className="mt-2 pt-2 border-t border-[#00FF00]/10">
                        <p className="text-lg">
                          Yabancı Dil Toplam: <span className="font-bold">{results.dil.total.toFixed(2)} net</span> / 80 soru
                          <span className="text-muted-foreground ml-2">(%{results.dil.percentage.toFixed(1)})</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="h-[100px] md:hidden" aria-hidden="true" />
        </div>
      </main>
    </div>
  );
} 