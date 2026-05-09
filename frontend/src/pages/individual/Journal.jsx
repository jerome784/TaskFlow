import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Check } from "lucide-react";
import { journalApi } from "../../api/journal";
import { cn } from "../../utils/utils";

export default function Journal() {
  const queryClient = useQueryClient();
  const dateStr = new Date().toISOString().split('T')[0];
  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  
  const [content, setContent] = useState("");

  const { data: serverContent, isLoading } = useQuery({
    queryKey: ["journal", dateStr],
    queryFn: () => journalApi.getEntry(dateStr),
  });

  useEffect(() => {
    if (serverContent !== undefined) {
      setContent(serverContent);
    }
  }, [serverContent]);

  const saveEntry = useMutation({
    mutationFn: (newContent) => journalApi.saveEntry(dateStr, newContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal", dateStr] });
    }
  });

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-vintage-brown/20 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vintage-charcoal mb-2">Daily Journal</h1>
          <p className="text-vintage-charcoal/70">{dateLabel}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-vintage-brown/10 flex items-center justify-center text-vintage-brown">
          <BookOpen className="w-6 h-6" />
        </div>
      </div>

      <div className="flex-1 vintage-card p-8 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(139, 111, 71, 0.1) 31px, rgba(139, 111, 71, 0.1) 32px)', backgroundPositionY: '8px' }}></div>
        
        {isLoading ? (
          <p className="text-vintage-brown relative z-10">Loading your journal...</p>
        ) : (
          <textarea 
            className="flex-1 w-full bg-transparent resize-none focus:outline-none text-vintage-charcoal leading-[32px] text-lg font-serif z-10 relative"
            placeholder="Dear diary, today I..."
            value={content}
            onChange={e => setContent(e.target.value)}
          ></textarea>
        )}
        
        <div className="flex justify-end mt-4 z-10 relative">
          <button 
            onClick={() => saveEntry.mutate(content)}
            disabled={saveEntry.isPending}
            className={cn("vintage-btn-primary flex items-center gap-2 transition-all", saveEntry.isSuccess && "bg-vintage-olive text-white border-vintage-olive")}
          >
            {saveEntry.isPending ? "Saving..." : saveEntry.isSuccess ? <><Check className="w-4 h-4"/> Saved</> : "Save Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}
