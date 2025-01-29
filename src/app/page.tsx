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
  const [resultName, setResultName] = useState<string>("");

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

    // Canvas boyutlarını ayarla
    canvas.width = 800;
    canvas.height = 600;

    // Arka plan
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Başlık
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 36px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(resultName || "TYT Sonuçları", canvas.width / 2, 60);

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
    ctx.fillStyle = "#FFFFFF";
    const startY = 160;
    const lineHeight = 35;
    let currentY = startY;

    // Ders sonuçları
    ctx.fillText(`Türkçe: ${results.turkish.net.toFixed(2)} net`, 50, currentY);
    currentY += lineHeight;
    ctx.fillText(`Sosyal Bilimler: ${results.social.net.toFixed(2)} net`, 50, currentY);
    currentY += lineHeight;
    ctx.fillText(`Temel Matematik: ${results.math.net.toFixed(2)} net`, 50, currentY);
    currentY += lineHeight;
    ctx.fillText(`Fen Bilimleri: ${results.science.net.toFixed(2)} net`, 50, currentY);
    currentY += lineHeight * 2;

    // Bölüm sonu çizgisi
    drawHorizontalLine(currentY - lineHeight);
    currentY += lineHeight;

    // Toplam sonuç
    ctx.fillStyle = "#00FF00";
    ctx.font = "bold 26px system-ui";
    ctx.fillText(`Toplam: ${results.total.toFixed(2)} net / 120 soru`, 50, currentY);
    currentY += lineHeight;
    ctx.fillText(`Başarı Yüzdesi: %${results.percentage.toFixed(1)}`, 50, currentY);

    // Watermark
    ctx.fillStyle = "#404040";
    ctx.font = "20px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("net-hesaplama.vercel.app | github.com/umutcandev", canvas.width / 2, canvas.height - 30);

    // Canvas'ı PNG olarak indir
    const link = document.createElement("a");
    link.download = `${resultName || "tyt-sonuc"}.png`;
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
              <h2 className="text-3xl font-bold text-primary">TYT</h2>
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
                          Sonuçlarınızı daha sonra hangi denemede yaptığınızı hatırlamak için bir isim verebilirsiniz. Örneğin: "Özdebir Mart TYT" veya "345 TYT"
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
