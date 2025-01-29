"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2, Download } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";

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
  const [resultName, setResultName] = useState<string>("");

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

        // Sayısal puanı hesapla
        results.sayisal.total = results.math.net + results.physics.net + results.chemistry.net + results.biology.net;
        results.sayisal.percentage = (results.sayisal.total / 80) * 100;

        // Sözel puanı hesapla
        results.sozel.total = results.tdeSos1.net + results.socialSciences2.net;
        results.sozel.percentage = (results.sozel.total / 80) * 100;

        // Eşit ağırlık puanı hesapla
        results.esitagirlik.total = results.math.net + results.tdeSos1.net;
        results.esitagirlik.percentage = (results.esitagirlik.total / 80) * 100;

        // Dil puanı hesapla
        results.dil.total = results.foreignLanguage.net;
        results.dil.percentage = (results.dil.total / 80) * 100;

        setResults(results);
        setIsCalculating(false);

        // Mobilde sonuçlara otomatik kaydırma
        if (window.innerWidth < 768) {
          setTimeout(() => {
            const resultsElement = document.querySelector('.border-l-\\[3px\\]');
            if (resultsElement) {
              resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      }, 200);
    } catch (error) {
      console.error('Error calculating net:', error);
      setIsCalculating(false);
    }
  };

  const downloadResults = () => {
    if (!results) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas boyutlarını artır
    canvas.width = 800;
    canvas.height = 1200;

    // Arka plan
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Başlık
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 36px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(resultName || "AYT Sonuçları", canvas.width / 2, 60);

    // Tarih ve Saat
    const now = new Date();
    const dateStr = now.toLocaleDateString("tr-TR", { 
      day: "numeric", 
      month: "long", 
      year: "numeric"
    });
    const timeStr = now.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit"
    });

    ctx.font = "24px system-ui";
    ctx.fillStyle = "#808080";
    ctx.textAlign = "center";
    ctx.fillText(`${dateStr} - ${timeStr}`, canvas.width / 2, 100);

    // Yatay çizgi çizme fonksiyonu
    const drawHorizontalLine = (y: number) => {
      ctx.beginPath();
      ctx.strokeStyle = "#333333";
      ctx.lineWidth = 2;
      ctx.moveTo(50, y);
      ctx.lineTo(canvas.width - 50, y);
      ctx.stroke();
    };

    // Sonuçlar
    ctx.font = "24px system-ui";
    ctx.textAlign = "left";
    let startY = 160;
    const lineHeight = 35;
    let currentY = startY;

    // Sayısal sonuçlar
    if (results.math.correct > 0 || results.math.incorrect > 0 ||
        results.physics.correct > 0 || results.physics.incorrect > 0 ||
        results.chemistry.correct > 0 || results.chemistry.incorrect > 0 ||
        results.biology.correct > 0 || results.biology.incorrect > 0) {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px system-ui";
      ctx.fillText("Sayısal", 50, currentY);
      currentY += lineHeight;

      ctx.font = "24px system-ui";
      if (results.math.correct > 0 || results.math.incorrect > 0) {
        ctx.fillText(`Matematik: ${results.math.net.toFixed(2)} net`, 50, currentY);
        currentY += lineHeight;
      }
      if (results.physics.correct > 0 || results.physics.incorrect > 0) {
        ctx.fillText(`Fizik: ${results.physics.net.toFixed(2)} net`, 50, currentY);
        currentY += lineHeight;
      }
      if (results.chemistry.correct > 0 || results.chemistry.incorrect > 0) {
        ctx.fillText(`Kimya: ${results.chemistry.net.toFixed(2)} net`, 50, currentY);
        currentY += lineHeight;
      }
      if (results.biology.correct > 0 || results.biology.incorrect > 0) {
        ctx.fillText(`Biyoloji: ${results.biology.net.toFixed(2)} net`, 50, currentY);
        currentY += lineHeight;
      }

      ctx.fillStyle = "#00FF00";
      ctx.font = "bold 26px system-ui";
      ctx.fillText(`Sayısal Toplam: ${results.sayisal.total.toFixed(2)} net / 80 soru`, 50, currentY + lineHeight);
      ctx.fillText(`Başarı Yüzdesi: %${results.sayisal.percentage.toFixed(1)}`, 50, currentY + lineHeight * 2);
      currentY += lineHeight * 3;

      // Bölüm sonu çizgisi
      drawHorizontalLine(currentY);
      currentY += lineHeight;
    }

    // Eşit Ağırlık sonuçları
    if (results.math.correct > 0 || results.math.incorrect > 0 ||
        results.tdeSos1.correct > 0 || results.tdeSos1.incorrect > 0) {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px system-ui";
      ctx.fillText("Eşit Ağırlık", 50, currentY);
      currentY += lineHeight;

      ctx.font = "24px system-ui";
      if (results.math.correct > 0 || results.math.incorrect > 0) {
        ctx.fillText(`Matematik: ${results.math.net.toFixed(2)} net`, 50, currentY);
        currentY += lineHeight;
      }
      if (results.tdeSos1.correct > 0 || results.tdeSos1.incorrect > 0) {
        ctx.fillText(`TDE/Sosyal-1: ${results.tdeSos1.net.toFixed(2)} net`, 50, currentY);
        currentY += lineHeight;
      }

      ctx.fillStyle = "#00FF00";
      ctx.font = "bold 26px system-ui";
      ctx.fillText(`EA Toplam: ${results.esitagirlik.total.toFixed(2)} net / 80 soru`, 50, currentY + lineHeight);
      ctx.fillText(`Başarı Yüzdesi: %${results.esitagirlik.percentage.toFixed(1)}`, 50, currentY + lineHeight * 2);
      currentY += lineHeight * 3;

      // Bölüm sonu çizgisi
      drawHorizontalLine(currentY);
      currentY += lineHeight;
    }

    // Sözel sonuçları
    if (results.tdeSos1.correct > 0 || results.tdeSos1.incorrect > 0 ||
        results.socialSciences2.correct > 0 || results.socialSciences2.incorrect > 0) {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px system-ui";
      ctx.fillText("Sözel", 50, currentY);
      currentY += lineHeight;

      ctx.font = "24px system-ui";
      if (results.tdeSos1.correct > 0 || results.tdeSos1.incorrect > 0) {
        ctx.fillText(`TDE/Sosyal-1: ${results.tdeSos1.net.toFixed(2)} net`, 50, currentY);
        currentY += lineHeight;
      }
      if (results.socialSciences2.correct > 0 || results.socialSciences2.incorrect > 0) {
        ctx.fillText(`Sosyal-2: ${results.socialSciences2.net.toFixed(2)} net`, 50, currentY);
        currentY += lineHeight;
      }

      ctx.fillStyle = "#00FF00";
      ctx.font = "bold 26px system-ui";
      ctx.fillText(`Sözel Toplam: ${results.sozel.total.toFixed(2)} net / 80 soru`, 50, currentY + lineHeight);
      ctx.fillText(`Başarı Yüzdesi: %${results.sozel.percentage.toFixed(1)}`, 50, currentY + lineHeight * 2);
      currentY += lineHeight * 3;

      // Bölüm sonu çizgisi
      drawHorizontalLine(currentY);
      currentY += lineHeight;
    }

    // Dil sonuçları
    if (results.foreignLanguage.correct > 0 || results.foreignLanguage.incorrect > 0) {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px system-ui";
      ctx.fillText("Yabancı Dil", 50, currentY);
      currentY += lineHeight;

      ctx.font = "24px system-ui";
      ctx.fillText(`Yabancı Dil: ${results.foreignLanguage.net.toFixed(2)} net`, 50, currentY);
      currentY += lineHeight * 2;

      ctx.fillStyle = "#00FF00";
      ctx.font = "bold 26px system-ui";
      ctx.fillText(`Dil Toplam: ${results.dil.total.toFixed(2)} net / 80 soru`, 50, currentY);
      currentY += lineHeight;
      ctx.fillText(`Başarı Yüzdesi: %${results.dil.percentage.toFixed(1)}`, 50, currentY);
      currentY += lineHeight * 2;

      // Bölüm sonu çizgisi
      drawHorizontalLine(currentY);
    }

    // Watermark
    ctx.fillStyle = "#404040";
    ctx.font = "20px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("net-hesaplama.vercel.app | github.com/umutcandev", canvas.width / 2, canvas.height - 30);

    // Canvas'ı PNG olarak indir
    const link = document.createElement("a");
    link.download = `${resultName || "ayt-sonuc"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-8 sm:px-16 lg:px-32 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold text-primary">AYT</h2>
              <a 
                href="https://github.com/umutcandev" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground bg-muted/30 rounded-full hover:bg-muted/50 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                umutcandev
              </a>
            </div>
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
                <div className="flex items-center justify-between mb-4 pr-4">
                  <h3 className="text-lg font-semibold text-primary">Sonuçlar</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Sonuçları Kaydet
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[calc(100%-2rem)] sm:w-[28rem] rounded-lg md:rounded-xl">
                      <DialogHeader>
                        <DialogTitle>Sonuçları Kaydet</DialogTitle>
                        <DialogDescription className="mt-2">
                          Sonuçlarınızı daha sonra hangi denemede yaptığınızı hatırlamak için bir isim verebilirsiniz. Örneğin: "Özdebir Mart AYT" veya "345 AYT"
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Input
                          placeholder="Sınav ismi (isteğe bağlı)"
                          value={resultName}
                          onChange={(e) => setResultName(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <DialogFooter>
                        <Button onClick={downloadResults}>
                          <Download className="w-4 h-4 mr-2" />
                          İndir
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
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