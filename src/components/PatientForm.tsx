import { useState } from "react";
import { Patient, Passage, Acte, ACTES_STANDARDS } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface PatientFormProps {
  cliniques: string[];
  onAddClinique: (nom: string) => void;
  onSubmit: (patient: Patient) => void;
  onCancel: () => void;
  initialData?: Patient | null;
}

const PatientForm = ({ cliniques, onAddClinique, onSubmit, onCancel, initialData }: PatientFormProps) => {
  const [nom, setNom] = useState(initialData?.nom || "");
  const [chambre, setChambre] = useState(initialData?.chambre || "");
  const [etage, setEtage] = useState(initialData?.etage || "");
  const [clinique, setClinique] = useState(initialData?.clinique || "");
  const [autresClinique, setAutresClinique] = useState("");
  const [showAutres, setShowAutres] = useState(false);
  const [date, setDate] = useState<Date>(initialData ? new Date(initialData.passages[0]?.date || new Date()) : new Date());
  const [selectedActes, setSelectedActes] = useState<{ nom: string; montant: number }[]>(
    initialData?.passages[0]?.actes.map(a => ({ nom: a.nom, montant: a.montant })) || []
  );
  const [montantLibre, setMontantLibre] = useState("");
  const [nomLibre, setNomLibre] = useState("");

  const toggleActe = (acte: { nom: string; montant: number }) => {
    setSelectedActes((prev) =>
      prev.find((a) => a.nom === acte.nom)
        ? prev.filter((a) => a.nom !== acte.nom)
        : [...prev, acte]
    );
  };

  const addActeLibre = () => {
    if (montantLibre && nomLibre) {
      setSelectedActes((prev) => [...prev, { nom: nomLibre, montant: parseFloat(montantLibre) }]);
      setMontantLibre("");
      setNomLibre("");
    }
  };

  const handleCliniqueChange = (value: string) => {
    if (value === "__autres__") {
      setShowAutres(true);
      setClinique("");
    } else {
      setShowAutres(false);
      setClinique(value);
    }
  };

  const handleAddAutresClinique = () => {
    if (autresClinique.trim()) {
      onAddClinique(autresClinique.trim());
      setClinique(autresClinique.trim());
      setShowAutres(false);
      setAutresClinique("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !clinique || selectedActes.length === 0) return;

    const passage: Passage = {
      id: crypto.randomUUID(),
      date: date.toISOString(),
      actes: selectedActes.map((a) => ({ id: crypto.randomUUID(), ...a })),
    };

    const patient: Patient = {
      id: initialData?.id || crypto.randomUUID(),
      nom: nom.trim(),
      chambre: chambre.trim(),
      etage: etage.trim(),
      clinique,
      passages: initialData ? [...initialData.passages.slice(1), passage] : [passage],
      statut: "en_attente",
      archive: false,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    onSubmit(patient);
  };

  const total = selectedActes.reduce((s, a) => s + a.montant, 0);

  return (
    <Card className="animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel} className="touch-target">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="font-heading text-lg">
            {initialData ? "Modifier Patient" : "Nouveau Patient"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Clinique */}
          <div className="space-y-2">
            <Label>Clinique</Label>
            <Select value={clinique || (showAutres ? "__autres__" : "")} onValueChange={handleCliniqueChange}>
              <SelectTrigger className="touch-target text-base">
                <SelectValue placeholder="Sélectionner une clinique" />
              </SelectTrigger>
              <SelectContent>
                {cliniques.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
                <SelectItem value="__autres__">AUTRES CLINIQUES...</SelectItem>
              </SelectContent>
            </Select>
            {showAutres && (
              <div className="flex gap-2">
                <Input
                  value={autresClinique}
                  onChange={(e) => setAutresClinique(e.target.value)}
                  placeholder="Nom de la clinique"
                  className="text-base"
                />
                <Button type="button" size="sm" onClick={handleAddAutresClinique}>
                  OK
                </Button>
              </div>
            )}
          </div>

          {/* Patient info */}
          <div className="space-y-2">
            <Label>Nom du Patient</Label>
            <Input value={nom} onChange={(e) => setNom(e.target.value)} className="touch-target text-base" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Chambre</Label>
              <Input value={chambre} onChange={(e) => setChambre(e.target.value)} className="touch-target text-base" />
            </div>
            <div className="space-y-2">
              <Label>Étage</Label>
              <Input value={etage} onChange={(e) => setEtage(e.target.value)} className="touch-target text-base" />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date de passage</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full touch-target text-base justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP", { locale: fr })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Actes */}
          <div className="space-y-3">
            <Label>Actes</Label>
            {ACTES_STANDARDS.map((acte) => (
              <label
                key={acte.nom}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card cursor-pointer hover:bg-accent/50 transition-colors touch-target"
              >
                <Checkbox
                  checked={selectedActes.some((a) => a.nom === acte.nom)}
                  onCheckedChange={() => toggleActe(acte)}
                />
                <span className="flex-1 text-sm">{acte.nom}</span>
                <span className="font-semibold text-sm text-primary">{acte.montant} dh</span>
              </label>
            ))}

            {/* Acte libre */}
            <div className="p-3 rounded-lg border bg-card space-y-2">
              <Label className="text-sm text-muted-foreground">Acte libre</Label>
              <div className="flex gap-2">
                <Input
                  value={nomLibre}
                  onChange={(e) => setNomLibre(e.target.value)}
                  placeholder="Nom de l'acte"
                  className="text-sm"
                />
                <Input
                  value={montantLibre}
                  onChange={(e) => setMontantLibre(e.target.value)}
                  type="number"
                  placeholder="Montant"
                  className="w-24 text-sm"
                />
                <Button type="button" size="sm" onClick={addActeLibre} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Selected custom actes */}
            {selectedActes
              .filter((a) => !ACTES_STANDARDS.find((s) => s.nom === a.nom))
              .map((a, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-accent/30 text-sm">
                  <span className="flex-1">{a.nom}</span>
                  <span className="font-semibold text-primary">{a.montant} dh</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedActes((prev) => prev.filter((x) => x !== a))}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
          </div>

          {/* Total & Submit */}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="font-heading font-bold text-lg">Total: {total} dh</span>
            <Button type="submit" className="touch-target text-base font-semibold px-8" disabled={!nom.trim() || !clinique || selectedActes.length === 0}>
              {initialData ? "Modifier" : "Enregistrer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientForm;
