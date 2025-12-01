import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Trash2, ExternalLink, X, AlertTriangle, Image, MessageCircle, CheckSquare, Square, Filter, List, Grid, Send, Clock, ZoomIn, ZoomOut, Upload, Palette, PenTool, Video, ClipboardList, Leaf, Camera, Smartphone, BarChart3, Link, MessageSquare, Save, Copy, Tag, Flag, History, ChevronDown, ChevronUp, AlertCircle, Sparkles, Play, Images, Film } from 'lucide-react';
import { fetchPosts, createPost, updatePost, deletePost } from './supabase';
import { initEmailJS, sendNotificationEmail } from './emailService';

// Platform Icons
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="url(#ig-grad)">
    <defs><linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFDC80"/><stop offset="25%" stopColor="#F77737"/><stop offset="50%" stopColor="#E1306C"/><stop offset="75%" stopColor="#C13584"/><stop offset="100%" stopColor="#833AB4"/></linearGradient></defs>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#000000">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#FF0000">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// Config
const teamMembers = [
  { id: 'gaia', name: 'Gaia', color: 'from-pink-400 to-rose-500', icon: Palette, email: 'gaia@enooso.it', role: 'grafica' },
  { id: 'viola', name: 'Viola', color: 'from-violet-400 to-purple-500', icon: PenTool, email: 'viola@enooso.it', role: 'copy' },
  { id: 'alessandro', name: 'Alessandro', color: 'from-amber-400 to-orange-500', icon: ClipboardList, email: 'alessandro@enooso.it', role: 'assistenza' },
  { id: 'valerio', name: 'Valerio', color: 'from-emerald-400 to-teal-500', icon: Leaf, email: 'valerio@enooso.it', role: 'founder' }
];

const statusConfig = {
  idea: { color: 'bg-stone-400', label: 'Idea', textColor: 'text-stone-600', bgLight: 'bg-stone-100', order: 0 },
  bozza: { color: 'bg-amber-500', label: 'Bozza', textColor: 'text-amber-600', bgLight: 'bg-amber-100', order: 1 },
  approvato: { color: 'bg-emerald-500', label: 'Approvato', textColor: 'text-emerald-600', bgLight: 'bg-emerald-100', order: 2 },
  pubblicato: { color: 'bg-blue-500', label: 'Pubblicato', textColor: 'text-blue-600', bgLight: 'bg-blue-100', order: 3 }
};

const priorityConfig = {
  alta: { color: 'bg-red-500', label: 'Alta', icon: AlertCircle },
  media: { color: 'bg-amber-500', label: 'Media', icon: Flag },
  bassa: { color: 'bg-blue-500', label: 'Bassa', icon: ChevronDown }
};

const defaultTags = ['Scopri di più', 'Link in bio', 'Acquista ora', 'Salva per dopo', 'Commenta', 'Condividi', 'Seguici', 'Prova gratis', 'Scrivici in DM'];

const zoomLevels = ['trimestre', 'mese', 'settimana'];

const platformLimits = {
  instagram: 2200,
  facebook: 63206,
  tiktok: 4000,
  youtube: 5000
};

const initialPosts = [
  { 
    id: 'demo1', 
    date: '2025-12-05', 
    time: '10:00',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop', 
    text: 'Scopri la nostra nuova linea di shampoo solidi. Fatto a mano a Roma, zero plastica.', 
    platforms: ['instagram', 'facebook'], 
    status: 'approvato', 
    priority: 'alta',
    tags: ['Scopri di più', 'Link in bio'],
    driveLink: '', 
    mediaType: 'image',
    carousel: [],
    video: '',
    checklist: { grafica: true, testo: true, video: false },
    comments: [
      { id: 1, author: 'viola', text: 'Caption aggiornata!', timestamp: '2025-11-28T10:30:00' },
      { id: 2, author: 'gaia', text: 'Grafica pronta! @viola controlla', timestamp: '2025-11-28T14:15:00' }
    ],
    history: [
      { action: 'Creato', author: 'valerio', timestamp: '2025-11-25T09:00:00' },
      { action: 'Status: Idea → Bozza', author: 'gaia', timestamp: '2025-11-26T11:00:00' },
      { action: 'Status: Bozza → Approvato', author: 'valerio', timestamp: '2025-11-28T16:00:00' }
    ]
  },
  { 
    id: 'demo2', 
    date: '2025-12-03', 
    time: '14:30',
    image: '', 
    text: 'Behind the scenes: come creiamo i nostri prodotti', 
    platforms: ['instagram', 'tiktok'], 
    status: 'bozza', 
    priority: 'media',
    tags: ['Seguici'],
    driveLink: '', 
    mediaType: 'video',
    carousel: [],
    video: '',
    checklist: { grafica: false, testo: true, video: false },
    comments: [],
    history: [
      { action: 'Creato', author: 'valerio', timestamp: '2025-11-27T10:00:00' }
    ]
  },
  { 
    id: 'demo3', 
    date: '2025-12-15', 
    time: '18:00',
    image: '', 
    text: '', 
    platforms: ['instagram'], 
    status: 'idea', 
    priority: 'alta',
    tags: ['Acquista ora', 'Link in bio'],
    driveLink: '', 
    mediaType: 'image',
    carousel: [],
    video: '',
    checklist: { grafica: false, testo: false, video: false },
    comments: [],
    history: [
      { action: 'Creato', author: 'valerio', timestamp: '2025-11-29T09:00:00' }
    ]
  },
];

