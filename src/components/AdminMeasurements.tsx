import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Ruler, Plus, Edit, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
}

interface Measurements {
  id: string;
  customer_id: string;
  shoulder: number | null;
  bust: number | null;
  upbust: number | null;
  underbust: number | null;
  shoulder_to_nipple: number | null;
  shoulder_to_underbust: number | null;
  shoulder_to_above_knee: number | null;
  shoulder_to_knee: number | null;
  half_length_front: number | null;
  half_length_back: number | null;
  blouse_length: number | null;
  hips: number | null;
  short_length: number | null;
  midi_length: number | null;
  full_length: number | null;
  thigh: number | null;
  knee: number | null;
  ankle: number | null;
  trouser_length: number | null;
  armhole: number | null;
  round_sleeves: number | null;
  sleeve_length: number | null;
  neck: number | null;
  notes: string | null;
  updated_at: string;
  profiles?: Profile;
}

interface MeasurementFormData {
  customer_id: string;
  shoulder: string;
  bust: string;
  upbust: string;
  underbust: string;
  shoulder_to_nipple: string;
  shoulder_to_underbust: string;
  shoulder_to_above_knee: string;
  shoulder_to_knee: string;
  half_length_front: string;
  half_length_back: string;
  blouse_length: string;
  hips: string;
  short_length: string;
  midi_length: string;
  full_length: string;
  thigh: string;
  knee: string;
  ankle: string;
  trouser_length: string;
  armhole: string;
  round_sleeves: string;
  sleeve_length: string;
  neck: string;
  notes: string;
}

const initialFormData: MeasurementFormData = {
  customer_id: '',
  shoulder: '',
  bust: '',
  upbust: '',
  underbust: '',
  shoulder_to_nipple: '',
  shoulder_to_underbust: '',
  shoulder_to_above_knee: '',
  shoulder_to_knee: '',
  half_length_front: '',
  half_length_back: '',
  blouse_length: '',
  hips: '',
  short_length: '',
  midi_length: '',
  full_length: '',
  thigh: '',
  knee: '',
  ankle: '',
  trouser_length: '',
  armhole: '',
  round_sleeves: '',
  sleeve_length: '',
  neck: '',
  notes: '',
};

const measurementFields = [
  { category: 'Upper Body', fields: [
    { key: 'shoulder', label: 'Shoulder' },
    { key: 'bust', label: 'Bust' },
    { key: 'upbust', label: 'Upbust' },
    { key: 'underbust', label: 'Underbust' },
    { key: 'neck', label: 'Neck' },
    { key: 'armhole', label: 'Armhole' },
  ]},
  { category: 'Lengths', fields: [
    { key: 'shoulder_to_nipple', label: 'Shoulder to Nipple Point' },
    { key: 'shoulder_to_underbust', label: 'Shoulder to Underbust' },
    { key: 'shoulder_to_above_knee', label: 'Shoulder to Above Knee' },
    { key: 'shoulder_to_knee', label: 'Shoulder to Knee' },
    { key: 'half_length_front', label: 'Half Length (Front)' },
    { key: 'half_length_back', label: 'Half Length (Back)' },
    { key: 'blouse_length', label: 'Blouse Length' },
  ]},
  { category: 'Sleeves', fields: [
    { key: 'round_sleeves', label: 'Round Sleeves' },
    { key: 'sleeve_length', label: 'Sleeve Length' },
  ]},
  { category: 'Lower Body', fields: [
    { key: 'hips', label: 'Hips' },
    { key: 'thigh', label: 'Thighs' },
    { key: 'knee', label: 'Knee' },
    { key: 'ankle', label: 'Ankle' },
  ]},
  { category: 'Garment Lengths', fields: [
    { key: 'short_length', label: 'Short Length' },
    { key: 'midi_length', label: 'Midi Length' },
    { key: 'full_length', label: 'Full Length' },
    { key: 'trouser_length', label: 'Trouser Length' },
  ]},
];

