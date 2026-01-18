import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ruler, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Measurements {
  id: string;
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-primary" />
                  Upper Body
                </CardTitle>
                <CardDescription className="font-body">
                  Bust and shoulder measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MeasurementItem label="Shoulder" value={measurements.shoulder} />
                <MeasurementItem label="Bust" value={measurements.bust} />
                <MeasurementItem label="Upbust" value={measurements.upbust} />
                <MeasurementItem label="Underbust" value={measurements.underbust} />
                <MeasurementItem label="Neck" value={measurements.neck} />
                <MeasurementItem label="Armhole" value={measurements.armhole} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-primary" />
                  Lengths
                </CardTitle>
                <CardDescription className="font-body">
                  Body length measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MeasurementItem label="Shoulder to Nipple" value={measurements.shoulder_to_nipple} />
                <MeasurementItem label="Shoulder to Underbust" value={measurements.shoulder_to_underbust} />
                <MeasurementItem label="Shoulder to Above Knee" value={measurements.shoulder_to_above_knee} />
                <MeasurementItem label="Shoulder to Knee" value={measurements.shoulder_to_knee} />
                <MeasurementItem label="Half Length (Front)" value={measurements.half_length_front} />
                <MeasurementItem label="Half Length (Back)" value={measurements.half_length_back} />
                <MeasurementItem label="Blouse Length" value={measurements.blouse_length} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-primary" />
                  Sleeves
                </CardTitle>
                <CardDescription className="font-body">
                  Arm and sleeve measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MeasurementItem label="Round Sleeves" value={measurements.round_sleeves} />
                <MeasurementItem label="Sleeve Length" value={measurements.sleeve_length} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-primary" />
                  Lower Body
                </CardTitle>
                <CardDescription className="font-body">
                  Hip and leg measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MeasurementItem label="Hips" value={measurements.hips} />
                <MeasurementItem label="Thighs" value={measurements.thigh} />
                <MeasurementItem label="Knee" value={measurements.knee} />
                <MeasurementItem label="Ankle" value={measurements.ankle} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-primary" />
                  Garment Lengths
                </CardTitle>
                <CardDescription className="font-body">
                  Dress and trouser lengths
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MeasurementItem label="Short Length" value={measurements.short_length} />
                <MeasurementItem label="Midi Length" value={measurements.midi_length} />
                <MeasurementItem label="Full Length" value={measurements.full_length} />
                <MeasurementItem label="Trouser Length" value={measurements.trouser_length} />
              </CardContent>
            </Card>

            {measurements.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-muted-foreground">{measurements.notes}</p>
                </CardContent>
              </Card>
            )}

            <p className="md:col-span-2 lg:col-span-3 text-center font-body text-sm text-muted-foreground">
              Last updated: {new Date(measurements.updated_at).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerMeasurements;
