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
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Top Navigation */}
      <HeaderNav activeView={activeView} onSelectView={setActiveView} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-10">
        {/* VIEW 1: STUDIO DE DÉCISION */}
        {activeView === 'decision' && (
          <div className="space-y-10">
            {!evaluation ? (
              <>
                {/* Clean, Formal, Airy Hero */}
                <div className="text-center max-w-3xl mx-auto space-y-4 py-4">
                  <div className="inline-flex items-center gap-2 border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 inline-block" />
                    Données officielles ANSD (RGPH-5, RGE-2, IHPC) & UEMOA
                  </div>

                  <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight font-heading">
                    Évaluez la viabilité de votre projet
                    <span className="block text-primary">avec rigueur et précision.</span>
                  </h1>

                  <p className="text-base text-muted-foreground leading-relaxed font-sans max-w-2xl mx-auto">
                    Confrontez vos hypothèses de prix et de coûts aux statistiques réelles du marché sénégalais. Obtenez un arbitrage objectif, votre seuil de rentabilité et une feuille de route opérationnelle.
                  </p>
                </div>

                {/* Form Section */}
                <TechWindow
                  title="Paramètres du projet et modèle financier"
                  badge="Formulaire d'évaluation"
                  badgeColor="neutral"
                >
                  {errorMsg && (
                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive text-destructive text-sm font-medium">
                      {errorMsg}
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

      {/* Clean Formal Footer */}
      <footer className="border-t border-border bg-card py-6 px-6 text-muted-foreground text-xs font-sans mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-foreground font-bold tracking-tight font-heading">TUNQ</span>
            <span>— Plateforme d'intelligence économique et d'arbitrage financier</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Sources : ANSD Sénégal</span>
            <span>•</span>
            <span>BCEAO / UEMOA</span>
            <span>•</span>
            <span>SYSCOHADA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
