import { Sparkles, Calendar, MapPin, Users, Building2, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";



const leaders = [
  {
    name: "Đại tá Đinh Quang Huy",
    role: "Lữ đoàn trưởng",
    quote: "",
  },
  {
    name: "Đại tá Phạm Quyết Thành",
    role: "Chính ủy",
    quote: "",
  },
];

const units = [
  { name: "Chỉ huy Lữ đoàn", desc: "Chỉ huy chung toàn đơn vị", isMain: true },
  { name: "Tiểu đoàn 1", desc: "Đảm nhiệm nhiệm vụ Huấn luyện, bảo vệ bảo quản và thi công Công trình Quốc phòng" },
  { name: "Tiểu đoàn 2", desc: "Đảm nhiệm nhiệm vụ bảo vệ bảo quản và thi công Công trình Quốc phòng" },
  { name: "Tiểu đoàn 3", desc: "Đảm nhiệm nhiệm vụ bảo vệ bảo quản và thi công Công trình Quốc phòng" },
  { name: "Tiểu đoàn 4", desc: "Đảm nhiệm nhiệm vụ bảo vệ bảo quản và thi công Công trình Quốc phòng" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/hero-parade.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />

        <div className="relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/20 backdrop-blur-sm border border-border/50 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">Lực lượng tinh nhuệ</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-4">
            LỮ ĐOÀN 72
          </h1>

          <p className="text-xl md:text-2xl text-primary font-medium mb-6">
            Binh chủng Công binh
          </p>

          <p className="max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            Đơn vị anh hùng với truyền thống vẻ vang, luôn hoàn thành xuất sắc nhiệm vụ được giao,
            góp phần xây dựng và bảo vệ Tổ quốc Việt Nam xã hội chủ nghĩa.
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="pt-16 md:pt-24 pb-16 md:pb-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Lịch sử hình thành
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-elegant">
              <p className="text-foreground leading-relaxed mb-4">
                Lữ đoàn 72 - Binh chủng Công binh được thành lập vào năm 1972. Từ những ngày đầu thành lập, đơn vị đã nhanh chóng khẳng định vị thế là một trong những lực lượng Công binh quan trọng của Quân đội Nhân dân Việt Nam.
              </p>
              <p className="text-foreground leading-relaxed">
                Trải qua 53 năm chiến đấu và trưởng thành, Lữ đoàn đã không ngừng phát triển về mọi mặt từ tổ chức biên chế, trang bị, trình độ chuyên môn. Đơn vị đã vinh dự được Đảng và Nhà nước trao tặng nhiều phần thưởng cao quý.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Location Section */}
      <section className="pt-16 md:pt-24 pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Địa bàn đóng quân
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-elegant">
              <img
                src="/dia-ban-dong-quan.jpg"
                alt="Cán bộ chiến sĩ Lữ đoàn 72 tại địa bàn đóng quân"
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-serif font-semibold text-foreground">Cơ sở hiện đại</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Lữ đoàn 72 với đặc thù đơn vị phân tán, đóng quân trên nhiều tỉnh, đảm nhiệm nhiều nhiệm vụ khác nhau. Hiện nay, sở chỉ huy Lữ đoàn đang đóng quân trên địa bàn Xã An Nghĩa, Tỉnh Phú Thọ.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span className="text-foreground">Khu vực huấn luyện rộng rãi với đầy đủ trang thiết bị</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span className="text-foreground">Khu nhà ở và sinh hoạt khang trang, hiện đại</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span className="text-foreground">Cảnh quan xanh mát, môi trường sống trong lành</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold mb-4">
              Chỉ huy Lữ đoàn
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {leaders.map((leader) => (
              <div key={leader.name} className="bg-card rounded-2xl p-8 shadow-elegant flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gold flex items-center justify-center mb-6 shadow-lg">
                  <Users className="w-12 h-12 text-card" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-3">{leader.name}</h3>
                <span className="inline-block px-6 py-1.5 rounded-full bg-gold text-card text-sm font-semibold mb-4">
                  {leader.role}
                </span>
                {leader.quote && (
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{leader.quote}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organization Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold mb-4">
              Tổ chức biên chế
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="max-w-5xl mx-auto px-4">
            {/* Main command */}
            <div className="mb-10">
              <div className="bg-card border-2 border-gold rounded-2xl p-8 shadow-sm text-center max-w-3xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-gold mb-2">{units[0].name}</h3>
                <p className="text-muted-foreground">{units[0].desc}</p>
              </div>
            </div>

            {/* Subordinate units */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {units.slice(1).map((unit) => (
                <div key={unit.name} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-elegant transition-all flex flex-col items-start text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-6 h-6 text-gold shrink-0" />
                    <h4 className="font-serif font-bold text-foreground text-lg">{unit.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{unit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
