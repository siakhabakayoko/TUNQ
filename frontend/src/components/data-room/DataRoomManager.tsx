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
      <div className="border border-border bg-secondary/40 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-card border border-border flex items-center justify-center text-primary shadow-xs">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">WORKSPACE : DAKAR VENTURES LAB</span>
              <span className="text-[10px] bg-secondary text-primary border border-border px-2 py-0.5 font-bold">
                ● FOUNDRY MULTI-TENANT
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 font-sans">
              Espace sécurisé hermétique. Données privées de l'entreprise cloisonnées pour l'analyse IA.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground font-semibold">ID ORGANISATION :</span>
          <span className="text-foreground font-bold bg-card px-2.5 py-1 border border-border">
            ORG_SN_88204
          </span>
        </div>
      </div>

      {/* Cloud Connectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Google Drive Card */}
        <div className="border border-border bg-card p-4 font-mono text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-50 border border-sky-200 text-sky-800">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-foreground flex items-center gap-1.5">
                GOOGLE DRIVE CONNECTOR
                {isDriveConnected && (
                  <span className="text-[9px] text-emerald-800 border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 font-bold">
                    CONNECTÉ
                  </span>
                )}
              </div>
              <div className="text-[11px] text-muted-foreground font-sans mt-0.5">
                Synchronisation des dossiers financiers & rapports terrain.
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsDriveConnected(!isDriveConnected)}
            className={`px-3 py-1.5 border text-xs transition-all font-semibold ${
              isDriveConnected
                ? 'border-border text-foreground hover:bg-muted bg-secondary'
                : 'border-primary text-primary-foreground bg-primary'
            }`}
          >
            {isDriveConnected ? '[ ACTIF ]' : '[ CONNECTER ]'}
          </button>
        </div>

        {/* Gmail Connector Card */}
        <div className="border border-border bg-card p-4 font-mono text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-foreground flex items-center gap-1.5">
                GMAIL CONNECTOR (DEVIS)
                {isGmailConnected && (
                  <span className="text-[9px] text-emerald-800 border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 font-bold">
                    CONNECTÉ
                  </span>
                )}
              </div>
              <div className="text-[11px] text-muted-foreground font-sans mt-0.5">
                Extraction automatique des pièces jointes de devis fournisseurs.
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsGmailConnected(!isGmailConnected)}
            className={`px-3 py-1.5 border text-xs transition-all font-semibold ${
              isGmailConnected
                ? 'border-border text-foreground hover:bg-muted bg-secondary'
                : 'border-primary text-primary-foreground bg-primary'
            }`}
          >
            {isGmailConnected ? '[ ACTIF ]' : '[ CONNECTER ]'}
          </button>
        </div>
      </div>

      {/* Main Files Table Window */}
      <TechWindow
        title="REGISTRE DES DOCUMENTS & PIÈCES JUSTIFICATIVES CLOISONNÉES"
        badge={`${files.length} DOCUMENTS SÉCURISÉS`}
        badgeColor="emerald"
        actions={
          <button
            onClick={handleSimulateUpload}
            disabled={isUploading}
            className="px-2.5 py-1 bg-primary text-primary-foreground text-xs font-mono font-bold flex items-center gap-1 border border-primary disabled:opacity-50"
          >
            <Plus className="h-3 w-3" />
            <span>{isUploading ? 'INDEXATION...' : 'AJOUTER UN FICHIER'}</span>
          </button>
        }
      >
        {/* Upload Dropzone Preview */}
        <div
          onClick={handleSimulateUpload}
          className="border-2 border-dashed border-border p-6 text-center mb-6 cursor-pointer hover:border-primary hover:bg-secondary/40 transition-all font-mono"
        >
          <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
          <div className="text-xs font-bold text-foreground">
            GLISSEZ-DÉPOSEZ VOS ÉTATS FINANCIERS SYSCOHADA, DEVIS OU ÉTUDES
          </div>
          <div className="text-[11px] text-muted-foreground mt-1 font-sans">
            Formats acceptés : PDF, XLSX, CSV, DOCX (Max 25MB par fichier). Chiffrement AES-256 automatique.
          </div>
        </div>

        {/* Files Table */}
        <div className="overflow-x-auto border border-border shadow-xs">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-secondary text-foreground font-bold border-b border-border">
              <tr>
                <th className="p-3">NOM DU DOCUMENT</th>
                <th className="p-3">CATÉGORIE SYSCOHADA</th>
                <th className="p-3">TAILLE</th>
                <th className="p-3">SOURCE SYNC</th>
                <th className="p-3">DATE D'AJOUT</th>
                <th className="p-3 text-right">STATUT ANALYSE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-3 font-semibold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{file.name}</span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {file.type === 'financial_syscohada' && 'Bilan & Comptes de Résultat (SYSCOHADA)'}
                    {file.type === 'survey_field' && 'Enquête terrain & Étude de marché'}
                    {file.type === 'supplier_quote' && 'Devis & Factures Proforma'}
                    {file.type === 'legal' && 'Statuts d\'entreprise (OHADA)'}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {(file.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] uppercase font-bold text-foreground bg-secondary px-1.5 py-0.5 border border-border">
                      {file.syncSource}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{file.uploadedAt}</td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 border border-emerald-300 bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                      ● {file.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Security Guarantee Box */}
        <div className="mt-4 p-3 bg-secondary/30 border border-border flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
          <Shield className="h-4 w-4 text-emerald-700 shrink-0" />
          <span>
            <strong>CONFIDENTIALITÉ SÉQUESTRE :</strong> Vos états comptables et données stratégiques sont isolés par tenant ID et ne sont jamais réinjectés pour l'entraînement public des modèles de fondation.
          </span>
        </div>
      </TechWindow>
    </div>
  );
};
