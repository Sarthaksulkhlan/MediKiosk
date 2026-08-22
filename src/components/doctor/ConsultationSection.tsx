import React, { useState, useEffect, useRef } from 'react';
import { PatientRecord, DoctorSection } from '../../types';

interface ConsultationSectionProps {
  patient: PatientRecord;
  onNavigateSection: (section: DoctorSection) => void;
  isSigned: boolean;
  onSign: () => void;
}

export const ConsultationSection: React.FC<ConsultationSectionProps> = ({
  patient,
  onNavigateSection,
  isSigned,
  onSign,
}) => {
  const [consultNotes, setConsultNotes] = useState<string>(
    `Consultation initiated with ${patient.name} (${patient.patientId}). Patient evaluated for ${patient.chiefComplaint}.`
  );
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'in-room'>('in-room');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = patient.languageCode === 'HI' ? 'hi-IN' : 'en-US';

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setConsultNotes((prev) => `${prev} ${transcript}`);
        }
      };

      rec.onerror = () => {
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, [patient.languageCode]);

  const toggleRecording = () => {
    if (!speechSupported) {
      // Simulate voice input fallback
      setConsultNotes(
        (prev) =>
          `${prev}\n[Voice Dictation @ ${new Date().toLocaleTimeString()}]: Patient reports symptoms improved after rest. Vital signs re-verified as normal.`
      );
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const insertQuickPhrase = (phrase: string) => {
    setConsultNotes((prev) => `${prev}\n• ${phrase}`);
  };

  const handleCallPatient = () => {
    setCallStatus('calling');
    setTimeout(() => {
      setCallStatus('in-room');
    }, 2000);
  };

  return (
    <div id="consultation-section" className="space-y-6">
      {/* 1. Active Consultation Header */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-[#E8D8B8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-2xl">medical_services</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-lg text-[#24302F]">
                Active Consultation Room &bull; OPD Desk 3A
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {callStatus === 'in-room' ? 'Patient Present' : 'Paging Waiting Room'}
              </span>
            </div>
            <p className="text-xs text-[#73787A] mt-0.5">
              Consulting {patient.name} ({patient.age}y &bull; {patient.patientId}) &bull; Primary language: {patient.language}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {callStatus === 'calling' ? (
            <span className="px-3.5 py-2 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1.5 animate-pulse">
              <span className="material-symbols-outlined text-[16px]">campaign</span>
              Paging on Waiting Screen...
            </span>
          ) : (
            <button
              onClick={handleCallPatient}
              className="px-3.5 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#F3EBDD] border border-[#E8D8B8] text-xs font-bold text-[#24302F] flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">volume_up</span>
              <span>Re-page Desk</span>
            </button>
          )}

          <button
            onClick={() => onNavigateSection('doctor-edit')}
            className="px-3.5 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#F3EBDD] border border-[#E8D8B8] text-xs font-bold text-[#24302F] flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">edit_note</span>
            <span>Write Prescription</span>
          </button>
        </div>
      </div>

      {/* 2. Doctor Live Voice Dictation & Notes Desk */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-[#E8D8B8] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8D8B8]/70">
          <div>
            <h4 className="font-display font-bold text-base text-[#24302F] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B89A5A] text-lg">mic</span>
              Real-Time Consultation Dictation &amp; Clinical Scribe
            </h4>
            <p className="text-xs text-[#73787A]">
              Speak in English or Hindi; speech recognition will transcribe directly into the patient consultation log.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-voice-dictate-consult"
              onClick={toggleRecording}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isRecording ? 'stop_circle' : 'mic'}
              </span>
              <span>{isRecording ? 'Listening (Click to Stop)...' : 'Start Voice Dictation'}</span>
            </button>
          </div>
        </div>

        {/* Quick Clinical Templates */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B89A5A] block">
            Quick Clinical Inserts:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              'Chest clear bilaterally, normal vesicular breath sounds.',
              'Heart sounds S1/S2 present, no murmurs or gallops.',
              'Abdomen soft, non-tender, no organomegaly.',
              'No focal neurological deficit, cranial nerves intact.',
              'Oral hydration advice and SOS fever regimen explained.',
              'Patient oriented to time, place and person.',
            ].map((phrase, i) => (
              <button
                key={i}
                type="button"
                onClick={() => insertQuickPhrase(phrase)}
                className="px-2.5 py-1 bg-[#FAF7F0] hover:bg-[#F3EBDD] text-[#4D5652] hover:text-[#24302F] text-[11px] rounded-lg border border-[#E8D8B8] transition-colors cursor-pointer"
              >
                + {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Textarea */}
        <div>
          <textarea
            rows={8}
            value={consultNotes}
            onChange={(e) => setConsultNotes(e.target.value)}
            className="w-full bg-[#FAF7F0] border border-[#E8D8B8] rounded-2xl p-4 text-xs sm:text-sm text-[#24302F] leading-relaxed outline-none focus:border-[#B89A5A] font-mono resize-y"
            placeholder="Type or dictate consultation findings, discussion with patient, and clinical decisions..."
          />
        </div>

        {/* Bottom sign off */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E8D8B8]/60">
          <span className="text-xs text-[#73787A]">
            Consulting Physician: <strong>Dr. Sharma, MD (Reg: MCI-984210)</strong>
          </span>

          <button
            id="btn-sign-from-consult"
            onClick={onSign}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isSigned
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isSigned ? 'verified' : 'draw'}
            </span>
            <span>{isSigned ? 'Consultation Signed & Finalized' : 'Sign & Complete Consultation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
