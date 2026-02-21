import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, serverTimestamp, getDocs, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseInitialized } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2, Calendar, AlertTriangle, X, Check, HelpCircle, ChevronDown, Image as ImageIcon, ArrowLeft, MessageCircle, Send, Edit2, Pin, Lock, Eye, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  hasImage?: boolean;
  isPinned?: boolean;
  isSecret?: boolean;
  views?: number;
  likes?: number;
  createdAt: any;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: any;
}

const MarkdownHelpSection = ({ title, content }: { title: string, content: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0 bg-white first:rounded-t-xl last:rounded-b-xl">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full px-4 py-3 text-left font-bold text-gray-700 hover:bg-gray-50 transition-colors text-xs"
      >
        <span>{title}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-gray-50"
          >
            <div className="p-4 text-gray-600 text-[11px] border-t border-gray-100 leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-pre:my-1 prose-pre:bg-gray-800 prose-pre:text-gray-100">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkBreaks]} 
                rehypePlugins={[rehypeRaw]}
                components={{
                  p: ({node, ...props}) => <p {...props} className="mb-1 last:mb-0" />,
                  h1: ({node, ...props}) => <h1 {...props} className="text-lg font-bold mt-2 mb-1" />,
                  h2: ({node, ...props}) => <h2 {...props} className="text-base font-bold mt-2 mb-1" />,
                  h3: ({node, ...props}) => <h3 {...props} className="text-sm font-bold mt-2 mb-1" />,
                  h4: ({node, ...props}) => <h4 {...props} className="text-xs font-bold mt-1 mb-1" />,
                  h5: ({node, ...props}) => <h5 {...props} className="text-[10px] font-bold mt-1 mb-1" />,
                  h6: ({node, ...props}) => <h6 {...props} className="text-[9px] font-bold mt-1 mb-1" />,
                  blockquote: ({node, ...props}) => <blockquote {...props} className="border-l-2 border-gray-300 pl-2 my-1 italic text-gray-400" />,
                  hr: ({node, ...props}) => <hr {...props} className="my-2 border-gray-200" />,
                  code: ({node, className, children, ...props}) => {
                    const isInline = !String(children).includes('\n');
                    if (isInline) {
                      return (
                        <code className="bg-gray-200 rounded px-1 py-0.5 text-red-500 font-mono text-[10px]" {...props}>
                          {children}
                        </code>
                      );
                    }
                    return (
                      <div className="bg-gray-800 rounded p-2 my-1 overflow-x-auto">
                        <code className="text-gray-100 font-mono text-[10px] block" {...props}>
                          {children}
                        </code>
                      </div>
                    );
                  }
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CommentsSection = ({ postId }: { postId: string }) => {
  const { isAdmin } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(newComments);
      setLoading(false);
    });
    return unsubscribe;
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    try {
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        text: newComment,
        author: authorName,
        createdAt: serverTimestamp()
      });
      setNewComment('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error("Error adding comment: ", error);
      alert("댓글 작성 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, 'posts', postId, 'comments', commentId));
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-100">
      <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
        <MessageCircle size={16} /> 댓글 {comments.length}
      </h3>

      {/* Comment List */}
      <div className="space-y-3 mb-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-3 rounded-xl text-sm group">
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-gray-700">{comment.author}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {comment.createdAt?.toDate().toLocaleDateString()}
                </span>
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(comment.id)}
                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-600 whitespace-pre-wrap">{comment.text}</p>
          </div>
        ))}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="이름"
            className="w-32 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-bold flex items-center gap-1"
          >
            <Send size={14} /> 등록
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={newComment}
          onChange={handleInput}
          placeholder="댓글을 남겨주세요..."
          className="w-full px-3 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[80px] resize-none overflow-hidden"
          required
        />
      </form>
    </div>
  );
};

