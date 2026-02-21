import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Trash2, Plus, X, Check, Link as LinkIcon, Calendar, Eye } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { db, isFirebaseInitialized } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

interface GalleryItem {
  id: string;
  url: string;
  title: string;
  likes: number;
  views?: number;
  createdAt: any;
}

export default function GalleryPage() {
  const { isAdmin } = useAuth();
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (!isFirebaseInitialized || !db) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryItem[];
      setPhotos(newPhotos);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching photos:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [isFirebaseInitialized]);

  const handlePhotoClick = async (photo: GalleryItem) => {
    // Optimistically update view count for display
    const updatedPhoto = {
      ...photo,
      views: (photo.views || 0) + 1
    };
    setSelectedPhoto(updatedPhoto);
    
    // Increment view count
    if (db) {
      try {
        const photoRef = doc(db, 'gallery', photo.id);
        await updateDoc(photoRef, {
          views: increment(1)
        });
      } catch (error) {
        console.error("Error incrementing view count:", error);
      }
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    try {
      await addDoc(collection(db, 'gallery'), {
        url: newUrl,
        title: newTitle,
        likes: 0,
        views: 0,
        createdAt: serverTimestamp()
      });
      setNewUrl('');
      setNewTitle('');
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding photo: ", error);
      alert("사진 추가 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'gallery', id));
      setDeletingId(null);
      if (selectedPhoto?.id === id) setSelectedPhoto(null);
    } catch (error) {
      console.error("Error removing photo: ", error);
      alert("사진 삭제 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-4 relative">
      {/* Header & Add Button */}
      <div className="flex justify-end items-center mb-2">
        {isAdmin && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-3 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-cyan-700 transition-colors"
          >
            <Plus size={14} /> 사진 추가
          </button>
        )}
      </div>

      {/* Add Photo Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddPhoto} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">이미지 주소</label>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                    <LinkIcon size={14} />
                  </div>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">제목 (선택)</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="사진 설명"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg text-xs font-medium"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-medium hover:bg-cyan-700"
                >
                  등록
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Grid */}
      {loading ? (
        <div className="text-center py-10 text-gray-400 text-xs">사진 불러오는 중...</div>
      ) : photos.length === 0 ? (
        <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200 text-xs">
          아직 사진이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              layoutId={`photo-${photo.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handlePhotoClick(photo)}
              className="aspect-square bg-gray-100 relative overflow-hidden cursor-pointer group"
            >
              <img 
                src={photo.url} 
                alt={photo.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Error';
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            />
            
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50"
            >
              <X size={32} />
            </button>
            
            <div 
              className="relative z-10 flex flex-col items-center max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title & Date */}
              <div className="text-center mb-6">
                {selectedPhoto.title && selectedPhoto.title !== 'Untitled' && (
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{selectedPhoto.title}</h3>
                )}
                <div className="flex items-center justify-center gap-3 text-gray-400 text-sm font-mono">
                  <span>{formatDate(selectedPhoto.createdAt)}</span>
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      <span>{selectedPhoto.views || 0}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Image */}
              <motion.div
                layoutId={`photo-${selectedPhoto.id}`}
                className="relative bg-white p-1 shadow-2xl rounded-sm flex flex-col"
              >
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.title} 
                  className="max-h-[70vh] max-w-[90vw] w-auto h-auto block"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Admin Actions */}
              {isAdmin && (
                <div className="mt-6">
                   {deletingId === selectedPhoto.id ? (
                      <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                        <span className="text-white text-sm font-bold">정말 삭제하시겠습니까?</span>
                        <button
                          onClick={(e) => {
                             e.stopPropagation();
                             handleDelete(selectedPhoto.id);
                          }}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-bold transition-colors"
                        >
                          삭제
                        </button>
                        <button
                          onClick={(e) => {
                             e.stopPropagation();
                             setDeletingId(null);
                          }}
                          className="px-3 py-1 bg-white/20 text-white rounded hover:bg-white/30 text-xs font-bold transition-colors"
                        >
                          취소
                        </button>
                      </div>
                   ) : (
                    <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingId(selectedPhoto.id);
                        }}
                        className="text-white/50 hover:text-red-400 transition-colors flex items-center gap-2 text-sm"
                      >
                        <Trash2 size={16} /> 사진 삭제
                      </button>
                   )}
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
