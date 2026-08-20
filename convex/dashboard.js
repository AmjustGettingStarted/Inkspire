import { v } from "convex/values";
import { query } from "./_generated/server";

// Get dashboard analytics for the authenticated user
export const getAnalytics = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Get user from database
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!user) {
      return null;
    }

    // Get all user's posts
    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), user._id))
      .collect();

    // Get user's followers count
    const followersCount = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followingId"), user._id))
      .collect();

    // Calculate analytics
    const totalViews = posts.reduce((sum, post) => sum + post.viewCount, 0);
    const totalLikes = posts.reduce((sum, post) => sum + post.likeCount, 0);

    // Get comments count for user's posts
    const postIds = posts.map((p) => p._id);
    let totalComments = 0;

    for (const postId of postIds) {
      const comments = await ctx.db
        .query("comments")
        .filter((q) =>
          q.and(
            q.eq(q.field("postId"), postId),
            q.eq(q.field("status"), "approved"),
          ),
        )
        .collect();
      totalComments += comments.length;
    }

    // Calculate growth percentages (simplified - you might want to implement proper date-based calculations)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const recentPosts = posts.filter((p) => p.createdAt > thirtyDaysAgo);
    const recentViews = recentPosts.reduce(
      (sum, post) => sum + post.viewCount,
      0,
    );
    const recentLikes = recentPosts.reduce(
      (sum, post) => sum + post.likeCount,
      0,
    );

    // Simple growth calculation (you can enhance this)
    const viewsGrowth = totalViews > 0 ? (recentViews / totalViews) * 100 : 0;
    const likesGrowth = totalLikes > 0 ? (recentLikes / totalLikes) * 100 : 0;
    const commentsGrowth = totalComments > 0 ? 15 : 0; // Placeholder
    const followersGrowth = followersCount.length > 0 ? 12 : 0; // Placeholder

    return {
      totalViews,
      totalLikes,
      totalComments,
      totalFollowers: followersCount.length,
      viewsGrowth: Math.round(viewsGrowth * 10) / 10,
      likesGrowth: Math.round(likesGrowth * 10) / 10,
      commentsGrowth,
      followersGrowth,
    };
  },
});

// Get recent activity for the dashboard
export const getRecentActivity = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Get user from database
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!user) {
      return [];
    }

    // Get user's posts
    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), user._id))
      .collect();

    const postIds = posts.map((p) => p._id);
    const activities = [];

    // Get recent likes on user's posts
    for (const postId of postIds) {
      const likes = await ctx.db
        .query("likes")
        .filter((q) => q.eq(q.field("postId"), postId))
        .order("desc")
        .take(5);

      for (const like of likes) {
        if (like.userId) {
          const likeUser = await ctx.db.get(like.userId);
          const post = posts.find((p) => p._id === postId);

          if (likeUser && post) {
            activities.push({
              type: "like",
              user: likeUser.name,
              post: post.title,
              time: like.createdAt,
            });
          }
        }
      }
    }

    // Get recent comments on user's posts
    for (const postId of postIds) {
      const comments = await ctx.db
        .query("comments")
        .filter((q) =>
          q.and(
            q.eq(q.field("postId"), postId),
            q.eq(q.field("status"), "approved"),
          ),
        )
        .order("desc")
        .take(5);

      for (const comment of comments) {
        const post = posts.find((p) => p._id === postId);

        if (post) {
          activities.push({
            type: "comment",
            user: comment.authorName,
            post: post.title,
            time: comment.createdAt,
          });
        }
      }
    }

    // Get recent followers
    const recentFollowers = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followingId"), user._id))
      .order("desc")
      .take(5);

    for (const follow of recentFollowers) {
      const follower = await ctx.db.get(follow.followerId);
      if (follower) {
        activities.push({
          type: "follow",
          user: follower.name,
          time: follow.createdAt,
        });
      }
    }

    // Sort all activities by time and limit
    activities.sort((a, b) => b.time - a.time);

    return activities.slice(0, args.limit || 10);
  },
});

// Get posts with analytics for dashboard
export const getPostsWithAnalytics = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Get user from database
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!user) {
      return [];
    }

    // Get recent posts with enhanced data
    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), user._id))
      .order("desc")
      .take(args.limit || 5);

    // Add comment counts to each post
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await ctx.db
          .query("comments")
          .filter((q) =>
            q.and(
              q.eq(q.field("postId"), post._id),
              q.eq(q.field("status"), "approved"),
            ),
          )
          .collect();

        return {
          ...post,
          commentCount: comments.length,
        };
      }),
    );

    return postsWithComments;
  },
});

export const getDailyViews = query({
  args: {
    timeframe: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!user) throw new Error("User not found");

    const userPosts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), user._id))
      .collect();

    if (userPosts.length === 0) return [];

    const postIds = userPosts.map((post) => post._id);

    const timeframeMap = { "1D": 1, "1W": 7, "1M": 30, "6M": 180, "1Y": 365 };
    const selectedTimeframe = args.timeframe || "1M";
    const totalDays = timeframeMap[selectedTimeframe] || 30;

    // Generate date map with default zero values
    const daysMap = {};
    const chartData = [];

    for (let i = totalDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

      const dayObj = {
        date: dateKey,
        views: 0,
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        fullDate: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };

      daysMap[dateKey] = dayObj;
      chartData.push(dayObj);
    }

    // Fetch daily stats
    const dailyStats = await ctx.db
      .query("dailyStats")
      .filter((q) => q.or(...postIds.map((id) => q.eq(q.field("postId"), id))))
      .collect();

    // Map stats safely by normalizing the stored date key
    dailyStats.forEach((stat) => {
      // Normalize stored date to YYYY-MM-DD format regardless of ISO format
      const formattedStatDate = new Date(stat.date || stat._creationTime)
        .toISOString()
        .split("T")[0];

      if (daysMap[formattedStatDate]) {
        daysMap[formattedStatDate].views += stat.views || 0;
      }
    });

    return chartData;
  },
});
