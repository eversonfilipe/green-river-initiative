
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Loader2, Lock, Users, FileText, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      navigate('/');
      toast({
        title: "Access denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
    } else if (!isAuthenticated) {
      navigate('/');
      toast({
        title: "Authentication required",
        description: "You must be logged in as an admin to access this page.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch volunteer requests
  const { 
    data: requests, 
    isLoading: requestsLoading, 
    error: requestsError, 
    refetch: refetchRequests
  } = useQuery({
    queryKey: ['admin-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_requests')
        .select(`
          *,
          user:user_id (
            id,
            full_name,
            email,
            created_at
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated && user?.role === 'admin',
  });

  // Fetch users
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          profile:profiles (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated && user?.role === 'admin',
  });

  // Fetch articles
  const {
    data: articles,
    isLoading: articlesLoading,
    error: articlesError,
  } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          author:author_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated && user?.role === 'admin',
  });

  // Handle request approval/rejection
  const handleRequestAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const request = requests?.find(req => req.id === id);
      if (!request) return;

      // Update request status
      const { error: updateError } = await supabase
        .from('admin_requests')
        .update({ 
          status: action === 'approve' ? 'approved' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (updateError) throw updateError;

      // If approved, update user role
      if (action === 'approve') {
        const { error: userError } = await supabase
          .from('users')
          .update({ 
            role: request.role,
            updated_at: new Date().toISOString()
          })
          .eq('id', request.user_id);
        
        if (userError) throw userError;
      }
      
      toast({
        title: `Request ${action === 'approve' ? 'approved' : 'rejected'}`,
        description: `The volunteer request has been ${action === 'approve' ? 'approved' : 'rejected'} successfully.`,
      });
      
      refetchRequests();
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast({
        title: `Error ${action === 'approve' ? 'approving' : 'rejecting'} request`,
        description: `There was a problem ${action === 'approve' ? 'approving' : 'rejecting'} the request. Please try again.`,
        variant: "destructive",
      });
    }
  };

  // Generate avatar for user
  const getAvatarUrl = (userId: string, profile: any) => {
    if (!profile) return '';
    
    const baseUrl = `https://api.dicebear.com/7.x/personas/svg`;
    const params = new URLSearchParams({
      seed: userId,
      backgroundColor: profile.avatar_background || 'blue',
      skinTone: profile.avatar_skin || 'medium',
      clothing: profile.avatar_clothing || 'casual',
      gender: profile.avatar_gender || 'neutral',
    });
    
    return `${baseUrl}?${params.toString()}`;
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (!isAuthenticated || (isAuthenticated && user?.role !== 'admin')) {
    return (
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow pt-16">
            <div className="container py-16">
              <div className="text-center">
                <Lock className="mx-auto h-16 w-16 text-forest-300 mb-4" />
                <h1 className="text-3xl font-bold text-forest-800 mb-2">Access Denied</h1>
                <p className="text-forest-600 mb-6">You don't have permission to access the admin dashboard.</p>
                <Button asChild>
                  <a href="/">Go to Homepage</a>
                </Button>
              </div>
            </div>
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
          <div className="container py-16">
            <h1 className="text-3xl font-bold text-forest-800 mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{users?.length || 0}</div>
                  <p className="text-forest-600 text-sm">Total registered users</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{articles?.length || 0}</div>
                  <p className="text-forest-600 text-sm">Total published and draft articles</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Pending Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {requests?.filter(req => req.status === 'pending').length || 0}
                  </div>
                  <p className="text-forest-600 text-sm">Volunteer requests awaiting approval</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="requests">
              <TabsList className="mb-8">
                <TabsTrigger value="requests" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Volunteer Requests</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                </TabsTrigger>
                <TabsTrigger value="articles" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Articles</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="requests">
                <Card>
                  <CardHeader>
                    <CardTitle>Volunteer Requests</CardTitle>
                    <CardDescription>
                      Manage volunteer role requests from users.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {requestsLoading ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-forest-600" />
                      </div>
                    ) : requestsError ? (
                      <div className="text-center py-12">
                        <p className="text-red-500">Error loading requests. Please try again.</p>
                      </div>
                    ) : !requests?.length ? (
                      <div className="text-center py-12">
                        <p className="text-forest-600">No volunteer requests found.</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {requests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                      {getInitials(request.user?.full_name || '')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{request.user?.full_name || 'Unknown'}</div>
                                    <div className="text-sm text-forest-500">{request.user?.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-forest-100 text-forest-700">
                                  {request.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {request.created_at 
                                  ? format(new Date(request.created_at), 'MMM d, yyyy')
                                  : 'Unknown'
                                }
                              </TableCell>
                              <TableCell>
                                {(() => {
                                  switch (request.status) {
                                    case 'pending':
                                      return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">Pending</Badge>;
                                    case 'approved':
                                      return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">Approved</Badge>;
                                    case 'rejected':
                                      return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">Rejected</Badge>;
                                    default:
                                      return <Badge variant="outline">Unknown</Badge>;
                                  }
                                })()}
                              </TableCell>
                              <TableCell className="text-right">
                                {request.status === 'pending' && (
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => handleRequestAction(request.id, 'approve')}
                                      className="bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => handleRequestAction(request.id, 'reject')}
                                      className="bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      View all registered users in the system.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {usersLoading ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-forest-600" />
                      </div>
                    ) : usersError ? (
                      <div className="text-center py-12">
                        <p className="text-red-500">Error loading users. Please try again.</p>
                      </div>
                    ) : !users?.length ? (
                      <div className="text-center py-12">
                        <p className="text-forest-600">No users found.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Created</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={getAvatarUrl(user.id, user.profile)} />
                                      <AvatarFallback>
                                        {getInitials(user.full_name || '')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="font-medium">{user.full_name || 'Unnamed User'}</div>
                                  </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  <Badge className={user.role === 'admin' 
                                    ? 'bg-purple-100 text-purple-700' 
                                    : user.role === 'volunteer'
                                      ? 'bg-forest-100 text-forest-700'
                                      : 'bg-blue-100 text-blue-700'
                                  }>
                                    {user.role || 'user'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {user.created_at 
                                    ? format(new Date(user.created_at), 'MMM d, yyyy')
                                    : 'Unknown'
                                  }
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="articles">
                <Card>
                  <CardHeader>
                    <CardTitle>Article Management</CardTitle>
                    <CardDescription>
                      View all articles in the system, including drafts.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {articlesLoading ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-forest-600" />
                      </div>
                    ) : articlesError ? (
                      <div className="text-center py-12">
                        <p className="text-red-500">Error loading articles. Please try again.</p>
                      </div>
                    ) : !articles?.length ? (
                      <div className="text-center py-12">
                        <p className="text-forest-600">No articles found.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Title</TableHead>
                              <TableHead>Author</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Published</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {articles.map((article) => (
                              <TableRow key={article.id}>
                                <TableCell>
                                  <div className="font-medium line-clamp-1">{article.title}</div>
                                  {article.tags && article.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {article.tags.slice(0, 2).map((tag: string) => (
                                        <Badge key={tag} variant="outline" className="text-xs py-0 px-1">
                                          {tag}
                                        </Badge>
                                      ))}
                                      {article.tags.length > 2 && (
                                        <Badge variant="outline" className="text-xs py-0 px-1">
                                          +{article.tags.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{article.author?.full_name || 'Unknown'}</div>
                                  <div className="text-sm text-forest-500">{article.author?.email}</div>
                                </TableCell>
                                <TableCell>
                                  {article.status === 'published' ? (
                                    <Badge className="bg-green-100 text-green-700">Published</Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                                      Draft
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {article.published_at 
                                    ? format(new Date(article.published_at), 'MMM d, yyyy')
                                    : 'Not published'
                                  }
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => navigate(`/articles/${article.id}`)}
                                    >
                                      View
                                    </Button>
                                    <Button 
                                      size="sm"
                                      onClick={() => navigate(`/articles/edit/${article.id}`)}
                                    >
                                      Edit
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default AdminDashboard;
