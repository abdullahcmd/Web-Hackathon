import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, ThumbsUp, Trash2, Edit3, Send, Sprout } from "lucide-react";
import { useAuth } from "@/lib/auth";

type Comment = {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
};

type Post = {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
  likes: string[];
  comments: Comment[];
};

const STORAGE_KEY = "community_posts_v1";

function nowId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadPosts(): Post[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // seed some initial Urdu/English posts
  const seeded: Post[] = [
    {
      id: nowId("p"),
      authorId: "seed-1",
      authorName: "علی احمد",
      content: "آج لاہور میں بارش متوقع ہے، پانی کم دیں۔ کیا کسی نے ٹماٹر کی نئی قسم آزمائی ہے؟",
      createdAt: Date.now() - 1000 * 60 * 60 * 5,
      likes: [],
      comments: [
        {
          id: nowId("c"),
          authorId: "seed-2",
          authorName: "Usman",
          content: "Yes, hybrid Nadir performed well for me in Faisalabad.",
          createdAt: Date.now() - 1000 * 60 * 60 * 4,
        },
      ],
    },
    {
      id: nowId("p"),
      authorId: "seed-3",
      authorName: "Zara",
      content: "Onion prices dropped in Sindh last week. Anyone noticing recovery?",
      createdAt: Date.now() - 1000 * 60 * 60 * 2,
      likes: [],
      comments: [],
    },
    {
      id: nowId("p"),
      authorId: "seed-4",
      authorName: "محمد وقاص",
      content: "کھاد کب ڈالنی چاہیے؟ کیا درجہ حرارت 35° پر اثر ہوتا ہے؟",
      createdAt: Date.now() - 1000 * 60 * 30,
      likes: [],
      comments: [],
    },
  ];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  } catch {}
  return seeded;
}

function savePosts(posts: Post[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export default function FarmerCommunity() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    setPosts(loadPosts());
  }, []);

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => b.createdAt - a.createdAt),
    [posts]
  );

  const upsert = (updated: Post) => {
    setPosts((prev) => {
      const idx = prev.findIndex((p) => p.id === updated.id);
      const next = idx >= 0 ? [...prev.slice(0, idx), updated, ...prev.slice(idx + 1)] : [updated, ...prev];
      savePosts(next);
      return next;
    });
  };

  const remove = (id: string) => {
    setPosts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      savePosts(next);
      return next;
    });
  };

  const onCreatePost = () => {
    const text = newPost.trim();
    if (!text) return;
    if (!user) {
      toast({ title: "Login required", description: "براہ کرم پوسٹ کرنے کے لیے لاگ ان کریں" });
      return;
    }
    const p: Post = {
      id: nowId("p"),
      authorId: user.id,
      authorName: user.name || user.email || "Farmer",
      content: text,
      createdAt: Date.now(),
      likes: [],
      comments: [],
    };
    setPosts((prev) => {
      const next = [p, ...prev];
      savePosts(next);
      return next;
    });
    setNewPost("");
    toast({ title: "Post added" });
  };

  const onToggleLike = (post: Post) => {
    if (!user) return;
    const has = post.likes.includes(user.id);
    const updated = { ...post, likes: has ? post.likes.filter((i) => i !== user.id) : [...post.likes, user.id] };
    upsert(updated);
  };

  const onAddComment = (post: Post) => {
    if (!user) return;
    const text = (commentDrafts[post.id] || "").trim();
    if (!text) return;
    const c: Comment = {
      id: nowId("c"),
      authorId: user.id,
      authorName: user.name || user.email || "Farmer",
      content: text,
      createdAt: Date.now(),
    };
    const updated = { ...post, comments: [...post.comments, c] };
    upsert(updated);
    setCommentDrafts((d) => ({ ...d, [post.id]: "" }));
  };

  const onEditPost = (post: Post) => {
    setEditingPostId(post.id);
    setEditingText(post.content);
  };

  const onSaveEdit = (post: Post) => {
    const text = editingText.trim();
    if (!text) return setEditingPostId(null);
    upsert({ ...post, content: text });
    setEditingPostId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">کمیونٹی فورم (Community Forum)</h1>
        </div>

        <Card className="p-4 space-y-3">
          <h2 className="font-semibold">نئی پوسٹ شامل کریں / Add New Post</h2>
          <textarea
            className="w-full border rounded-md p-3 text-sm bg-background"
            rows={3}
            placeholder="اپنا سوال یا مشورہ یہاں لکھیں... / Share your question or advice..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={onCreatePost} data-testid="button-add-post">Post</Button>
          </div>
        </Card>

        <div className="space-y-4">
          {sortedPosts.map((post) => {
            const isOwner = user && user.id === post.authorId;
            return (
              <Card key={post.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{post.authorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onToggleLike(post)}
                      data-testid="button-like">
                      <ThumbsUp className="h-4 w-4 mr-1" /> {post.likes.length}
                    </Button>
                    {isOwner && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => onEditPost(post)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => remove(post.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {editingPostId === post.id ? (
                  <div className="space-y-2">
                    <textarea
                      className="w-full border rounded-md p-3 text-sm bg-background"
                      rows={3}
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button variant="secondary" onClick={() => setEditingPostId(null)}>Cancel</Button>
                      <Button onClick={() => onSaveEdit(post)}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
                )}

                <div className="pt-2 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MessageSquare className="h-4 w-4" /> Comments
                  </div>
                  <div className="space-y-3">
                    {post.comments.map((c) => (
                      <div key={c.id} className="border rounded-md p-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{c.authorName}</span>
                          <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{c.content}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="اپنی رائے لکھیں... / Add a comment..."
                      value={commentDrafts[post.id] || ""}
                      onChange={(e) => setCommentDrafts((d) => ({ ...d, [post.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          onAddComment(post);
                        }
                      }}
                    />
                    <Button onClick={() => onAddComment(post)} data-testid="button-add-comment">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}


