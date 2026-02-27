"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Bell, Heart, MessageCircle, Send, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";

interface Author { id: string; name?: string; trustScore?: number }
interface CommentItem { id: string; text: string; createdAt: string; author: Author }
interface PostItem {
  reportCount?: number;
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  author: Author;
  comments: CommentItem[];
  reactions?: { id: string }[];
  _count?: { comments?: number; reactions?: number };
}
interface ActivityItem { id: string; type: "COMMENT" | "REACTION"; isRead: boolean; createdAt: string; actor: Author; post: { id: string; content: string } }

type FeedFilter = "all" | "images" | "discussed";
type FeedSort = "newest" | "active";

export default function SocialPage() {
  const { lang } = useLanguage();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [newImageUrlInput, setNewImageUrlInput] = useState("");
  const [newImageName, setNewImageName] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [feedFilter, setFeedFilter] = useState<FeedFilter>("all");
  const [feedSort, setFeedSort] = useState<FeedSort>("newest");
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [unread, setUnread] = useState(0);

  const t = {
    el: {
      badge: "Community Social", title: "Social Feed", subtitle: "Αναρτήσεις, σχόλια και community αλληλεπίδραση.",
      createPost: "Νέα Ανάρτηση", postPlaceholder: "Γράψε κάτι χρήσιμο...", publish: "Δημοσίευση", publishing: "Δημοσίευση...",
      addImage: "Προσθήκη εικόνας", imageUrl: "ή URL εικόνας", removeImage: "Αφαίρεση εικόνας", uploadingImage: "Ανέβασμα εικόνας...",
      empty: "Δεν υπάρχουν αναρτήσεις ακόμα.", comments: "σχόλια", addComment: "Γράψε σχόλιο...", send: "Αποστολή",
      loginHint: "Για post/comment χρειάζεται token: pawsitiveToken", anonymous: "Ανώνυμος", trust: "trust",
      all: "Όλα", withImages: "Με εικόνα", mostDiscussed: "Πιο συζητημένα", newest: "Νεότερα", mostActive: "Πιο ενεργά",
      like: "Μου αρέσει", unlike: "Σου άρεσε", report: "Αναφορά", reported: "Αναφέρθηκε", activity: "Δραστηριότητα", markRead: "Σήμανση ως διαβασμένα",
      commented: "σχολίασε στο post σου", reacted: "αντέδρασε στο post σου"
    },
    en: {
      badge: "Community Social", title: "Social Feed", subtitle: "Posts, comments and community interaction.",
      createPost: "Create Post", postPlaceholder: "Share something useful...", publish: "Publish", publishing: "Publishing...",
      addImage: "Add image", imageUrl: "or image URL", removeImage: "Remove image", uploadingImage: "Uploading image...",
      empty: "No posts yet.", comments: "comments", addComment: "Write a comment...", send: "Send",
      loginHint: "Posting/commenting requires token: pawsitiveToken", anonymous: "Anonymous", trust: "trust",
      all: "All", withImages: "With images", mostDiscussed: "Most discussed", newest: "Newest", mostActive: "Most active",
      like: "Like", unlike: "Liked", report: "Report", reported: "Reported", activity: "Activity", markRead: "Mark all read",
      commented: "commented on your post", reacted: "reacted to your post"
    }
  }[lang];

  const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("pawsitiveToken") : null);

  const fetchPosts = async () => {
    const r = await fetch("http://localhost:3001/social/posts");
    if (r.ok) setPosts(await r.json());
  };

  const fetchActivity = async () => {
    const r = await fetch("http://localhost:3001/social/activity");
    if (!r.ok) return;
    const data = await r.json();
    setActivity(data.items || []);
    setUnread(data.unread || 0);
  };

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([fetchPosts(), fetchActivity()]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleImageSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImageName(file.name);
    try {
      setUploadingImage(true);
      const form = new FormData(); form.append("file", file);
      const token = getToken();
      const r = await fetch("http://localhost:3001/social/uploads", { method: "POST", headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: form });
      if (!r.ok) return;
      const data = await r.json();
      setNewImageUrl(data.imageUrl || null);
    } finally { setUploadingImage(false); e.target.value = ""; }
  };

  const handleCreatePost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      const token = getToken();
      const finalImageUrl = newImageUrl || newImageUrlInput.trim() || undefined;
      const r = await fetch("http://localhost:3001/social/posts", { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ content: newPost.trim(), imageUrl: finalImageUrl }) });
      if (!r.ok) return;
      setNewPost(""); setNewImageUrl(null); setNewImageUrlInput(""); setNewImageName("");
      await Promise.all([fetchPosts(), fetchActivity()]);
    } finally { setPosting(false); }
  };

  const handleAddComment = async (postId: string) => {
    const text = (commentDrafts[postId] || "").trim();
    if (!text) return;
    const token = getToken();
    const r = await fetch(`http://localhost:3001/social/posts/${postId}/comments`, { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ text }) });
    if (!r.ok) return;
    setCommentDrafts((p) => ({ ...p, [postId]: "" }));
    await Promise.all([fetchPosts(), fetchActivity()]);
  };

  const handleReact = async (postId: string) => {
    const token = getToken();
    const r = await fetch(`http://localhost:3001/social/posts/${postId}/react`, { method: "POST", headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
    if (!r.ok) return;
    await Promise.all([fetchPosts(), fetchActivity()]);
  };

  const handleReport = async (postId: string) => {
    const r = await fetch(`http://localhost:3001/social/posts/${postId}/report`, { method: "POST" });
    if (!r.ok) return;
    await fetchPosts();
  };

  const handleMarkRead = async () => {
    await fetch("http://localhost:3001/social/activity/read-all", { method: "POST" });
    await fetchActivity();
  };

  const visiblePosts = useMemo(() => {
    let items = [...posts];
    if (feedFilter === "images") items = items.filter((p) => !!p.imageUrl);
    if (feedFilter === "discussed") items = items.filter((p) => (p._count?.comments ?? p.comments.length) > 0);
    if (feedSort === "active") items.sort((a, b) => ((b._count?.comments ?? 0) + (b._count?.reactions ?? 0)) - ((a._count?.comments ?? 0) + (a._count?.reactions ?? 0)));
    else items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return items;
  }, [posts, feedFilter, feedSort]);

  return (
    <div className="min-h-screen p-8 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-sky-100/90 bg-white/80 p-6 shadow-[0_8px_22px_rgba(46,92,155,0.08)]">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50/80 px-3 py-1 text-xs font-semibold uppercase"><Sparkles className="h-3.5 w-3.5" /> {t.badge}</p>
          <h1 className="flex items-center gap-2 text-3xl font-bold"><MessageCircle className="h-7 w-7 text-sky-600" /> {t.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{t.subtitle}</p>
        </header>

        <section className="rounded-2xl border border-sky-100/90 bg-white/85 p-5 shadow-[0_8px_22px_rgba(46,92,155,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t.activity}</h2>
            <button onClick={handleMarkRead} className="text-xs text-sky-700 hover:underline">{t.markRead} ({unread})</button>
          </div>
          <div className="space-y-2">
            {activity.slice(0, 4).map((a) => (
              <div key={a.id} className={`rounded-lg border px-3 py-2 text-sm ${a.isRead ? 'border-slate-100 bg-white' : 'border-sky-200 bg-sky-50/50'}`}>
                <span className="font-semibold">{a.actor?.name || t.anonymous}</span>{' '}
                {a.type === 'COMMENT' ? t.commented : t.reacted}
              </div>
            ))}
            {activity.length === 0 && <p className="text-sm text-slate-500">—</p>}
          </div>
        </section>

        <section className="rounded-2xl border border-sky-100/90 bg-white/85 p-5 shadow-[0_8px_22px_rgba(46,92,155,0.08)]">
          <h2 className="mb-3 text-lg font-semibold">{t.createPost}</h2>
          <form onSubmit={handleCreatePost} className="space-y-3">
            <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder={t.postPlaceholder} rows={4} className="w-full rounded-xl border border-slate-200 px-3 py-2" />
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><label htmlFor="post-image" className="mr-2 font-medium">{t.addImage}</label><input id="post-image" type="file" accept="image/*" onChange={handleImageSelected} className="text-sm" /></div>
              <input value={newImageUrlInput} onChange={(e) => setNewImageUrlInput(e.target.value)} placeholder={t.imageUrl} className="min-w-[260px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
              {newImageName && <span className="text-xs text-slate-500">{newImageName}</span>}
              {uploadingImage && <span className="text-xs text-sky-600">{t.uploadingImage}</span>}
              {(newImageUrl || newImageUrlInput.trim()) && <button type="button" onClick={() => { setNewImageUrl(null); setNewImageUrlInput(""); setNewImageName(""); }} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm">{t.removeImage}</button>}
            </div>
            {(newImageUrl || newImageUrlInput.trim()) && <img src={newImageUrl || newImageUrlInput} alt="preview" className="max-h-64 w-full rounded-xl border border-slate-200 object-cover" />}
            <div className="flex items-center justify-between"><p className="text-xs text-slate-500">{t.loginHint}</p><button disabled={posting || uploadingImage} className="inline-flex items-center gap-2 rounded-lg border border-sky-300 bg-gradient-to-r from-[#7ee5d7] to-[#8fdcff] px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60"><Send className="h-4 w-4" /> {posting ? t.publishing : t.publish}</button></div>
          </form>
        </section>

        <section className="rounded-2xl border border-sky-100/90 bg-white/75 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setFeedFilter("all")} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${feedFilter === "all" ? "bg-sky-100 text-sky-800" : "bg-white text-slate-600"}`}>{t.all}</button>
            <button onClick={() => setFeedFilter("images")} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${feedFilter === "images" ? "bg-sky-100 text-sky-800" : "bg-white text-slate-600"}`}>{t.withImages}</button>
            <button onClick={() => setFeedFilter("discussed")} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${feedFilter === "discussed" ? "bg-sky-100 text-sky-800" : "bg-white text-slate-600"}`}>{t.mostDiscussed}</button>
            <div className="ml-auto flex gap-2">
              <button onClick={() => setFeedSort("newest")} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${feedSort === "newest" ? "bg-emerald-100 text-emerald-800" : "bg-white text-slate-600"}`}>{t.newest}</button>
              <button onClick={() => setFeedSort("active")} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${feedSort === "active" ? "bg-emerald-100 text-emerald-800" : "bg-white text-slate-600"}`}>{t.mostActive}</button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          {loading ? <div className="rounded-2xl border border-sky-100/90 bg-white/80 p-6 text-slate-500">Loading feed...</div> : visiblePosts.length === 0 ? <div className="rounded-2xl border border-dashed border-sky-200 bg-white/75 p-6 text-slate-500">{t.empty}</div> : visiblePosts.map((post) => {
            const liked = Boolean(post.reactions?.length);
            return <article key={post.id} className="rounded-2xl border border-sky-100/90 bg-white/88 p-5 shadow-[0_8px_18px_rgba(46,92,155,0.06)]">
              <div className="mb-3 flex items-start justify-between gap-4"><div><p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800"><UserRound className="h-4 w-4 text-sky-600" />{post.author?.name || t.anonymous}</p><p className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleString(lang === "el" ? "el-GR" : "en-US")} • {t.trust} {post.author?.trustScore ?? 0}</p></div><span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-1 text-xs text-emerald-700"><ShieldCheck className="h-3.5 w-3.5" /> {post._count?.comments ?? post.comments.length} {t.comments}</span></div>
              <p className="whitespace-pre-wrap text-sm text-slate-700">{post.content}</p>
              {post.imageUrl && <img src={post.imageUrl} alt="Post image" className="mt-3 max-h-96 w-full rounded-xl border border-slate-200 object-cover" />}
              <div className="mt-3 flex items-center gap-2"><button onClick={() => handleReact(post.id)} className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold ${liked ? "border-rose-200 bg-rose-50 text-rose-700" : "border-slate-200 bg-white text-slate-700"}`}><Heart className={`h-3.5 w-3.5 ${liked ? "fill-rose-500" : ""}`} />{liked ? t.unlike : t.like} ({post._count?.reactions ?? 0})</button><button onClick={() => handleReport(post.id)} className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">{t.report} ({post.reportCount ?? 0})</button></div>
              <div className="mt-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                {post.comments.slice(0, 5).map((comment) => <div key={comment.id} className="rounded-lg bg-white px-3 py-2 text-sm"><span className="font-semibold text-slate-800">{comment.author?.name || t.anonymous}</span><span className="text-slate-500"> · {new Date(comment.createdAt).toLocaleTimeString(lang === "el" ? "el-GR" : "en-US")}</span><p className="mt-1 text-slate-700">{comment.text}</p></div>)}
                <div className="flex gap-2 pt-1"><input value={commentDrafts[post.id] || ""} onChange={(e) => setCommentDrafts((p) => ({ ...p, [post.id]: e.target.value }))} placeholder={t.addComment} className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" /><button onClick={() => handleAddComment(post.id)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">{t.send}</button></div>
              </div>
            </article>;
          })}
        </section>
      </div>
    </div>
  );
}





