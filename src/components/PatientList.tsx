import { useState } from "react";
import { Patient, Passage, ACTES_STANDARDS } from "@/types/patient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import AddPassageDialog from "@/components/AddPassageDialog";

interface PatientListProps {
  patients: Patient[];
  onStatusChange: (id: string, statut: "en_attente" | "paye") => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onAddPassage: (patientId: string, passage: Passage) => void;
  onDeletePassage: (patientId: string, passageId: string) => void;
  onDeleteActe: (patientId: string, passageId: string, acteId: string) => void;
}

const PatientList = ({
  patients,
  onStatusChange,
  onArchive,
  onDelete,
  onAddPassage,
  onDeletePassage,
  onDeleteActe,
}: PatientListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [passageDialogPatientId, setPassageDialogPatientId] = useState<string | null>(null);

  if (patients.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Aucun patient enregistré</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {patients.map((patient) => {
        const total = patient.passages.reduce(
          (s, ps) => s + ps.actes.reduce((a, act) => a + act.montant, 0),
          0
        );
        const isExpanded = expandedId === patient.id;

        return (
          <Card key={patient.id} className="animate-slide-up overflow-hidden">
            <CardContent className="p-4">
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : patient.id)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-3 h-3 rounded-full flex-shrink-0 ${
                        patient.statut === "paye" ? "bg-success" : "bg-destructive"
                      }`}
                    />
                    <h3 className="font-heading font-semibold text-base">{patient.nom}</h3>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {patient.clinique} · Ch. {patient.chambre} · Ét. {patient.etage}
                  </p>
                </button>
                <span className="font-bold text-primary whitespace-nowrap">{total} dh</span>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-4 space-y-3 animate-slide-up">
                  {patient.passages.map((passage) => (
                    <div key={passage.id} className="bg-muted rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {format(new Date(passage.date), "dd MMM yyyy", { locale: fr })}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeletePassage(patient.id, passage.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      {passage.actes.map((acte) => (
                        <div key={acte.id} className="flex items-center justify-between text-sm pl-2">
                          <span>{acte.nom}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-primary font-medium">{acte.montant} dh</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteActe(patient.id, passage.id, acte.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPassageDialogPatientId(patient.id)}
                      className="touch-target text-sm gap-1"
                    >
                      <Plus className="h-4 w-4" /> Ajouter un passage
                    </Button>
                    {patient.statut === "en_attente" ? (
                      <Button
                        size="sm"
                        onClick={() => onStatusChange(patient.id, "paye")}
                        className="touch-target text-sm bg-success hover:bg-success/90"
                      >
                        Marquer Payé
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onStatusChange(patient.id, "en_attente")}
                        className="touch-target text-sm"
                      >
                        Remettre En Attente
                      </Button>
                    )}
                    {patient.statut === "paye" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onArchive(patient.id)}
                        className="touch-target text-sm"
                      >
                        Archiver
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(patient.id)}
                      className="touch-target text-sm text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {passageDialogPatientId && (
        <AddPassageDialog
          open={!!passageDialogPatientId}
          onOpenChange={(open) => !open && setPassageDialogPatientId(null)}
          onAdd={(passage) => {
            onAddPassage(passageDialogPatientId, passage);
            setPassageDialogPatientId(null);
          }}
        />
      )}
    </div>
  );
};

export default PatientList;
