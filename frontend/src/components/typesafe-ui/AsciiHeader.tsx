import React from 'react';

export const AsciiHeader: React.FC = () => {
  return (
    <div className="font-mono text-xs select-none overflow-x-auto border-2 border-t-white border-l-white border-b-black border-r-black bg-[#C0C0C0] text-black shadow-md p-1">
      {/* 90s Desktop Titlebar */}
      <div className="bg-[#000080] text-white px-2 py-1 flex items-center justify-between font-bold text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 bg-[#C0C0C0] border border-t-white border-l-white border-b-black border-r-black inline-block" />
          <span>TUNQ_OS_98 [SYSTEM_ONE // TERMINAL INTERFACE]</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="h-4 w-4 bg-[#C0C0C0] border border-t-white border-l-white border-b-black border-r-black text-black font-mono text-[10px] leading-none flex items-center justify-center font-bold">
            _
          </button>
          <button className="h-4 w-4 bg-[#C0C0C0] border border-t-white border-l-white border-b-black border-r-black text-black font-mono text-[10px] leading-none flex items-center justify-center font-bold">
            □
          </button>
          <button className="h-4 w-4 bg-[#C0C0C0] border border-t-white border-l-white border-b-black border-r-black text-black font-mono text-[10px] leading-none flex items-center justify-center font-bold">
            ×
          </button>
        </div>
      </div>

      {/* Retro ASCII Terminal Body */}
      <div className="bg-black text-[#03FFB2] p-3 border border-t-black border-l-black border-b-white border-r-white font-mono text-[10px] md:text-[11px] leading-[13px] whitespace-pre overflow-x-auto">
{`
╔══════════════════════════════════════════════════════════════════════════════════════╗
║  ████████╗██╗   ██╗███╗   ██╗ ██████╗       [ SYSTEM ONE DECISION CORE v0.1 ]       ║
║  ╚══██╔══╝██║   ██║████╗  ██║██╔═══██╗      [ ARBITRAGE : TUNQ DECISION CORE ]      ║
║     ██║   ██║   ██║██╔██╗ ██║██║   ██║      [ DATA LAKE : ANSD SÉNÉGAL (158 DB) ]   ║
║     ██║   ██║   ██║██║╚██╗██║██║▄▄ ██║      [ EXPANSION : CORRIDORS UEMOA / BCEAO ] ║
║     ██║   ╚██████╔╝██║ ╚████║╚██████╔╝      [ SÉCURITÉ  : DATA ROOM AES-256 ]       ║
║     ╚═╝    ╚═════╝ ╚═╝  ╚═══╝ ╚══▀▀═╝       [ STATUT    : ONLINE // CALIBRATED ]    ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
`}
        <div className="flex flex-wrap items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-800">
          <span>&gt; ANSD_NODE_DKR // SYNC_OK</span>
          <span>&gt; LATENCY : 142ms</span>
          <span>&gt; MEM_HEAP : 640KB BASE OK</span>
          <span>&gt; CORRIDORS : DKR-BKO | DKR-ABJ | DKR-CKY</span>
        </div>
      </div>
    </div>
  );
};
