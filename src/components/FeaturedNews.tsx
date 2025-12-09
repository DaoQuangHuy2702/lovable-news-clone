import { Calendar, Eye, Clock, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface FeaturedNewsProps {
  article: {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    views: number;
    readTime: string;
    image: string;
  };
}

const FeaturedNews = ({ article }: FeaturedNewsProps) => {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-primary rounded-full" />
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-primary">
          Tin nổi bật
        </h2>
      </div>

      <div className="news-card grid md:grid-cols-2 gap-0 overflow-hidden">
        {/* Image */}
        <div className="relative h-64 md:h-auto bg-cream-dark">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 left-4 category-badge bg-primary text-card">
            {article.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar size={16} />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={16} />
              {article.views.toLocaleString()} lượt xem
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={16} />
              {article.readTime}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-serif font-semibold text-foreground mb-4">
            {article.title}
          </h3>

          <p className="text-muted-foreground mb-6 line-clamp-3">
            {article.excerpt}
          </p>

          <Button className="w-fit group">
            Đọc tiếp
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNews;
