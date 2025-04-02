
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
import { ArrowLeft, Save, Send, Image, Plus, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { ContentEditor } from '@/components/ContentEditor';
import { Separator } from '@/components/ui/separator';

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
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "draft" as ArticleStatus,
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

  // Calculate reading time based on content length
  const calculateReadingTime = (content: string) => {
    // Average reading speed: 200 words per minute
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    return readingTime;
  };

  // Update reading time when content changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'content' && value.content) {
        const readingTime = calculateReadingTime(value.content);
        form.setValue('read_time', readingTime);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

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
      setIsSaving(true);
      
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
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing && isLoading) {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/articles')}
            className="mb-6 hover:bg-forest-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          className="w-full text-3xl sm:text-4xl font-bold focus:outline-none border-b border-transparent focus:border-forest-300 pb-2 transition-all placeholder:text-gray-400 placeholder:font-normal placeholder:text-2xl"
                          placeholder="Enter article title..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} className="bg-forest-100 text-forest-700 hover:bg-forest-200">
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
                  <div className="flex gap-2 items-center">
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
                      className="h-8 text-sm w-32 sm:w-auto"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddTag} 
                      variant="outline"
                      size="sm"
                      className="h-8"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ContentEditor 
                        value={field.value} 
                        onChange={field.onChange} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex gap-2 items-center">
                        <FormLabel className="m-0 text-sm font-medium">Status:</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-32 h-9">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="read_time"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <FormLabel className="whitespace-nowrap text-sm font-medium">Reading time:</FormLabel>
                      <div className="flex items-center border rounded-md">
                        <button
                          type="button"
                          className="px-2 py-1 border-r"
                          onClick={() => field.onChange(Math.max(1, field.value - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3">{field.value} min</span>
                        <button
                          type="button"
                          className="px-2 py-1 border-l"
                          onClick={() => field.onChange(field.value + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                />
                
                <div className="flex gap-4 ml-auto">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/articles')}
                  >
                    Cancel
                  </Button>
                  
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <div className="flex items-center">
                        <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2" />
                        Saving...
                      </div>
                    ) : form.watch("status") === "draft" ? (
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
              </div>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleEditor;
