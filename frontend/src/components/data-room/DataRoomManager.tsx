import React, { useState } from 'react';
import { TechWindow } from '@/components/typesafe-ui/TechWindow';
import { DataRoomFile, WorkspaceOrg } from '@/types';
import {
  FolderLock,
  Upload,
  FileText,
  Mail,
  HardDrive,
  CheckCircle2,
  Lock,
  Shield,
  Building,
  RefreshCw,
  Plus
} from 'lucide-react';

const INITIAL_FILES: DataRoomFile[] = [
  {
    id: 'doc_01',
    name: 'bilan_comptable_syscohada_2025.xlsx',
    type: 'financial_syscohada',
    sizeBytes: 1240000,
    syncSource: 'gdrive',
    uploadedAt: '2026-09-15',
    status: 'indexed'
  },
  {
    id: 'doc_02',
    name: 'etude_terrain_consommateurs_dakar.pdf',
    type: 'survey_field',
    sizeBytes: 4200000,
    syncSource: 'upload',
    uploadedAt: '2026-09-18',
    status: 'analyzed'
  },
  {
    id: 'doc_03',
    name: 'devis_fournisseurs_intrants_chine_turquie.pdf',
    type: 'supplier_quote',
    sizeBytes: 850000,
    syncSource: 'gmail',
    uploadedAt: '2026-09-20',
    status: 'indexed'
  },
  {
    id: 'doc_04',
    name: 'pacte_actionnaires_statuts_ohada.pdf',
    type: 'legal',
    sizeBytes: 1800000,
    syncSource: 'upload',
    uploadedAt: '2026-09-22',
    status: 'indexed'
  }
];

