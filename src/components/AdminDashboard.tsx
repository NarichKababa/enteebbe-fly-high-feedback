import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Users, MessageSquare, BarChart3, Calendar } from 'lucide-react';
import { Feedback, FEEDBACK_CATEGORIES } from '@/types/feedback';
import { format } from 'date-fns';

interface FeedbackStats {
  total: number;
  averageRating: number;
  categoryBreakdown: Record<string, number>;
  ratingBreakdown: Record<number, number>;
  recentFeedback: Feedback[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<FeedbackStats>({
    total: 0,
    averageRating: 0,
    categoryBreakdown: {},
    ratingBreakdown: {},
    recentFeedback: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbackStats();
  }, []);

  const fetchFeedbackStats = async () => {
    try {
      const { data: feedback, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (feedback) {
        const total = feedback.length;
        const averageRating = feedback.reduce((sum, f) => sum + f.rating, 0) / total || 0;
        
        const categoryBreakdown = feedback.reduce((acc, f) => {
          acc[f.category] = (acc[f.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const ratingBreakdown = feedback.reduce((acc, f) => {
          acc[f.rating] = (acc[f.rating] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        setStats({
          total,
          averageRating,
          categoryBreakdown,
          ratingBreakdown,
          recentFeedback: feedback.slice(0, 10)
        });
      }
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800';
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and analyze passenger feedback
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <div className="flex items-center mt-1">
              {renderStars(Math.round(stats.averageRating))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.recentFeedback.filter(f => 
                new Date(f.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              New feedback submissions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((Object.entries(stats.ratingBreakdown)
                .filter(([rating]) => parseInt(rating) >= 4)
                .reduce((sum, [_, count]) => sum + count, 0) / stats.total) * 100 || 0
              ).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              4+ star ratings
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="feedback">Recent Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Feedback by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.categoryBreakdown)
                    .sort(([,a], [,b]) => b - a)
                    .map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {FEEDBACK_CATEGORIES[category as keyof typeof FEEDBACK_CATEGORIES]}
                        </span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{rating}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${((stats.ratingBreakdown[rating] || 0) / stats.total) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8">
                          {stats.ratingBreakdown[rating] || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>
                Latest feedback submissions from passengers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentFeedback.map(feedback => (
                  <div key={feedback.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{feedback.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {feedback.is_anonymous ? 'Anonymous' : feedback.passenger_name} • 
                          {FEEDBACK_CATEGORIES[feedback.category]} •
                          {format(new Date(feedback.created_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRatingColor(feedback.rating)}>
                          {feedback.rating}/5
                        </Badge>
                        {feedback.flight_number && (
                          <Badge variant="outline">{feedback.flight_number}</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm">{feedback.comment}</p>
                    <div className="flex items-center mt-2">
                      {renderStars(feedback.rating)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800">Top Performing Area</h4>
                    <p className="text-sm text-green-700">
                      {Object.entries(stats.categoryBreakdown)
                        .sort(([,a], [,b]) => b - a)[0]?.[0] 
                        ? FEEDBACK_CATEGORIES[Object.entries(stats.categoryBreakdown)
                            .sort(([,a], [,b]) => b - a)[0][0] as keyof typeof FEEDBACK_CATEGORIES]
                        : 'No data'
                      } has the most feedback submissions
                    </p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Satisfaction Trends</h4>
                    <p className="text-sm text-blue-700">
                      {stats.averageRating >= 4 ? 'Excellent' : 
                       stats.averageRating >= 3 ? 'Good' : 'Needs Improvement'} overall satisfaction rating
                    </p>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-800">Action Required</h4>
                    <p className="text-sm text-yellow-700">
                      {Object.entries(stats.ratingBreakdown)
                        .filter(([rating]) => parseInt(rating) <= 2)
                        .reduce((sum, [_, count]) => sum + count, 0)
                      } low ratings need attention
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 border rounded-lg hover:bg-muted transition-colors">
                    <h4 className="font-semibold">Export Feedback Report</h4>
                    <p className="text-sm text-muted-foreground">
                      Download detailed analytics report
                    </p>
                  </button>
                  
                  <button className="w-full text-left p-3 border rounded-lg hover:bg-muted transition-colors">
                    <h4 className="font-semibold">Send Follow-up Surveys</h4>
                    <p className="text-sm text-muted-foreground">
                      Contact passengers with poor ratings
                    </p>
                  </button>
                  
                  <button className="w-full text-left p-3 border rounded-lg hover:bg-muted transition-colors">
                    <h4 className="font-semibold">Schedule Review Meeting</h4>
                    <p className="text-sm text-muted-foreground">
                      Discuss feedback with department heads
                    </p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}