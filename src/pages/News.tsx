import { useState, useMemo } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import FeaturedNews from "@/components/FeaturedNews";
import NewsGrid from "@/components/NewsGrid";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { categories, featuredArticle, newsArticles } from "@/data/newsData";

const News = () => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const filteredArticles = useMemo(() => {
    if (activeCategory === "Tất cả") return newsArticles;
    return newsArticles.filter((article) => article.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <FeaturedNews article={featuredArticle} />
        <NewsGrid articles={filteredArticles} />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default News;
