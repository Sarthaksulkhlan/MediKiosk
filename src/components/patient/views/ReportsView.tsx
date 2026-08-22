import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { PatientTab, UploadedReport } from '../types';

interface ReportsViewProps {
  uploadedReports: UploadedReport[];
  onAddReport: (report: UploadedReport) => void;
  onDeleteReport: (id: string) => void;
  setActiveTab: (tab: PatientTab) => void;
  onMarkStepComplete: (step: PatientTab) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  uploadedReports,
  onAddReport,
  onDeleteReport,
  setActiveTab,
  onMarkStepComplete,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedReportForModal, setSelectedReportForModal] = useState<UploadedReport | null>(null);
  const [isScanningSim, setIsScanningSim] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isPdf = file.name.endsWith('.pdf');
      const ext = isPdf ? 'PDF' : 'JPG';

      const newReport: UploadedReport = {
        id: `rep-${Date.now()}-${i}`,
        fileName: file.name,
        fileType: ext as any,
        category: file.name.toLowerCase().includes('rx') ? 'Prescription' : 'Lab Report',
        uploadedAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        size: `${(file.size / 1024).toFixed(1)} KB`,
        status: 'Processed',
        extractedData: {
          testName: 'Automated Clinical Document Parse',
          doctor: 'Dr. R. Sharma, MD',
          date: '22 Aug 2026',
          parameters: [
            { name: 'Hemoglobin (Hb)', value: '13.4 g/dL', range: '12.0 - 15.5 g/dL', status: 'normal' },
            { name: 'Fasting Blood Glucose', value: '102 mg/dL', range: '70 - 110 mg/dL', status: 'normal' },
            { name: 'Serum Creatinine', value: '0.9 mg/dL', range: '0.6 - 1.2 mg/dL', status: 'normal' },
          ],
          summary: 'Parameters within baseline physiological tolerances. Ready for doctor consultation.',
        },
      };

      onAddReport(newReport);
    }
  };

  const handleCameraScanSimulation = () => {
    setIsScanningSim(true);
    setTimeout(() => {
      const scanReport: UploadedReport = {
        id: `rep-scan-${Date.now()}`,
        fileName: `Scanned_Prescription_${new Date().toISOString().slice(0, 10)}.png`,
        fileType: 'PNG',
        category: 'Prescription',
        uploadedAt: 'Just now',
        size: '1.4 MB',
        status: 'Processed',
        extractedData: {
          testName: 'OPD Prescription Scan',
          doctor: 'Dr. Anand Verma, MBBS',
          date: '15 Aug 2026',
          medicines: [
            { name: 'Tab Amlodipine', dosage: '5mg', frequency: 'Once daily in morning' },
            { name: 'Tab Paracetamol', dosage: '650mg', frequency: 'SOS (as needed for pain)' },
          ],
          summary: 'Extracted active antihypertensive and antipyretic prescription from scan.',
        },
      };

      onAddReport(scanReport);
      setIsScanningSim(false);
    }, 1800);
  };

  const handleContinue = () => {
    onMarkStepComplete('reports');
    setActiveTab('review');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Header Banner */}
      <div className="border-b border-[#E8D8B8]/70 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B89A5A]/15 text-[#8C6B28] text-xs font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[15px]">description</span>
          <span>Step 7 • Medical Records &amp; Scans</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24302F]">
          Upload Medical Reports
        </h1>
        <p className="text-sm text-[#5D6662] mt-1 max-w-3xl leading-relaxed">
          Upload prescriptions, lab reports, ECGs, scans, or previous discharge summaries. Our AI extracts vital parameters for physician review.
        </p>
      </div>

      {/* Upload & Scanner Zone */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Drag & Drop File Zone (2 Cols) */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileUpload(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`md:col-span-2 p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
            isDragging
              ? 'border-[#B89A5A] bg-[#F0E6D2]/60 scale-[1.01]'
              : 'border-[#E8D8B8] bg-white hover:bg-[#FAF7F0] hover:border-[#B89A5A]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8] text-[#B89A5A] flex items-center justify-center shadow-xs mb-3">
            <span className="material-symbols-outlined text-[32px]">upload_file</span>
          </div>

          <h3 className="text-base font-bold text-[#24302F]">
            Drag &amp; drop medical files here, or <span className="text-[#8C6B28] underline">browse</span>
          </h3>
          <p className="text-xs text-[#7B8580] mt-1">
            Supports PDF, JPG, PNG, DICOM (Max 25MB per file)
          </p>

          <div className="flex items-center gap-2 mt-4 text-[11px] font-semibold text-[#5D6662] bg-[#FAF7F0] px-3 py-1.5 rounded-full border border-[#E8D8B8]">
            <span className="material-symbols-outlined text-[15px] text-teal-700">lock</span>
            <span>256-Bit Encrypted &amp; HIPAA/ABDM Compliant Storage</span>
          </div>
        </div>

        {/* Camera / Scanner Simulation Card (1 Col) */}
        <div className="p-6 rounded-3xl bg-[#24302F] text-[#FAF7F0] border border-[#E8D8B8]/30 shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#D8BE88]">
              <span className="material-symbols-outlined text-[28px]">document_scanner</span>
            </div>
            <h3 className="text-lg font-bold text-white">Document Scanner</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Use your device camera to scan physical paper prescriptions, bills, or diagnostic receipts with real-time edge detection.
            </p>
          </div>

          <button
            onClick={handleCameraScanSimulation}
            disabled={isScanningSim}
            className="w-full mt-4 inline-flex items-center justify-center gap-2 bg-[#B89A5A] hover:bg-[#A88A4A] text-[#1B2423] py-3 rounded-2xl font-bold text-xs shadow-md cursor-pointer transition-all"
          >
            {isScanningSim ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#1B2423] border-t-transparent rounded-full animate-spin" />
                <span>Scanning document...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                <span>Scan Document with Camera</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8D8B8]/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8]/60">
          <h3 className="font-bold text-base text-[#24302F] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#B89A5A]">folder_shared</span>
            <span>Uploaded Documents ({uploadedReports.length})</span>
          </h3>
          <span className="text-xs text-emerald-800 bg-emerald-100 font-bold px-2.5 py-0.5 rounded-full">
            Auto-Extraction Enabled
          </span>
        </div>

        {uploadedReports.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#7B8580]">
            No reports uploaded yet. Upload a prescription or lab report above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadedReports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8] flex items-start justify-between gap-3 hover:border-[#B89A5A] transition-all"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E8D8B8] text-[#8C6B28] flex items-center justify-center shrink-0 font-extrabold text-xs">
                    {report.fileType}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#24302F] truncate">{report.fileName}</h4>
                    <p className="text-[11px] text-[#6B7570] mt-0.5">
                      {report.category} • {report.size} • {report.uploadedAt}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded">
                      ✓ {report.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setSelectedReportForModal(report)}
                    title="View Extraction"
                    className="p-1.5 rounded-lg bg-white hover:bg-[#F3EBDD] text-[#24302F] border border-[#E8D8B8] text-xs font-bold"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onDeleteReport(report.id)}
                    title="Delete report"
                    className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-700 border border-rose-200"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Extraction Preview Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8D8B8]/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8]/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#B89A5A]">auto_awesome</span>
            <h3 className="font-bold text-base text-[#24302F]">AI Clinical Extraction Preview</h3>
          </div>
          <span className="text-[11px] text-purple-800 bg-purple-100 font-bold px-2 py-0.5 rounded-full">
            Aura OCR Engine
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8]/70">
            <div className="text-[10px] font-bold uppercase text-[#6B7570]">Hemoglobin (Hb)</div>
            <div className="text-base font-extrabold text-[#24302F] mt-1">13.4 g/dL</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
              Normal Range (12.0 - 15.5)
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8]/70">
            <div className="text-[10px] font-bold uppercase text-[#6B7570]">Fasting Blood Glucose</div>
            <div className="text-base font-extrabold text-[#24302F] mt-1">102 mg/dL</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
              Normal Range (70 - 110)
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8]/70">
            <div className="text-[10px] font-bold uppercase text-[#6B7570]">Blood Pressure</div>
            <div className="text-base font-extrabold text-[#24302F] mt-1">128/82 mmHg</div>
            <div className="text-[10px] text-teal-700 font-semibold mt-0.5">
              Target Baseline Controlled
            </div>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-700 text-[18px]">info</span>
          <span>
            <strong>AI-extracted information:</strong> Please verify document details with your attending doctor before treatment decisions.
          </span>
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8D8B8]/80 shadow-xs flex items-center justify-between">
        <button
          onClick={() => setActiveTab('red-flags')}
          className="text-xs font-bold text-[#5D6662] hover:text-[#24302F] px-4 py-2"
        >
          ← Back to Risk Assessment
        </button>

        <button
          onClick={handleContinue}
          className="inline-flex items-center gap-2 bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-md hover:-translate-y-0.5"
        >
          <span>Continue to Review</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

      {/* Modal for Report Extraction Details */}
      {selectedReportForModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#E8D8B8] shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8]/60">
              <div>
                <h3 className="font-bold text-base text-[#24302F]">
                  {selectedReportForModal.fileName}
                </h3>
                <p className="text-xs text-[#6B7570]">
                  {selectedReportForModal.category} • {selectedReportForModal.uploadedAt}
                </p>
              </div>
              <button
                onClick={() => setSelectedReportForModal(null)}
                className="text-[#6B7570] hover:text-[#24302F]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {selectedReportForModal.extractedData && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8]/70 space-y-1">
                  <div className="font-bold text-[#24302F]">Summary:</div>
                  <p className="text-[#5D6662]">{selectedReportForModal.extractedData.summary}</p>
                </div>

                {selectedReportForModal.extractedData.parameters && (
                  <div className="space-y-2">
                    <div className="font-bold text-[#24302F]">Extracted Lab Parameters:</div>
                    {selectedReportForModal.extractedData.parameters.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white border border-[#E8D8B8] flex items-center justify-between"
                      >
                        <span className="font-medium text-[#24302F]">{p.name}</span>
                        <span className="font-mono font-bold text-emerald-800">{p.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedReportForModal(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#24302F] text-[#FAF7F0]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
