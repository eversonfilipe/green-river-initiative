
import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Loader2, Plus, Edit, FileEdit, Eye, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Articles = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const canManageArticles = isAuthenticated && (user?.role === 'admin' || user?.role === 'volunteer');

  const { data: articlesData, isLoading, error, refetch } = useQuery({
    queryKey: ['articles', currentPage, user?.role],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
        .range((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage - 1);
      
      // If user is not admin or volunteer, only show published articles
      if (!canManageArticles) {
        query = query.eq('status', 'published');
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });

  // Get total count for pagination
  const { data: countData } = useQuery({
    queryKey: ['articlesCount', user?.role],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });
      
      // If user is not admin or volunteer, only count published articles
      if (!canManageArticles) {
        query = query.eq('status', 'published');
      }
      
      const { count, error } = await query;
      
      if (error) throw error;
      return count || 0;
    }
  });

  const handleDeleteArticle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Article deleted",
        description: "The article has been successfully deleted.",
      });
      
      refetch();
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error deleting article",
        description: "There was a problem deleting the article. Please try again.",
        variant: "destructive",
      });
    }
  };

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
      read_time: 7,
      status: 'published'
    },
    {
      id: '2',
      title: "Indigenous Knowledge and Biodiversity Conservation",
      content: "How traditional ecological knowledge from indigenous communities contributes to conservation efforts.",
      tags: ["Indigenous", "Conservation"],
      published_at: new Date().toISOString(),
      read_time: 9,
      status: 'published'
    },
    {
      id: '3',
      title: "Climate Change Impacts on Amazonian Ecosystems",
      content: "Research findings on how climate change is affecting the Amazon rainforest and its unique biodiversity.",
      tags: ["Climate", "Research"],
      published_at: new Date().toISOString(),
      read_time: 12,
      status: 'published'
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
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-forest-800 title-accent mx-auto w-fit">
                  Knowledge Hub
                </h1>
                {canManageArticles && (
                  <Button 
                    onClick={() => navigate('/articles/new')} 
                    className="bg-forest-600 hover:bg-forest-700"
                  >
                    <Plus className="mr-2 h-4 w-4" /> New Article
                  </Button>
                )}
              </div>
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
                    <Card key={article.id} className={`eco-card overflow-hidden ${article.status === 'draft' ? 'border-dashed border-2 border-amber-400' : ''}`}>
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={`https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=800&q=80`} 
                          alt={article.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                        />
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {article.status === 'draft' && (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                              Draft
                            </Badge>
                          )}
                          {article.tags && article.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="bg-forest-100 text-forest-700 hover:bg-forest-200">
                              {tag}
                            </Badge>
                          ))}
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
                          <span>{article.read_time || Math.floor(Math.random() * 10) + 5} min read</span>
                        </div>
                        
                        {canManageArticles ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <FileEdit className="h-4 w-4 mr-1" /> Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/articles/${article.id}`}>
                                  <Eye className="h-4 w-4 mr-2" /> View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/articles/edit/${article.id}`}>
                                  <Edit className="h-4 w-4 mr-2" /> Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteArticle(article.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <Link to={`/articles/${article.id}`} className="text-forest-600 hover:text-forest-800 text-sm font-medium flex items-center gap-1">
                            Read more
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        )}
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
