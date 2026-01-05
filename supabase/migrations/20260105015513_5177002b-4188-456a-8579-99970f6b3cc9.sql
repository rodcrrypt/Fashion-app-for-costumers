-- Create storage bucket for progress photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', true);

-- Allow authenticated users to view all progress photos
CREATE POLICY "Anyone can view progress photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'progress-photos');

-- Only admins can upload progress photos
CREATE POLICY "Admins can upload progress photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'progress-photos' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can update progress photos
CREATE POLICY "Admins can update progress photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'progress-photos' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can delete progress photos
CREATE POLICY "Admins can delete progress photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'progress-photos' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);