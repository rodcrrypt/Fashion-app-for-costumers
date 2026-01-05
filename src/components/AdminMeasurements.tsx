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
  chest: number | null;
  shoulder: number | null;
  arm_length: number | null;
  bicep: number | null;
  wrist: number | null;
  neck: number | null;
  waist: number | null;
  hip: number | null;
  inseam: number | null;
  outseam: number | null;
  thigh: number | null;
  height: number | null;
  notes: string | null;
  updated_at: string;
  profiles?: Profile;
}

interface MeasurementFormData {
  customer_id: string;
  chest: string;
  shoulder: string;
  arm_length: string;
  bicep: string;
  wrist: string;
  neck: string;
  waist: string;
  hip: string;
  inseam: string;
  outseam: string;
  thigh: string;
  height: string;
  notes: string;
}

const initialFormData: MeasurementFormData = {
  customer_id: '',
  chest: '',
  shoulder: '',
  arm_length: '',
  bicep: '',
  wrist: '',
  neck: '',
  waist: '',
  hip: '',
  inseam: '',
  outseam: '',
  thigh: '',
  height: '',
  notes: '',
};

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
    
    // Fetch all measurements
    const { data: measurementsData, error: measurementsError } = await supabase
      .from('measurements')
      .select('*')
      .order('updated_at', { ascending: false });

    if (measurementsError) {
      console.error('Error fetching measurements:', measurementsError);
      toast.error('Failed to load measurements');
    } else {
      // Fetch profiles for each measurement
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

    // Fetch all customers for the dropdown
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
      chest: parseNumber(formData.chest),
      shoulder: parseNumber(formData.shoulder),
      arm_length: parseNumber(formData.arm_length),
      bicep: parseNumber(formData.bicep),
      wrist: parseNumber(formData.wrist),
      neck: parseNumber(formData.neck),
      waist: parseNumber(formData.waist),
      hip: parseNumber(formData.hip),
      inseam: parseNumber(formData.inseam),
      outseam: parseNumber(formData.outseam),
      thigh: parseNumber(formData.thigh),
      height: parseNumber(formData.height),
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
      chest: measurement.chest?.toString() || '',
      shoulder: measurement.shoulder?.toString() || '',
      arm_length: measurement.arm_length?.toString() || '',
      bicep: measurement.bicep?.toString() || '',
      wrist: measurement.wrist?.toString() || '',
      neck: measurement.neck?.toString() || '',
      waist: measurement.waist?.toString() || '',
      hip: measurement.hip?.toString() || '',
      inseam: measurement.inseam?.toString() || '',
      outseam: measurement.outseam?.toString() || '',
      thigh: measurement.thigh?.toString() || '',
      height: measurement.height?.toString() || '',
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

                <div>
                  <h4 className="font-display font-medium mb-3">Upper Body (cm)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="chest">Chest</Label>
                      <Input
                        id="chest"
                        type="number"
                        step="0.1"
                        value={formData.chest}
                        onChange={(e) => handleInputChange('chest', e.target.value)}
                        placeholder="e.g., 96"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shoulder">Shoulder</Label>
                      <Input
                        id="shoulder"
                        type="number"
                        step="0.1"
                        value={formData.shoulder}
                        onChange={(e) => handleInputChange('shoulder', e.target.value)}
                        placeholder="e.g., 45"
                      />
                    </div>
                    <div>
                      <Label htmlFor="arm_length">Arm Length</Label>
                      <Input
                        id="arm_length"
                        type="number"
                        step="0.1"
                        value={formData.arm_length}
                        onChange={(e) => handleInputChange('arm_length', e.target.value)}
                        placeholder="e.g., 62"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bicep">Bicep</Label>
                      <Input
                        id="bicep"
                        type="number"
                        step="0.1"
                        value={formData.bicep}
                        onChange={(e) => handleInputChange('bicep', e.target.value)}
                        placeholder="e.g., 32"
                      />
                    </div>
                    <div>
                      <Label htmlFor="wrist">Wrist</Label>
                      <Input
                        id="wrist"
                        type="number"
                        step="0.1"
                        value={formData.wrist}
                        onChange={(e) => handleInputChange('wrist', e.target.value)}
                        placeholder="e.g., 17"
                      />
                    </div>
                    <div>
                      <Label htmlFor="neck">Neck</Label>
                      <Input
                        id="neck"
                        type="number"
                        step="0.1"
                        value={formData.neck}
                        onChange={(e) => handleInputChange('neck', e.target.value)}
                        placeholder="e.g., 40"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-display font-medium mb-3">Lower Body (cm)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="waist">Waist</Label>
                      <Input
                        id="waist"
                        type="number"
                        step="0.1"
                        value={formData.waist}
                        onChange={(e) => handleInputChange('waist', e.target.value)}
                        placeholder="e.g., 82"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hip">Hip</Label>
                      <Input
                        id="hip"
                        type="number"
                        step="0.1"
                        value={formData.hip}
                        onChange={(e) => handleInputChange('hip', e.target.value)}
                        placeholder="e.g., 98"
                      />
                    </div>
                    <div>
                      <Label htmlFor="inseam">Inseam</Label>
                      <Input
                        id="inseam"
                        type="number"
                        step="0.1"
                        value={formData.inseam}
                        onChange={(e) => handleInputChange('inseam', e.target.value)}
                        placeholder="e.g., 78"
                      />
                    </div>
                    <div>
                      <Label htmlFor="outseam">Outseam</Label>
                      <Input
                        id="outseam"
                        type="number"
                        step="0.1"
                        value={formData.outseam}
                        onChange={(e) => handleInputChange('outseam', e.target.value)}
                        placeholder="e.g., 105"
                      />
                    </div>
                    <div>
                      <Label htmlFor="thigh">Thigh</Label>
                      <Input
                        id="thigh"
                        type="number"
                        step="0.1"
                        value={formData.thigh}
                        onChange={(e) => handleInputChange('thigh', e.target.value)}
                        placeholder="e.g., 58"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        placeholder="e.g., 175"
                      />
                    </div>
                  </div>
                </div>

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
