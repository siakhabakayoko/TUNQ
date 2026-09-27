'use client';

import React, { useState } from 'react';
import { HeaderNav } from '@/components/layout/HeaderNav';
import { ProjectEvaluationForm } from '@/components/decision-console/ProjectEvaluationForm';
import { EvaluationResultsView } from '@/components/decision-console/EvaluationResultsView';
import { AnsdDataExplorer } from '@/components/data-explorer/AnsdDataExplorer';
import { DataRoomManager } from '@/components/data-room/DataRoomManager';
import { TechWindow } from '@/components/typesafe-ui/TechWindow';
import { ProjectInput, FullProjectEvaluation } from '@/types';
import { Terminal, ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';

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
    <div className="min-h-screen bg-[#07090E] text-zinc-100 flex flex-col font-sans selection:bg-[#03FFB2] selection:text-black">
      {/* Top Navigation */}
      <HeaderNav activeView={activeView} onSelectView={setActiveView} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* VIEW 1: STUDIO DE DÉCISION */}
        {activeView === 'decision' && (
          <div className="space-y-6">
            {!evaluation ? (
              <>
                {/* Hero Banner inspired by TypeSafe AI */}
                <div className="border border-[#21262D] bg-[#0D1117] p-6 md:p-8 relative overflow-hidden">
                  {/* Subtle grain/dither backdrop */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1E2633_1px,transparent_1px)] [background-size:10px_10px] opacity-40 pointer-events-none" />

                  <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 border border-[#03FFB2]/40 bg-[#03FFB2]/10 px-2.5 py-1 text-[11px] font-mono text-[#03FFB2] uppercase tracking-widest mb-4">
                      <Cpu className="h-3.5 w-3.5" /> MOTEUR DE DÉCISION SYSTEM ONE // SÉNÉGAL & UEMOA
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-none mb-3">
                      Prouver la rentabilité.
                      <span className="block text-[#03FFB2] mt-1">Trancher sans complaisance.</span>
                    </h1>

                    <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-sans mt-2">
                      Confrontez votre idée de business aux données officielles de l'<strong>ANSD</strong> (IHPC, Recensement RGPH-5, pérennité RGE-2) et aux flux transfrontaliers <strong>UEMOA</strong>. Arbitrage froid par <strong>Jev (TypeSafe AI)</strong> et plan d'action rédigé par <strong>Google Gemini</strong>.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-6 font-mono text-xs text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 bg-[#03FFB2]" />
                        <span>ZÉRO HALLUCINATION : SCORING TYPÉ</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 bg-cyan-400" />
                        <span>BENCHMARKS RÉELS ANSD 2024-2026</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 bg-amber-400" />
                        <span>STRESS-TESTS D’INFLATION FCFA</span>
                      </div>
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
                    <div className="mb-4 p-3 bg-red-950/40 border border-red-800 text-red-300 font-mono text-xs">
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

      {/* Technical Footer */}
      <footer className="border-t border-[#1C2128] bg-[#06080B] py-4 px-6 text-zinc-500 font-mono text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#03FFB2] font-bold">TUNQ</span>
            <span>// Plateforme d'Intelligence Économique & d'Arbitrage Stratégique</span>
          </div>
          <div className="text-[10px] text-zinc-600">
            Sources : ANSD Sénégal (senegal.opendataforafrica.org) • BCEAO • Commission UEMOA • TypeSafe AI Jev
          </div>
        </div>
      </footer>
    </div>
  );
}
