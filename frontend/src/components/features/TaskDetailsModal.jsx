import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Paperclip, MessageSquare, Send, File, Trash2, Download } from "lucide-react";
import { tasksApi } from "../../api/tasks";
import { commentsApi } from "../../api/comments";
import { attachmentsApi } from "../../api/attachments";
import { useAuthStore } from "../../store/authStore";
import { cn } from "../../utils/utils";

export default function TaskDetailsModal({ task, onClose }) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [newComment, setNewComment] = useState("");

  const { data: comments = [], isLoading: loadingComments } = useQuery({
    queryKey: ["comments", task.id],
    queryFn: () => commentsApi.list(task.id),
  });

  const { data: attachments = [], isLoading: loadingAttachments } = useQuery({
    queryKey: ["attachments", task.id],
    queryFn: () => attachmentsApi.list(task.id),
  });

  const updateStatus = useMutation({
    mutationFn: (status) => tasksApi.updateStatus(task.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // We don't necessarily update the local task object, React Query refetch of tasks will update the list
      // For immediate feedback, we can optimistically update or just let the user see the change when they close
    },
  });

  const addComment = useMutation({
    mutationFn: () => commentsApi.create(task.id, newComment),
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", task.id] });
    },
  });

  const deleteComment = useMutation({
    mutationFn: (commentId) => commentsApi.remove(task.id, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", task.id] });
    },
  });

  const uploadAttachment = useMutation({
    mutationFn: (file) => attachmentsApi.upload(task.id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", task.id] });
    },
  });

  const deleteAttachment = useMutation({
    mutationFn: (attachmentId) => attachmentsApi.remove(task.id, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", task.id] });
    },
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAttachment.mutate(file);
    }
  };

  const isAssignee = task.assignee?.id === user?.id;
  const canEditStatus = user?.role === "ADMIN" || user?.role === "MANAGER" || isAssignee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-vintage-charcoal/80 backdrop-blur-sm p-4">
      <div className="bg-vintage-cream border border-vintage-brown/20 w-full max-w-4xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-vintage-brown/10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-serif font-bold text-vintage-charcoal">{task.title}</h2>
            <span className={cn(
              "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
              task.status === "Done" ? "text-vintage-olive bg-vintage-olive/10 border-vintage-olive/20" :
              task.status === "In Progress" ? "text-vintage-gold bg-vintage-gold/10 border-vintage-gold/20" :
              "text-vintage-brown bg-vintage-brown/10 border-vintage-brown/20"
            )}>
              {task.status}
            </span>
          </div>
          <button onClick={onClose} className="p-2 text-vintage-brown hover:bg-vintage-brown/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Main Info */}
          <div className="flex-1 p-6 overflow-y-auto border-r border-vintage-brown/10">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-vintage-brown mb-2">Description</h3>
                <p className="text-vintage-charcoal whitespace-pre-wrap">
                  {task.description || "No description provided."}
                </p>
              </div>

              {/* Attachments Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-vintage-brown flex items-center gap-2">
                    <Paperclip className="w-4 h-4" /> Attachments
                  </h3>
                  <label className="cursor-pointer text-xs font-bold text-vintage-olive hover:text-vintage-charcoal transition-colors">
                    Upload File
                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploadAttachment.isPending} />
                  </label>
                </div>
                
                {loadingAttachments ? (
                  <p className="text-sm text-vintage-brown">Loading attachments...</p>
                ) : attachments.length === 0 ? (
                  <div className="p-4 rounded-lg border border-dashed border-vintage-brown/30 text-center text-sm text-vintage-brown bg-vintage-brown/5">
                    No attachments yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {attachments.map((att) => (
                      <div key={att.id} className="flex items-center justify-between p-3 rounded-lg border border-vintage-brown/20 bg-white group">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 bg-vintage-brown/10 rounded-md text-vintage-brown flex-shrink-0">
                            <File className="w-4 h-4" />
                          </div>
                          <div className="truncate min-w-0">
                            <p className="text-sm font-medium text-vintage-charcoal truncate" title={att.fileName}>{att.fileName}</p>
                            <p className="text-xs text-vintage-brown">{new Date(att.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                          <button onClick={() => attachmentsApi.download(task.id, att.id, att.fileName)} className="p-1.5 text-vintage-olive hover:bg-vintage-olive/10 rounded-md">
                            <Download className="w-4 h-4" />
                          </button>
                          {(user?.id === att.uploadedBy?.id || user?.role === "ADMIN") && (
                            <button onClick={() => deleteAttachment.mutate(att.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / Comments */}
          <div className="w-full md:w-80 bg-vintage-beige/30 p-6 flex flex-col h-full overflow-hidden">
            <div className="mb-6 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-vintage-brown mb-1">Assignee</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-vintage-olive/20 flex items-center justify-center text-[10px] font-bold text-vintage-olive">
                    {(task.assignee?.name || "U").charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-vintage-charcoal">{task.assignee?.name || "Unassigned"}</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-vintage-brown mb-1">Due Date</p>
                <p className="text-sm font-medium text-vintage-charcoal">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</p>
              </div>

              {canEditStatus && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-vintage-brown mb-1">Update Status</p>
                  <select 
                    className="w-full vintage-input py-1.5 text-sm"
                    defaultValue={task.status}
                    onChange={(e) => updateStatus.mutate(e.target.value)}
                    disabled={updateStatus.isPending}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col overflow-hidden min-h-[300px]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-vintage-brown flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4" /> Comments
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {loadingComments ? (
                  <p className="text-sm text-vintage-brown">Loading comments...</p>
                ) : comments.length === 0 ? (
                  <p className="text-sm text-vintage-brown italic">No comments yet.</p>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="bg-white p-3 rounded-lg border border-vintage-brown/20 shadow-sm relative group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-vintage-charcoal">{comment.author?.name}</span>
                        <span className="text-[10px] text-vintage-brown">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-vintage-charcoal/90">{comment.content}</p>
                      
                      {(user?.id === comment.author?.id || user?.role === "ADMIN") && (
                        <button 
                          onClick={() => deleteComment.mutate(comment.id)}
                          className="absolute -top-2 -right-2 bg-white border border-vintage-brown/20 rounded-full p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all shadow-sm"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="relative">
                <textarea 
                  className="w-full vintage-input min-h-[80px] text-sm pr-10 resize-none"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (newComment.trim()) addComment.mutate();
                    }
                  }}
                />
                <button 
                  onClick={() => { if (newComment.trim()) addComment.mutate() }}
                  disabled={!newComment.trim() || addComment.isPending}
                  className="absolute bottom-3 right-3 text-vintage-olive hover:text-vintage-charcoal disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
