import { useState, useEffect } from "react";
import { getTheme, saveTheme } from "@/lib/theme";
import { fetchCliniques, addCliniqueDB } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, Palette, Building2, Download } from "lucide-react";
import { toast } from "sonner";
import { exportAllCsv } from "@/lib/exportCsv";

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage = ({ onBack }: SettingsPageProps) => {
  const [color, setColor] = useState(getTheme().primaryColor);
  const [cliniques, setCliniques] = useState<string[]>([]);
  const [newClinique, setNewClinique] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchCliniques().then(setCliniques).catch(() => {});
  }, []);

  const handleColorChange = (hex: string) => {
    setColor(hex);
    saveTheme({ primaryColor: hex });
  };

  const handleAddClinique = async () => {
    const nom = newClinique.trim();
    if (!nom) return;
    if (cliniques.includes(nom)) {
      toast.error("Cette clinique existe déjà");
      return;
    }
    try {
      await addCliniqueDB(nom);
      setCliniques((prev) => [...prev, nom]);
      setNewClinique("");
      toast.success("Clinique ajoutée");
    } catch {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const presetColors = [
    "#4a5568", "#2d3748", "#1a365d", "#2c5282",
    "#0f766e", "#065f46", "#7c3aed", "#9333ea",
    "#b91c1c", "#c2410c", "#a16207", "#475569",
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-50 bg-primary px-4 py-3 flex items-center gap-3 shadow-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-primary-foreground hover:bg-primary/80"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-primary-foreground font-heading font-bold text-lg">
          Paramètres
        </h1>
      </header>

      <main className="container max-w-lg mx-auto py-4 space-y-4">
        {/* Color Picker */}
        <Card className="animate-slide-up">
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Couleur de l'interface
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Label htmlFor="colorPicker" className="text-sm text-muted-foreground">
                Choisir une couleur :
              </Label>
              <input
                id="colorPicker"
                type="color"
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer"
              />
              <span className="text-sm font-mono text-muted-foreground">{color}</span>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Couleurs rapides :</Label>
              <div className="flex flex-wrap gap-2">
                {presetColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleColorChange(c)}
                    className="w-10 h-10 rounded-lg border-2 transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c,
                      borderColor: c === color ? "hsl(var(--foreground))" : "transparent",
                    }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clinic Manager */}
        <Card className="animate-slide-up">
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Gestion des cliniques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newClinique}
                onChange={(e) => setNewClinique(e.target.value)}
                placeholder="Nom de la nouvelle clinique"
                className="touch-target text-base"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddClinique())}
              />
              <Button onClick={handleAddClinique} className="touch-target" disabled={!newClinique.trim()}>
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-1">
              {cliniques.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">Aucune clinique enregistrée</p>
              ) : (
                cliniques.map((c) => (
                  <div
                    key={c}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 text-sm"
                  >
                    <span>{c}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up">
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Export des données (CSV)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Télécharge un fichier par table : cliniques, patients (avec statuts), passages, actes (avec montants) et rendez-vous.
            </p>
            <Button
              className="w-full touch-target gap-2"
              disabled={exporting}
              onClick={async () => {
                setExporting(true);
                try {
                  const n = await exportAllCsv();
                  toast.success(`${n} fichier(s) exporté(s)`);
                } catch {
                  toast.error("Erreur lors de l'export");
                } finally {
                  setExporting(false);
                }
              }}
            >
              <Download className="h-5 w-5" />
              {exporting ? "Export en cours..." : "Exporter en CSV"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SettingsPage;
