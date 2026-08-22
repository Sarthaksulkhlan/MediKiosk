// Aura AI - MediKiosk's Healthcare Assistant Engine
// Safe, systematic, progressive clinical inquiry in English and Hindi without autonomous diagnosis.

export interface AuraMessage {
  id: string;
  sender: 'aura' | 'patient' | 'system';
  text: string;
  timestamp?: string;
  quickReplies?: string[];
  isRedFlagWarning?: boolean;
}

export interface IntakeContext {
  chiefComplaint: string;
  duration: string;
  location?: string;
  severity?: string;
  nature?: string;
  associatedSymptoms?: string;
  aggravatingFactors?: string;
  pastHistory?: string;
  currentMedications?: string;
  allergies?: string;
  redFlagsIdentified: string[];
  stepIndex: number;
  isIntakeComplete: boolean;
}

// Symptom-specific targeted follow-up questions (English and Hindi)
const TARGETED_QUESTIONS: Record<
  string,
  {
    locationQuestionEN: string;
    locationQuestionHI: string;
    associatedPromptEN: string;
    associatedPromptHI: string;
    redFlagCheck: (text: string) => string | null;
  }
> = {
  Headache: {
    locationQuestionEN: 'Where exactly do you feel the pain (e.g. front of forehead, temples, one side, or back of head)?',
    locationQuestionHI: 'दर्द ठीक किस जगह महसूस हो रहा है (जैसे माथे के आगे, कनपटी, एक तरफ या सिर के पीछे)?',
    associatedPromptEN: 'Have you noticed any nausea, vomiting, blurred vision, dizziness, or sensitivity to light/sound?',
    associatedPromptHI: 'क्या आपको जी मिचलाना, उल्टी, धुंधला दिखना, चक्कर आना या तेज रोशनी/आवाज से परेशानी महसूस हो रही है?',
    redFlagCheck: (t) => {
      const lower = t.toLowerCase();
      if (lower.includes('thunderclap') || lower.includes('worst headache of life') || lower.includes('fainting') || lower.includes('numbness') || lower.includes('confusion') || lower.includes('अचानक बहुत तेज')) {
        return 'Sudden severe neurological or consciousness symptoms';
      }
      return null;
    },
  },
  Fever: {
    locationQuestionEN: 'Has the temperature been steady throughout the day, or does it spike mainly in the evening or night?',
    locationQuestionHI: 'क्या बुखार दिनभर एक जैसा रहता है, या विशेष रूप से शाम या रात को बढ़ता है?',
    associatedPromptEN: 'Have you experienced any cough, sore throat, burning with urination, or body aches alongside the fever?',
    associatedPromptHI: 'क्या बुखार के साथ खांसी, गले में खराश, पेशाब में जलन या बदन दर्द भी हो रहा है?',
    redFlagCheck: (t) => {
      const lower = t.toLowerCase();
      if (lower.includes('stiff neck') || lower.includes('rash with fever') || lower.includes('breathing difficulty') || lower.includes('unconscious') || lower.includes('सांस लेने में तकलीफ')) {
        return 'High fever with secondary emergency flags';
      }
      return null;
    },
  },
  'Stomach pain': {
    locationQuestionEN: 'Where in your abdomen is the pain centered (upper stomach, around the belly button, lower right, or lower left)?',
    locationQuestionHI: 'पेट में दर्द कहाँ केंद्रित है (ऊपरी पेट, नाभि के पास, नीचे दाईं तरफ या नीचे बाईं तरफ)?',
    associatedPromptEN: 'Have you experienced nausea, vomiting, diarrhea, constipation, or loss of appetite?',
    associatedPromptHI: 'क्या आपको जी मिचलाना, उल्टी, दस्त, कब्ज या भूख न लगने की समस्या हुई है?',
    redFlagCheck: (t) => {
      const lower = t.toLowerCase();
      if (lower.includes('black stool') || lower.includes('blood in vomit') || lower.includes('unbearable pain') || lower.includes('rigid') || lower.includes('खून')) {
        return 'Acute gastrointestinal red flags';
      }
      return null;
    },
  },
  'Chest pain / Discomfort': {
    locationQuestionEN: 'Does the chest discomfort radiate anywhere, such as to your left arm, shoulder, jaw, or upper back?',
    locationQuestionHI: 'क्या सीने का दर्द कहीं और फैल रहा है, जैसे बाएं हाथ, कंधे, जबड़े या पीठ की तरफ?',
    associatedPromptEN: 'Are you feeling breathless, sweating unusually, or having palpitations?',
    associatedPromptHI: 'क्या आपको सांस फूलना, असामान्य पसीना आना या दिल की धड़कन तेज महसूस हो रही है?',
    redFlagCheck: () => 'Chest discomfort reported — prioritize immediate clinical review.',
  },
  Cough: {
    locationQuestionEN: 'Is the cough mostly dry and tickly in the throat, or are you bringing up phlegm/mucus?',
    locationQuestionHI: 'क्या खांसी सूखी और गले में खराश वाली है, या कफ/बलगम भी निकल रहा है?',
    associatedPromptEN: 'Have you had any fever, shortness of breath, wheezing, or chest tightness?',
    associatedPromptHI: 'क्या आपको बुखार, सांस फूलना, सीने में घरघराहट या जकड़न महसूस हो रही है?',
    redFlagCheck: (t) => {
      const lower = t.toLowerCase();
      if (lower.includes('blood in cough') || lower.includes('hemoptysis') || lower.includes('struggling to breathe') || lower.includes('खून')) {
        return 'Respiratory distress indicator';
      }
      return null;
    },
  },
  'Back pain': {
    locationQuestionEN: 'Is the pain located in the lower lumbar back, mid-back, or neck area, and does it shoot down your legs?',
    locationQuestionHI: 'दर्द कमर के निचले हिस्से, बीच में या गर्दन में है, और क्या यह पैरों की तरफ खिंचता है?',
    associatedPromptEN: 'Have you noticed any numbness, tingling, or weakness in your feet or legs?',
    associatedPromptHI: 'क्या आपने पैरों में सुन्नता, झुनझुनी या कमजोरी महसूस की है?',
    redFlagCheck: (t) => {
      const lower = t.toLowerCase();
      if (lower.includes('bladder loss') || lower.includes('incontinence') || lower.includes('numbness in groin') || lower.includes('सुन्न')) {
        return 'Cauda equina warning flag';
      }
      return null;
    },
  },
};