const AdminMeasurements = () => {
  const [measurements, setMeasurements] = useState<Measurements[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MeasurementFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    
    const { data: measurementsData, error: measurementsError } = await supabase
      .from('measurements')
      .select('*')
      .order('updated_at', { ascending: false });

    if (measurementsError) {
      console.error('Error fetching measurements:', measurementsError);
      toast.error('Failed to load measurements');
    } else {
      const measurementsWithProfiles: Measurements[] = [];
      for (const m of measurementsData || []) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .eq('id', m.customer_id)
          .maybeSingle();
        measurementsWithProfiles.push({ ...m, profiles: profile || undefined });
      }
      setMeasurements(measurementsWithProfiles);
    }

    const { data: customersData, error: customersError } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .order('full_name');

    if (customersError) {
      console.error('Error fetching customers:', customersError);
    } else {
      setCustomers(customersData || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (field: keyof MeasurementFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const parseNumber = (value: string): number | null => {
    if (!value.trim()) return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_id) {
      toast.error('Please select a customer');
      return;
    }

    setSubmitting(true);

    const measurementData = {
      customer_id: formData.customer_id,
      shoulder: parseNumber(formData.shoulder),
      bust: parseNumber(formData.bust),
      upbust: parseNumber(formData.upbust),
      underbust: parseNumber(formData.underbust),
      shoulder_to_nipple: parseNumber(formData.shoulder_to_nipple),
      shoulder_to_underbust: parseNumber(formData.shoulder_to_underbust),
      shoulder_to_above_knee: parseNumber(formData.shoulder_to_above_knee),
      shoulder_to_knee: parseNumber(formData.shoulder_to_knee),
      half_length_front: parseNumber(formData.half_length_front),
      half_length_back: parseNumber(formData.half_length_back),
      blouse_length: parseNumber(formData.blouse_length),
      hips: parseNumber(formData.hips),
      short_length: parseNumber(formData.short_length),
      midi_length: parseNumber(formData.midi_length),
      full_length: parseNumber(formData.full_length),
      thigh: parseNumber(formData.thigh),
      knee: parseNumber(formData.knee),
      ankle: parseNumber(formData.ankle),
      trouser_length: parseNumber(formData.trouser_length),
      armhole: parseNumber(formData.armhole),
      round_sleeves: parseNumber(formData.round_sleeves),
      sleeve_length: parseNumber(formData.sleeve_length),
      neck: parseNumber(formData.neck),
      notes: formData.notes.trim() || null,
    };

    let error;

    if (editingId) {
      const { error: updateError } = await supabase
        .from('measurements')
        .update(measurementData)
        .eq('id', editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('measurements')
        .insert(measurementData);
      error = insertError;
    }

    setSubmitting(false);

    if (error) {
      console.error('Error saving measurements:', error);
      toast.error('Failed to save measurements');
    } else {
      toast.success(editingId ? 'Measurements updated' : 'Measurements added');
      setDialogOpen(false);
      setFormData(initialFormData);
      setEditingId(null);
      fetchData();
    }
  };

  const handleEdit = (measurement: Measurements) => {
    setEditingId(measurement.id);
    setFormData({
      customer_id: measurement.customer_id,
      shoulder: measurement.shoulder?.toString() || '',
      bust: measurement.bust?.toString() || '',
      upbust: measurement.upbust?.toString() || '',
      underbust: measurement.underbust?.toString() || '',
      shoulder_to_nipple: measurement.shoulder_to_nipple?.toString() || '',
      shoulder_to_underbust: measurement.shoulder_to_underbust?.toString() || '',
      shoulder_to_above_knee: measurement.shoulder_to_above_knee?.toString() || '',
      shoulder_to_knee: measurement.shoulder_to_knee?.toString() || '',
      half_length_front: measurement.half_length_front?.toString() || '',
      half_length_back: measurement.half_length_back?.toString() || '',
      blouse_length: measurement.blouse_length?.toString() || '',
      hips: measurement.hips?.toString() || '',
      short_length: measurement.short_length?.toString() || '',
      midi_length: measurement.midi_length?.toString() || '',
      full_length: measurement.full_length?.toString() || '',
      thigh: measurement.thigh?.toString() || '',
      knee: measurement.knee?.toString() || '',
      ankle: measurement.ankle?.toString() || '',
      trouser_length: measurement.trouser_length?.toString() || '',
      armhole: measurement.armhole?.toString() || '',
      round_sleeves: measurement.round_sleeves?.toString() || '',
      sleeve_length: measurement.sleeve_length?.toString() || '',
      neck: measurement.neck?.toString() || '',
      notes: measurement.notes || '',
    });
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="pt-6 h-64" />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <Ruler className="w-5 h-5 text-primary" />
              Customer Measurements
            </CardTitle>
            <CardDescription className="font-body">
              Manage client body measurements
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Measurements
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingId ? 'Edit Measurements' : 'Add New Measurements'}
                </DialogTitle>
                <DialogDescription className="font-body">
                  Enter the customer's body measurements in centimeters
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="customer">Customer</Label>
                  <Select
                    value={formData.customer_id}
                    onValueChange={(value) => handleInputChange('customer_id', value)}
                    disabled={!!editingId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.full_name || customer.email || 'Unknown'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {measurementFields.map((category) => (
                  <div key={category.category}>
                    <h4 className="font-display font-medium mb-3">{category.category} (cm)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {category.fields.map((field) => (
                        <div key={field.key}>
                          <Label htmlFor={field.key}>{field.label}</Label>
                          <Input
                            id={field.key}
                            type="number"
                            step="0.1"
                            value={formData[field.key as keyof MeasurementFormData]}
                            onChange={(e) => handleInputChange(field.key as keyof MeasurementFormData, e.target.value)}
                            placeholder="—"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional notes about fit preferences..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : editingId ? 'Update' : 'Save'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {measurements.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-body text-muted-foreground">
              No measurements recorded yet. Add your first customer measurements.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {measurements.map((measurement) => (
              <div
                key={measurement.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
              >
                <div>
                  <h4 className="font-display font-medium">
                    {measurement.profiles?.full_name || measurement.profiles?.email || 'Unknown Customer'}
                  </h4>
                  <p className="font-body text-sm text-muted-foreground">
                    Last updated: {new Date(measurement.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(measurement)}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminMeasurements;
