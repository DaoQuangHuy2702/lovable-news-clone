import { useState, useEffect } from "react";
import { Trophy, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";

const Games = () => {
  const [quiz, setQuiz] = useState<any>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [showSubmission, setShowSubmission] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [timeStarted, setTimeStarted] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    rank: "",
    position: "",
    unit: "",
    phoneNumber: "",
  });

  const fetchActiveQuiz = async () => {
    try {
      const response = await api.get("/quiz/active");
      if (response.data && response.data.data) {
        setQuiz(response.data.data);
        const questions = response.data.data.questions.map((q: any) => ({
          question: q.content,
          options: q.options.map((o: any) => o.content),
          correctAnswer: q.options.findIndex((o: any) => o.isCorrect),
        }));
        setQuizQuestions(questions);
      }
    } catch (error) {
      console.error("Failed to fetch active quiz:", error);
      // We don't toast error here because it might just mean no active quiz
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveQuiz();
  }, []);

  const handleStartGame = () => {
    setTimeStarted(Date.now());
  };

  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    if (timeStarted === null) setTimeStarted(Date.now());

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

  const handleSubmitResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.rank || !formData.unit) {
      toast.error("Vui lòng điền các trường bắt buộc (*)");
      return;
    }

    setIsSubmitting(true);
    try {
      const completionTime = timeStarted ? Math.floor((Date.now() - timeStarted) / 1000) : 0;
      await api.post("/quiz/submit", {
        ...formData,
        score,
        completionTime,
        quiz: { id: quiz.id }
      });
      toast.success("Nộp kết quả thành công!");
      setShowSubmission(false);
      handleFetchLeaderboard();
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Không thể nộp kết quả. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFetchLeaderboard = async () => {
    try {
      const url = quiz?.id ? `/quiz/leaderboard?quizId=${quiz.id}` : "/quiz/leaderboard";
      const response = await api.get(url);
      if (response.data && response.data.data) {
        setLeaderboardData(response.data.data);
        setShowLeaderboard(true);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      toast.error("Không thể tải bảng xếp hạng.");
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
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-4 uppercase leading-tight">
            {quiz ? quiz.title : "CUỘC THI TÌM HIỂU TRUYỀN THỐNG"}
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground mb-6">
            {quiz ? quiz.description : "Hiện tại chưa có cuộc thi nào đang diễn ra. Vui lòng quay lại sau."}
          </p>
          {quiz && (
            <Button
              onClick={handleFetchLeaderboard}
              variant="outline"
              className="gap-2 border-primary text-primary hover:bg-primary/10 rounded-full"
            >
              <Trophy className="w-4 h-4" />
              Xem bảng xếp hạng
            </Button>
          )}
        </div>
      </section>

      {/* Quiz Section */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20 italic">Đang tải câu hỏi...</div>
          ) : !quiz || quizQuestions.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-20 border-2 border-dashed rounded-2xl bg-muted/20">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground">Chưa có bộ câu hỏi nào được kích hoạt.</p>
            </div>
          ) : !gameFinished ? (
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
                <div className="flex flex-col gap-3">
                  <Button onClick={() => setShowSubmission(true)} className="w-full">
                    Nộp kết quả
                  </Button>
                  <Button onClick={handleRestart} variant="outline" className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Chơi lại
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modals outside of conditional rendering for global accessibility */}
      <SubmissionModalComponent
        open={showSubmission}
        onOpenChange={setShowSubmission}
        formData={formData}
        setFormData={setFormData}
        handleSubmitResult={handleSubmitResult}
        isSubmitting={isSubmitting}
      />

      <LeaderboardModalComponent
        open={showLeaderboard}
        onOpenChange={setShowLeaderboard}
        leaderboardData={leaderboardData}
      />

      <Footer />
    </div>
  );
};

// Extracted for clarity and to ensure they are at the top level of the DOM when needed
const SubmissionModalComponent = ({ open, onOpenChange, formData, setFormData, handleSubmitResult, isSubmitting }: any) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Thông tin người dự thi</DialogTitle>
        <DialogDescription>
          Vui lòng điền thông tin để lưu lại kết quả của bạn.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmitResult} className="space-y-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Họ và tên <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nguyễn Văn A"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="birthDate">Ngày sinh</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e: any) => setFormData({ ...formData, birthDate: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rank">Cấp bậc, chức vụ <span className="text-red-500">*</span></Label>
            <Input
              id="rank"
              value={formData.rank}
              onChange={(e: any) => setFormData({ ...formData, rank: e.target.value })}
              placeholder="Nhập cấp bậc, chức vụ"
              required
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="unit">Đơn vị <span className="text-red-500">*</span></Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e: any) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="Tiểu đoàn 1"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            value={formData.phoneNumber}
            onChange={(e: any) => setFormData({ ...formData, phoneNumber: e.target.value })}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Đang gửi..." : "Gửi kết quả"}
        </Button>
      </form>
    </DialogContent>
  </Dialog>
);

const LeaderboardModalComponent = ({ open, onOpenChange, leaderboardData }: any) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-4xl max-h-[90vh] md:max-h-[80vh] overflow-y-auto px-4 md:px-6">
      <DialogHeader>
        <DialogTitle className="text-xl md:text-2xl font-serif font-bold text-gold text-center">BẢNG XẾP HẠNG</DialogTitle>
      </DialogHeader>

      <div className="py-4">
        {/* Desktop View: Table */}
        <div className="hidden md:block relative overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-secondary/50 font-medium text-muted-foreground">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Hạng</th>
                <th className="px-4 py-3 whitespace-nowrap">Họ và tên</th>
                <th className="px-4 py-3 whitespace-nowrap">Đơn vị</th>
                <th className="px-4 py-3 whitespace-nowrap">Điểm</th>
                <th className="px-4 py-3 whitespace-nowrap">Thời gian làm bài</th>
                <th className="px-4 py-3 whitespace-nowrap">Ngày nộp</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((item: any, index: number) => (
                <tr key={item.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-bold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span>{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : ""}</span>
                      <span>Hạng {index + 1}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-semibold whitespace-nowrap">{item.name}</div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">{item.rank}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.unit}</td>
                  <td className="px-4 py-3 font-bold text-primary whitespace-nowrap">{item.score}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{item.completionTime}s</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }).replace(/, /g, ' ') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden space-y-4">
          {leaderboardData.map((item: any, index: number) => (
            <div key={item.id} className="bg-card rounded-xl p-4 border border-border shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start border-b border-border pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : ""}</span>
                  <span className="font-bold text-primary">Hạng {index + 1}</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">{item.score} điểm</div>
                  <div className="text-xs text-muted-foreground">{item.completionTime} giây</div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-medium">Họ và tên</div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.rank}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-medium">Đơn vị</div>
                  <div>{item.unit}</div>
                </div>
                <div className="pt-2 border-t border-border mt-1">
                  <div className="text-[10px] text-muted-foreground flex justify-between">
                    <span>Ngày nộp:</span>
                    <span>
                      {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }).replace(/, /g, ' ') : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default Games;