export class AuraAIEngine {
  /**
   * Generates the initial greeting and context acknowledgement for Aura AI (English & Hindi)
   */
  public static generateInitialGreeting(
    patientName: string,
    transcript: string,
    extracted: { chiefComplaint: string; duration: string; associatedSymptom: string },
    lang: 'EN' | 'HI' = 'EN'
  ): AuraMessage[] {
    const messages: AuraMessage[] = [];
    const isHindi = lang === 'HI';

    if (
      !transcript ||
      !transcript.trim() ||
      extracted.chiefComplaint === 'No clinical complaint identified'
    ) {
      if (isHindi) {
        messages.push({
          id: 'msg-init-1',
          sender: 'aura',
          text: `नमस्ते ${patientName}। मैं Aura हूँ, MediKiosk का हेल्थकेयर असिस्टेंट। डॉक्टर से आपके परामर्श से पहले आपके लक्षणों को व्यवस्थित करने में आपकी मदद करने के लिए यहाँ हूँ।`,
        });
        messages.push({
          id: 'msg-init-2',
          sender: 'aura',
          text: 'कृपया बताएं कि आप आज कैसा महसूस कर रहे हैं। आप माइक्रोफ़ोन से बोल सकते हैं या नीचे लिख सकते हैं।',
          quickReplies: ['मुझे बुखार है', 'तेज सिरदर्द है', 'पेट में दर्द है', 'खांसी और जुकाम है'],
        });
      } else {
        messages.push({
          id: 'msg-init-1',
          sender: 'aura',
          text: `Hello ${patientName}. I am Aura, MediKiosk's Healthcare Assistant. I am here to help you organize your symptoms into a structured clinical summary before your consultation with the physician.`,
        });
        messages.push({
          id: 'msg-init-2',
          sender: 'aura',
          text: 'Please tell me what health concern brings you in today. You can speak using the microphone or type below.',
          quickReplies: ['I have a fever', 'Severe headache', 'Stomach discomfort', 'Cough & cold'],
        });
      }
      return messages;
    }

    // Acknowledge stated complaint in Hindi or English
    if (isHindi) {
      let ackText = `नमस्ते ${patientName}। मैंने आपकी बात दर्ज कर ली है।`;
      if (extracted.chiefComplaint !== 'No clinical complaint identified') {
        ackText = `नमस्ते ${patientName}। मैंने दर्ज किया है कि आपको **${extracted.chiefComplaint}**`;
        if (extracted.duration !== 'Not mentioned') {
          ackText += ` **${extracted.duration}** से है`;
        }
        if (extracted.associatedSymptom !== 'None identified') {
          ackText += `, साथ में **${extracted.associatedSymptom}** भी है`;
        }
        ackText += `।`;
      }

      messages.push({
        id: 'msg-init-1',
        sender: 'aura',
        text: ackText,
      });

      const symptomKey = Object.keys(TARGETED_QUESTIONS).find((k) =>
        extracted.chiefComplaint.toLowerCase().includes(k.toLowerCase())
      );

      if (symptomKey && TARGETED_QUESTIONS[symptomKey]) {
        messages.push({
          id: 'msg-init-2',
          sender: 'aura',
          text: TARGETED_QUESTIONS[symptomKey].locationQuestionHI,
          quickReplies: ['हल्का दर्द', 'मध्यम तीव्रता', 'तेज दर्द'],
        });
      } else {
        messages.push({
          id: 'msg-init-2',
          sender: 'aura',
          text: 'अभी तकलीफ कितनी गंभीर है — हल्का, मध्यम या तेज?',
          quickReplies: ['हल्का', 'मध्यम', 'तेज दर्द'],
        });
      }
    } else {
      let ackText = `Hello ${patientName}. I have noted your statement.`;
      if (extracted.chiefComplaint !== 'No clinical complaint identified') {
        ackText = `Hello ${patientName}. I have recorded that you are experiencing **${extracted.chiefComplaint}**`;
        if (extracted.duration !== 'Not mentioned') {
          ackText += ` for **${extracted.duration}**`;
        }
        if (extracted.associatedSymptom !== 'None identified') {
          ackText += `, with associated **${extracted.associatedSymptom}**`;
        }
        ackText += `.`;
      }

      messages.push({
        id: 'msg-init-1',
        sender: 'aura',
        text: ackText,
      });

      const symptomKey = Object.keys(TARGETED_QUESTIONS).find((k) =>
        extracted.chiefComplaint.toLowerCase().includes(k.toLowerCase())
      );

      if (symptomKey && TARGETED_QUESTIONS[symptomKey]) {
        messages.push({
          id: 'msg-init-2',
          sender: 'aura',
          text: TARGETED_QUESTIONS[symptomKey].locationQuestionEN,
          quickReplies: ['Mild discomfort', 'Moderate intensity', 'Severe'],
        });
      } else {
        messages.push({
          id: 'msg-init-2',
          sender: 'aura',
          text: 'How severe is the discomfort right now — mild, moderate, or severe?',
          quickReplies: ['Mild', 'Moderate', 'Severe'],
        });
      }
    }

    return messages;
  }