export default function BlogPage() {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasImage, setHasImage] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isSecret, setIsSecret] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  useEffect(() => {
    // Load liked posts from local storage
    const storedLikes = localStorage.getItem('liked_posts');
    if (storedLikes) {
      setLikedPosts(JSON.parse(storedLikes));
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseInitialized || !db) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      
      // Filter secret posts for non-admins
      const visiblePosts = isAdmin ? newPosts : newPosts.filter(post => !post.isSecret);

      // Sort by pinned status then date
      visiblePosts.sort((a, b) => {
        if (a.isPinned === b.isPinned) return 0;
        return a.isPinned ? -1 : 1;
      });
      
      setPosts(visiblePosts);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching posts:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [isFirebaseInitialized, isAdmin]);

  const handlePostClick = async (post: BlogPost) => {
    // Optimistically update view count for display
    const updatedPost = {
      ...post,
      views: (post.views || 0) + 1
    };
    setSelectedPost(updatedPost);
    
    // Increment view count in DB
    if (db) {
      try {
        const postRef = doc(db, 'posts', post.id);
        await updateDoc(postRef, {
          views: increment(1)
        });
      } catch (error) {
        console.error("Error incrementing view count:", error);
      }
    }
  };

  const handleLike = async (e: React.MouseEvent, post: BlogPost) => {
    e.stopPropagation();
    if (likedPosts.includes(post.id)) return;

    try {
      const postRef = doc(db, 'posts', post.id);
      await updateDoc(postRef, {
        likes: increment(1)
      });
      
      const newLikedPosts = [...likedPosts, post.id];
      setLikedPosts(newLikedPosts);
      localStorage.setItem('liked_posts', JSON.stringify(newLikedPosts));
      
      // Optimistic update for selected post
      if (selectedPost && selectedPost.id === post.id) {
        setSelectedPost({
          ...selectedPost,
          likes: (selectedPost.likes || 0) + 1
        });
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  if (!isFirebaseInitialized) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Firebase Setup Required</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Please configure your Firebase credentials in the secrets panel to view and create blog posts.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const finalTitle = title.trim() || '무제';

    try {
      if (isEditing && editingId) {
        await updateDoc(doc(db, 'posts', editingId), {
          title: finalTitle,
          content,
          hasImage,
          isPinned,
          isSecret,
          updatedAt: serverTimestamp()
        });
        setIsEditing(false);
        setEditingId(null);
        // Update selected post if we are in detail view
        if (selectedPost && selectedPost.id === editingId) {
          setSelectedPost({
            ...selectedPost,
            title: finalTitle,
            content,
            hasImage,
            isPinned,
            isSecret
          });
        }
      } else {
        await addDoc(collection(db, 'posts'), {
          title: finalTitle,
          content,
          hasImage,
          isPinned,
          isSecret,
          views: 0,
          likes: 0,
          createdAt: serverTimestamp()
        });
      }
      
      setTitle('');
      setContent('');
      setHasImage(false);
      setIsPinned(false);
      setIsSecret(false);
      setIsWriting(false);
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("글 저장 중 오류가 발생했습니다.");
    }
  };

  const handleEdit = (post: BlogPost) => {
    setTitle(post.title);
    setContent(post.content);
    setHasImage(post.hasImage || false);
    setIsPinned(post.isPinned || false);
    setIsSecret(post.isSecret || false);
    setEditingId(post.id);
    setIsEditing(true);
    setIsWriting(true);
    // If in detail view, go back to list to show editor
    if (selectedPost) {
      setSelectedPost(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'posts', id));
      setDeletingId(null);
      if (selectedPost?.id === id) {
        setSelectedPost(null);
      }
    } catch (error) {
      console.error("Error removing document: ", error);
      alert("글 삭제 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // Detail View
  if (selectedPost) {
    return (
      <div className="">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-cyan-600 transition-colors"
          >
            <ArrowLeft size={16} /> 목록으로
          </button>
          
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(selectedPost)}
                className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                title="수정"
              >
                <Edit2 size={16} />
              </button>
              
              {deletingId === selectedPost.id ? (
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <span className="text-xs text-gray-500 font-bold px-1">삭제?</span>
                  <button
                    onClick={() => handleDelete(selectedPost.id)}
                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => setDeletingId(null)}
                    className="p-1 bg-gray-300 text-gray-600 rounded hover:bg-gray-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeletingId(selectedPost.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="삭제"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              {selectedPost.isSecret && <Lock size={20} className="text-gray-400" />}
              {selectedPost.title}
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar size={12} />
                <span>{formatDate(selectedPost.createdAt)}</span>
                {selectedPost.hasImage && <ImageIcon size={12} className="text-cyan-500" />}
                {isAdmin && (
                  <div className="flex items-center gap-1 ml-2">
                    <Eye size={12} />
                    <span>{selectedPost.views || 0}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-gray-700 text-sm leading-relaxed mb-8 prose prose-sm max-w-none prose-p:my-3 prose-headings:my-6 prose-ul:my-3 prose-li:my-1 prose-img:rounded-xl prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm, remarkBreaks]} 
              rehypePlugins={[rehypeRaw]}
              components={{
                p: ({node, ...props}) => <p {...props} className="mb-3 last:mb-0" />,
                a: ({node, ...props}) => <a {...props} className="text-blue-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer" />,
                h1: ({node, ...props}) => <h1 {...props} className="text-3xl font-bold mt-6 mb-4 text-gray-900" />,
                h2: ({node, ...props}) => <h2 {...props} className="text-2xl font-bold mt-5 mb-3 text-gray-800" />,
                h3: ({node, ...props}) => <h3 {...props} className="text-xl font-bold mt-4 mb-2 text-gray-800" />,
                h4: ({node, ...props}) => <h4 {...props} className="text-lg font-bold mt-3 mb-2 text-gray-800" />,
                h5: ({node, ...props}) => <h5 {...props} className="text-base font-bold mt-2 mb-1 text-gray-700" />,
                h6: ({node, ...props}) => <h6 {...props} className="text-sm font-bold mt-2 mb-1 text-gray-600" />,
                em: ({node, ...props}) => <span {...props} className="text-gray-400 not-italic" />,
                ul: ({node, className, ...props}) => {
                  return <ul {...props} className="list-disc pl-5 my-3 space-y-1" />
                },
                ol: ({node, ...props}) => <ol {...props} className="list-decimal list-inside my-3 space-y-1 pl-2" />,
                li: ({node, className, children, ...props}) => {
                  // Check if children contains a checkbox (input type="checkbox")
                  const hasCheckbox = Array.isArray(children) && children.some((child: any) => 
                    child?.props?.type === 'checkbox'
                  );
                  
                  if (hasCheckbox) {
                    return <li {...props} className="list-none flex items-start -ml-5">{children}</li>;
                  }
                  return <li {...props} className="pl-1">{children}</li>;
                },
                img: ({node, ...props}) => <img {...props} className="rounded-lg max-h-96 object-cover my-4 shadow-sm" referrerPolicy="no-referrer" />,
                table: ({node, ...props}) => <div className="overflow-x-auto my-4"><table {...props} className="min-w-full divide-y divide-gray-200 border" /></div>,
                th: ({node, ...props}) => <th {...props} className="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border" />,
                td: ({node, ...props}) => <td {...props} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border" />,
                blockquote: ({node, ...props}) => <blockquote {...props} className="border-l-4 border-gray-200 pl-4 italic text-gray-500 my-4" />,
                code: ({node, className, children, ...props}) => {
                  const match = /language-(\w+)/.exec(className || '')
                  return !String(children).includes('\n') ? (
                    <code className="bg-gray-100 rounded px-1 py-0.5 text-red-500 font-mono text-xs" {...props}>
                      {children}
                    </code>
                  ) : (
                    <div className="bg-gray-800 rounded-lg p-3 my-4 overflow-x-auto">
                      <code className="text-gray-100 font-mono text-xs block whitespace-pre" {...props}>
                        {children}
                      </code>
                    </div>
                  )
                }
              }}
            >
              {selectedPost.content}
            </ReactMarkdown>
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={(e) => handleLike(e, selectedPost)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm ${
                likedPosts.includes(selectedPost.id) 
                  ? 'bg-red-50 text-red-500 border border-red-200 shadow-red-100' 
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Heart size={18} className={likedPosts.includes(selectedPost.id) ? "fill-red-500" : ""} />
              <span>좋아요 {selectedPost.likes || 0}</span>
            </button>
          </div>

          <CommentsSection postId={selectedPost.id} />
        </motion.article>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6 relative">
      {/* Header / Write Button */}
      <div className="flex justify-end items-center">
        {isAdmin && !isWriting && (
          <button
            onClick={() => {
              setIsEditing(false);
              setEditingId(null);
              setTitle('');
              setContent('');
              setHasImage(false);
              setIsPinned(false);
              setIsWriting(true);
            }}
            className="px-4 py-2 bg-cyan-600 text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-cyan-700 transition-colors shadow-sm"
          >
            <Plus size={16} /> 글쓰기
          </button>
        )}
      </div>

      {/* Write Form */}
      <AnimatePresence>
        {isWriting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4 mb-6 relative">
              <div className="flex justify-between items-center mb-2">
                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600">
                  {isEditing ? 'Edit Post' : 'New Post'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowHelp(!showHelp)}
                  className="px-3 py-1.5 bg-gray-800 text-white rounded text-xs font-bold flex items-center gap-1 hover:bg-gray-700 transition-colors"
                >
                  {showHelp ? <><X size={12} /> 가이드 닫기</> : <><HelpCircle size={12} /> 문법 가이드</>}
                </button>
              </div>

              {/* Markdown Help Section - Static Position */}
              <AnimatePresence>
                {showHelp && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginBottom: 16 }}
                    exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                  >
                    <div className="flex flex-col">
                      <MarkdownHelpSection title="[글씨 크기]" content={`\\# 1 → <span style="font-size: 1.125rem; font-weight: 700;">큰 글씨 1</span>
\\## 2 → <span style="font-size: 1rem; font-weight: 700;">큰 글씨 2</span>
\\### 3 → <span style="font-size: 0.875rem; font-weight: 700;">큰 글씨 3</span>
\\#### 4 → <span style="font-size: 0.75rem; font-weight: 700;">큰 글씨 4</span>
\\##### 5 → <span style="font-size: 0.625rem; font-weight: 700;">작은 글씨 1</span>
\\###### 6 → <span style="font-size: 0.5625rem; font-weight: 700;">작은 글씨 2</span>`} />

                      <MarkdownHelpSection title="[강조]" content={`\\*\\*굵게\\*\\* → **굵은 글씨**
\\*연하게\\* → <span style="opacity: 0.5;">연한 글씨</span>
\\~\\~취소선\\~\\~ → ~~취소선~~`} />

                      <MarkdownHelpSection title="[링크 및 이미지]" content={`**링크 달기**
\\[링크텍스트\\](URL)
예: \\[네이버\\](https://naver.com)

**이미지 첨부하기**
\\!\\[이미지설명\\](이미지주소URL)`} />

                      <MarkdownHelpSection title="[글자 색상]" content={`\\<span style="color:red"\\>빨강\\</span\\> → <span style="color:red">빨강</span>
\\<span style="color:blue"\\>파랑\\</span\\> → <span style="color:blue">파랑</span>
\\<span style="color:green"\\>초록\\</span\\> → <span style="color:green">초록</span>
\\<span style="color:purple"\\>보라\\</span\\> → <span style="color:purple">보라</span>
\\<span style="color:pink"\\>분홍\\</span\\> → <span style="color:pink">분홍</span>
\\<span style="color:HEX코드"\\>내용\\</span\\>`} />

                      <MarkdownHelpSection title="[인용 및 코드]" content={`\\> 인용
↓

> 인용문

&nbsp;&nbsp;\\\`인라인 코드\\\` → \`코드\`

&nbsp;&nbsp;\\-\\-\\- → 구분선

&nbsp;&nbsp;**코드블럭** ↓
\\\`\\\`\\\`
내용
\\\`\\\`\\\` `} />

                      <MarkdownHelpSection title="[표 (Table)]" content={`\\|제목\\|내용\\|
\\|-\\|-\\|
\\|왼쪽\\|오른쪽\\|`} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold text-lg placeholder-gray-300"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="오늘의 다이어리를 작성해보세요...&#13;&#10;* '문법 가이드'를 열어 다양한 서식을 확인해보세요."
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[300px] resize-none font-mono text-sm leading-relaxed placeholder-gray-300"
                required
              />
              
              <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-gray-500 hover:text-cyan-600 transition-colors select-none">
                    <input 
                      type="checkbox" 
                      checked={hasImage} 
                      onChange={(e) => setHasImage(e.target.checked)}
                      className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-gray-300"
                    />
                    <span className="text-xs font-bold flex items-center gap-1">
                      <ImageIcon size={14} /> 이미지
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-gray-500 hover:text-cyan-600 transition-colors select-none">
                    <input 
                      type="checkbox" 
                      checked={isPinned} 
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-gray-300"
                    />
                    <span className="text-xs font-bold flex items-center gap-1">
                      <Pin size={14} /> 고정
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-gray-500 hover:text-cyan-600 transition-colors select-none">
                    <input 
                      type="checkbox" 
                      checked={isSecret} 
                      onChange={(e) => setIsSecret(e.target.checked)}
                      className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-gray-300"
                    />
                    <span className="text-xs font-bold flex items-center gap-1">
                      <Lock size={14} /> 비밀
                    </span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsWriting(false);
                      setIsEditing(false);
                      setEditingId(null);
                      setTitle('');
                      setContent('');
                      setHasImage(false);
                      setIsPinned(false);
                      setIsSecret(false);
                    }}
                    className="px-3 py-2 text-gray-400 hover:text-gray-600 text-xs font-bold transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-gray-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Check size={14} /> {isEditing ? '수정' : '등록'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-10 text-gray-400">로딩 중...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
            작성된 글이 없습니다.
          </div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handlePostClick(post)}
              className={`bg-white p-4 rounded-xl shadow-sm border ${post.isPinned ? 'border-cyan-200 bg-cyan-50/30' : 'border-gray-100'} hover:border-cyan-200 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {post.isPinned && (
                  <Pin size={14} className="text-cyan-600 flex-shrink-0 fill-cyan-600" />
                )}
                {post.isSecret && (
                  <Lock size={14} className="text-gray-400 flex-shrink-0" />
                )}
                <h3 className="text-sm font-bold text-gray-700 truncate group-hover:text-cyan-700 transition-colors">
                  {post.title}
                </h3>
                {post.hasImage && (
                  <ImageIcon size={14} className="text-gray-400 group-hover:text-cyan-500 transition-colors flex-shrink-0" />
                )}
              </div>
              
              <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                {isAdmin && (
                  <div className="flex items-center gap-0.5 text-[10px] text-gray-400">
                    <Eye size={11} />
                    <span>{post.views || 0}</span>
                  </div>
                )}
                <div className="flex items-center gap-0.5 text-[10px] text-gray-400">
                  <Heart size={11} className={likedPosts.includes(post.id) ? "fill-red-400 text-red-400" : ""} />
                  <span>{post.likes || 0}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">
                  {formatDate(post.createdAt)}
                </span>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(post);
                      }}
                      className="text-gray-300 hover:text-cyan-600 p-1 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    
                    {deletingId === post.id ? (
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          <Check size={12} />
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="p-1 bg-gray-300 text-gray-600 rounded hover:bg-gray-400 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingId(post.id);
                        }}
                        className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
