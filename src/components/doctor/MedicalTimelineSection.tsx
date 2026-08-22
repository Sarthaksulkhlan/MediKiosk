import React, { useState } from 'react';
import { PatientRecord, TimelineEvent } from '../../types';

interface MedicalTimelineSectionProps {
  patient: PatientRecord;
}

export const MedicalTimelineSection: React.FC<MedicalTimelineSectionProps> = ({
  patient,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(
    patient.timeline || [
      {
        id: 'ev-1',
        date: 'Today',
        time: '10:42 AM',
        category: 'intake',
        title: 'MediKiosk Digital Intake',
        description: `Chief complaint: ${patient.chiefComplaint}. Narrative recorded in ${patient.language}.`,
        doctorOrSource: 'Aura AI Intake Pod',
        status: 'Completed',
        tags: ['Intake', patient.language],
      },
      {
        id: 'ev-2',
        date: 'Today',
        time: '10:45 AM',
        category: 'vitals',
        title: 'Biometric Telemetry Captured',
        description: `Temp: ${patient.vitals.temperature} • BP: ${patient.vitals.bloodPressure} • HR: ${patient.vitals.heartRate} • SpO2: ${patient.vitals.oxygenSaturation}`,
        doctorOrSource: 'Kiosk Station 1',
        status: 'Synchronized',
        tags: ['Vitals', 'Telemetry'],
      },
    ]
  );

  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEvent: TimelineEvent = {
      id: `ev-${Date.now()}`,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'consult',
      title: newEventTitle,
      description: newEventDesc || 'Physician entered clinical milestone note.',
      doctorOrSource: 'Dr. Sharma, MD',
      status: 'Recorded',
      tags: ['Physician Note', 'Live EMR'],
    };

    setTimelineEvents([newEvent, ...timelineEvents]);
    setNewEventTitle('');
    setNewEventDesc('');
    setIsAdding(false);
  };

  const filteredEvents = timelineEvents.filter(
    (ev) => filterCategory === 'ALL' || ev.category === filterCategory
  );

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'intake':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'vitals':
        return 'bg-teal-100 text-teal-900 border-teal-200';
      case 'consult':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'lab':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'rx':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'ayush':
        return 'bg-[#F3EBDD] text-[#735A22] border-[#E8D8B8]';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div id="medical-timeline-section" className="space-y-6">
      {/* 1. Timeline Header & Filters */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-[#E8D8B8] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8D8B8]/70">
          <div>
            <h3 className="font-display font-bold text-lg text-[#24302F] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B89A5A] text-xl">timeline</span>
              Longitudinal Clinical Timeline
            </h3>
            <p className="text-xs text-[#73787A]">
              Comprehensive chronological care journey for {patient.name} ({patient.patientId}).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter Chips */}
            <div className="flex items-center bg-[#FAF7F0] p-1 rounded-xl border border-[#E8D8B8] text-xs">
              {[
                { id: 'ALL', label: 'All Events' },
                { id: 'intake', label: 'Intake' },
                { id: 'vitals', label: 'Vitals' },
                { id: 'consult', label: 'Consult' },
                { id: 'lab', label: 'Labs' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilterCategory(c.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    filterCategory === c.id
                      ? 'bg-[#24302F] text-[#FAF7F0]'
                      : 'text-[#4D5652] hover:bg-[#F3EBDD]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-3 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#F3EBDD] border border-[#E8D8B8] text-xs font-bold text-[#24302F] flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">add_circle</span>
              <span>Add Event</span>
            </button>
          </div>
        </div>

        {/* Add Event Form */}
        {isAdding && (
          <form onSubmit={handleAddEvent} className="mt-4 p-4 bg-[#FAF7F0] rounded-2xl border border-[#E8D8B8] space-y-3">
            <h4 className="font-bold text-xs text-[#24302F]">Record Clinical Milestone</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Event Title (e.g., OPD Consult Note, Injection Administered)"
                required
                className="bg-white border border-[#E8D8B8] rounded-xl px-3 py-2 text-xs text-[#24302F] outline-none"
              />
              <input
                type="text"
                value={newEventDesc}
                onChange={(e) => setNewEventDesc(e.target.value)}
                placeholder="Clinical details, observations or dosage notes"
                className="bg-white border border-[#E8D8B8] rounded-xl px-3 py-2 text-xs text-[#24302F] outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-[#73787A] hover:bg-[#E8D8B8]/30"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-[#24302F] text-white text-xs font-bold"
              >
                Save to Timeline
              </button>
            </div>
          </form>
        )}

        {/* 2. Interactive Timeline Events List */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E8D8B8] space-y-6 mt-6 ml-2 sm:ml-4">
          {filteredEvents.map((ev, index) => (
            <div key={ev.id || index} className="relative group">
              {/* Timeline Pin */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#B89A5A] text-[#24302F] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[13px] text-[#B89A5A]">
                  {ev.category === 'vitals' ? 'monitoring' : ev.category === 'lab' ? 'science' : ev.category === 'intake' ? 'how_to_reg' : 'medical_information'}
                </span>
              </div>

              <div className="bg-[#FAF7F0]/80 p-4 sm:p-5 rounded-2xl border border-[#E8D8B8]/80 hover:border-[#B89A5A] transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#24302F]">{ev.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(ev.category)}`}>
                      {ev.category.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#73787A]">
                    <span className="font-semibold text-[#24302F]">{ev.date}</span>
                    {ev.time && <span>&bull; {ev.time}</span>}
                  </div>
                </div>

                <p className="text-xs text-[#4D5652] leading-relaxed mb-3">
                  {ev.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E8D8B8]/50 text-[11px]">
                  <span className="text-[#73787A]">
                    Source: <strong className="text-[#24302F]">{ev.doctorOrSource || 'MediKiosk System'}</strong>
                  </span>

                  {ev.tags && ev.tags.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      {ev.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 bg-white text-[10px] rounded-md border border-[#E8D8B8] text-[#73787A]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
