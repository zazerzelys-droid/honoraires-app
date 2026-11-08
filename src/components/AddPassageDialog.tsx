import { useState } from "react";
import { Passage, ACTES_STANDARDS } from "@/types/patient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AddPassageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (passage: Passage) => void;
}

const AddPassageDialog = ({ open, onOpenChange, onAdd }: AddPassageDialogProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedActes, setSelectedActes] = useState<{ nom: string; montant: number }[]>([]);
  const [nomLibre, setNomLibre] = useState("");
  const [montantLibre, setMontantLibre] = useState("");

  const toggleActe = (acte: { nom: string; montant: number }) => {
    setSelectedActes((prev) =>
      prev.find((a) => a.nom === acte.nom)
        ? prev.filter((a) => a.nom !== acte.nom)
        : [...prev, acte]
    );
  };

  const addLibre = () => {
    if (nomLibre && montantLibre) {
      setSelectedActes((prev) => [...prev, { nom: nomLibre, montant: parseFloat(montantLibre) }]);
      setNomLibre("");
      setMontantLibre("");
    }
  };

  const handleSubmit = () => {
    if (selectedActes.length === 0) return;
    const passage: Passage = {
      id: crypto.randomUUID(),
      date: date.toISOString(),
      actes: selectedActes.map((a) => ({ id: crypto.randomUUID(), ...a })),
    };
    onAdd(passage);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">Ajouter un passage</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full touch-target text-base justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP", { locale: fr })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Actes</Label>
            {ACTES_STANDARDS.map((acte) => (
              <label key={acte.nom} className="flex items-center gap-3 p-2 rounded-md border cursor-pointer touch-target">
                <Checkbox checked={selectedActes.some((a) => a.nom === acte.nom)} onCheckedChange={() => toggleActe(acte)} />
                <span className="flex-1 text-sm">{acte.nom}</span>
                <span className="text-sm font-semibold text-primary">{acte.montant} dh</span>
              </label>
            ))}
            <div className="flex gap-2">
              <Input value={nomLibre} onChange={(e) => setNomLibre(e.target.value)} placeholder="Acte libre" className="text-sm" />
              <Input value={montantLibre} onChange={(e) => setMontantLibre(e.target.value)} type="number" placeholder="dh" className="w-20 text-sm" />
              <Button type="button" size="sm" variant="outline" onClick={addLibre}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full touch-target" disabled={selectedActes.length === 0}>
            Ajouter ({selectedActes.reduce((s, a) => s + a.montant, 0)} dh)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPassageDialog;
