
"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, CheckCircle2, Clock, FileSpreadsheet, RefreshCw, Search } from "lucide-react";

// Util
function cn(...cls: Array<string | undefined | false>) {
  return cls.filter(Boolean).join(" ");
}

// --- Dati finti --------------------------------------------------------------

type PRCItem = {
  id: string;
  commessa: string;
  cliente: string;
  responsabile: string;
  inizio: string;  // ISO date
  fine?: string;   // ISO date (solo per completati)
  avanzamento?: number; // 0..100 (solo per in corso)
  stato: "in_corso" | "completato";
  note?: string;
};

const PRC_DATA: PRCItem[] = [
  // In corso
  {
    id: "PRC-2025-001",
    commessa: "Revamping Carrozza UIC-Z1",
    cliente: "FerroLinea S.p.A.",
    responsabile: "M. Rossi",
    inizio: "2025-09-10",
    avanzamento: 68,
    stato: "in_corso",
    note: "Verniciatura in cabina 2",
  },
  {
    id: "PRC-2025-002",
    commessa: "Revisione Sospensioni ETR500",
    cliente: "AltaVeloce",
    responsabile: "L. Bianchi",
    inizio: "2025-09-18",
    avanzamento: 42,
    stato: "in_corso",
    note: "In attesa componenti fornitore",
  },
  {
    id: "PRC-2025-004",
    commessa: "Refit Interni Jazz",
    cliente: "Trasporti Centro",
    responsabile: "G. Verdi",
    inizio: "2025-09-28",
    avanzamento: 25,
    stato: "in_corso",
    note: "Smontaggi comparti bagno",
  },
  // Completati
  {
    id: "PRC-2025-003",
    commessa: "Sostituzione Porte IC901",
    cliente: "LineaNord",
    responsabile: "S. Neri",
    inizio: "2025-08-20",
    fine: "2025-09-12",
    stato: "completato",
    note: "Collaudo superato",
  },
  {
    id: "PRC-2025-005",
    commessa: "Manutenzione Ordinaria Minuetto",
    cliente: "RegioRail",
    responsabile: "A. Gallo",
    inizio: "2025-07-05",
    fine: "2025-08-01",
    stato: "completato",
    note: "KPI nei limiti",
  },
];

// --- Componenti UI -----------------------------------------------------------

function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
}: {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  trend?: { label: string; up?: boolean };
}) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
          {trend && (
            <span
              className={cn(
                "ml-2 inline-flex items-center gap-1",
                trend.up ? "text-emerald-600" : "text-red-600"
              )}
            >
              <ArrowUpRight className={cn("h-3 w-3", !trend.up && "rotate-180")} />
              {trend.label}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

function Toolbar({
  value,
  onChange,
  onRefresh,
}: {
  value: string;
  onChange: (v: string) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cerca commessa, cliente, responsabile..."
          className="pl-8"
        />
      </div>
      <Button variant="outline" onClick={onRefresh} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Aggiorna
      </Button>
    </div>
  );
}

function TableInCorso({ items }: { items: PRCItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PRC in Corso</CardTitle>
        <CardDescription>Attività operative con avanzamento in tempo reale</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">PRC</TableHead>
              <TableHead>Commessa</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Responsabile</TableHead>
              <TableHead className="w-[160px]">Avanzamento</TableHead>
              <TableHead className="w-[120px]">Stato</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-mono">{row.id}</TableCell>
                <TableCell className="font-medium">{row.commessa}</TableCell>
                <TableCell>{row.cliente}</TableCell>
                <TableCell>{row.responsabile}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>{row.avanzamento}%</span>
                      <span className="text-muted-foreground">
                        avvio {new Date(row.inizio).toLocaleDateString("it-IT")}
                      </span>
                    </div>
                    <Progress value={row.avanzamento ?? 0} className="h-2" />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3 w-3" />
                    In corso
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nessun PRC in corso trovato
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TableCompletati({ items }: { items: PRCItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PRC Completati</CardTitle>
        <CardDescription>Storico recente con esito e note di lavorazione</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">PRC</TableHead>
              <TableHead>Commessa</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Responsabile</TableHead>
              <TableHead className="w-[160px]">Periodo</TableHead>
              <TableHead className="w-[120px]">Esito</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-mono">{row.id}</TableCell>
                <TableCell className="font-medium">{row.commessa}</TableCell>
                <TableCell>{row.cliente}</TableCell>
                <TableCell>{row.responsabile}</TableCell>
                <TableCell className="text-xs">
                  {new Date(row.inizio).toLocaleDateString("it-IT")} →{" "}
                  {row.fine ? new Date(row.fine).toLocaleDateString("it-IT") : "-"}
                </TableCell>
                <TableCell>
                  <Badge className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Completato
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nessun PRC completato trovato
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// --- Pagina ------------------------------------------------------------------

export default function Home() {
  const [query, setQuery] = useState("");

  const { inCorso, completati } = useMemo(() => {
    const q = query.toLowerCase().trim();
    const filtered = PRC_DATA.filter((r) => {
      if (!q) return true;
      const hay = `${r.id} ${r.commessa} ${r.cliente} ${r.responsabile}`.toLowerCase();
      return hay.includes(q);
    });
    return {
      inCorso: filtered.filter((r) => r.stato === "in_corso"),
      completati: filtered.filter((r) => r.stato === "completato"),
    };
  }, [query]);

  // metriche semplici
  const kpiInCorso = inCorso.length;
  const kpiCompletati = completati.length;
  const avanzamentoMedio =
    inCorso.length > 0
      ? Math.round(
          inCorso.reduce((acc, r) => acc + (r.avanzamento ?? 0), 0) / inCorso.length
        )
      : 0;

  return (
    <div className="space-y-6 mx-auto w-[85%] mt-20">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard PRC</h1>
          <p className="text-sm text-muted-foreground">
            Demo di monitoraggio commesse: PRC in corso e completati.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Esporta
          </Button>
          <Button className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Aggiorna dati
          </Button>
        </div>
      </div>

      {/* Metriche */}
      <div className="grid gap-4 laptop:grid-cols-3">
        <MetricCard
          title="PRC in corso"
          value={kpiInCorso.toString()}
          description="attività operative aperte"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          trend={{ label: "+2 oggi", up: true }}
        />
        <MetricCard
          title="PRC completati"
          value={kpiCompletati.toString()}
          description="ultimi completamenti registrati"
          icon={<CheckCircle2 className="h-4 w-4 text-muted-foreground" />}
          trend={{ label: "+1 questa settimana", up: true }}
        />
        <MetricCard
          title="Avanzamento medio"
          value={`${avanzamentoMedio}%`}
          description="media sui PRC aperti"
          icon={<ArrowUpRight className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Toolbar ricerca */}
      <Toolbar
        value={query}
        onChange={setQuery}
        onRefresh={() => {
          // placeholder per la demo
          // qui potresti fare un re-fetch dati
          console.log("refresh");
        }}
      />

      {/* Tabs con le due tabelle */}
      <Tabs defaultValue="in-corso" className="space-y-4">
        <TabsList>
          <TabsTrigger value="in-corso">PRC in Corso</TabsTrigger>
          <TabsTrigger value="completati">PRC Completati</TabsTrigger>
        </TabsList>
        <TabsContent value="in-corso" className="space-y-4">
          <TableInCorso items={inCorso} />
        </TabsContent>
        <TabsContent value="completati" className="space-y-4">
          <TableCompletati items={completati} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

