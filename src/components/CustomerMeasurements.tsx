import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ruler, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Measurements {
  id: string;
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
}

const MeasurementItem = ({ label, value }: { label: string; value: number | null }) => (
  <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
    <span className="font-body text-muted-foreground">{label}</span>
    <span className="font-display font-medium text-foreground">
      {value ? `${value} cm` : '—'}
    </span>
  </div>
);

const CustomerMeasurements = () => {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<Measurements | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeasurements = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('measurements')
        .select('*')
        .eq('customer_id', user.id)
        .order('updated_at', { ascending: false })
        .maybeSingle();

      if (error) {
        console.error('Error fetching measurements:', error);
      } else {
        setMeasurements(data);
      }
      setLoading(false);
    };

    fetchMeasurements();
  }, [user]);

  if (!user) {
    return (
      <section id="measurements" className="py-20 bg-muted/30">
        <div className="container-narrow mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6 text-center">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-body text-muted-foreground">
                Please sign in to view your measurements.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section id="measurements" className="py-20 bg-muted/30">
        <div className="container-narrow mx-auto px-4">
          <Card className="max-w-2xl mx-auto animate-pulse">
            <CardContent className="pt-6 h-64" />
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="measurements" className="py-20 bg-muted/30">
      <div className="container-narrow mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block font-body text-sm tracking-widest text-accent uppercase mb-4">
            Your Profile
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Your Measurements
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Your recorded body measurements for custom tailoring
          </p>
        </div>

        {!measurements ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6 text-center">
              <Ruler className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-body text-muted-foreground">
                No measurements recorded yet. Your tailor will add your measurements during your fitting appointment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-primary" />
                  Upper Body
                </CardTitle>
                <CardDescription className="font-body">
                  Measurements for tops and shirts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MeasurementItem label="Chest" value={measurements.chest} />
                <MeasurementItem label="Shoulder" value={measurements.shoulder} />
                <MeasurementItem label="Arm Length" value={measurements.arm_length} />
                <MeasurementItem label="Bicep" value={measurements.bicep} />
                <MeasurementItem label="Wrist" value={measurements.wrist} />
                <MeasurementItem label="Neck" value={measurements.neck} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-primary" />
                  Lower Body
                </CardTitle>
                <CardDescription className="font-body">
                  Measurements for pants and skirts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MeasurementItem label="Waist" value={measurements.waist} />
                <MeasurementItem label="Hip" value={measurements.hip} />
                <MeasurementItem label="Inseam" value={measurements.inseam} />
                <MeasurementItem label="Outseam" value={measurements.outseam} />
                <MeasurementItem label="Thigh" value={measurements.thigh} />
                <MeasurementItem label="Height" value={measurements.height} />
              </CardContent>
            </Card>

            {measurements.notes && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-muted-foreground">{measurements.notes}</p>
                </CardContent>
              </Card>
            )}

            <p className="md:col-span-2 text-center font-body text-sm text-muted-foreground">
              Last updated: {new Date(measurements.updated_at).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerMeasurements;