export const DataRoomManager: React.FC = () => {
  const [files, setFiles] = useState<DataRoomFile[]>(INITIAL_FILES);
  const [isDriveConnected, setIsDriveConnected] = useState(true);
  const [isGmailConnected, setIsGmailConnected] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newFile: DataRoomFile = {
        id: `doc_${Date.now()}`,
        name: 'etats_financiers_provisoire_s1_2026.pdf',
        type: 'financial_syscohada',
        sizeBytes: 2150000,
        syncSource: 'upload',
        uploadedAt: new Date().toISOString().slice(0, 10),
        status: 'indexed'
      };
      setFiles([newFile, ...files]);
      setIsUploading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Workspace Org Header */}
      <div className="border border-[#21262D] bg-[#11141A] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#161B22] border border-[#272B33] flex items-center justify-center text-[#03FFB2]">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">WORKSPACE : DAKAR VENTURES LAB</span>
              <span className="text-[10px] bg-[#03FFB2]/10 text-[#03FFB2] border border-[#03FFB2]/30 px-1.5 py-0.5">
                ● FOUNDRY MULTI-TENANT
              </span>
            </div>
            <div className="text-xs text-zinc-400 mt-0.5 font-sans">
              Espace sécurisé hermétique. Données privées de l'entreprise cloisonnées pour l'analyse IA.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">ID ORGANISATION :</span>
          <span className="text-zinc-300 font-bold bg-[#1C2128] px-2 py-1 border border-zinc-700">
            ORG_SN_88204
          </span>
        </div>
      </div>

      {/* Cloud Connectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Google Drive Card */}
        <div className="border border-[#21262D] bg-[#0D1117] p-4 font-mono text-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-950/40 border border-blue-800 text-blue-400">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                GOOGLE DRIVE CONNECTOR
                {isDriveConnected && (
                  <span className="text-[9px] text-[#03FFB2] border border-[#03FFB2]/30 bg-[#03FFB2]/10 px-1.5 py-0.2">
                    CONNECTÉ
                  </span>
                )}
              </div>
              <div className="text-[11px] text-zinc-400 font-sans mt-0.5">
                Synchronisation automatique des dossiers financiers & rapports terrain.
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsDriveConnected(!isDriveConnected)}
            className={`px-3 py-1.5 border text-xs transition-all ${
              isDriveConnected
                ? 'border-zinc-700 text-zinc-400 hover:text-white bg-[#161B22]'
                : 'border-[#03FFB2] text-black bg-[#03FFB2]'
            }`}
          >
            {isDriveConnected ? '[ SYNCHRO ACTIVER ]' : '[ CONNECTER ]'}
          </button>
        </div>

        {/* Gmail Card */}
        <div className="border border-[#21262D] bg-[#0D1117] p-4 font-mono text-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-950/40 border border-red-800 text-red-400">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                GMAIL PROCUREMENT WATCHER
                {isGmailConnected && (
                  <span className="text-[9px] text-[#03FFB2] border border-[#03FFB2]/30 bg-[#03FFB2]/10 px-1.5 py-0.2">
                    CONNECTÉ
                  </span>
                )}
              </div>
              <div className="text-[11px] text-zinc-400 font-sans mt-0.5">
                Extraction des devis fournisseurs et mercuriales reçus par email.
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsGmailConnected(!isGmailConnected)}
            className={`px-3 py-1.5 border text-xs transition-all ${
              isGmailConnected
                ? 'border-zinc-700 text-zinc-400 hover:text-white bg-[#161B22]'
                : 'border-[#03FFB2] text-black bg-[#03FFB2]'
            }`}
          >
            {isGmailConnected ? '[ FILTRE ACTIF ]' : '[ CONNECTER ]'}
          </button>
        </div>
      </div>

      {/* Direct Ingestion / Upload Window */}
      <TechWindow
        title="DATA ROOM VIRTUELLE // INGESTION DOCUMENTAIRE SÉCURISÉE"
        badge="AES-256 CHIFFRÉ"
        badgeColor="emerald"
        actions={
          <button
            onClick={handleSimulateUpload}
            disabled={isUploading}
            className="flex items-center gap-1.5 bg-[#03FFB2] hover:bg-[#00E599] text-black px-2.5 py-1 text-xs font-mono font-bold transition-all disabled:opacity-50"
          >
            <Upload className="h-3 w-3" />
            {isUploading ? 'INDEXATION...' : '[ + DÉPOSER UN DOCUMENT ]'}
          </button>
        }
      >
        <div className="overflow-x-auto border border-[#21262D]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#161B22] text-zinc-400 border-b border-[#21262D]">
              <tr>
                <th className="p-3">DOCUMENT / FICHIER</th>
                <th className="p-3">TYPOLOGIE ANALYTIQUE</th>
                <th className="p-3">SOURCE SYNC</th>
                <th className="p-3">TAILLE</th>
                <th className="p-3">DATE D'AJOUT</th>
                <th className="p-3 text-right">STATUT RAG / VECTEUR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2128] bg-[#0D1117]">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-[#161B22]/60 transition-colors">
                  <td className="p-3 font-semibold text-white flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#03FFB2]" />
                    <span>{file.name}</span>
                  </td>
                  <td className="p-3 text-zinc-300 uppercase text-[10px]">
                    {file.type.replace('_', ' ')}
                  </td>
                  <td className="p-3 text-zinc-400">
                    <span className="px-1.5 py-0.5 border border-zinc-700 bg-black/40 text-[10px]">
                      {file.syncSource === 'gdrive' && '● Google Drive'}
                      {file.syncSource === 'gmail' && '● Gmail Archive'}
                      {file.syncSource === 'upload' && '● Dépôt Manuel'}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-400">
                    {(file.sizeBytes / 1024 / 1024).toFixed(2)} Mo
                  </td>
                  <td className="p-3 text-zinc-500">{file.uploadedAt}</td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 border border-[#03FFB2]/30 bg-[#03FFB2]/10 text-[#03FFB2] text-[10px] font-bold">
                      ● {file.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TechWindow>
    </div>
  );
};