export default function PianoEditorialeEnooso() {
  const [posts, setPosts] = useState(initialPosts);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState('mese');
  const [viewMode, setViewMode] = useState('calendar');
  const [editingPost, setEditingPost] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedTaskSection, setExpandedTaskSection] = useState(null);
  const [filters, setFilters] = useState({ status: 'all', platform: 'all', tag: 'all', priority: 'all', dateFrom: '', dateTo: '' });
  const [newComment, setNewComment] = useState('');
  const [currentUser] = useState('valerio');
  const [draggedPost, setDraggedPost] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);
  const [showPreview, setShowPreview] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const draggedPostRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const carouselInputRef = useRef(null);

  useEffect(() => {
    initEmailJS();
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const data = await fetchPosts();
    if (data && data.length > 0) {
      const mappedPosts = data.map(p => ({
        id: p.id,
        date: p.date,
        time: p.time || '12:00',
        text: p.text || '',
        image: p.image || '',
        carousel: p.carousel || [],
        video: p.video || '',
        mediaType: p.media_type || 'image',
        platforms: p.platforms || [],
        status: p.status || 'idea',
        priority: p.priority || 'media',
        tags: p.tags || [],
        driveLink: p.drive_link || '',
        checklist: {
          grafica: p.checklist_grafica || false,
          testo: p.checklist_testo || false,
          video: p.checklist_video || false
        },
        comments: p.comments || [],
        history: p.history || []
      }));
      setPosts(mappedPosts);
    }
    setLoading(false);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const sendNotification = async (recipientId, type, postData) => {
    const recipient = teamMembers.find(m => m.id === recipientId);
    if (!recipient) return;
    await sendNotificationEmail(recipientId, type, postData);
    showToast(`📧 Notifica inviata a ${recipient.name}`);
  };

  const formatDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const todayStr = formatDate(new Date());
  
  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      if (filters.status !== 'all' && p.status !== filters.status) return false;
      if (filters.platform !== 'all' && !p.platforms?.includes(filters.platform)) return false;
      if (filters.tag !== 'all' && !p.tags?.includes(filters.tag)) return false;
      if (filters.priority !== 'all' && p.priority !== filters.priority) return false;
      if (filters.dateFrom && p.date < filters.dateFrom) return false;
      if (filters.dateTo && p.date > filters.dateTo) return false;
      return true;
    });
  }, [posts, filters]);

  const allTags = useMemo(() => {
    const tags = new Set(defaultTags);
    posts.forEach(p => p.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [posts]);

  const getPostsForDate = (dateStr) => filteredPosts.filter(p => p.date === dateStr);
  const goToToday = () => setCurrentDate(new Date());

  const navigate = (dir) => {
    const d = new Date(currentDate);
    if (zoomLevel === 'trimestre') d.setMonth(d.getMonth() + dir * 3);
    else if (zoomLevel === 'mese') d.setMonth(d.getMonth() + dir);
    else d.setDate(d.getDate() + dir * 7);
    setCurrentDate(d);
  };

  const zoomIn = () => {
    const i = zoomLevels.indexOf(zoomLevel);
    if (i < zoomLevels.length - 1) setZoomLevel(zoomLevels[i + 1]);
  };

  const zoomOut = () => {
    const i = zoomLevels.indexOf(zoomLevel);
    if (i > 0) setZoomLevel(zoomLevels[i - 1]);
  };

  const getDaysUntil = (dateStr) => {
    const target = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  };

  const handleDayClick = (dateStr) => {
    const newPost = { 
      date: dateStr, time: '12:00', image: '', text: '', platforms: [], status: 'idea', 
      priority: 'media', tags: [], driveLink: '',
      mediaType: 'image', carousel: [], video: '',
      checklist: { grafica: false, testo: false, video: false }, comments: [],
      history: [{ action: 'Creato', author: currentUser, timestamp: new Date().toISOString() }]
    };
    setEditingPost(newPost);
  };

  const handlePostClick = (post, e) => { 
    if (e) e.stopPropagation(); 
    setEditingPost({
      ...post,
      carousel: post.carousel || [],
      video: post.video || '',
      mediaType: post.mediaType || (post.video ? 'video' : post.carousel?.length > 0 ? 'carousel' : 'image')
    }); 
  };

  const addHistoryEntry = (post, action) => {
    return {
      ...post,
      history: [...(post.history || []), { action, author: currentUser, timestamp: new Date().toISOString() }]
    };
  };

  const handleSave = async () => {
    if (!editingPost) return;
    
    let updatedPost = editingPost;
    
    // Check if it's an existing database post (UUID format) or local/demo post
    const isDbPost = editingPost.id && !editingPost.id.startsWith('post-') && !editingPost.id.startsWith('demo');
    
    if (editingPost.id) {
      const originalPost = posts.find(p => p.id === editingPost.id);
      if (originalPost && originalPost.status !== editingPost.status) {
        updatedPost = addHistoryEntry(updatedPost, `Status: ${statusConfig[originalPost.status]?.label} → ${statusConfig[editingPost.status]?.label}`);
      }
      
      if (isDbPost) {
        // Update in database
        const success = await updatePost(editingPost.id, updatedPost);
        if (success) {
          setPosts(posts.map(p => p.id === editingPost.id ? updatedPost : p));
        }
      } else {
        // Local post update
        setPosts(posts.map(p => p.id === editingPost.id ? updatedPost : p));
      }
    } else {
      // Create new post
      const created = await createPost(editingPost);
      if (created) {
        updatedPost = { ...editingPost, id: created.id };
        setPosts([...posts, updatedPost]);
      } else {
        // Fallback to local
        updatedPost = { ...editingPost, id: `post-${Date.now()}` };
        setPosts([...posts, updatedPost]);
      }
    }
    
    if (updatedPost.status !== 'idea') {
      const isVideoPost = updatedPost.mediaType === 'video';
      
      if (!updatedPost.checklist?.testo) {
        sendNotification('viola', 'task_copy', updatedPost);
      }
      
      if (isVideoPost && !updatedPost.checklist?.video) {
        sendNotification('gaia', 'task_video', updatedPost);
      } else if (!isVideoPost && !updatedPost.checklist?.grafica) {
        sendNotification('gaia', 'task_grafica', updatedPost);
      }
    }
    
    setEditingPost(null);
    showToast('✅ Post salvato!');
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    const isDbPost = id && !id.startsWith('post-') && !id.startsWith('demo');
    if (isDbPost) {
      await deletePost(id);
    }
    setPosts(posts.filter(p => p.id !== id));
    if (editingPost?.id === id) setEditingPost(null);
    showToast('🗑️ Post eliminato');
  };

  const handleDuplicate = (post, e) => {
    if (e) e.stopPropagation();
    const duplicated = {
      ...post,
      id: `post-${Date.now()}`,
      status: 'idea',
      comments: [],
      history: [{ action: `Duplicato da post del ${new Date(post.date).toLocaleDateString('it-IT')}`, author: currentUser, timestamp: new Date().toISOString() }]
    };
    setPosts([...posts, duplicated]);
    showToast('📋 Post duplicato!');
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !editingPost) return;
    const mentions = newComment.match(/@(\w+)/g)?.map(m => m.slice(1).toLowerCase()) || [];
    
    const updatedPost = {
      ...editingPost,
      comments: [...(editingPost.comments || []), {
        id: Date.now(), author: currentUser, text: newComment, timestamp: new Date().toISOString(), mentions
      }]
    };
    
    setEditingPost(updatedPost);
    
    mentions.forEach(mentionedUser => {
      const member = teamMembers.find(m => m.id === mentionedUser || m.name.toLowerCase() === mentionedUser);
      if (member && member.id !== currentUser) {
        sendNotification(member.id, 'mention', updatedPost);
      }
    });
    
    setNewComment('');
  };

  const toggleChecklist = (key) => {
    if (!editingPost) return;
    setEditingPost({
      ...editingPost,
      checklist: { ...editingPost.checklist, [key]: !editingPost.checklist?.[key] }
    });
  };

  const addTag = (tagToAdd) => {
    const tag = tagToAdd || newTag;
    if (!editingPost || !tag || !tag.trim()) return;
    if (!editingPost.tags?.includes(tag.trim())) {
      setEditingPost(prev => ({ ...prev, tags: [...(prev.tags || []), tag.trim()] }));
    }
    setNewTag('');
  };

  const removeTag = (tag) => {
    if (!editingPost) return;
    setEditingPost({ ...editingPost, tags: editingPost.tags?.filter(t => t !== tag) || [] });
  };

  const getChecklistProgress = (post) => {
    if (!post.checklist) return 0;
    const total = Object.keys(post.checklist).length;
    const done = Object.values(post.checklist).filter(Boolean).length;
    return Math.round((done / total) * 100);
  };

  const getMember = (id) => teamMembers.find(m => m.id === id) || teamMembers[0];

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingPost(prev => ({ ...prev, image: event.target.result, mediaType: 'image' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCarouselUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const promises = files.slice(0, 10).map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(promises).then(images => {
        setEditingPost(prev => ({ 
          ...prev, 
          carousel: [...(prev.carousel || []), ...images].slice(0, 10),
          mediaType: 'carousel'
        }));
      });
    }
    e.target.value = '';
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingPost(prev => ({ ...prev, video: event.target.result, mediaType: 'video' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCarouselImage = (index) => {
    setEditingPost(prev => ({
      ...prev,
      carousel: prev.carousel.filter((_, i) => i !== index)
    }));
  };

  // Drag & Drop
  const handleDragStart = (e, post) => {
    draggedPostRef.current = post;
    setDraggedPost(post);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', post.id);
  };

  const handleDragOver = (e, dateStr) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(dateStr);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDrop = (e, dateStr) => {
    e.preventDefault();
    const postToMove = draggedPostRef.current;
    if (postToMove) {
      const updatedPost = addHistoryEntry({ ...postToMove, date: dateStr }, `Spostato al ${new Date(dateStr).toLocaleDateString('it-IT')}`);
      setPosts(prev => prev.map(p => p.id === postToMove.id ? updatedPost : p));
    }
    draggedPostRef.current = null;
    setDraggedPost(null);
    setDragOverDate(null);
  };

  const handleDragEnd = () => {
    draggedPostRef.current = null;
    setDraggedPost(null);
    setDragOverDate(null);
    setDragOverStatus(null);
  };

  const exportToCSV = () => {
    const headers = ['Data', 'Ora', 'Testo', 'Piattaforme', 'Status', 'Priorità', 'CTA'];
    const rows = filteredPosts.map(p => [
      p.date,
      p.time || '',
      `"${(p.text || '').replace(/"/g, '""')}"`,
      p.platforms?.join(', ') || '',
      statusConfig[p.status]?.label || '',
      priorityConfig[p.priority]?.label || '',
      p.tags?.join(', ') || ''
    ]);
    const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `piano-editoriale-enooso-${formatDate(new Date())}.csv`;
    link.click();
  };

  const urgentPosts = posts.filter(p => {
    const days = getDaysUntil(p.date);
    return days >= 0 && days <= 3 && p.status !== 'pubblicato';
  });

  const tasksForGaia = posts.filter(p => {
    if (p.status === 'pubblicato') return false;
    const isVideoPost = p.mediaType === 'video';
    if (isVideoPost) return !p.checklist?.video;
    return !p.checklist?.grafica;
  });
  
  const tasksForViola = posts.filter(p => {
    if (p.status === 'pubblicato') return false;
    return !p.checklist?.testo;
  });

  const renderCommentText = (text) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        const name = part.slice(1).toLowerCase();
        const member = teamMembers.find(m => m.id === name || m.name.toLowerCase() === name);
        if (member) {
          return (
            <span key={i} className={`px-1 py-0.5 rounded bg-gradient-to-r ${member.color} text-white text-xs font-medium`}>
              {part}
            </span>
          );
        }
      }
      return part;
    });
  };

  const getCharCount = (text, platform) => {
    const count = text?.length || 0;
    const limit = platformLimits[platform] || 2200;
    const isOver = count > limit;
    return { count, limit, isOver };
  };

  // Post Card Component
  const PostCard = ({ post, compact = false, showDelete = true, showActions = true }) => {
    const status = statusConfig[post.status] || statusConfig.idea;
    
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, post)}
        onDragEnd={handleDragEnd}
        onClick={(e) => handlePostClick(post, e)}
        className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg border-2 border-transparent hover:border-emerald-300 bg-white ${compact ? 'h-20' : 'h-32'} ${draggedPost?.id === post.id ? 'opacity-50' : ''}`}
      >
        {post.image ? (
          <>
            <img src={post.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-50 to-stone-100" />
        )}
        
        <div className="absolute top-1.5 left-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${status.color} text-white shadow-sm`}>
            {status.label}
          </span>
        </div>
        
        {showActions && showDelete && (
          <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button 
              onClick={(e) => { e.stopPropagation(); handleDelete(post.id, e); }}
              className="p-1.5 bg-red-500 hover:bg-red-600 rounded-lg shadow-lg transition-colors"
            >
              <Trash2 className="w-3 h-3 text-white" />
            </button>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <p className={`font-medium drop-shadow-sm ${post.image ? 'text-white' : 'text-stone-700'} ${compact ? 'text-[11px] line-clamp-1' : 'text-xs line-clamp-2'}`}>
            {post.text || 'Senza testo...'}
          </p>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              {post.time && (
                <span className={`text-[10px] ${post.image ? 'text-white/80' : 'text-stone-500'}`}>
                  {post.time}
                </span>
              )}
            </div>
            <div className="flex gap-0.5">
              {post.platforms?.includes('instagram') && <div className="w-4 h-4 bg-white/90 rounded flex items-center justify-center"><InstagramIcon /></div>}
              {post.platforms?.includes('facebook') && <div className="w-4 h-4 bg-white/90 rounded flex items-center justify-center"><FacebookIcon /></div>}
              {post.platforms?.includes('tiktok') && <div className="w-4 h-4 bg-white/90 rounded flex items-center justify-center"><TikTokIcon /></div>}
              {post.platforms?.includes('youtube') && <div className="w-4 h-4 bg-white/90 rounded flex items-center justify-center"><YouTubeIcon /></div>}
            </div>
          </div>
        </div>
        
        {post.priority === 'alta' && (
          <div className="absolute top-1.5 right-1.5 group-hover:opacity-0 transition-opacity">
            <span className="w-2 h-2 bg-red-500 rounded-full block animate-pulse"></span>
          </div>
        )}
      </div>
    );
  };

  // Month View
  const MonthView = () => {
    const days = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
    const daysFull = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startDay = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    
    const cells = [];
    for (let i = 0; i < startDay; i++) {
      cells.push({ day: prevMonthDays - startDay + i + 1, currentMonth: false, date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - startDay + i + 1) });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({ day: i, currentMonth: true, date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i) });
    }
    for (let i = 1; cells.length < 42; i++) {
      cells.push({ day: i, currentMonth: false, date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i) });
    }

    return (
      <div className="bg-white/80 backdrop-blur rounded-2xl md:rounded-3xl p-2 md:p-4 shadow-xl border border-white/50">
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-1 md:mb-2">
          {days.map((d, i) => (
            <div key={d + i} className="text-center text-xs md:text-sm font-bold text-stone-500 py-1 md:py-2">
              <span className="md:hidden">{d}</span>
              <span className="hidden md:inline">{daysFull[i]}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {cells.map((cell, idx) => {
            const dateStr = formatDate(cell.date);
            const dayPosts = getPostsForDate(dateStr);
            const isToday = dateStr === todayStr;
            const isDragOver = dragOverDate === dateStr;
            
            return (
              <div
                key={idx}
                onClick={() => dayPosts.length === 0 ? handleDayClick(dateStr) : handlePostClick(dayPosts[0])}
                onDragOver={(e) => handleDragOver(e, dateStr)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, dateStr)}
                className={`min-h-[60px] md:min-h-[140px] p-1 md:p-2 rounded-lg md:rounded-2xl transition-all cursor-pointer
                  ${cell.currentMonth ? 'bg-white' : 'bg-stone-50/50'}
                  ${isToday ? 'ring-2 ring-emerald-500 ring-offset-1 md:ring-offset-2' : ''}
                  ${isDragOver ? 'bg-emerald-100 ring-2 ring-emerald-400 ring-dashed' : 'hover:bg-emerald-50/50'}
                  ${dayPosts.length === 0 ? 'hover:shadow-md' : ''}`}
              >
                <div className={`text-xs md:text-sm font-bold mb-0.5 md:mb-2 ${isToday ? 'text-emerald-600' : cell.currentMonth ? 'text-stone-700' : 'text-stone-300'}`}>
                  {cell.day}
                </div>
                <div className="md:hidden flex flex-wrap gap-0.5">
                  {dayPosts.slice(0, 3).map(post => (
                    <div key={post.id} className={`w-2 h-2 rounded-full ${statusConfig[post.status]?.color || 'bg-stone-400'}`} />
                  ))}
                  {dayPosts.length > 3 && <span className="text-[8px] text-stone-400">+{dayPosts.length - 3}</span>}
                </div>
                <div className="hidden md:block space-y-1">
                  {dayPosts.slice(0, 2).map(post => (
                    <PostCard key={post.id} post={post} compact={dayPosts.length > 1} />
                  ))}
                  {dayPosts.length > 2 && (
                    <button className="w-full text-xs text-emerald-600 font-bold text-center py-1 bg-emerald-50 rounded-lg hover:bg-emerald-100">
                      +{dayPosts.length - 2} altri
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Week View
  const WeekView = () => {
    const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    return (
      <div className="bg-white/80 backdrop-blur rounded-2xl md:rounded-3xl p-2 md:p-4 shadow-xl border border-white/50">
        <div className="md:hidden space-y-2">
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            const dateStr = formatDate(date);
            const dayPosts = getPostsForDate(dateStr);
            const isToday = dateStr === todayStr;

            return (
              <div
                key={i}
                onClick={() => dayPosts.length === 0 && handleDayClick(dateStr)}
                className={`p-3 rounded-xl transition-all ${isToday ? 'bg-emerald-50 ring-2 ring-emerald-500' : 'bg-white'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`font-bold ${isToday ? 'text-emerald-600' : 'text-stone-700'}`}>
                    {days[i]} {date.getDate()}
                  </div>
                  {dayPosts.length > 0 && (
                    <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">{dayPosts.length} post</span>
                  )}
                </div>
                <div className="space-y-2">
                  {dayPosts.map(post => (
                    <PostCard key={post.id} post={post} compact />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="hidden md:grid grid-cols-7 gap-3">
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            const dateStr = formatDate(date);
            const dayPosts = getPostsForDate(dateStr);
            const isToday = dateStr === todayStr;
            const isDragOver = dragOverDate === dateStr;

            return (
              <div
                key={i}
                onClick={() => dayPosts.length === 0 && handleDayClick(dateStr)}
                onDragOver={(e) => handleDragOver(e, dateStr)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, dateStr)}
                className={`min-h-[300px] p-3 rounded-2xl transition-all
                  ${isToday ? 'bg-emerald-50 ring-2 ring-emerald-500' : 'bg-white'}
                  ${isDragOver ? 'bg-emerald-100 ring-2 ring-emerald-400 ring-dashed' : ''}`}
              >
                <div className="text-center mb-3">
                  <div className="text-xs font-medium text-stone-500">{days[i]}</div>
                  <div className={`text-2xl font-bold ${isToday ? 'text-emerald-600' : 'text-stone-700'}`}>{date.getDate()}</div>
                </div>
                <div className="space-y-2">
                  {dayPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                  {dayPosts.length === 0 && (
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-stone-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50">
                      <Plus className="w-6 h-6 text-stone-400" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // List View
  const ListView = () => (
    <div className="space-y-3">
      {filteredPosts.length === 0 ? (
        <div className="bg-white/80 backdrop-blur rounded-3xl p-12 text-center">
          <Calendar className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 text-lg">Nessun post trovato</p>
        </div>
      ) : filteredPosts.sort((a, b) => a.date.localeCompare(b.date)).map(post => {
        const daysUntil = getDaysUntil(post.date);
        const progress = getChecklistProgress(post);
        
        return (
          <div key={post.id} className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all cursor-pointer group">
            <div className="flex gap-4">
              {post.image ? <img src={post.image} alt="" onClick={(e) => handlePostClick(post, e)} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                : <div onClick={(e) => handlePostClick(post, e)} className="w-20 h-20 rounded-xl bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center flex-shrink-0"><Image className="w-8 h-8 text-stone-400" /></div>}
              <div className="flex-1 min-w-0" onClick={(e) => handlePostClick(post, e)}>
                <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${statusConfig[post.status]?.color || 'bg-stone-400'}`}>
                      {statusConfig[post.status]?.label || post.status}
                    </span>
                    {post.priority && (
                      <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${priorityConfig[post.priority]?.color}`}>
                        {priorityConfig[post.priority]?.label}
                      </span>
                    )}
                    {daysUntil >= 0 && daysUntil <= 3 && post.status !== 'pubblicato' && (
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {daysUntil === 0 ? 'Oggi!' : `${daysUntil}g`}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold text-stone-600">
                      {new Date(post.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
                      {post.time && <span className="text-stone-400 ml-1">{post.time}</span>}
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDuplicate(post, e); }}
                      className="p-1.5 bg-blue-100 hover:bg-blue-500 hover:text-white text-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(post.id, e); }}
                      className="p-1.5 bg-red-100 hover:bg-red-500 hover:text-white text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-stone-800 font-medium line-clamp-2 mb-2">{post.text || <span className="text-stone-400 italic">Nessun testo</span>}</p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {post.platforms?.includes('instagram') && <InstagramIcon />}
                      {post.platforms?.includes('facebook') && <FacebookIcon />}
                      {post.platforms?.includes('tiktok') && <TikTokIcon />}
                      {post.platforms?.includes('youtube') && <YouTubeIcon />}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-stone-500 text-sm">
                    {post.comments?.length > 0 && <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {post.comments.length}</span>}
                    <div className="flex items-center gap-1">
                      <div className="w-12 h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs font-medium">{progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Edit Form
  if (editingPost) {
    const charInfo = editingPost.platforms?.[0] ? getCharCount(editingPost.text, editingPost.platforms[0]) : { count: 0, limit: 2200, isOver: false };
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-2 md:p-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setEditingPost(null)} className="mb-3 md:mb-4 flex items-center gap-1 md:gap-2 text-stone-600 hover:text-stone-800 font-medium text-sm md:text-base">
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" /> Torna al calendario
          </button>
          <div className="bg-white/80 backdrop-blur rounded-2xl md:rounded-3xl shadow-xl border border-white/50 overflow-hidden">
            <div className={`${statusConfig[editingPost.status]?.color || 'bg-stone-400'} p-4 md:p-5 text-white`}>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg md:text-xl font-bold">
                    {new Date(editingPost.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                    {editingPost.time && <span className="ml-2 opacity-90">• {editingPost.time}</span>}
                  </h2>
                </div>
                <span className="px-3 py-1.5 bg-white/20 rounded-lg font-bold text-sm uppercase">{statusConfig[editingPost.status]?.label}</span>
              </div>
            </div>
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4" /> Data</label>
                  <input 
                    type="date" 
                    value={editingPost.date} 
                    onChange={e => setEditingPost({...editingPost, date: e.target.value})} 
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none mt-2" 
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-2"><Clock className="w-4 h-4" /> Orario</label>
                  <input 
                    type="time" 
                    value={editingPost.time || ''} 
                    onChange={e => setEditingPost({...editingPost, time: e.target.value})} 
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none mt-2" 
                  />
                </div>
              </div>

              {/* Media Type Selector */}
              <div>
                <label className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-2"><Camera className="w-4 h-4" /> Contenuto Media</label>
                <div className="flex gap-2 mt-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setEditingPost(prev => ({ ...prev, mediaType: 'image' }))}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                      (!editingPost.mediaType || editingPost.mediaType === 'image') 
                        ? 'bg-emerald-500 text-white shadow-lg' 
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <Image className="w-4 h-4" /> Immagine
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPost(prev => ({ ...prev, mediaType: 'carousel' }))}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                      editingPost.mediaType === 'carousel' 
                        ? 'bg-emerald-500 text-white shadow-lg' 
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <Images className="w-4 h-4" /> Carosello
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPost(prev => ({ ...prev, mediaType: 'video' }))}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                      editingPost.mediaType === 'video' 
                        ? 'bg-emerald-500 text-white shadow-lg' 
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <Film className="w-4 h-4" /> Video
                  </button>
                </div>

                {/* Image Upload */}
                {(!editingPost.mediaType || editingPost.mediaType === 'image') && (
                  <>
                    {editingPost.image ? (
                      <div className="relative rounded-2xl overflow-hidden">
                        <img src={editingPost.image} alt="" className="w-full h-48 object-cover" />
                        <button onClick={() => setEditingPost({...editingPost, image: ''})} className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"><X className="w-5 h-5" /></button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center">
                        <Image className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                        <p className="text-sm text-stone-500 mb-3">Carica un'immagine</p>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg flex items-center gap-2 text-sm mx-auto">
                          <Upload className="w-4 h-4" /> Carica
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </div>
                    )}
                  </>
                )}

                {/* Carousel Upload */}
                {editingPost.mediaType === 'carousel' && (
                  <div className="border-2 border-dashed border-stone-200 rounded-2xl p-4">
                    {editingPost.carousel?.length > 0 ? (
                      <div className="space-y-3">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {editingPost.carousel.map((img, idx) => (
                            <div key={idx} className="relative flex-shrink-0">
                              <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                              <button 
                                type="button"
                                onClick={() => removeCarouselImage(idx)} 
                                className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          {editingPost.carousel.length < 10 && (
                            <button 
                              type="button"
                              onClick={() => carouselInputRef.current?.click()}
                              className="w-20 h-20 border-2 border-dashed border-stone-300 rounded-lg flex items-center justify-center text-stone-400 hover:border-emerald-400 hover:text-emerald-500"
                            >
                              <Plus className="w-6 h-6" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 text-center">{editingPost.carousel.length}/10 immagini</p>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Images className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                        <p className="text-sm text-stone-500 mb-3">Carica fino a 10 immagini</p>
                        <button type="button" onClick={() => carouselInputRef.current?.click()} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg flex items-center gap-2 text-sm mx-auto">
                          <Upload className="w-4 h-4" /> Carica immagini
                        </button>
                      </div>
                    )}
                    <input ref={carouselInputRef} type="file" accept="image/*" multiple onChange={handleCarouselUpload} className="hidden" />
                  </div>
                )}

                {/* Video Upload */}
                {editingPost.mediaType === 'video' && (
                  <>
                    {editingPost.video ? (
                      <div className="relative rounded-2xl overflow-hidden bg-black">
                        <video src={editingPost.video} className="w-full h-48 object-contain" controls />
                        <button onClick={() => setEditingPost({...editingPost, video: ''})} className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"><X className="w-5 h-5" /></button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center">
                        <Film className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                        <p className="text-sm text-stone-500 mb-3">Carica un video</p>
                        <button type="button" onClick={() => videoInputRef.current?.click()} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg flex items-center gap-2 text-sm mx-auto">
                          <Upload className="w-4 h-4" /> Carica video
                        </button>
                        <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Caption */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-stone-700 flex items-center gap-2"><PenTool className="w-4 h-4" /> Caption</label>
                  <span className={`text-xs font-medium ${charInfo.isOver ? 'text-red-500' : 'text-stone-400'}`}>
                    {charInfo.count} / {charInfo.limit}
                  </span>
                </div>
                <textarea 
                  value={editingPost.text} 
                  onChange={e => setEditingPost({...editingPost, text: e.target.value})} 
                  rows={4} 
                  className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 outline-none resize-none ${charInfo.isOver ? 'border-red-300 focus:ring-red-400' : 'border-stone-200 focus:ring-emerald-400'}`} 
                  placeholder="Scrivi la caption..." 
                />
              </div>

              {/* Platforms */}
              <div>
                <label className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-2"><Smartphone className="w-4 h-4" /> Piattaforme</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 mt-2">
                  {['instagram', 'facebook', 'tiktok', 'youtube'].map(platform => (
                    <button key={platform} onClick={() => {
                      const platforms = editingPost.platforms?.includes(platform) ? editingPost.platforms.filter(p => p !== platform) : [...(editingPost.platforms || []), platform];
                      setEditingPost({...editingPost, platforms});
                    }} className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 transition-all ${editingPost.platforms?.includes(platform) ? 'border-emerald-400 bg-emerald-50' : 'border-stone-200 hover:border-stone-300'}`}>
                      <div className="w-5 h-5 flex-shrink-0">
                        {platform === 'instagram' && <InstagramIcon />}
                        {platform === 'facebook' && <FacebookIcon />}
                        {platform === 'tiktok' && <TikTokIcon />}
                        {platform === 'youtube' && <YouTubeIcon />}
                      </div>
                      <span className="font-medium capitalize text-sm">{platform}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Status</label>
                  <select value={editingPost.status} onChange={e => setEditingPost({...editingPost, status: e.target.value})} className="w-full px-3 md:px-4 py-2 md:py-3 border border-stone-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none text-sm md:text-base mt-2">
                    {Object.entries(statusConfig).map(([key, config]) => <option key={key} value={key}>{config.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-2"><Flag className="w-4 h-4" /> Priorità</label>
                  <select value={editingPost.priority || 'media'} onChange={e => setEditingPost({...editingPost, priority: e.target.value})} className="w-full px-3 md:px-4 py-2 md:py-3 border border-stone-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none text-sm md:text-base mt-2">
                    {Object.entries(priorityConfig).map(([key, config]) => <option key={key} value={key}>{config.label}</option>)}
                  </select>
                </div>
              </div>

              {/* CTA Tags */}
              <div>
                <label className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-2"><Tag className="w-4 h-4" /> CTA</label>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {editingPost.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium flex items-center gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newTag} 
                    onChange={e => setNewTag(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && addTag(newTag)}
                    placeholder="Aggiungi CTA..." 
                    className="flex-1 px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none" 
                  />
                  <button onClick={() => addTag()} className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {defaultTags.filter(t => !editingPost.tags?.includes(t)).slice(0, 5).map(tag => (
                    <button key={tag} onClick={() => addTag(tag)} className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-xs">
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checklist */}
              <div>
                <label className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-2"><CheckSquare className="w-4 h-4" /> Checklist</label>
                <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-3 mt-2">
                  {editingPost.mediaType !== 'video' && (
                    <button onClick={() => toggleChecklist('grafica')} className={`flex items-center justify-center md:justify-start gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl border-2 transition-all text-xs md:text-base ${editingPost.checklist?.grafica ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-stone-200 text-stone-500 hover:border-stone-300'}`}>
                      {editingPost.checklist?.grafica ? <CheckSquare className="w-4 h-4 md:w-5 md:h-5" /> : <Square className="w-4 h-4 md:w-5 md:h-5" />}
                      <Palette className="w-3 h-3 md:w-4 md:h-4 hidden md:block" />
                      <span className="font-medium">Grafica</span>
                    </button>
                  )}
                  <button onClick={() => toggleChecklist('testo')} className={`flex items-center justify-center md:justify-start gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl border-2 transition-all text-xs md:text-base ${editingPost.checklist?.testo ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-stone-200 text-stone-500 hover:border-stone-300'}`}>
                    {editingPost.checklist?.testo ? <CheckSquare className="w-4 h-4 md:w-5 md:h-5" /> : <Square className="w-4 h-4 md:w-5 md:h-5" />}
                    <PenTool className="w-3 h-3 md:w-4 md:h-4 hidden md:block" />
                    <span className="font-medium">Testo</span>
                  </button>
                  {editingPost.mediaType === 'video' && (
                    <button onClick={() => toggleChecklist('video')} className={`flex items-center justify-center md:justify-start gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl border-2 transition-all text-xs md:text-base ${editingPost.checklist?.video ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-stone-200 text-stone-500 hover:border-stone-300'}`}>
                      {editingPost.checklist?.video ? <CheckSquare className="w-4 h-4 md:w-5 md:h-5" /> : <Square className="w-4 h-4 md:w-5 md:h-5" />}
                      <Video className="w-3 h-3 md:w-4 md:h-4 hidden md:block" />
                      <span className="font-medium">Video</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Drive Link */}
              <div>
                <label className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-2"><Link className="w-4 h-4" /> Link Google Drive</label>
                <div className="flex gap-2 mt-2">
                  <input type="text" value={editingPost.driveLink || ''} onChange={e => setEditingPost({...editingPost, driveLink: e.target.value})} className="flex-1 px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none" placeholder="https://drive.google.com/..." />
                  {editingPost.driveLink && <a href={editingPost.driveLink} target="_blank" rel="noopener noreferrer" className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"><ExternalLink className="w-5 h-5" /></a>}
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Commenti ({editingPost.comments?.length || 0})</label>
                <p className="text-xs text-stone-400 mb-2">Usa @nome per menzionare (es. @gaia, @viola)</p>
                <div className="bg-stone-50 rounded-2xl p-4 space-y-3 max-h-48 overflow-y-auto mt-2">
                  {editingPost.comments?.length === 0 && <p className="text-stone-400 text-center py-4">Nessun commento</p>}
                  {editingPost.comments?.map(comment => {
                    const author = getMember(comment.author);
                    const AuthorIcon = author.icon;
                    return (
                      <div key={comment.id} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${author.color} flex items-center justify-center text-white flex-shrink-0`}>
                          <AuthorIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-bold text-stone-700">{author.name}</span>
                            <span className="text-xs text-stone-400">{new Date(comment.timestamp).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-stone-600">{renderCommentText(comment.text)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2 mt-3">
                  <input 
                    type="text" 
                    value={newComment} 
                    onChange={e => setNewComment(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleAddComment()} 
                    className="flex-1 px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none" 
                    placeholder="Scrivi un commento..." 
                  />
                  <button onClick={handleAddComment} disabled={!newComment.trim()} className="px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50"><Send className="w-5 h-5" /></button>
                </div>
              </div>

              {/* History */}
              {editingPost.history?.length > 0 && (
                <div>
                  <button 
                    onClick={() => setShowHistory(!showHistory)} 
                    className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-2 hover:text-emerald-600"
                  >
                    <History className="w-4 h-4" /> Storico ({editingPost.history.length})
                    {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {showHistory && (
                    <div className="bg-stone-50 rounded-2xl p-4 space-y-2 max-h-48 overflow-y-auto mt-2">
                      {editingPost.history.slice().reverse().map((entry, i) => {
                        const author = getMember(entry.author);
                        return (
                          <div key={i} className="flex items-center gap-3 text-sm">
                            <span className={`w-6 h-6 rounded-full bg-gradient-to-r ${author.color} flex items-center justify-center flex-shrink-0`}>
                              <author.icon className="w-3 h-3 text-white" />
                            </span>
                            <span className="text-stone-600">{entry.action}</span>
                            <span className="text-stone-400 text-xs ml-auto">
                              {new Date(entry.timestamp).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 md:gap-3 pt-3 md:pt-4 border-t border-stone-200">
                <button onClick={handleSave} className="flex-1 py-3 md:py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base">
                  <Save className="w-4 h-4 md:w-5 md:h-5" /> Salva
                </button>
                {editingPost.id && (
                  <button onClick={() => handleDelete(editingPost.id)} className="px-4 md:px-6 py-3 md:py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600">
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main View
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-2 md:p-4">
      <div className="max-w-7xl mx-auto space-y-2 md:space-y-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-4 md:p-5 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold">Piano Editoriale</h1>
              <p className="text-emerald-100 text-xs md:text-sm">Enooso • Social Management</p>
            </div>
          </div>
        </div>

        {/* Task Section */}
        {(tasksForGaia.length > 0 || tasksForViola.length > 0 || urgentPosts.length > 0) && (
          <div className="bg-white/80 backdrop-blur rounded-xl p-3 shadow-lg border border-white/50">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold text-stone-700">Da completare:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {urgentPosts.length > 0 && (
                  <button 
                    onClick={() => setExpandedTaskSection(expandedTaskSection === 'urgent' ? null : 'urgent')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${expandedTaskSection === 'urgent' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">{urgentPosts.length} Urgenti</span>
                  </button>
                )}
                {tasksForGaia.length > 0 && (
                  <button 
                    onClick={() => setExpandedTaskSection(expandedTaskSection === 'gaia' ? null : 'gaia')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${expandedTaskSection === 'gaia' ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`}
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">{tasksForGaia.length} Gaia</span>
                  </button>
                )}
                {tasksForViola.length > 0 && (
                  <button 
                    onClick={() => setExpandedTaskSection(expandedTaskSection === 'viola' ? null : 'viola')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${expandedTaskSection === 'viola' ? 'bg-violet-500 text-white' : 'bg-violet-100 text-violet-600 hover:bg-violet-200'}`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">{tasksForViola.length} Viola</span>
                  </button>
                )}
              </div>
            </div>
            
            {expandedTaskSection && (
              <div className="mt-3 pt-3 border-t border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-600">
                    {expandedTaskSection === 'urgent' && 'Post urgenti'}
                    {expandedTaskSection === 'gaia' && 'Task per Gaia'}
                    {expandedTaskSection === 'viola' && 'Task per Viola'}
                  </span>
                  <button onClick={() => setExpandedTaskSection(null)} className="p-0.5 hover:bg-stone-100 rounded">
                    <X className="w-3.5 h-3.5 text-stone-400" />
                  </button>
                </div>
                <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                  {(expandedTaskSection === 'urgent' ? urgentPosts :
                    expandedTaskSection === 'gaia' ? tasksForGaia :
                    tasksForViola
                  ).map(post => (
                    <div 
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                      className="flex items-center gap-2 p-2 bg-white rounded-lg border border-stone-100 hover:shadow-sm cursor-pointer"
                    >
                      {post.image ? (
                        <img src={post.image} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />
                      ) : (
                        <div className={`w-8 h-8 rounded ${statusConfig[post.status]?.color || 'bg-stone-400'} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white font-bold text-xs">{post.status?.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-stone-700 line-clamp-1">{post.text || 'Senza testo...'}</p>
                        <span className="text-[10px] text-stone-500">
                          {new Date(post.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border border-white/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-stone-100 rounded-xl p-1">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-lg"><ChevronLeft className="w-5 h-5 text-stone-600" /></button>
                <button onClick={goToToday} className="px-3 py-2 font-medium text-stone-700 hover:bg-white rounded-lg text-sm">Oggi</button>
                <button onClick={() => navigate(1)} className="p-2 hover:bg-white rounded-lg"><ChevronRight className="w-5 h-5 text-stone-600" /></button>
              </div>
              <span className="text-sm sm:text-lg font-bold text-stone-700 capitalize">
                {currentDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {viewMode === 'calendar' && (
                <div className="hidden md:flex items-center bg-stone-100 rounded-xl p-1">
                  <button onClick={zoomOut} disabled={zoomLevel === 'trimestre'} className="p-2 hover:bg-white rounded-lg disabled:opacity-30">
                    <ZoomOut className="w-4 h-4 text-stone-600" />
                  </button>
                  <span className="px-3 text-xs font-medium text-stone-500 capitalize min-w-[70px] text-center">{zoomLevel}</span>
                  <button onClick={zoomIn} disabled={zoomLevel === 'settimana'} className="p-2 hover:bg-white rounded-lg disabled:opacity-30">
                    <ZoomIn className="w-4 h-4 text-stone-600" />
                  </button>
                </div>
              )}

              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className={`p-2.5 rounded-xl transition-all ${showFilters ? 'bg-emerald-500 text-white shadow-lg' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
              >
                <Filter className="w-5 h-5" />
              </button>

              <div className="flex bg-stone-100 rounded-xl p-1">
                <button 
                  onClick={() => setViewMode('calendar')} 
                  className={`p-2.5 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white shadow text-emerald-600' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow text-emerald-600' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <button 
                onClick={() => handleDayClick(formatDate(new Date()))} 
                className="p-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-stone-700 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-500" /> Filtri
              </h4>
              <button 
                onClick={() => setFilters({ status: 'all', platform: 'all', tag: 'all', priority: 'all', dateFrom: '', dateTo: '' })}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Reset tutti
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1.5 block">Status</label>
                <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="w-full px-3 py-2 bg-stone-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400">
                  <option value="all">Tutti</option>
                  {Object.entries(statusConfig).map(([key, config]) => <option key={key} value={key}>{config.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1.5 block">Piattaforma</label>
                <select value={filters.platform} onChange={e => setFilters({...filters, platform: e.target.value})} className="w-full px-3 py-2 bg-stone-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400">
                  <option value="all">Tutte</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1.5 block">CTA</label>
                <select value={filters.tag} onChange={e => setFilters({...filters, tag: e.target.value})} className="w-full px-3 py-2 bg-stone-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400">
                  <option value="all">Tutti</option>
                  {allTags.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1.5 block">Priorità</label>
                <select value={filters.priority} onChange={e => setFilters({...filters, priority: e.target.value})} className="w-full px-3 py-2 bg-stone-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400">
                  <option value="all">Tutte</option>
                  {Object.entries(priorityConfig).map(([key, config]) => <option key={key} value={key}>{config.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1.5 block">Da</label>
                <input type="date" value={filters.dateFrom} onChange={e => setFilters({...filters, dateFrom: e.target.value})} className="w-full px-3 py-2 bg-stone-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1.5 block">A</label>
                <input type="date" value={filters.dateTo} onChange={e => setFilters({...filters, dateTo: e.target.value})} className="w-full px-3 py-2 bg-stone-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400" />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {viewMode === 'calendar' ? (
          zoomLevel === 'settimana' ? <WeekView /> : <MonthView />
        ) : (
          <ListView />
        )}
      </div>
      
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-pulse">
          <div className="bg-stone-800 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm">
            <p className="text-sm">{toast}</p>
            <button onClick={() => setToast(null)} className="text-white/60 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
