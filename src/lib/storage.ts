import { supabase } from "@/integrations/supabase/client";
import { Patient, Passage, Acte } from "@/types/patient";

const AUTH_KEY = "honoraires_auth";

// Auth (kept in localStorage - single user app)
export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === "true";
}

export function login(password: string): boolean {
  if (password === "Sareli@1975") {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

// Cliniques
export async function fetchCliniques(): Promise<string[]> {
  const { data, error } = await supabase
    .from("cliniques")
    .select("nom")
    .order("created_at");
  if (error) throw error;
  return data.map((c) => c.nom);
}

export async function addCliniqueDB(nom: string): Promise<void> {
  const { error } = await supabase.from("cliniques").upsert({ nom }, { onConflict: "nom" });
  if (error) throw error;
}

// Patients - fetch with nested passages and actes
export async function fetchPatients(): Promise<Patient[]> {
  const { data: patients, error: pErr } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });
  if (pErr) throw pErr;

  const { data: passages, error: psErr } = await supabase
    .from("passages")
    .select("*")
    .order("date");
  if (psErr) throw psErr;

  const { data: actes, error: aErr } = await supabase
    .from("actes")
    .select("*");
  if (aErr) throw aErr;

  // Build nested structure
  const actesByPassage = new Map<string, Acte[]>();
  for (const a of actes || []) {
    const list = actesByPassage.get(a.passage_id) || [];
    list.push({ id: a.id, nom: a.nom, montant: a.montant });
    actesByPassage.set(a.passage_id, list);
  }

  const passagesByPatient = new Map<string, Passage[]>();
  for (const p of passages || []) {
    const list = passagesByPatient.get(p.patient_id) || [];
    list.push({
      id: p.id,
      date: p.date,
      actes: actesByPassage.get(p.id) || [],
    });
    passagesByPatient.set(p.patient_id, list);
  }

  return (patients || []).map((p) => ({
    id: p.id,
    nom: p.nom,
    chambre: p.chambre || "",
    etage: p.etage || "",
    clinique: p.clinique,
    passages: passagesByPatient.get(p.id) || [],
    statut: p.statut as "en_attente" | "paye",
    archive: p.archive,
    createdAt: p.created_at,
  }));
}

// Create patient with passages and actes
export async function createPatient(patient: Omit<Patient, "id" | "createdAt">): Promise<string> {
  const { data, error } = await supabase
    .from("patients")
    .insert({
      nom: patient.nom,
      chambre: patient.chambre,
      etage: patient.etage,
      clinique: patient.clinique,
      statut: patient.statut,
      archive: patient.archive,
    })
    .select("id")
    .single();
  if (error) throw error;

  for (const passage of patient.passages) {
    await addPassageDB(data.id, passage);
  }

  return data.id;
}

export async function updatePatientStatus(id: string, statut: string): Promise<void> {
  const { error } = await supabase.from("patients").update({ statut }).eq("id", id);
  if (error) throw error;
}

export async function archivePatient(id: string): Promise<void> {
  const { error } = await supabase.from("patients").update({ archive: true }).eq("id", id);
  if (error) throw error;
}

export async function deletePatientDB(id: string): Promise<void> {
  const { error } = await supabase.from("patients").delete().eq("id", id);
  if (error) throw error;
}

// Passages
export async function addPassageDB(patientId: string, passage: Omit<Passage, "id"> & { id?: string }): Promise<void> {
  const { data, error } = await supabase
    .from("passages")
    .insert({ patient_id: patientId, date: passage.date })
    .select("id")
    .single();
  if (error) throw error;

  if (passage.actes.length > 0) {
    const { error: aErr } = await supabase.from("actes").insert(
      passage.actes.map((a) => ({
        passage_id: data.id,
        nom: a.nom,
        montant: a.montant,
      }))
    );
    if (aErr) throw aErr;
  }
}

export async function deletePassageDB(passageId: string): Promise<void> {
  const { error } = await supabase.from("passages").delete().eq("id", passageId);
  if (error) throw error;
}

export async function deleteActeDB(acteId: string): Promise<void> {
  const { error } = await supabase.from("actes").delete().eq("id", acteId);
  if (error) throw error;
}
