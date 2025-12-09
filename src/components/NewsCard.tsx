import { Calendar, Eye } from "lucide-react";

interface NewsCardProps {
  article: {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    views: number;
    image: string;
  };
}

const NewsCard = ({ article }: NewsCardProps) => {
  const categoryColors: Record<string, string> = {
    "Huấn luyện": "bg-blue-100 text-blue-700",
    "Thi đua": "bg-orange-100 text-orange-700",
    "Dân vận": "bg-green-100 text-green-700",
    "Sự kiện": "bg-purple-100 text-purple-700",
    "Đền ơn đáp nghĩa": "bg-pink-100 text-pink-700",
    "Thể thao": "bg-teal-100 text-teal-700",
    "Chính trị": "bg-red-100 text-red-700",
  };

  return (
    <article className="news-card animate-fade-in" style={{ animationDelay: `${article.id * 100}ms` }}>
      {/* Image */}
      <div className="relative h-48 bg-cream-dark overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <span className={`absolute top-3 left-3 category-badge ${categoryColors[article.category] || "bg-secondary text-secondary-foreground"}`}>
          {article.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {article.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye size={14} />
            {article.views.toLocaleString()}
          </span>
        </div>

        <h3 className="text-lg font-serif font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
          {article.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {article.excerpt}
        </p>

        <button className="text-sm font-medium text-primary hover:text-gold-dark transition-colors">
          Xem chi tiết →
        </button>
      </div>
    </article>
  );
};

export default NewsCard;
