
"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Filter, Search } from "lucide-react";

// -------------------- Tipi & Mock --------------------

type PRCAttivita = {
  id: string;
  codice: string;
  descrizione: string;
  responsabile: string;
  stato: "programmata" | "in_corso" | "completata" | "in_verifica";
  inizio?: string; // ISO
  fine?: string;   // ISO
  note?: string;
};

type PRCDettaglio = {
  id: string;
  commessa: string;
  cliente: string;
  referenteCliente: string;
  responsabileInterno: string;
  dataApertura: string; // ISO
  avanzamento: number;  // 0..100
  statoGenerale: "in_corso" | "completato";
  note?: string;
  attivita: PRCAttivita[];
};

const MOCK_PRC: PRCDettaglio = {
  id: "PRC-2025-001",
  commessa: "Revamping Carrozza UIC-Z1",
  cliente: "FerroLinea S.p.A.",
  referenteCliente: "ing. P. Rinaldi",
  responsabileInterno: "M. Rossi",
  dataApertura: "2025-09-10",
  avanzamento: 68,
  statoGenerale: "in_corso",
  note: "Priorità alta. Coordinare verniciatura con disponibilità cabina 2.",
  attivita: [
    {
      id: "A-01",
      codice: "SMT-001",
      descrizione: "Smontaggio pannelli laterali comparto 1",
      responsabile: "G. Verdi",
      stato: "completata",
      inizio: "2025-09-10",
      fine: "2025-09-11",
      note: "Nessuna anomalia",
    },
    {
      id: "A-02",
      codice: "LVG-010",
      descrizione: "Levigatura superficie esterna modulo A",
      responsabile: "S. Neri",
      stato: "in_corso",
      inizio: "2025-09-12",
      note: "Residui da rimuovere zona porta 2",
    },
    {
      id: "A-03",
      codice: "VNC-020",
      descrizione: "Verniciatura base primer cabina 2",
      responsabile: "A. Gallo",
      stato: "programmata",
      note: "In attesa disponibilità cabina",
    },
    {
      id: "A-04",
      codice: "CTL-005",
      descrizione: "Controllo spessori e ispezione visiva",
      responsabile: "L. Bianchi",
      stato: "in_verifica",
      note: "Campioni prelevati",
    },
  ],
};

// -------------------- Helper UI --------------------

function StatoBadge({ stato }: { stato: PRCAttivita["stato"] }) {
  const map: Record<PRCAttivita["stato"], { label: string; className: string }> = {
    programmata: { label: "Programm.", className: "bg-slate-100 text-slate-800 dark:bg-slate-900" },
    in_corso: { label: "In corso", className: "bg-amber-100 text-amber-800 dark:bg-amber-900" },
    in_verifica: { label: "In verifica", className: "bg-blue-100 text-blue-800 dark:bg-blue-900" },
    completata: { label: "Completata", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900" },
  };
  const s = map[stato];
  return <Badge className={s.className}>{s.label}</Badge>;
}

function formatDate(d?: string) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

// -------------------- Pagina --------------------

export default function CustomerPRCPage() {
  const [q, setQ] = useState("");
  const prc = MOCK_PRC;

  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    if (!term) return prc.attivita;
    return prc.attivita.filter((a) =>
      `${a.codice} ${a.descrizione} ${a.responsabile} ${a.stato}`.toLowerCase().includes(term)
    );
  }, [q, prc.attivita]);

  return (
    <div className="mx-auto w-[75%] space-y-6 py-6">
      {/* Header PRC */}
      <Card>
        <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">PRC {prc.id}</CardTitle>
            <CardDescription>
              <span className="font-medium text-foreground">{prc.commessa}</span> • Cliente: {prc.cliente}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {prc.statoGenerale === "in_corso" ? "In corso" : "Completato"}
            </Badge>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Scarica PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Referente cliente</p>
              <p className="font-medium">{prc.referenteCliente}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Responsabile interno</p>
              <p className="font-medium">{prc.responsabileInterno}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Data apertura</p>
              <p className="font-medium">{formatDate(prc.dataApertura)}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Avanzamento complessivo</p>
              <p className="text-sm text-muted-foreground">{prc.avanzamento}%</p>
            </div>
            <Progress value={prc.avanzamento} className="h-2" />
          </div>

          {prc.note && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Note</p>
                <p className="text-sm">{prc.note}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Toolbar attivita */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filtra attività per codice, descrizione o responsabile…"
            className="pl-8"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtri
        </Button>
      </div>

      {/* Tabella attività */}
      <Card>
        <CardHeader>
          <CardTitle>Attività del PRC</CardTitle>
          <CardDescription>Dettaglio operativo con stati e tempistiche</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[110px]">Codice</TableHead>
                <TableHead>Descrizione</TableHead>
                <TableHead className="w-[140px]">Responsabile</TableHead>
                <TableHead className="w-[120px]">Inizio</TableHead>
                <TableHead className="w-[120px]">Fine</TableHead>
                <TableHead className="w-[130px]">Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono">{a.codice}</TableCell>
                  <TableCell className="font-medium">
                    <div>{a.descrizione}</div>
                    {a.note && <div className="text-xs text-muted-foreground">{a.note}</div>}
                  </TableCell>
                  <TableCell>{a.responsabile}</TableCell>
                  <TableCell className="text-xs">{formatDate(a.inizio)}</TableCell>
                  <TableCell className="text-xs">{formatDate(a.fine)}</TableCell>
                  <TableCell>
                    <StatoBadge stato={a.stato} />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Nessuna attività corrispondente ai filtri
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Allegati e storico azioni (placeholder demo) */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Allegati</CardTitle>
            <CardDescription>Documenti collegati al PRC</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Download className="h-4 w-4" />
              PRC_{prc.id}.pdf
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Download className="h-4 w-4" />
              Verbale-collaudo.pdf
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storico Azioni</CardTitle>
            <CardDescription>Eventi recenti di aggiornamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>12/09 — <span className="font-medium">LVG-010</span> aggiornato a <em>In corso</em></div>
            <div>11/09 — <span className="font-medium">SMT-001</span> segnato come <em>Completata</em></div>
            <div>10/09 — Apertura PRC in piattaforma</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
