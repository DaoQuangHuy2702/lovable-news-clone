import { useState } from "react";
import { Trophy, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const quizQuestions = [
  {
    question: "Lữ đoàn 72 thuộc Binh chủng nào của Quân đội Nhân dân Việt Nam?",
    options: ["Binh chủng Tăng thiết giáp", "Binh chủng Công binh", "Binh chủng Pháo binh", "Binh chủng Thông tin"],
    correctAnswer: 1,
  },
  {
    question: "Lữ đoàn 72 được thành lập vào năm nào?",
    options: ["1970", "1975", "1980", "1985"],
    correctAnswer: 1,
  },
  {
    question: "Khẩu hiệu truyền thống của Binh chủng Công binh là gì?",
    options: [
      "Quyết chiến quyết thắng",
      "Đi trước mở đường - Về sau thắng lợi",
      "Trung thành - Dũng cảm",
      "Chủ động - Sáng tạo",
    ],
    correctAnswer: 1,
  },
  {
    question: "Lữ đoàn 72 được phong tặng danh hiệu Anh hùng Lực lượng vũ trang vào năm nào?",
    options: ["1975", "1980", "1985", "1990"],
    correctAnswer: 1,
  },
  {
    question: "Nhiệm vụ chính của Binh chủng Công binh là gì?",
    options: [
      "Chiến đấu trên không",
      "Xây dựng công trình, mở đường, rà phá bom mìn",
      "Vận tải quân sự",
      "Thông tin liên lạc",
    ],
    correctAnswer: 1,
  },
  {
    question: "Lữ đoàn 72 đạt danh hiệu Đơn vị Quyết thắng vào năm nào?",
    options: ["2015", "2018", "2020", "2022"],
    correctAnswer: 2,
  },
];

const Games = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 10);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameFinished(false);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQuestion];

  const getOptionStyle = (index: number) => {
    if (!showResult) {
      return "bg-card hover:bg-secondary border-border hover:border-primary/50";
    }
    if (index === question.correctAnswer) {
      return "bg-green-50 border-green-500 text-green-700";
    }
    if (index === selectedAnswer && index !== question.correctAnswer) {
      return "bg-red-50 border-red-500 text-red-700";
    }
    return "bg-card border-border opacity-50";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Mini Game
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground">
            Tìm hiểu về Lữ đoàn 72 - Binh chủng Công binh
          </p>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          {!gameFinished ? (
            <div className="max-w-2xl mx-auto">
              {/* Progress Card */}
              <div className="bg-card rounded-xl p-5 shadow-sm mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-muted-foreground">Tiến trình</span>
                  <span className="text-sm font-medium text-foreground">
                    Câu {currentQuestion + 1}/{quizQuestions.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2 mb-4" />
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-foreground">Điểm: {score}</span>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-card rounded-xl p-6 shadow-elegant">
                <span className="inline-block px-3 py-1.5 rounded-full bg-primary text-card text-sm font-medium mb-4">
                  Câu hỏi {currentQuestion + 1}
                </span>
                
                <h2 className="text-xl md:text-2xl font-serif font-semibold text-foreground mb-6">
                  {question.question}
                </h2>

                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectAnswer(index)}
                      disabled={showResult}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${getOptionStyle(index)}`}
                    >
                      <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-foreground shrink-0">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showResult && index === question.correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {showResult && index === selectedAnswer && index !== question.correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </button>
                  ))}
                </div>

                {showResult && (
                  <Button onClick={handleNextQuestion} className="w-full mt-6">
                    {currentQuestion < quizQuestions.length - 1 ? "Câu tiếp theo" : "Xem kết quả"}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="max-w-md mx-auto text-center">
              <div className="bg-card rounded-2xl p-8 shadow-elegant">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                  Hoàn thành!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Bạn đã trả lời đúng {score / 10}/{quizQuestions.length} câu hỏi
                </p>
                <div className="text-5xl font-serif font-bold text-primary mb-6">
                  {score} điểm
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  {score >= 50 ? "Xuất sắc! Bạn hiểu rõ về Lữ đoàn 72." : "Hãy tìm hiểu thêm về Lữ đoàn 72 nhé!"}
                </p>
                <Button onClick={handleRestart} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Chơi lại
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Games;
