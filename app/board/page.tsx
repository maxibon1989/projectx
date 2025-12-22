'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { PageLayout } from '@/components/layout';
import {
  Card,
  CardBody,
  Button,
  Modal,
  TextArea,
  Badge,
  Avatar,
  EmptyState,
} from '@/components/ui';
import { BoardPost } from '@/types';
import { formatRelativeTime, generateId } from '@/lib/utils';
import {
  FiMessageSquare,
  FiPlus,
  FiBookmark,
  FiEdit2,
  FiTrash2,
} from 'react-icons/fi';

export default function BoardPage() {
  const { state, dispatch, getHouseById, getBoardPostsForHouse, getMemberById } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BoardPost | null>(null);
  const [content, setContent] = useState('');

  const selectedHouse = state.selectedHouseId
    ? getHouseById(state.selectedHouseId)
    : null;

  const posts = selectedHouse ? getBoardPostsForHouse(selectedHouse.id) : [];

  const resetForm = () => {
    setContent('');
    setEditingPost(null);
  };

  const handleSubmit = () => {
    if (!selectedHouse || !content.trim()) return;

    if (editingPost) {
      const updatedPost: BoardPost = {
        ...editingPost,
        content: content.trim(),
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_BOARD_POST', payload: updatedPost });
    } else {
      const newPost: BoardPost = {
        id: generateId(),
        houseId: selectedHouse.id,
        authorId: state.currentUser?.id || '',
        content: content.trim(),
        isPinned: false,
        createdAt: new Date(),
      };
      dispatch({ type: 'ADD_BOARD_POST', payload: newPost });
    }

    resetForm();
    setShowModal(false);
  };

  const handleTogglePin = (post: BoardPost) => {
    dispatch({
      type: 'UPDATE_BOARD_POST',
      payload: { ...post, isPinned: !post.isPinned },
    });
  };

  const handleDelete = (postId: string) => {
    if (confirm('Delete this post?')) {
      dispatch({ type: 'DELETE_BOARD_POST', payload: postId });
    }
  };

  const openEditModal = (post: BoardPost) => {
    setEditingPost(post);
    setContent(post.content);
    setShowModal(true);
  };

  const canManagePost = (post: BoardPost) => {
    return (
      post.authorId === state.currentUser?.id ||
      state.currentUser?.role === 'owner' ||
      state.currentUser?.role === 'cohost'
    );
  };

  if (!selectedHouse) {
    return (
      <PageLayout>
        <EmptyState
          icon={<FiMessageSquare className="w-8 h-8" />}
          title="No property selected"
          description="Select a property from the sidebar to view internal notes."
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Internal Notes</h1>
            <p className="text-slate-500 text-sm mt-1">
              Notes and reminders for {selectedHouse.name}
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <FiPlus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <EmptyState
            icon={<FiMessageSquare className="w-8 h-8" />}
            title="No notes yet"
            description="Share internal notes and reminders with co-hosts."
            actionLabel="Create Post"
            onAction={() => setShowModal(true)}
          />
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const author = getMemberById(post.authorId);
              return (
                <Card key={post.id}>
                  <CardBody className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar name={author?.name || 'Unknown'} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-800">
                            {author?.name || 'Unknown'}
                          </span>
                          {post.isPinned && (
                            <Badge variant="warning" size="sm">
                              <FiBookmark className="w-3 h-3 mr-1" />
                              Pinned
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-700 whitespace-pre-wrap break-words">
                          {post.content}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-slate-400">
                            {formatRelativeTime(post.createdAt)}
                            {post.updatedAt && ' (edited)'}
                          </p>
                          {canManagePost(post) && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleTogglePin(post)}
                                className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                                title={post.isPinned ? 'Unpin' : 'Pin'}
                              >
                                <FiBookmark className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditModal(post)}
                                className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                                title="Edit"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(post.id)}
                                className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600"
                                title="Delete"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingPost ? 'Edit Post' : 'New Post'}
        size="md"
      >
        <div className="p-4 space-y-4">
          <TextArea
            placeholder="Share an announcement, reminder, or note..."
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          />
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              fullWidth
              disabled={!content.trim()}
            >
              {editingPost ? 'Save Changes' : 'Post'}
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}
