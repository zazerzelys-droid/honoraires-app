import { Patient } from "@/types/patient";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const ArchiveList = ({ patients }: { patients: Patient[] }) => {
  if (patients.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Aucun dossier archivé</p>
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
        return (
          <Card key={patient.id} className="opacity-75">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading font-semibold">{patient.nom}</h3>
                  <p className="text-sm text-muted-foreground">{patient.clinique}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {patient.passages.length} passage(s) ·{" "}
                    {format(new Date(patient.createdAt), "dd MMM yyyy", { locale: fr })}
                  </p>
                </div>
                <span className="font-bold text-success">{total} dh ✓</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ArchiveList;
