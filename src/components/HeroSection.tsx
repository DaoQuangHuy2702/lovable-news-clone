const HeroSection = () => {
  return (
    <section className="hero-bg py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <span className="inline-block px-4 py-1.5 bg-card/80 rounded-full text-sm text-muted-foreground mb-6">
          Tin tức & Sự kiện
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gradient mb-6">
          Tin Tức Lữ Đoàn 72
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Cập nhật các hoạt động, sự kiện và thành tích nổi bật của cán bộ, chiến sĩ 
          Lữ đoàn 72 - Binh chủng Công binh
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
