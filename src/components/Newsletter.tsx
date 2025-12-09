import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Đăng ký thành công!",
        description: "Cảm ơn bạn đã đăng ký nhận tin tức từ Lữ đoàn 72.",
      });
      setEmail("");
    }
  };

  return (
    <section className="bg-cream-dark py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-xl mx-auto">
          <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="text-card" size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-4">
            Đăng ký nhận tin tức
          </h2>
          <p className="text-muted-foreground mb-8">
            Nhận thông tin cập nhật mới nhất về hoạt động của Lữ đoàn 72 qua email
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-card border-border"
              required
            />
            <Button type="submit" className="whitespace-nowrap">
              Đăng ký
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
