import { useState, useEffect, useCallback } from "react";
import {
  fetchPatients,
  fetchCliniques,
  addCliniqueDB,
  createPatient,
  updatePatientStatus,
  archivePatient,
  deletePatientDB,
  addPassageDB,
  deletePassageDB,
  deleteActeDB,
  logout,
} from "@/lib/storage";
import { Patient, Passage } from "@/types/patient";
import PatientForm from "@/components/PatientForm";
import PatientList from "@/components/PatientList";
import ArchiveList from "@/components/ArchiveList";
import DashboardFooter from "@/components/DashboardFooter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Plus, Archive, RefreshCw, Settings } from "lucide-react";
import { toast } from "sonner";

interface DashboardPageProps {
  onLogout: () => void;
  onOpenSettings: () => void;
}

const DashboardPage = ({ onLogout, onOpenSettings }: DashboardPageProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [cliniques, setCliniques] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [p, c] = await Promise.all([fetchPatients(), fetchCliniques()]);
      setPatients(p);
      setCliniques(c);
    } catch (err) {
      toast.error("Erreur de chargement des données");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddPatient = async (patient: Patient) => {
    try {
      await createPatient(patient);
      await loadData();
      setShowForm(false);
      toast.success("Patient ajouté");
    } catch (err) {
      toast.error("Erreur lors de l'ajout");
      console.error(err);
    }
  };

  const handleDeletePatient = async (id: string) => {
    try {
      await deletePatientDB(id);
      await loadData();
      toast.success("Patient supprimé");
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleStatusChange = async (id: string, statut: "en_attente" | "paye") => {
    try {
      await updatePatientStatus(id, statut);
      if (statut === "paye") {
        await archivePatient(id);
        toast.success("Patient payé et archivé");
      } else {
        // Si on remet en attente depuis les archives, désarchiver
        const { supabase } = await import("@/integrations/supabase/client");
        await supabase.from("patients").update({ archive: false }).eq("id", id);
      }
      await loadData();
    } catch (err) {
      toast.error("Erreur lors du changement de statut");
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archivePatient(id);
      await loadData();
      toast.success("Dossier archivé");
    } catch (err) {
      toast.error("Erreur lors de l'archivage");
    }
  };

  const handleAddClinique = async (nom: string) => {
    try {
      await addCliniqueDB(nom);
      const c = await fetchCliniques();
      setCliniques(c);
    } catch (err) {
      toast.error("Erreur lors de l'ajout de la clinique");
    }
  };

  const handleAddPassage = async (patientId: string, passage: Passage) => {
    try {
      await addPassageDB(patientId, passage);
      await loadData();
      toast.success("Passage ajouté");
    } catch (err) {
      toast.error("Erreur lors de l'ajout du passage");
    }
  };

  const handleDeletePassage = async (patientId: string, passageId: string) => {
    try {
      await deletePassageDB(passageId);
      await loadData();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleDeleteActe = async (patientId: string, passageId: string, acteId: string) => {
    try {
      await deleteActeDB(acteId);
      await loadData();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const activePatients = patients.filter((p) => p.statut === "en_attente");
  const archivedPatients = patients.filter((p) => p.statut === "paye");

  const sumPatient = (p: Patient) =>
    p.passages.reduce((s, ps) => s + ps.actes.reduce((a, act) => a + act.montant, 0), 0);

  const totalEnAttente = patients
    .filter((p) => p.statut === "en_attente" && !p.archive)
    .reduce((sum, p) => sum + sumPatient(p), 0);

  const totalPaye = patients
    .filter((p) => p.statut === "paye")
    .reduce((sum, p) => sum + sumPatient(p), 0);

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-50 bg-primary px-4 py-3 flex items-center justify-between shadow-md">
        <h1 className="text-primary-foreground font-heading font-bold text-lg">
          Honoraires
        </h1>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadData}
            className="text-primary-foreground hover:bg-primary/80"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            className="text-primary-foreground hover:bg-primary/80"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-primary-foreground hover:bg-primary/80"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container max-w-lg mx-auto py-4 space-y-4">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Chargement...</div>
        ) : showForm ? (
          <PatientForm
            cliniques={cliniques}
            onAddClinique={handleAddClinique}
            onSubmit={handleAddPatient}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <>
            <Button
              onClick={() => setShowForm(true)}
              className="w-full touch-target text-base font-semibold gap-2"
            >
              <Plus className="h-5 w-5" />
              Nouveau Patient
            </Button>

            <Tabs defaultValue="actifs" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="actifs" className="flex-1 touch-target">
                  Actifs ({activePatients.length})
                </TabsTrigger>
                <TabsTrigger value="archives" className="flex-1 touch-target">
                  <Archive className="h-4 w-4 mr-1" />
                  Archives ({archivedPatients.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="actifs">
                <PatientList
                  patients={activePatients}
                  onStatusChange={handleStatusChange}
                  onArchive={handleArchive}
                  onDelete={handleDeletePatient}
                  onAddPassage={handleAddPassage}
                  onDeletePassage={handleDeletePassage}
                  onDeleteActe={handleDeleteActe}
                />
              </TabsContent>
              <TabsContent value="archives">
                <ArchiveList patients={archivedPatients} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>

      <DashboardFooter totalEnAttente={totalEnAttente} totalPaye={totalPaye} />
    </div>
  );
};

export default DashboardPage;
