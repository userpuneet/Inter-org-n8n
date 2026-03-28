
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  FileText,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  PlusCircle,
  ChevronRight,
  BookOpen,
  Play,
  Users,
  Lightbulb,
  X
} from "lucide-react";

interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  published: string;
  lastUpdated: string;
  viewCount: number;
  helpfulRating: number;
}

const dummyArticles: KnowledgeArticle[] = [
  {
    id: "KB-001",
    title: "How to Reset Your Password",
    content: `
      <h2>Steps to Reset Your Password</h2>
      <p>If you've forgotten your password or need to reset it for security reasons, follow these simple steps:</p>
      <ol>
        <li>Navigate to the login page</li>
        <li>Click on the "Forgot Password" link below the login form</li>
        <li>Enter your email address</li>
        <li>Check your email for a password reset link</li>
        <li>Click the link and follow the instructions to create a new password</li>
        <li>Use your new password to log in</li>
      </ol>
    `,
    category: "Account Management",
    tags: ["password", "reset", "account", "login"],
    author: {
      name: "Sarah Johnson",
      avatar: "SJ"
    },
    published: "2025-01-15T10:30:00Z",
    lastUpdated: "2025-04-10T14:15:00Z",
    viewCount: 1452,
    helpfulRating: 92
  },
  {
    id: "KB-002",
    title: "Setting Up Two-Factor Authentication",
    content: `
      <h2>What is Two-Factor Authentication?</h2>
      <p>Two-factor authentication (2FA) adds an extra layer of security to your account by requiring two forms of identification.</p>
    `,
    category: "Security",
    tags: ["2FA", "security", "authentication"],
    author: {
      name: "Michael Chen",
      avatar: "MC"
    },
    published: "2025-02-08T09:45:00Z",
    lastUpdated: "2025-04-20T11:30:00Z",
    viewCount: 875,
    helpfulRating: 95
  },
  {
    id: "KB-003",
    title: "Troubleshooting API Connection Errors",
    content: `
      <h2>Common API Connection Issues</h2>
      <p>If you're experiencing problems connecting to our API, here are some common issues and their solutions.</p>
    `,
    category: "API",
    tags: ["api", "troubleshooting", "errors"],
    author: {
      name: "Lisa Wong",
      avatar: "LW"
    },
    published: "2025-03-12T15:20:00Z",
    lastUpdated: "2025-05-01T10:45:00Z",
    viewCount: 1120,
    helpfulRating: 88
  }
];

const SelfServicePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [articleContent, setArticleContent] = useState<KnowledgeArticle | null>(null);
  const { toast } = useToast();
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowSearchResults(true);
      setArticleContent(null);
    }
  };
  
  const handleViewArticle = (articleId: string) => {
    const article = dummyArticles.find(a => a.id === articleId);
    if (article) {
      setArticleContent(article);
      setShowSearchResults(false);
    }
  };
  
  const handleFeedback = (helpful: boolean) => {
    toast({
      title: "Feedback Received",
      description: helpful ? "Thank you for your positive feedback!" : "Thank you for your feedback. We'll work to improve this content."
    });
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Customer Self-Service Portal</h1>
          <p className="text-gray-500">Find answers, solve problems, and get help without waiting</p>
        </div>
        
        <div className="relative mb-6">
          <div className="flex flex-col md:flex-row items-center p-6 bg-gradient-to-r from-purple-100 to-blue-50 rounded-lg">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
              <h2 className="text-xl font-bold mb-2">Find answers instantly</h2>
              <p className="mb-4">Our AI-powered search finds the answers you need and suggests solutions before you even create a ticket.</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Describe your issue or question..."
                  className="pl-10 pr-24 py-6 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyUp={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button 
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2">TRENDING QUESTION</Badge>
                  <h3 className="font-medium">How do I reset my password?</h3>
                  <p className="text-sm text-gray-500 mb-2">95% find this helpful</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleViewArticle("KB-001")}
                  >
                    View Guide <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {!showSearchResults && !articleContent && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <HelpCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Guided Troubleshooters</h3>
                      <p className="text-sm text-gray-500">Step-by-step solutions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer" onClick={() => handleViewArticle("KB-001")}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Knowledge Base</h3>
                      <p className="text-sm text-gray-500">Detailed guides and articles</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Community Forums</h3>
                      <p className="text-sm text-gray-500">Get help from other users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {dummyArticles.map((article) => (
                <Card 
                  key={article.id}
                  className="hover:border-primary hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleViewArticle(article.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-600">Article</span>
                    </div>
                    <h3 className="font-medium mb-2">{article.title}</h3>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {article.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">{article.author.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500">{article.author.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(article.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
        
        {articleContent && (
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{articleContent.title}</CardTitle>
                <CardDescription>
                  Published {new Date(articleContent.published).toLocaleDateString()}, 
                  last updated {new Date(articleContent.lastUpdated).toLocaleDateString()}
                </CardDescription>
              </div>
              <Button variant="ghost" onClick={() => setArticleContent(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-600">
                  {articleContent.category}
                </Badge>
                {articleContent.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>
              
              <div className="prose prose-sm max-w-none mb-6" dangerouslySetInnerHTML={{ __html: articleContent.content }} />
              
              <div className="flex items-center justify-between border-t pt-4 mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Was this article helpful?</span>
                  <Button variant="outline" size="sm" onClick={() => handleFeedback(true)}>
                    <ThumbsUp className="h-4 w-4 mr-1" /> Yes
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleFeedback(false)}>
                    <ThumbsDown className="h-4 w-4 mr-1" /> No
                  </Button>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{articleContent.viewCount}</span> views
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{articleContent.helpfulRating}%</span> found helpful
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default SelfServicePage;