  /**
   * Generates the next response from Aura AI based on conversation step & user input in English or Hindi
   */
  public static processNextStep(
    userText: string,
    history: AuraMessage[],
    extracted: { chiefComplaint: string; duration: string; associatedSymptom: string },
    lang: 'EN' | 'HI' = 'EN'
  ): {
    nextMessage: AuraMessage;
    isComplete: boolean;
    summaryRecap?: string;
  } {
    const isHindi = lang === 'HI';
    const patientResponses = history.filter((m) => m.sender === 'patient').length;
    const lower = userText.toLowerCase();

    // Check for red flags
    let redFlagFound = false;
    if (
      lower.includes('chest pain') ||
      lower.includes('cannot breathe') ||
      lower.includes('unconscious') ||
      lower.includes('worst headache') ||
      lower.includes('coughing blood') ||
      lower.includes('सीने में दर्द') ||
      lower.includes('सांस नहीं') ||
      lower.includes('बेहोश') ||
      lower.includes('खून')
    ) {
      redFlagFound = true;
    }

    // Step 1: Severity / Character
    if (patientResponses <= 1) {
      if (isHindi) {
        return {
          nextMessage: {
            id: `msg-${Date.now()}`,
            sender: 'aura',
            text: 'धन्यवाद। अभी लक्षण कितने गंभीर हैं — आप इसे हल्का, मध्यम या तेज में से क्या कहेंगे?',
            quickReplies: ['हल्की तकलीफ', 'मध्यम तीव्रता', 'तेज और गंभीर'],
            isRedFlagWarning: redFlagFound,
          },
          isComplete: false,
        };
      }
      return {
        nextMessage: {
          id: `msg-${Date.now()}`,
          sender: 'aura',
          text: 'Thank you. How severe is the symptom right now — would you rate it as mild, moderate, or severe?',
          quickReplies: ['Mild discomfort', 'Moderate intensity', 'Severe & distressing'],
          isRedFlagWarning: redFlagFound,
        },
        isComplete: false,
      };
    }

    // Step 2: Associated Symptoms / Triggers
    if (patientResponses === 2) {
      const symptomKey = Object.keys(TARGETED_QUESTIONS).find((k) =>
        extracted.chiefComplaint.toLowerCase().includes(k.toLowerCase())
      );

      if (isHindi) {
        const promptTextHI =
          symptomKey && TARGETED_QUESTIONS[symptomKey]
            ? TARGETED_QUESTIONS[symptomKey].associatedPromptHI
            : 'क्या आपने कोई अन्य लक्षण देखा है, या ऐसी कोई चीज़ जिससे यह बढ़ता या घटता है?';

        return {
          nextMessage: {
            id: `msg-${Date.now()}`,
            sender: 'aura',
            text: promptTextHI,
            quickReplies: ['कुछ खास नहीं', 'हिलने-डुलने पर बढ़ता है', 'आराम करने पर घटता है'],
          },
          isComplete: false,
        };
      }

      const promptText =
        symptomKey && TARGETED_QUESTIONS[symptomKey]
          ? TARGETED_QUESTIONS[symptomKey].associatedPromptEN
          : 'Have you noticed any other accompanying symptoms, or anything that makes it noticeably better or worse?';

      return {
        nextMessage: {
          id: `msg-${Date.now()}`,
          sender: 'aura',
          text: promptText,
          quickReplies: ['None other', 'Gets worse with movement', 'Slightly better with rest'],
        },
        isComplete: false,
      };
    }

    // Step 3: Medical History & Known Allergies
    if (patientResponses === 3) {
      if (isHindi) {
        return {
          nextMessage: {
            id: `msg-${Date.now()}`,
            sender: 'aura',
            text: 'क्या आपको पहले से कोई बीमारी (जैसे उच्च रक्तचाप, मधुमेह या अस्थमा) या किसी दवा से एलर्जी है?',
            quickReplies: ['कोई बीमारी या एलर्जी नहीं', 'उच्च रक्तचाप (BP)', 'मधुमेह (Diabetes)', 'दवा एलर्जी'],
          },
          isComplete: false,
        };
      }
      return {
        nextMessage: {
          id: `msg-${Date.now()}`,
          sender: 'aura',
          text: 'Do you have any existing health conditions (such as high blood pressure, diabetes, or asthma) or any known drug allergies?',
          quickReplies: ['No chronic illnesses or allergies', 'Hypertension', 'Diabetes', 'Allergic to Penicillin'],
        },
        isComplete: false,
      };
    }

    // Step 4: Current Medications
    if (patientResponses === 4) {
      if (isHindi) {
        return {
          nextMessage: {
            id: `msg-${Date.now()}`,
            sender: 'aura',
            text: 'क्या आप अभी इसके लिए कोई नियमित दवा या बिना पर्चे वाली दवाई ले रहे हैं?',
            quickReplies: ['कोई दवा नहीं', 'पैरासिटामोल जरूरत पड़ने पर', 'नियमित दैनिक दवाएं'],
          },
          isComplete: false,
        };
      }
      return {
        nextMessage: {
          id: `msg-${Date.now()}`,
          sender: 'aura',
          text: 'Are you currently taking any regular medications or over-the-counter remedies for this?',
          quickReplies: ['None', 'Paracetamol as needed', 'Regular daily prescriptions'],
        },
        isComplete: false,
      };
    }

    // Final Step: Complete & Structured Recap in appropriate language
    const complaintText =
      extracted.chiefComplaint !== 'No clinical complaint identified'
        ? extracted.chiefComplaint
        : isHindi ? 'स्वास्थ्य परामर्श अनुरोध' : 'Health consultation request';

    const durationText =
      extracted.duration !== 'Not mentioned'
        ? extracted.duration
        : isHindi ? 'हाल ही में शुरू' : 'Recent onset';

    const associatedText =
      extracted.associatedSymptom !== 'None identified'
        ? extracted.associatedSymptom
        : isHindi ? 'कोई अतिरिक्त लक्षण नहीं' : 'No secondary symptoms identified';

    if (isHindi) {
      const recapHI = `धन्यवाद। मैंने आपका परामर्श पूर्व सारांश तैयार कर लिया है:

• **मुख्य समस्या:** ${complaintText}
• **अवधि:** ${durationText}
• **संबंधित लक्षण:** ${associatedText}
• **मरीज़ द्वारा विवरण:** क्लिनिकल टाइमलाइन में दर्ज

आपकी जानकारी डॉक्टर की समीक्षा के लिए तैयार है। कृपया परामर्श के दौरान डॉक्टर से सभी लक्षणों पर विस्तार से चर्चा करें।`;

      return {
        nextMessage: {
          id: `msg-${Date.now()}`,
          sender: 'aura',
          text: recapHI,
        },
        isComplete: true,
        summaryRecap: recapHI,
      };
    }

    const recap = `Thank you. I have structured your pre-consultation summary:

• **Chief Concern:** ${complaintText}
• **Duration:** ${durationText}
• **Associated Symptoms:** ${associatedText}
• **Patient Reported Details:** Recorded into clinical timeline

Your information has been formatted and is ready for physician review. Please discuss all symptoms in detail with your doctor.`;

    return {
      nextMessage: {
        id: `msg-${Date.now()}`,
        sender: 'aura',
        text: recap,
      },
      isComplete: true,
      summaryRecap: recap,
    };
  }
}
