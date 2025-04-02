import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Clock, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { 
  AlertDialog,
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

const ArticleView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          author:author_id (
            full_name,
            email,
            id
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const canEdit = user && (user.role === 'admin' || (user.role === 'volunteer' && user.id === article?.author_id));

  const handleDelete = async () => {
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
      
      navigate('/articles');
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error deleting article",
        description: "There was a problem deleting the article. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-forest-600 rounded-full border-t-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-16">
          <div className="container py-16">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-forest-800 mb-4">Article Not Found</h1>
              <p className="text-forest-600 mb-8">The article you are looking for does not exist or you don't have permission to view it.</p>
              <Button asChild>
                <Link to="/articles">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Articles
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <article className="py-16 bg-forest-50">
          <div className="container max-w-4xl">
            <div className="mb-8">
              <Link to="/articles" className="text-forest-600 hover:text-forest-800 flex items-center gap-1 mb-6">
                <ArrowLeft className="h-4 w-4" />
                Back to Articles
              </Link>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {article.status === 'draft' && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                    Draft
                  </Badge>
                )}
                {article.tags && article.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="bg-forest-100 text-forest-700">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-forest-800 mb-4">{article.title}</h1>
              
              <div className="flex flex-wrap gap-6 text-sm text-forest-600 mb-8">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {article.published_at 
                      ? format(new Date(article.published_at), 'MMMM d, yyyy')
                      : 'Not published yet'}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{article.read_time || Math.floor(Math.random() * 10) + 5} min read</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>By {article.author?.full_name || 'Unknown Author'}</span>
                </div>
              </div>
              
              {canEdit && (
                <div className="flex gap-2 mb-8">
                  <Button asChild variant="outline">
                    <Link to={`/articles/edit/${article.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the article.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
            
            <div className="prose prose-forest max-w-none">
              <div className="whitespace-pre-wrap">{article.content}</div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleView;
