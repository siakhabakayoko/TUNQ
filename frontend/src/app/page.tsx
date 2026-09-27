'use client';

import React, { useState } from 'react';
import { HeaderNav } from '@/components/layout/HeaderNav';
import { ProjectEvaluationForm } from '@/components/decision-console/ProjectEvaluationForm';
import { EvaluationResultsView } from '@/components/decision-console/EvaluationResultsView';
import { AnsdDataExplorer } from '@/components/data-explorer/AnsdDataExplorer';
import { DataRoomManager } from '@/components/data-room/DataRoomManager';
import { TechWindow } from '@/components/typesafe-ui/TechWindow';
import { TunqLogo } from '@/components/layout/TunqLogo';
import { ProjectInput, FullProjectEvaluation } from '@/types';
import { ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';

export default function Home() {
  const [activeView, setActiveView] = useState<'decision' | 'explorer' | 'dataroom'>('decision');
  const [evaluation, setEvaluation] = useState<FullProjectEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEvaluate = async (input: ProjectInput) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de l’évaluation.');
      }

      const evalData: FullProjectEvaluation = await res.json();
      setEvaluation(evalData);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Erreur de connexion au moteur décisionnel.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-mono selection:bg-primary selection:text-primary-foreground">
      {/* Top Navigation */}
      <HeaderNav activeView={activeView} onSelectView={setActiveView} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        {/* VIEW 1: STUDIO DE DÉCISION */}
        {activeView === 'decision' && (
          <div className="space-y-6">
            {!evaluation ? (
              <>
                {/* Hero Box */}
                <div className="border border-border bg-card p-6 md:p-8 shadow-xs relative overflow-hidden">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                      <div className="inline-flex items-center gap-2 border border-border bg-secondary px-2.5 py-1 text-[11px] text-foreground uppercase tracking-widest mb-3 font-mono font-semibold">
                        <Cpu className="h-3.5 w-3.5 text-primary" /> MOTEUR DE DÉCISION DÉTERMINISTE // SYSTEM ONE SÉNÉGAL
                      </div>

                      <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15] font-heading">
                        Prouver la rentabilité.
                        <span className="block text-primary">Trancher sans complaisance.</span>
                      </h1>

                      <p className="text-sm text-muted-foreground leading-relaxed font-sans mt-3">
                        Confrontez votre projet aux données certifiées de l'<strong>ANSD</strong> (IHPC 2023, Recensement RGPH-5, pérennité RGE-2) et aux flux transfrontaliers <strong>UEMOA</strong>. Arbitrage froid par <strong>Jev (TypeSafe AI)</strong> et plan d'action rédigé par <strong>Google Gemini</strong>.
                      </p>

                      <div className="flex flex-wrap gap-2.5 mt-5 text-[11px] font-mono">
                        <div className="flex items-center gap-2 border border-border bg-secondary/80 px-2.5 py-1 text-foreground">
                          <span className="h-2 w-2 bg-emerald-600 inline-block" />
                          <span>ZÉRO HALLUCINATION : SCORING TYPÉ</span>
                        </div>
                        <div className="flex items-center gap-2 border border-border bg-secondary/80 px-2.5 py-1 text-foreground">
                          <span className="h-2 w-2 bg-sky-600 inline-block" />
                          <span>BENCHMARKS ANSD 2024-2026</span>
                        </div>
                        <div className="flex items-center gap-2 border border-border bg-secondary/80 px-2.5 py-1 text-foreground">
                          <span className="h-2 w-2 bg-amber-600 inline-block" />
                          <span>STRESS-TESTS D’INFLATION FCFA</span>
                        </div>
                      </div>
                    </div>

                    {/* Logo Display in Hero */}
                    <div className="hidden lg:flex flex-col items-center justify-center p-6 bg-secondary/40 border border-border">
                      <TunqLogo className="h-14 w-auto text-foreground" fill="currentColor" />
                      <span className="text-[10px] text-muted-foreground font-mono mt-3 tracking-widest uppercase font-semibold">
                        SÉNÉGAL // UEMOA SYSTEM
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Window */}
                <TechWindow
                  title="CONFIGURATION DU PROJET & MODÉLISATION FINANCIÈRE"
                  badge="FORMULAIRE ACTIF"
                  badgeColor="emerald"
                >
                  {errorMsg && (
                    <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive font-mono text-xs">
                      [ERREUR] : {errorMsg}
                    </div>
                  )}

                  <ProjectEvaluationForm onSubmit={handleEvaluate} isLoading={isLoading} />
                </TechWindow>
              </>
            ) : (
              <EvaluationResultsView
                evaluation={evaluation}
                onReset={() => setEvaluation(null)}
              />
            )}
          </div>
        )}

        {/* VIEW 2: OBSERVATOIRE ANSD */}
        {activeView === 'explorer' && <AnsdDataExplorer />}

        {/* VIEW 3: DATA ROOM */}
        {activeView === 'dataroom' && <DataRoomManager />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary py-3 px-4 text-muted-foreground font-mono text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-foreground font-bold">[START] TUNQ</span>
            <span>// Plateforme d'Intelligence Économique & d'Arbitrage Stratégique</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span>ANSD (senegal.opendataforafrica.org)</span>
            <span>•</span>
            <span>BCEAO / UEMOA</span>
            <span>•</span>
            <span>TypeSafe AI Jev</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
