import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageSquarePlus, Clock, User, Tag, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface CustomerNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerEmail: string;
  customerName: string;
  customerId?: string | null;
}

interface CustomerNote {
  id: string;
  customer_email: string;
  customer_id: string | null;
  admin_id: string;
  note: string;
  note_type: string;
  created_at: string;
  updated_at: string;
}

const noteTypes = [
  { value: 'general', label: 'General', color: 'bg-gray-500/20 text-gray-700 border-gray-500/30' },
  { value: 'measurement', label: 'Measurement', color: 'bg-blue-500/20 text-blue-700 border-blue-500/30' },
  { value: 'preference', label: 'Preference', color: 'bg-purple-500/20 text-purple-700 border-purple-500/30' },
  { value: 'issue', label: 'Issue', color: 'bg-red-500/20 text-red-700 border-red-500/30' },
  { value: 'followup', label: 'Follow-up', color: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30' },
  { value: 'compliment', label: 'Compliment', color: 'bg-green-500/20 text-green-700 border-green-500/30' },
];

const CustomerNotesDialog = ({ 
  open, 
  onOpenChange, 
  customerEmail, 
  customerName,
  customerId 
}: CustomerNotesDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('general');

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['customer-notes', customerEmail],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_notes')
        .select('*')
        .eq('customer_email', customerEmail)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CustomerNote[];
    },
    enabled: open && !!customerEmail,
  });

  const addNoteMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('customer_notes')
        .insert({
          customer_email: customerEmail,
          customer_id: customerId || null,
          admin_id: user.id,
          note: newNote,
          note_type: noteType,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-notes', customerEmail] });
      toast({
        title: 'Note Added',
        description: 'Customer note has been saved.',
      });
      setNewNote('');
      setNoteType('general');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add note. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase
        .from('customer_notes')
        .delete()
        .eq('id', noteId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-notes', customerEmail] });
      toast({
        title: 'Note Deleted',
        description: 'Customer note has been removed.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete note. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNoteMutation.mutate();
  };

  const getNoteTypeConfig = (type: string) => {
    return noteTypes.find(t => t.value === type) || noteTypes[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Customer History: {customerName}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{customerEmail}</p>
        </DialogHeader>

        {/* Add New Note */}
        <div className="space-y-3 border-b pb-4">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Add New Note</span>
          </div>
          
          <div className="flex gap-2">
            <Select value={noteType} onValueChange={setNoteType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {noteTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <Tag className="h-3 w-3" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Textarea
            placeholder="Add a note about this customer..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
          />
          
          <Button 
            onClick={handleAddNote}
            disabled={!newNote.trim() || addNoteMutation.isPending}
            className="w-full"
          >
            {addNoteMutation.isPending ? 'Saving...' : 'Add Note'}
          </Button>
        </div>

        {/* Notes History */}
        <div className="flex-1 min-h-0">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Interaction History</span>
            <Badge variant="secondary" className="ml-auto">
              {notes.length} notes
            </Badge>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading notes...
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquarePlus className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No notes yet for this customer</p>
            </div>
          ) : (
            <ScrollArea className="h-[250px] pr-4">
              <div className="space-y-3">
                {notes.map((note) => {
                  const typeConfig = getNoteTypeConfig(note.note_type);
                  return (
                    <div 
                      key={note.id} 
                      className="p-3 rounded-lg bg-muted/50 border border-border/50 group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge 
                          variant="outline" 
                          className={`${typeConfig.color} text-xs`}
                        >
                          {typeConfig.label}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(note.created_at), 'MMM dd, yyyy h:mm a')}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                            onClick={() => deleteNoteMutation.mutate(note.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{note.note}</p>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerNotesDialog;
