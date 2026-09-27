import React, { useState } from 'react';
import { TechWindow } from '@/components/typesafe-ui/TechWindow';
import { DataRoomFile } from '@/types';
import {
  Upload,
  FileText,
  Mail,
  HardDrive,
  Shield,
  Building,
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
    <div className="space-y-8 animate-fadeIn">
      {/* Workspace Org Header */}
      <div className="border border-border bg-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-sans">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 bg-secondary border border-border flex items-center justify-center text-primary">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-foreground font-heading">
                Espace documentaire : Dakar Ventures Lab
              </h2>
              <span className="text-xs bg-secondary text-muted-foreground border border-border px-2 py-0.5 font-mono">
                Multi-tenant sécurisé
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Données privées cloisonnées par identifiant unique pour les analyses stratégiques.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Identifiant d'organisation :</span>
          <span className="text-foreground font-mono font-semibold bg-secondary px-2.5 py-1 border border-border">
            ORG_SN_88204
          </span>
        </div>
      </div>

      {/* Cloud Connectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Drive Card */}
        <div className="border border-border bg-card p-5 flex items-center justify-between font-sans">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-secondary border border-border text-foreground">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                <span>Google Drive</span>
                {isDriveConnected && (
                  <span className="text-xs text-emerald-800 border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-medium">
                    Connecté
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Synchronisation continue des rapports et pièces comptables.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDriveConnected(!isDriveConnected)}
            className={`px-3.5 py-1.5 border text-xs transition-all font-medium ${
              isDriveConnected
                ? 'border-border text-foreground hover:bg-secondary bg-card'
                : 'border-primary text-primary-foreground bg-primary'
            }`}
          >
            {isDriveConnected ? 'Actif' : 'Connecter'}
          </button>
        </div>

        {/* Gmail Connector Card */}
        <div className="border border-border bg-card p-5 flex items-center justify-between font-sans">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-secondary border border-border text-foreground">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                <span>Gmail (Devis fournisseurs)</span>
                {isGmailConnected && (
                  <span className="text-xs text-emerald-800 border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-medium">
                    Connecté
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Extraction automatisée des factures proforma et devis reçus.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsGmailConnected(!isGmailConnected)}
            className={`px-3.5 py-1.5 border text-xs transition-all font-medium ${
              isGmailConnected
                ? 'border-border text-foreground hover:bg-secondary bg-card'
                : 'border-primary text-primary-foreground bg-primary'
            }`}
          >
            {isGmailConnected ? 'Actif' : 'Connecter'}
          </button>
        </div>
      </div>

      {/* Main Files Table Window */}
      <TechWindow
        title="Pièces justificatives et documents d'analyse"
        badge={`${files.length} documents enregistrés`}
        badgeColor="neutral"
        actions={
          <button
            onClick={handleSimulateUpload}
            disabled={isUploading}
            className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-sans font-medium flex items-center gap-1.5 border border-primary disabled:opacity-50 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{isUploading ? 'Traitement en cours...' : 'Ajouter un document'}</span>
          </button>
        }
      >
        {/* Upload Dropzone Preview */}
        <div
          onClick={handleSimulateUpload}
          className="border-2 border-dashed border-border p-8 text-center mb-6 cursor-pointer hover:border-primary hover:bg-secondary/20 transition-all font-sans"
        >
          <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
          <div className="text-sm font-semibold text-foreground">
            Glissez-déposez vos états financiers SYSCOHADA, devis ou études de marché
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Formats supportés : PDF, XLSX, CSV, DOCX (taille max 25 Mo). Chiffrement AES-256.
          </p>
        </div>

        {/* Files Table */}
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-secondary text-foreground font-semibold border-b border-border">
              <tr>
                <th className="p-3">Intitulé du document</th>
                <th className="p-3">Catégorie</th>
                <th className="p-3">Taille</th>
                <th className="p-3">Source</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-3 font-medium text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{file.name}</span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {file.type === 'financial_syscohada' && 'Bilan & Comptes de Résultat (SYSCOHADA)'}
                    {file.type === 'survey_field' && 'Enquête terrain & Étude de marché'}
                    {file.type === 'supplier_quote' && 'Devis & Factures Proforma'}
                    {file.type === 'legal' && 'Statuts d\'entreprise (OHADA)'}
                  </td>
                  <td className="p-3 text-muted-foreground font-mono">
                    {(file.sizeBytes / (1024 * 1024)).toFixed(2)} Mo
                  </td>
                  <td className="p-3">
                    <span className="text-[11px] font-mono text-foreground bg-secondary px-2 py-0.5 border border-border">
                      {file.syncSource}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground font-mono">{file.uploadedAt}</td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-medium">
                      {file.status === 'indexed' ? 'Indexé' : 'Analysé'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Security Guarantee Box */}
        <div className="mt-5 p-4 bg-secondary/30 border border-border flex items-center gap-3 text-xs text-muted-foreground font-sans">
          <Shield className="h-4 w-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Garantie de confidentialité :</strong> Vos données et états financiers sont strictement cloisonnés par organisation et ne sont jamais exploités pour l'entraînement public de modèles IA.
          </span>
        </div>
      </TechWindow>
    </div>
  );
};

