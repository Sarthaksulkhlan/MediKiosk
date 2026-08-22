import React, { useState } from 'react';
import { PatientRecord, MedicalDocument } from '../../types';

interface ReportsSectionProps {
  patient: PatientRecord;
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({ patient }) => {
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(
    patient.documents && patient.documents.length > 0 ? patient.documents[0] : null
  );
  const [filterType, setFilterType] = useState<string>('ALL');

  const docs = patient.documents || [];
  const filteredDocs = docs.filter(
    (d) => filterType === 'ALL' || d.type === filterType
  );

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'prescription':
        return 'medication';
      case 'lab':
        return 'science';
      case 'imaging':
        return 'radiology';
      default:
        return 'description';
    }
  };

  return (
    <div id="reports-section" className="space-y-6">
      {/* Top Header */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-[#E8D8B8] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8D8B8]/70">
          <div>
            <h3 className="font-display font-bold text-lg text-[#24302F] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B89A5A] text-xl">folder_shared</span>
              Diagnostic Reports &amp; OCR Prescriptions
            </h3>
            <p className="text-xs text-[#73787A]">
              Historical records, laboratory panels, imaging scans &amp; digitized OCR documents for {patient.name}.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-[#FAF7F0] p-1 rounded-xl border border-[#E8D8B8] text-xs">
            {[
              { id: 'ALL', label: 'All Files' },
              { id: 'prescription', label: 'Prescriptions' },
              { id: 'lab', label: 'Lab Reports' },
              { id: 'imaging', label: 'Imaging' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  filterType === f.id
                    ? 'bg-[#24302F] text-[#FAF7F0]'
                    : 'text-[#4D5652] hover:bg-[#F3EBDD]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Split View: List on left, Document Reader on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Document list */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#B89A5A] block mb-2">
              Available Records ({filteredDocs.length})
            </span>

            {filteredDocs.length === 0 ? (
              <div className="p-8 text-center bg-[#FAF7F0] rounded-2xl border border-[#E8D8B8] text-[#73787A] text-xs">
                No documents found for selected filter.
              </div>
            ) : (
              filteredDocs.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    id={`doc-card-${doc.id}`}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAF7F0] border-[#B89A5A] ring-2 ring-[#B89A5A]/30 shadow-xs'
                        : 'bg-white border-[#E8D8B8] hover:bg-[#FAF7F0]/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-[#24302F] text-[#D8BE88]' : 'bg-[#FAF7F0] text-[#B89A5A] border border-[#E8D8B8]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {getDocIcon(doc.type)}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="font-bold text-xs text-[#24302F] truncate">
                            {doc.title}
                          </h4>
                          <span className="text-[10px] text-[#73787A] whitespace-nowrap">{doc.date}</span>
                        </div>
                        <p className="text-[11px] text-[#4D5652] line-clamp-2">
                          {doc.summary}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {doc.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Document Previewer */}
          <div className="lg:col-span-7">
            {selectedDoc ? (
              <div className="bg-[#FAF7F0]/80 rounded-3xl p-5 border border-[#E8D8B8] shadow-xs flex flex-col justify-between min-h-[380px]">
                <div>
                  <div className="flex items-start justify-between gap-3 pb-4 mb-4 border-b border-[#E8D8B8]/70">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#24302F] text-[#D8BE88] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">
                          {getDocIcon(selectedDoc.type)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm sm:text-base text-[#24302F]">
                          {selectedDoc.title}
                        </h4>
                        <p className="text-[11px] text-[#73787A]">
                          Recorded on {selectedDoc.date} &bull; Classification: {selectedDoc.type.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {selectedDoc.status}
                    </span>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-white p-4 rounded-2xl border border-[#E8D8B8] mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B89A5A] block mb-1">
                      Clinical Summary / OCR Transcription
                    </span>
                    <p className="text-xs text-[#24302F] leading-relaxed">
                      {selectedDoc.summary}
                    </p>
                  </div>

                  {/* Detailed breakdown if present */}
                  {selectedDoc.details && (
                    <div className="space-y-2.5">
                      {selectedDoc.details.testName && (
                        <div className="bg-white p-3 rounded-xl border border-[#E8D8B8] flex items-center justify-between text-xs">
                          <span className="text-[#73787A]">Test / Investigation:</span>
                          <span className="font-bold text-[#24302F]">{selectedDoc.details.testName}</span>
                        </div>
                      )}
                      {selectedDoc.details.referenceRange && (
                        <div className="bg-white p-3 rounded-xl border border-[#E8D8B8] text-xs">
                          <span className="text-[#73787A] block mb-1">Reference Ranges &amp; Values:</span>
                          <span className="font-mono text-[#24302F] text-[11px]">{selectedDoc.details.referenceRange}</span>
                        </div>
                      )}
                      {selectedDoc.details.notes && (
                        <div className="bg-white p-3 rounded-xl border border-[#E8D8B8] text-xs">
                          <span className="text-[#73787A] block mb-1">Extracted Prescription / Physician Notes:</span>
                          <pre className="text-[11px] text-[#4D5652] whitespace-pre-wrap font-sans leading-relaxed">
                            {selectedDoc.details.notes}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-[#E8D8B8]/60 flex items-center justify-between text-xs text-[#73787A]">
                  <span>Authenticated via MediKiosk OCR Vault</span>
                  <span className="font-mono text-[#B89A5A] font-bold">{selectedDoc.id}</span>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-[#FAF7F0] rounded-3xl border border-[#E8D8B8] text-[#73787A] text-xs">
                Select a document from the list on the left to view full findings.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
