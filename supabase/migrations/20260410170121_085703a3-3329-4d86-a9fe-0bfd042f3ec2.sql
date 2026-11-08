
-- Create cliniques table
CREATE TABLE public.cliniques (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  chambre TEXT DEFAULT '',
  etage TEXT DEFAULT '',
  clinique TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'paye')),
  archive BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create passages table
CREATE TABLE public.passages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create actes table
CREATE TABLE public.actes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  passage_id UUID NOT NULL REFERENCES public.passages(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  montant NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.cliniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actes ENABLE ROW LEVEL SECURITY;

-- Public access policies (single-user personal app with hardcoded password)
CREATE POLICY "Allow all access to cliniques" ON public.cliniques FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to patients" ON public.patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to passages" ON public.passages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to actes" ON public.actes FOR ALL USING (true) WITH CHECK (true);

-- Insert default cliniques
INSERT INTO public.cliniques (nom) VALUES
  ('Hôpital Privé de Salé AKDITAL'),
  ('Clinique AKDITAL AGDAL'),
  ('Polyclinique AGDAL'),
  ('Polyclinique de RABAT');

-- Trigger for updated_at on patients
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
