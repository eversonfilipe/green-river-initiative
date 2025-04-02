
import React, { useEffect, useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const Articles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const { data: articlesData, isLoading, error } = useQuery({
    queryKey: ['articles', currentPage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .range((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage - 1)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Get total count for pagination
  const { data: countData } = useQuery({
    queryKey: ['articlesCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading articles",
        description: "There was a problem loading articles. Please try again.",
        variant: "destructive",
      });
      console.error("Error loading articles:", error);
    }
  }, [error]);

  const totalPages = countData ? Math.ceil(countData / articlesPerPage) : 0;

  // Placeholder articles for the UI
  const placeholderArticles = [
    {
      id: '1',
      title: "Sustainable Farming Practices in the Amazon Basin",
      content: "Learn about innovative farming techniques that allow for agricultural production while preserving forest integrity.",
      tags: ["Agriculture", "Sustainability"],
      published_at: new Date().toISOString(),
      readTime: 7
    },
    {
      id: '2',
      title: "Indigenous Knowledge and Biodiversity Conservation",
      content: "How traditional ecological knowledge from indigenous communities contributes to conservation efforts.",
      tags: ["Indigenous", "Conservation"],
      published_at: new Date().toISOString(),
      readTime: 9
    },
    {
      id: '3',
      title: "Climate Change Impacts on Amazonian Ecosystems",
      content: "Research findings on how climate change is affecting the Amazon rainforest and its unique biodiversity.",
      tags: ["Climate", "Research"],
      published_at: new Date().toISOString(),
      readTime: 12
    }
  ];

  const displayedArticles = articlesData && articlesData.length > 0 ? articlesData : placeholderArticles;

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-16">
          <section className="py-16 lg:py-24 bg-forest-50">
            <div className="container">
              <h1 className="text-3xl lg:text-4xl font-bold text-forest-800 mb-6 text-center title-accent mx-auto w-fit">
                Knowledge Hub
              </h1>
              <p className="text-center text-forest-600 max-w-2xl mx-auto mb-12">
                Discover our latest articles and research on sustainable development, conservation, and the Amazon rainforest ecosystem.
              </p>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-forest-600" />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedArticles.map((article) => (
                    <Card key={article.id} className="eco-card overflow-hidden">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={`https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=800&q=80`} 
                          alt={article.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                        />
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex gap-2 mb-2 flex-wrap">
                          {article.tags ? article.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="bg-forest-100 text-forest-700 hover:bg-forest-200">
                              {tag}
                            </Badge>
                          )) : (
                            <>
                              <Badge variant="secondary" className="bg-forest-100 text-forest-700 hover:bg-forest-200">
                                Conservation
                              </Badge>
                              <Badge variant="secondary" className="bg-forest-100 text-forest-700 hover:bg-forest-200">
                                Research
                              </Badge>
                            </>
                          )}
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <CardDescription className="line-clamp-2">
                          {article.content.substring(0, 120)}...
                        </CardDescription>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-forest-600">
                          <BookOpen className="h-4 w-4" />
                          <span>{article.readTime || Math.floor(Math.random() * 10) + 5} min read</span>
                        </div>
                        <Link to={`/articles/${article.id}`} className="text-forest-600 hover:text-forest-800 text-sm font-medium flex items-center gap-1">
                          Read more
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            isActive={currentPage === page}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default Articles;
