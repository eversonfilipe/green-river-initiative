
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BookOpen, Users, ArrowRight } from 'lucide-react';

const FeaturedSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-forest-50 relative overflow-hidden">
      <div className="container">
        <h2 className="text-3xl lg:text-4xl font-bold text-forest-800 mb-6 text-center title-accent mx-auto w-fit">
          Explore Our Programs
        </h2>
        
        <Tabs defaultValue="articles" className="w-full max-w-4xl mx-auto mt-10">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="articles">Latest Articles</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="articles" className="animate-fade-in">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <Card key={index} className="eco-card overflow-hidden">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {article.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-forest-100 text-forest-700 hover:bg-forest-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-forest-600">
                      <BookOpen className="h-4 w-4" />
                      <span>{article.readTime} min read</span>
                    </div>
                    <Link to="/articles" className="text-forest-600 hover:text-forest-800 text-sm font-medium flex items-center gap-1">
                      Read more
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="outline" className="border-forest-300 hover:bg-forest-50 text-forest-700" asChild>
                <Link to="/articles">View All Articles</Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="courses" className="animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              {courses.map((course, index) => (
                <Card key={index} className="eco-card flex flex-col md:flex-row overflow-hidden">
                  <div className="md:w-1/3 h-40 md:h-auto overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        className={`
                          ${course.level === 'Beginner' ? 'bg-green-100 text-green-700' : 
                          course.level === 'Intermediate' ? 'bg-amber-100 text-amber-700' : 
                          'bg-red-100 text-red-700'}
                        `}
                      >
                        {course.level}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-4 w-4 text-forest-500" />
                        <span>{course.students} enrolled</span>
                      </div>
                      <Link 
                        to="/courses" 
                        className="text-forest-600 hover:text-forest-800 text-sm font-medium flex items-center gap-1"
                      >
                        View course
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="outline" className="border-forest-300 hover:bg-forest-50 text-forest-700" asChild>
                <Link to="/courses">View All Courses</Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="events" className="animate-fade-in">
            <div className="space-y-4">
              {events.map((event, index) => (
                <Card key={index} className="eco-card overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 bg-forest-100 flex flex-col items-center justify-center p-4">
                      <div className="text-center">
                        <p className="text-sm text-forest-700 font-medium">{event.date.month}</p>
                        <p className="text-3xl font-bold text-forest-800">{event.date.day}</p>
                        <p className="text-sm text-forest-700">{event.date.year}</p>
                      </div>
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-forest-600">
                          <Calendar className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        <Link 
                          to="/events" 
                          className="text-forest-600 hover:text-forest-800 text-sm font-medium flex items-center gap-1"
                        >
                          Learn more
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="outline" className="border-forest-300 hover:bg-forest-50 text-forest-700" asChild>
                <Link to="/events">View All Events</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

const articles = [
  {
    title: "Sustainable Farming Practices in the Amazon Basin",
    excerpt: "Learn about innovative farming techniques that allow for agricultural production while preserving forest integrity.",
    image: "https://images.unsplash.com/photo-1566408669374-5a6d5dca6b39?auto=format&fit=crop&w=800&q=80",
    tags: ["Agriculture", "Sustainability"],
    readTime: 7
  },
  {
    title: "Indigenous Knowledge and Biodiversity Conservation",
    excerpt: "How traditional ecological knowledge from indigenous communities contributes to conservation efforts.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80",
    tags: ["Indigenous", "Conservation"],
    readTime: 9
  },
  {
    title: "Climate Change Impacts on Amazonian Ecosystems",
    excerpt: "Research findings on how climate change is affecting the Amazon rainforest and its unique biodiversity.",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
    tags: ["Climate", "Research"],
    readTime: 12
  }
];

const courses = [
  {
    title: "Introduction to Amazon Ecology",
    description: "Learn about the fundamental ecological principles governing the Amazon rainforest ecosystem.",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80",
    level: "Beginner",
    students: 324
  },
  {
    title: "Sustainable Resource Management",
    description: "Strategies for managing natural resources while minimizing environmental impact in sensitive ecosystems.",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=800&q=80",
    level: "Intermediate",
    students: 187
  }
];

const events = [
  {
    title: "Amazon Conservation Symposium",
    description: "Join researchers and conservationists for a comprehensive discussion on the current state of Amazon conservation.",
    date: {
      month: "Sep",
      day: "15",
      year: "2023"
    },
    time: "10:00 AM - 4:00 PM"
  },
  {
    title: "Community Reforestation Project",
    description: "Volunteer to help plant native tree species as part of our ongoing reforestation initiative.",
    date: {
      month: "Oct",
      day: "03",
      year: "2023"
    },
    time: "9:00 AM - 1:00 PM"
  },
  {
    title: "Sustainable Development Workshop",
    description: "Learn practical skills for implementing sustainable development practices in your community.",
    date: {
      month: "Oct",
      day: "22",
      year: "2023"
    },
    time: "2:00 PM - 5:00 PM"
  }
];

export default FeaturedSection;
