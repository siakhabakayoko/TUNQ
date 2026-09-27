'use client';

import React, { useState } from 'react';
import { HeaderNav } from '@/components/layout/HeaderNav';
import { ProjectEvaluationForm } from '@/components/decision-console/ProjectEvaluationForm';
import { EvaluationResultsView } from '@/components/decision-console/EvaluationResultsView';
import { AnsdDataExplorer } from '@/components/data-explorer/AnsdDataExplorer';
import { DataRoomManager } from '@/components/data-room/DataRoomManager';
import { TechWindow } from '@/components/typesafe-ui/TechWindow';
import { AsciiHeader } from '@/components/typesafe-ui/AsciiHeader';
import { TunqLogo } from '@/components/layout/TunqLogo';
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
    <div className="min-h-screen bg-[#07090E] text-zinc-100 flex flex-col font-mono selection:bg-[#03FFB2] selection:text-black">
      {/* 90s GUI Top Navigation */}
      <HeaderNav activeView={activeView} onSelectView={setActiveView} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-6 space-y-5">
        {/* Retro ASCII Header Terminal Banner */}
        <AsciiHeader />

        {/* VIEW 1: STUDIO DE DÉCISION */}
        {activeView === 'decision' && (
          <div className="space-y-6">
            {!evaluation ? (
              <>
                {/* 90s Retro GUI Hero Box */}
                <div className="border-2 border-t-zinc-600 border-l-zinc-600 border-b-black border-r-black bg-[#0D1117] p-5 md:p-6 relative overflow-hidden shadow-lg">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                      <div className="inline-flex items-center gap-2 border border-[#03FFB2]/40 bg-[#03FFB2]/10 px-2 py-0.5 text-[10px] text-[#03FFB2] uppercase tracking-widest mb-3">
                        <Cpu className="h-3 w-3" /> MOTEUR DE DÉCISION DÉTERMINISTE // SYSTEM ONE SÉNÉGAL
                      </div>

                      <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-tight">
                        Prouver la rentabilité.
                        <span className="block text-[#03FFB2]">Trancher sans complaisance.</span>
                      </h1>

                      <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-sans mt-2">
                        Confrontez votre idée de business aux données officielles de l'<strong>ANSD</strong> (IHPC 2023, Recensement RGPH-5, pérennité RGE-2) et aux flux transfrontaliers <strong>UEMOA</strong>. Arbitrage froid par <strong>Jev (TypeSafe AI)</strong> et plan d'action rédigé par <strong>Google Gemini</strong>.
                      </p>

                      <div className="flex flex-wrap gap-3 mt-4 text-[10px] text-zinc-400">
                        <div className="flex items-center gap-1.5 border border-zinc-700 bg-black/40 px-2 py-0.5">
                          <span className="h-1.5 w-1.5 bg-[#03FFB2]" />
                          <span>ZÉRO HALLUCINATION : SCORING TYPÉ</span>
                        </div>
                        <div className="flex items-center gap-1.5 border border-zinc-700 bg-black/40 px-2 py-0.5">
                          <span className="h-1.5 w-1.5 bg-cyan-400" />
                          <span>BENCHMARKS ANSD 2024-2026</span>
                        </div>
                        <div className="flex items-center gap-1.5 border border-zinc-700 bg-black/40 px-2 py-0.5">
                          <span className="h-1.5 w-1.5 bg-[#FFB224]" />
                          <span>STRESS-TESTS D’INFLATION FCFA</span>
                        </div>
                      </div>
                    </div>

                    {/* Logo Display in Hero */}
                    <div className="hidden lg:flex flex-col items-center justify-center p-5 bg-[#080B0F] border-2 border-t-black border-l-black border-b-zinc-700 border-r-zinc-700 shadow-inner">
                      <TunqLogo className="h-14 w-auto text-[#03FFB2]" fill="#03FFB2" />
                      <span className="text-[9px] text-zinc-500 font-mono mt-2 tracking-widest uppercase">
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

      {/* 90s Taskbar Style Footer */}
      <footer className="border-t-2 border-t-zinc-600 border-b border-b-black bg-[#161B22] py-2 px-4 text-zinc-400 font-mono text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#03FFB2] font-bold">[START] TUNQ</span>
            <span>// Plateforme d'Intelligence Économique & d'Arbitrage Stratégique</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-zinc-500">
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
