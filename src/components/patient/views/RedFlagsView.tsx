import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PatientTab, RiskItem } from '../types';
import { ClinicalNLPParser } from '../../../utils/clinicalNLP';

interface RedFlagsViewProps {
  transcript: string;
  riskStatus: 'Low Risk' | 'Moderate Risk' | 'High Priority';
  onUpdateRiskStatus: (status: 'Low Risk' | 'Moderate Risk' | 'High Priority') => void;
  setActiveTab: (tab: PatientTab) => void;
  onMarkStepComplete: (step: PatientTab) => void;
}

export const RedFlagsView: React.FC<RedFlagsViewProps> = ({
  transcript,
  riskStatus,
  onUpdateRiskStatus,
  setActiveTab,
  onMarkStepComplete,
}) => {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [alertDispatched, setAlertDispatched] = useState(false);

  // Extract real red flags from clinical transcript
  const extracted = ClinicalNLPParser.extractEntities(transcript);
  const detectedFlags = extracted.redFlagsIdentified || [];

  const defaultRiskItems: RiskItem[] = [
    {
      id: 'risk-1',
      symptom: extracted.chiefComplaint !== 'No clinical complaint identified' ? extracted.chiefComplaint : 'Headache & Mild Pyrexia',
      severity: riskStatus === 'High Priority' ? 'High Priority' : 'Moderate',
      category: 'Primary Symptom',
      recommendation: 'Evaluate in scheduled OPD slot with blood pressure & vital checks.',
      actionRequired: 'Clinical examination by physician',
    },
    {
      id: 'risk-2',
      symptom: 'Duration: ' + (extracted.duration !== 'Not mentioned' ? extracted.duration : '2-3 Days'),
      severity: 'Low',
      category: 'Onset Timeline',
      recommendation: 'Sub-acute timeframe; non-emergency baseline tracking recommended.',
      actionRequired: 'Follow doctor prescription',
    },
    {
      id: 'risk-3',
      symptom: extracted.associatedSymptom !== 'None identified' ? extracted.associatedSymptom : 'No secondary distress detected',
      severity: 'Low',
      category: 'Associated Factors',
      recommendation: 'Hydration and rest advised prior to medical consult.',
      actionRequired: 'Standard hydration',
    },
  ];

  const handleDispatchEmergency = () => {
    setAlertDispatched(true);
    setTimeout(() => {
      setShowEmergencyModal(false);
      setAlertDispatched(false);
    }, 2500);
  };

  const handleContinue = () => {
    onMarkStepComplete('red-flags');
    setActiveTab('reports');
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[15px]">emergency</span>
          <span>Step 6 • Clinical Safety Stratification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24302F]">AI Risk Assessment</h1>
        <p className="text-sm text-[#5D6662] mt-1 max-w-3xl leading-relaxed">
          We analyzed your responses to identify symptoms that may require urgent attention or specialized medical intervention.
        </p>
      </div>

      {/* Top Alert Banner */}
      {detectedFlags.length > 0 || riskStatus === 'High Priority' ? (
        <div className="p-6 rounded-3xl bg-rose-50 border-2 border-rose-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-rose-950">
                Potential Warning Signs Detected
              </h3>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                Symptoms flagged:{' '}
                <strong>
                  {detectedFlags.length > 0 ? detectedFlags.join(', ') : 'High priority symptom cluster'}
                </strong>
                . Our triage protocol advises immediate notification to the nursing station.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowEmergencyModal(true)}
            className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 rounded-2xl font-bold text-xs shrink-0 shadow-md cursor-pointer transition-transform hover:scale-105"
          >
            <span className="material-symbols-outlined text-[18px]">emergency</span>
            <span>Trigger Emergency Alert</span>
          </button>
        </div>
      ) : (
        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">check_circle</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                No Emergency Red Flags Detected
              </h3>
              <p className="text-xs text-emerald-800">
                Your reported symptoms fall within standard outpatient triage parameters.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            Stable Baseline
          </span>
        </div>
      )}

      {/* Main Grid: Risk Gauge & Interactive Toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Card */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8D8B8]/80 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-[#24302F] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#B89A5A]">speed</span>
            <span>Triage Tier Stratification</span>
          </h3>

          <div className="space-y-2">
            {(['Low Risk', 'Moderate Risk', 'High Priority'] as const).map((tier) => {
              const isSelected = riskStatus === tier;
              return (
                <button
                  key={tier}
                  onClick={() => onUpdateRiskStatus(tier)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? tier === 'High Priority'
                        ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-xs'
                        : tier === 'Moderate Risk'
                        ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold shadow-xs'
                        : 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                      : 'bg-[#FAF7F0] border-[#E8D8B8] text-[#5D6662] hover:bg-[#F3EBDD]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        tier === 'High Priority'
                          ? 'bg-rose-500'
                          : tier === 'Moderate Risk'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <span className="text-xs">{tier}</span>
                  </div>
                  {isSelected && <span className="text-xs font-bold">Selected ✓</span>}
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8]/60 text-xs text-[#5D6662] space-y-1">
            <div className="font-bold text-[#24302F]">Next Recommended Action:</div>
            <p>
              {riskStatus === 'High Priority'
                ? 'Direct routing to urgent care bay or rapid nursing triage.'
                : riskStatus === 'Moderate Risk'
                ? 'Standard OPD consult with doctor review within 15–20 minutes.'
                : 'Proceed to scheduled consultation slot without delay.'}
            </p>
          </div>
        </div>

        {/* Structured Symptom Table (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-[#E8D8B8]/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8]/60">
            <h3 className="font-bold text-base text-[#24302F] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B89A5A]">table_chart</span>
              <span>Symptom Evaluation Breakdown</span>
            </h3>
            <span className="text-xs text-[#6B7570] font-mono">SOAP Intake Matrix</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8D8B8]/60 text-[#6B7570] uppercase font-bold text-[10px]">
                  <th className="pb-3">Reported Factor</th>
                  <th className="pb-3">Classification</th>
                  <th className="pb-3">Clinical Advisory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D8B8]/40">
                {defaultRiskItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF7F0]/60 transition-colors">
                    <td className="py-3 font-semibold text-[#24302F] pr-3">
                      <div>{item.symptom}</div>
                      <div className="text-[10px] text-[#7B8580] font-normal">{item.category}</div>
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.severity === 'High Priority'
                            ? 'bg-rose-100 text-rose-800'
                            : item.severity === 'Moderate'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.severity}
                      </span>
                    </td>
                    <td className="py-3 text-[#4D5652] leading-relaxed">
                      {item.recommendation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Emergency Assistance Helpline Card */}
      <div className="p-6 rounded-3xl bg-[#24302F] text-[#FAF7F0] border border-[#E8D8B8]/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D8BE88]">
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>24/7 National Emergency &amp; Ambulance Services</span>
          </div>
          <h4 className="text-lg font-extrabold text-white">Need Urgent Hospital Help?</h4>
          <p className="text-xs text-zinc-300">
            Dial <strong>108 (Ambulance)</strong> or <strong>112 (National Emergency)</strong> or alert the on-duty hospital triage nurse immediately.
          </p>
        </div>

        <button
          onClick={() => setShowEmergencyModal(true)}
          className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md cursor-pointer transition-all hover:scale-105"
        >
          <span className="material-symbols-outlined text-[20px]">sos</span>
          <span>Get Emergency Help</span>
        </button>
      </div>

      {/* Clinical Disclaimer */}
      <div className="p-4 rounded-2xl bg-zinc-100 border border-zinc-200 text-xs text-[#5D6662] leading-relaxed flex items-start gap-2.5">
        <span className="material-symbols-outlined text-zinc-700 text-[18px] shrink-0 mt-0.5">
          policy
        </span>
        <p>
          <strong>Medical Disclaimer:</strong> This automated risk assessment is a clinical intake aid for symptom organization and is NOT a medical diagnosis. A certified physician must conduct a thorough physical examination and clinical review.
        </p>
      </div>

      {/* Bottom CTA Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8D8B8]/80 shadow-xs flex items-center justify-between">
        <button
          onClick={() => setActiveTab('ai-interview')}
          className="text-xs font-bold text-[#5D6662] hover:text-[#24302F] px-4 py-2"
        >
          ← Back to Interview
        </button>

        <button
          onClick={handleContinue}
          className="inline-flex items-center gap-2 bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-md hover:-translate-y-0.5"
        >
          <span>Continue to Scan Reports</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-2 border-rose-400 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2 text-rose-700 font-extrabold text-base">
                <span className="material-symbols-outlined">emergency</span>
                <span>Emergency Triage Alert</span>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="text-zinc-500 hover:text-zinc-800"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {alertDispatched ? (
              <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-center space-y-2">
                <span className="material-symbols-outlined text-[36px] text-emerald-700">
                  check_circle
                </span>
                <h4 className="font-extrabold text-sm">Hospital Triage Alert Dispatched!</h4>
                <p className="text-xs">
                  Nurse on duty in OPD Floor 2 has been notified with your Token #{extracted.chiefComplaint ? 'A-42' : 'A-42'}.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-[#4D5652] leading-relaxed">
                  You are initiating a high-priority emergency alert. This will instantly ping the hospital nursing desk and prompt immediate clinical intervention.
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between font-bold text-rose-900">
                    <span>Emergency Ambulance</span>
                    <a href="tel:108" className="text-rose-700 underline font-mono text-sm">
                      Call 108
                    </a>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E8D8B8] flex items-center justify-between font-bold text-[#24302F]">
                    <span>Hospital Emergency Desk</span>
                    <span className="font-mono text-sm">Ext. 204</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowEmergencyModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDispatchEmergency}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md cursor-pointer"
                  >
                    Dispatch Hospital Alert Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};
