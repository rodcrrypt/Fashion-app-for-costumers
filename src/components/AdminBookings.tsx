import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle, XCircle, AlertCircle, Send, History } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import CustomerNotesDialog from './CustomerNotesDialog';

const quickTemplates = [
  { label: 'Confirm Appointment', text: 'Your appointment has been confirmed. We look forward to seeing you!' },
  { label: 'Request Reschedule', text: 'We need to reschedule your appointment. Please contact us to arrange a new time.' },
  { label: 'Reminder', text: 'This is a reminder for your upcoming appointment. Please arrive 10 minutes early.' },
  { label: 'Thank You', text: 'Thank you for visiting us. We hope you were satisfied with our service!' },
];

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  service_type: string;
  booking_date: string;
  booking_time: string;
  notes: string | null;
  status: string;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30', icon: <AlertCircle className="h-3 w-3" /> },
  confirmed: { label: 'Confirmed', color: 'bg-green-500/20 text-green-700 border-green-500/30', icon: <CheckCircle className="h-3 w-3" /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-700 border-red-500/30', icon: <XCircle className="h-3 w-3" /> },
  completed: { label: 'Completed', color: 'bg-blue-500/20 text-blue-700 border-blue-500/30', icon: <CheckCircle className="h-3 w-3" /> },
};

const AdminBookings = () => {
  const { isAdmin, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [selectedCustomerForNotes, setSelectedCustomerForNotes] = useState<{ email: string; name: string; id?: string | null } | null>(null);

  const handleOpenNotes = (booking: Booking) => {
    setSelectedCustomerForNotes({
      email: booking.customer_email,
      name: booking.customer_name,
      id: null, // bookings may not have customer_id linked
    });
    setNotesDialogOpen(true);
  };

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: true });
      
      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!user && isAdmin,
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, reply, status }: { id: string; reply: string; status: string }) => {
      const { error } = await supabase
        .from('bookings')
        .update({
          admin_reply: reply,
          status: status,
          replied_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast({
        title: 'Reply Sent',
        description: 'Your response has been saved successfully.',
      });
      setReplyDialogOpen(false);
      setReplyText('');
      setNewStatus('');
      setSelectedBooking(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to send reply. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleReply = (booking: Booking) => {
    setSelectedBooking(booking);
    setReplyText(booking.admin_reply || '');
    setNewStatus(booking.status);
    setReplyDialogOpen(true);
  };

  const submitReply = () => {
    if (!selectedBooking) return;
    replyMutation.mutate({
      id: selectedBooking.id,
      reply: replyText,
      status: newStatus || selectedBooking.status,
    });
  };

  if (!user || !isAdmin) return null;

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;

  return (
    <section id="admin-bookings" className="section-padding bg-muted/30">
      <div className="container-narrow mx-auto">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Booking Management
            </CardTitle>
            <CardDescription>View and respond to consultation requests</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-2xl font-bold text-green-700">{confirmedCount}</p>
                <p className="text-sm text-muted-foreground">Confirmed</p>
              </div>
              <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-2xl font-bold text-blue-700">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>

            {/* Bookings Table */}
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No bookings yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-medium">
                              <User className="h-3.5 w-3.5 text-muted-foreground" />
                              {booking.customer_name}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {booking.customer_email}
                            </div>
                            {booking.customer_phone && (
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {booking.customer_phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{booking.service_type.replace('-', ' ')}</span>
                          {booking.notes && (
                            <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                              {booking.notes}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {booking.booking_time}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`${statusConfig[booking.status]?.color || 'bg-gray-500/20'} flex items-center gap-1 w-fit`}
                          >
                            {statusConfig[booking.status]?.icon}
                            {statusConfig[booking.status]?.label || booking.status}
                          </Badge>
                          {booking.admin_reply && (
                            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                              <MessageSquare className="h-3 w-3" />
                              Replied
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {booking.customer_phone && (
                              <a
                                href={`https://wa.me/${booking.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${booking.customer_name}, regarding your ${booking.service_type.replace('-', ' ')} booking on ${format(new Date(booking.booking_date), 'MMM dd, yyyy')} at ${booking.booking_time}...`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                                title="WhatsApp"
                              >
                                <Phone className="h-4 w-4" />
                              </a>
                            )}
                            <a
                              href={`mailto:${booking.customer_email}?subject=${encodeURIComponent(`Regarding your ${booking.service_type.replace('-', ' ')} booking`)}&body=${encodeURIComponent(`Hi ${booking.customer_name},\n\nRegarding your booking on ${format(new Date(booking.booking_date), 'MMM dd, yyyy')} at ${booking.booking_time}...\n\nBest regards,\nDress by Orekelewa`)}`}
                              className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors"
                              title="Email"
                            >
                              <Mail className="h-4 w-4" />
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleReply(booking)}
                              className="gap-1.5"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              {booking.admin_reply ? 'Edit Reply' : 'Reply'}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenNotes(booking)}
                              className="gap-1.5"
                              title="Customer History"
                            >
                              <History className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reply Dialog */}
        <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Reply to Booking
              </DialogTitle>
            </DialogHeader>
            
            {selectedBooking && (
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="font-medium">{selectedBooking.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.customer_email}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(selectedBooking.booking_date), 'MMM dd, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {selectedBooking.booking_time}
                    </span>
                  </div>
                  <p className="text-sm capitalize">
                    <strong>Service:</strong> {selectedBooking.service_type.replace('-', ' ')}
                  </p>
                  {selectedBooking.notes && (
                    <p className="text-sm">
                      <strong>Notes:</strong> {selectedBooking.notes}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Update Status</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quick Templates</label>
                  <div className="flex flex-wrap gap-2">
                    {quickTemplates.map((template) => (
                      <Button
                        key={template.label}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => setReplyText(template.text)}
                      >
                        {template.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Reply</label>
                  <Textarea
                    placeholder="Write your response to the customer..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Direct contact buttons in dialog */}
                <div className="flex gap-2 pt-2 border-t">
                  {selectedBooking?.customer_phone && (
                    <a
                      href={`https://wa.me/${selectedBooking.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(replyText || `Hi ${selectedBooking.customer_name}, regarding your booking...`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button type="button" variant="outline" className="w-full gap-2 bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/30">
                        <Phone className="h-4 w-4" />
                        Send via WhatsApp
                      </Button>
                    </a>
                  )}
                  <a
                    href={`mailto:${selectedBooking?.customer_email}?subject=${encodeURIComponent(`Regarding your ${selectedBooking?.service_type.replace('-', ' ')} booking`)}&body=${encodeURIComponent(replyText || `Hi ${selectedBooking?.customer_name},\n\nRegarding your booking...\n\nBest regards,\nDress by Orekelewa`)}`}
                    className="flex-1"
                  >
                    <Button type="button" variant="outline" className="w-full gap-2 bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 border-blue-500/30">
                      <Mail className="h-4 w-4" />
                      Send via Email
                    </Button>
                  </a>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitReply} disabled={replyMutation.isPending}>
                {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Customer Notes Dialog */}
        {selectedCustomerForNotes && (
          <CustomerNotesDialog
            open={notesDialogOpen}
            onOpenChange={setNotesDialogOpen}
            customerEmail={selectedCustomerForNotes.email}
            customerName={selectedCustomerForNotes.name}
            customerId={selectedCustomerForNotes.id}
          />
        )}
      </div>
    </section>
  );
};

export default AdminBookings;
