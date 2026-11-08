interface DashboardFooterProps {
  totalEnAttente: number;
  totalPaye: number;
}

const DashboardFooter = ({ totalEnAttente, totalPaye }: DashboardFooterProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg z-50">
      <div className="container max-w-lg mx-auto flex">
        <div className="flex-1 py-4 px-4 text-center border-r">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-destructive inline-block" />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">En attente</span>
          </div>
          <span className="text-xl font-bold font-heading text-foreground">{totalEnAttente.toLocaleString("fr-FR")} dh</span>
        </div>
        <div className="flex-1 py-4 px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-success inline-block" />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Payé</span>
          </div>
          <span className="text-xl font-bold font-heading text-success">{totalPaye.toLocaleString("fr-FR")} dh</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardFooter;
