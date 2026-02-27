"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { MessageCircle, Send, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";

interface Author {
  id: string;
  name?: string;
  trustScore?: number;
}

interface CommentItem {
  id: string;
  text: string;
  createdAt: string;
  author: Author;
}

interface PostItem {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  author: Author;
  comments: CommentItem[];
  _count?: { comments?: number };
}

export default function SocialPage() {
  const { lang } = useLanguage();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [newImageUrlInput, setNewImageUrlInput] = useState("");
  const [newImageName, setNewImageName] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  const t = {
    el: {
      badge: "Community Social",
      title: "Social Feed",
      subtitle: "Αναρτήσεις, σχόλια και community αλληλεπίδραση για pet owners.",
      createPost: "Νέα Ανάρτηση",
      postPlaceholder: "Γράψε κάτι χρήσιμο για την κοινότητα...",
      publish: "Δημοσίευση",
      publishing: "Δημοσίευση...",
      addImage: "Προσθήκη εικόνας",
      imageUrl: "ή URL εικόνας",
      removeImage: "Αφαίρεση εικόνας",
      uploadingImage: "Ανέβασμα εικόνας...",
      empty: "Δεν υπάρχουν αναρτήσεις ακόμα. Γίνε ο πρώτος που θα ποστάρει.",
      comments: "σχόλια",
      addComment: "Γράψε σχόλιο...",
      send: "Αποστολή",
      loginHint: "Για post/comment χρειάζεται token στο localStorage: pawsitiveToken",
      anonymous: "Ανώνυμος",
      trust: "trust",
    },
    en: {
      badge: "Community Social",
      title: "Social Feed",
      subtitle: "Posts, comments and community interaction for pet owners.",
      createPost: "Create Post",
      postPlaceholder: "Share something useful with the community...",
      publish: "Publish",
      publishing: "Publishing...",
      addImage: "Add image",
      imageUrl: "or image URL",
      removeImage: "Remove image",
      uploadingImage: "Uploading image...",
      empty: "No posts yet. Be the first to post.",
      comments: "comments",
      addComment: "Write a comment...",
      send: "Send",
      loginHint: "Posting/commenting requires localStorage token: pawsitiveToken",
      anonymous: "Anonymous",
      trust: "trust",
    },
  }[lang];

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/social/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Fetch posts error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("pawsitiveToken") : null);

  const handleImageSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setNewImageName(file.name);

    try {
      setUploadingImage(true);
      const token = getToken();
      const form = new FormData();
      form.append("file", file);

      const response = await fetch("http://localhost:3001/social/uploads", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: form,
      });

      if (!response.ok) return;
      const data = await response.json();
      setNewImageUrl(data.imageUrl || null);
    } catch (error) {
      console.error("Image upload error", error);
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleCreatePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newPost.trim()) return;

    try {
      setPosting(true);
      const token = getToken();
      const finalImageUrl = newImageUrl || newImageUrlInput.trim() || undefined;
      const response = await fetch("http://localhost:3001/social/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content: newPost.trim(), imageUrl: finalImageUrl }),
      });

      if (!response.ok) return;
      setNewPost("");
      setNewImageUrl(null);
      setNewImageUrlInput("");
      setNewImageName("");
      await fetchPosts();
    } catch (error) {
      console.error("Create post error", error);
    } finally {
      setPosting(false);
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = (commentDrafts[postId] || "").trim();
    if (!text) return;

    try {
      const token = getToken();
      const response = await fetch(`http://localhost:3001/social/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) return;
      setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
      await fetchPosts();
    } catch (error) {
      console.error("Add comment error", error);
    }
  };

  return (
    <div className="min-h-screen p-8 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-sky-100/90 bg-white/80 p-6 shadow-[0_8px_22px_rgba(46,92,155,0.08)] backdrop-blur">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50/80 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-sky-700 uppercase">
            <Sparkles className="h-3.5 w-3.5" /> {t.badge}
          </p>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <MessageCircle className="h-7 w-7 text-sky-600" /> {t.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{t.subtitle}</p>
        </header>

        <section className="rounded-2xl border border-sky-100/90 bg-white/85 p-5 shadow-[0_8px_22px_rgba(46,92,155,0.08)]">
          <h2 className="mb-3 text-lg font-semibold">{t.createPost}</h2>
          <form onSubmit={handleCreatePost} className="space-y-3">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={t.postPlaceholder}
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            />

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                <label htmlFor="post-image" className="mr-2 font-medium text-slate-700">
                  {t.addImage}
                </label>
                <input id="post-image" type="file" accept="image/*" onChange={handleImageSelected} className="text-sm" />
              </div>

              <input
                value={newImageUrlInput}
                onChange={(e) => setNewImageUrlInput(e.target.value)}
                placeholder={t.imageUrl}
                className="min-w-[260px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              />

              {newImageName && <span className="text-xs text-slate-500">{newImageName}</span>}
              {uploadingImage && <span className="text-xs text-sky-600">{t.uploadingImage}</span>}

              {(newImageUrl || newImageUrlInput.trim()) && (
                <button
                  type="button"
                  onClick={() => {
                    setNewImageUrl(null);
                    setNewImageUrlInput("");
                    setNewImageName("");
                  }}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
                >
                  {t.removeImage}
                </button>
              )}
            </div>

            {(newImageUrl || newImageUrlInput.trim()) && (
              <img
                src={newImageUrl || newImageUrlInput}
                alt="Post preview"
                className="max-h-64 w-full rounded-xl border border-slate-200 object-cover"
              />
            )}

            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">{t.loginHint}</p>
              <button
                disabled={posting || uploadingImage}
                className="inline-flex items-center gap-2 rounded-lg border border-sky-300 bg-gradient-to-r from-[#7ee5d7] to-[#8fdcff] px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60"
              >
                <Send className="h-4 w-4" /> {posting ? t.publishing : t.publish}
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          {loading ? (
            <div className="rounded-2xl border border-sky-100/90 bg-white/80 p-6 text-slate-500">Loading feed...</div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-sky-200 bg-white/75 p-6 text-slate-500">{t.empty}</div>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="rounded-2xl border border-sky-100/90 bg-white/88 p-5 shadow-[0_8px_18px_rgba(46,92,155,0.06)]">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <UserRound className="h-4 w-4 text-sky-600" />
                      {post.author?.name || t.anonymous}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(post.createdAt).toLocaleString(lang === "el" ? "el-GR" : "en-US")} • {t.trust} {post.author?.trustScore ?? 0}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5" /> {post._count?.comments ?? post.comments.length} {t.comments}
                  </span>
                </div>

                <p className="whitespace-pre-wrap text-sm text-slate-700">{post.content}</p>

                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post image"
                    className="mt-3 max-h-96 w-full rounded-xl border border-slate-200 object-cover"
                  />
                )}

                <div className="mt-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  {post.comments.slice(0, 5).map((comment) => (
                    <div key={comment.id} className="rounded-lg bg-white px-3 py-2 text-sm">
                      <span className="font-semibold text-slate-800">{comment.author?.name || t.anonymous}</span>
                      <span className="text-slate-500"> · {new Date(comment.createdAt).toLocaleTimeString(lang === "el" ? "el-GR" : "en-US")}</span>
                      <p className="mt-1 text-slate-700">{comment.text}</p>
                    </div>
                  ))}

                  <div className="flex gap-2 pt-1">
                    <input
                      value={commentDrafts[post.id] || ""}
                      onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder={t.addComment}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {t.send}
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
