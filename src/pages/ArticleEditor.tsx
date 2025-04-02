
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, Save, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

// Define the status type explicitly
type ArticleStatus = "draft" | "published";

const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  status: z.enum(["draft", "published"]),
  read_time: z.number().min(1, "Reading time must be at least 1 minute"),
});

type ArticleFormValues = z.infer<typeof articleSchema> & {
  tags: string[];
};

const ArticleEditor = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "draft",
      read_time: 5,
      tags: [],
    },
    mode: "onChange",
  });

  // Fetch article data if editing
  const { data: articleData, isLoading, error } = useQuery({
    queryKey: ['article-edit', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  // Check if user has permission to edit
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/articles');
      toast({
        title: "Authentication required",
        description: "You must be logged in to create or edit articles.",
        variant: "destructive",
      });
    } else if (isAuthenticated && user?.role !== 'admin' && user?.role !== 'volunteer') {
      navigate('/articles');
      toast({
        title: "Permission denied",
        description: "You don't have permission to create or edit articles.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, user, navigate]);

  // Load article data into form if editing
  useEffect(() => {
    if (articleData) {
      form.reset({
        title: articleData.title,
        content: articleData.content,
        status: (articleData.status as ArticleStatus) || "draft",
        read_time: articleData.read_time || 5,
        tags: articleData.tags || [],
      });
      setTags(articleData.tags || []);
    }
  }, [articleData, form]);

  // Handle tag input
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle form submission
  const onSubmit = async (values: ArticleFormValues) => {
    try {
      const articleData = {
        title: values.title,
        content: values.content,
        status: values.status,
        read_time: values.read_time,
        tags: tags,
        author_id: user?.id,
        updated_at: new Date().toISOString(),
      };

      // Add published_at date if status is published
      if (values.status === 'published') {
        Object.assign(articleData, {
          published_at: new Date().toISOString()
        });
      }

      let response;

      if (isEditing) {
        response = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', id);
      } else {
        response = await supabase
          .from('articles')
          .insert({
            ...articleData,
            created_at: new Date().toISOString(),
          });
      }

      if (response.error) throw response.error;

      toast({
        title: isEditing ? "Article updated" : "Article created",
        description: isEditing 
          ? "Your article has been updated successfully." 
          : "Your article has been created successfully.",
      });

      navigate('/articles');
    } catch (error) {
      console.error("Error saving article:", error);
      toast({
        title: "Error saving article",
        description: "There was a problem saving your article. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isEditing && isLoading) {
    return (
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow pt-16 flex items-center justify-center">
            <div className="animate-spin h-12 w-12 border-4 border-forest-600 rounded-full border-t-transparent"></div>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-16">
          <div className="container py-16 max-w-4xl">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/articles')}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Button>

            <h1 className="text-3xl font-bold text-forest-800 mb-8">
              {isEditing ? "Edit Article" : "Create New Article"}
            </h1>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter article title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge key={tag} className="bg-forest-100 text-forest-700">
                        {tag}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveTag(tag)} 
                          className="ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      Add
                    </Button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your article content here..." 
                          {...field} 
                          rows={15}
                          className="resize-y"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="read_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reading Time (minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/articles')}
                  >
                    Cancel
                  </Button>
                  
                  <Button type="submit">
                    {form.watch("status") === "draft" ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Draft
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Publish
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default ArticleEditor;
