// Clinical NLP & Safety Extraction Engine for MediKiosk
// Strictly deterministic from the transcript - Zero autonomous diagnosis, Zero hallucinations.

export interface ExtractedClinicalEntities {
  chiefComplaint: string;
  duration: string;
  associatedSymptom: string;
}

// Common symptom phrase matchers (Multilingual: English, Hindi, Gujarati, Tamil)
const SYMPTOM_PATTERNS: { label: string; keywords: string[] }[] = [
  // Constitutional / Fever
  {
    label: 'Fever',
    keywords: [
      'fever', 'high fever', 'temperature', 'pyrexia', 'febrile', 'feeling hot',
      'बुखार', 'तेज बुखार', 'तापमान',
      'તાવ', 'ઝીણો તાવ',
      'காய்ச்சல்', 'சூடான உடம்பு',
    ],
  },
  {
    label: 'Chills & Shivering',
    keywords: [
      'chill', 'chills', 'shivering', 'shivers', 'rigors', 'cold shiver',
      'ठंड', 'कंपकंपी', 'जाड़ा',
      'ધ્રુજારી', 'ઠંડી',
      'குளிர்', 'நடுக்கம்',
    ],
  },
  // Head & Neurological
  {
    label: 'Headache',
    keywords: [
      'headache', 'head ache', 'migraine', 'throbbing head', 'head pain', 'temple pain',
      'सिरदर्द', 'सिर दर्द', 'आधा सीसी', 'माइग्रेन',
      'માથાનો દુખાવો', 'માથું દુખવું',
      'தலைவலி', 'ஒற்றைத் தலைவலி',
    ],
  },
  {
    label: 'Dizziness & Lightheadedness',
    keywords: [
      'dizziness', 'dizzy', 'lightheaded', 'vertigo', 'faint', 'spinning head',
      'चक्कर', 'चक्कर आना', 'सिर घूमना',
      'ચક્કર', 'માથું ઘૂમવું',
      'மயக்கம்', 'தலைச்சுற்றல்',
    ],
  },
  // Abdominal & GI
  {
    label: 'Stomach pain',
    keywords: [
      'stomach pain', 'stomach ache', 'abdominal pain', 'belly pain', 'gut pain', 'cramps',
      'gastric pain', 'tummy ache',
      'पेट दर्द', 'पेट में दर्द', 'पेट खराब', 'मरोड़',
      'પેટનો દુખાવો', 'પેટમાં દુખાવો',
      'வயிற்று வலி', 'வயிற்று உபாதை',
    ],
  },
  {
    label: 'Nausea',
    keywords: [
      'nausea', 'nauseous', 'queasy', 'feeling sick', 'upset stomach',
      'उबकाई', 'जी मिचलाना', 'जी घबराना',
      'ઉબકા', 'જીવ ગભરાવવો',
      'குமட்டல்', 'வயிற்றுப் பிரட்டல்',
    ],
  },
  {
    label: 'Vomiting',
    keywords: [
      'vomit', 'vomiting', 'threw up', 'throwing up', 'emesis',
      'उल्टी', 'उल्टियां',
      'ઊલટી',
      'வாந்தி',
    ],
  },
  {
    label: 'Loose motions / Diarrhea',
    keywords: [
      'diarrhea', 'loose motion', 'loose motions', 'watery stools', 'upset belly',
      'दस्त', 'पेट चलना', 'पतले दस्त',
      'ઝાડા',
      'வயிற்றுப்போக்கு',
    ],
  },
  // Respiratory & ENT
  {
    label: 'Cough',
    keywords: [
      'cough', 'coughing', 'dry cough', 'wet cough', 'phlegm',
      'खांसी', 'सुखी खांसी', 'बलगम',
      'ખાંસી', 'ઉધરસ',
      'இருமல்', 'சளி இருமல்',
    ],
  },
  {
    label: 'Sore throat',
    keywords: [
      'sore throat', 'throat pain', 'throat irritation', 'pharyngitis', 'difficulty swallowing',
      'गले में दर्द', 'गला खराब', 'गले में खराश',
      'ગળામાં દુખાવો', 'ગળામાં ખરાશ',
      'தொண்டை வலி', 'தொண்டை கரகரப்பு',
    ],
  },
  {
    label: 'Shortness of breath / Breathing difficulty',
    keywords: [
      'shortness of breath', 'breathlessness', 'difficulty breathing', 'wheezing', 'can’t breathe', 'cant breathe',
      'सांस फूलना', 'सांस लेने में तकलीफ', 'दम फूलना',
      'શ્વાસ ચડવો', 'શ્વાસ લેવામાં તકલીફ',
      'மூச்சுத் திணறல்', 'சுவாசிப்பதில் சிரமம்',
    ],
  },
  {
    label: 'Chest pain / Discomfort',
    keywords: [
      'chest pain', 'chest tightness', 'chest discomfort', 'pressure in chest', 'heaviness in chest',
      'छाती में दर्द', 'सीने में दर्द', 'छाती में भारीपन',
      'છાતીમાં દુખાવો', 'છાતીમાં ભાર',
      'நெஞ்சு வலி', 'நெஞ்சு பாரம்',
    ],
  },
  // Musculoskeletal
  {
    label: 'Back pain',
    keywords: [
      'back pain', 'lower back pain', 'spine pain', 'lumbar pain', 'backache',
      'कमर दर्द', 'कमर में दर्द', 'पीठ दर्द',
      'કમરનો દુખાવો', 'પીઠનો દુખાવો',
      'முதுகு வலி', 'இடுப்பு வலி',
    ],
  },
  {
    label: 'Joint pain / Body ache',
    keywords: [
      'joint pain', 'body ache', 'body aches', 'muscle pain', 'myalgia', 'knee pain', 'generalized ache',
      'बदन दर्द', 'जोड़ों में दर्द', 'हाथ पैर में दर्द', 'अंग दर्द',
      'સાંધાનો દુખાવો', 'શરીરનો દુખાવો', 'અંગ દુખાવો',
      'மூட்டு வலி', 'உடல் வலி',
    ],
  },
  {
    label: 'Fatigue & Weakness',
    keywords: [
      'fatigue', 'weakness', 'exhausted', 'tiredness', 'low energy', 'lethargy',
      'थकान', 'कमजोरी', 'सुस्ती',
      'થાક', 'નબળાઈ',
      'சோர்வு', 'உடல் பலவீனம்',
    ],
  },
  // Skin / Allergy
  {
    label: 'Skin rash & Itching',
    keywords: [
      'skin rash', 'itching', 'rash', 'hives', 'urticaria', 'red spots', 'skin allergy',
      'खुजली', 'दाने', 'एलर्जी', 'चकत्ते',
      'ખંજવાળ', 'ચકામા', 'ધાબળા',
      'தோல் அரிப்பு', 'தடிப்பு',
    ],
  },
  // Eye / Ear
  {
    label: 'Eye irritation / Redness',
    keywords: [
      'eye irritation', 'eye pain', 'red eye', 'watery eye', 'conjunctivitis',
      'आंखों में जलन', 'आंख लाल', 'आंख दर्द',
      'આંખમાં બળતરા', 'આંખ લાલ થવી',
      'கண் எரிச்சல்', 'கண் வலி',
    ],
  },
];

// Helper to test if a text contains any keyword as a standalone phrase
function containsKeyword(text: string, kw: string): boolean {
  const clean = text.toLowerCase();
  const lowerKw = kw.toLowerCase();
  
  // If english, check word boundaries or sub-string
  if (/^[a-z0-9\s'’]+$/i.test(lowerKw)) {
    const escaped = lowerKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
    return regex.test(clean);
  }
  return clean.includes(lowerKw);
}

// Duration regex & phrase extractors
export function extractDurationOnly(text: string): string {
  if (!text || !text.trim()) return 'Not mentioned';

  const clean = text.trim();
  const lower = clean.toLowerCase();

  // Common relational time phrases
  if (lower.includes('since this morning') || lower.includes('since morning') || lower.includes('this morning') || lower.includes('आज सुबह से') || lower.includes('આજ સવારથી') || lower.includes('இன்று காலை')) {
    return 'Since this morning';
  }
  if (lower.includes('since yesterday') || lower.includes('yesterday') || lower.includes('कल से') || lower.includes('કાલથી') || lower.includes('நேற்று முதல்') || lower.includes('நேற்று')) {
    return 'Since yesterday';
  }
  if (lower.includes('since last night') || lower.includes('last night') || lower.includes('कल रात से') || lower.includes('કાલે રાતથી')) {
    return 'Since last night';
  }
  if (lower.includes('for a few hours') || lower.includes('few hours') || lower.includes('कुछ घंटों से')) {
    return 'Few hours';
  }
  if (lower.includes('since a week') || lower.includes('past week') || lower.includes('for a week') || lower.includes('1 week') || lower.includes('one week') || lower.includes('एक हफ्ते से') || lower.includes('એક અઠવાડિયાથી')) {
    return '1 week';
  }

  // Regex patterns: "for 3 days", "3 days", "तीन दिनों से", "ત્રણ દિવસ", etc.
  const numDurationMatch = clean.match(
    /(?:for|past|since|last)?\s*(\d+|one|two|three|four|five|six|seven|eight|nine|ten|a couple of|a few|एक|दो|तीन|चार|पांच|બે|ત્રણ|ચાર|પાંચ|ஒரு|இரண்டு|மூன்று)\s*(days?|weeks?|months?|hours?|दिन|दिनों|हफ्ते|हफ़्ते|महीने|घंटे|દિવસ|અઠવાડિયા|நாட்கள்|வாரங்கள்)/i
  );

  if (numDurationMatch) {
    let raw = numDurationMatch[0].trim();
    // Clean leading prepositions
    raw = raw.replace(/^(for|past|since|last)\s+/i, '');
    return raw;
  }

  // Check specific word numbers
  if (lower.includes('three days') || lower.includes('3 days') || lower.includes('3 day') || lower.includes('तीन दिन') || lower.includes('ત્રણ દિવસ') || lower.includes('மூன்று நாட்கள்')) {
    return '3 days';
  }
  if (lower.includes('two days') || lower.includes('2 days') || lower.includes('2 day') || lower.includes('दो दिन') || lower.includes('બે દિવસ') || lower.includes('இரண்டு நாட்கள்')) {
    return '2 days';
  }
  if (lower.includes('five days') || lower.includes('5 days') || lower.includes('5 day') || lower.includes('पांच दिन') || lower.includes('પાંચ દિવસ')) {
    return '5 days';
  }
  if (lower.includes('four days') || lower.includes('4 days') || lower.includes('चार दिन')) {
    return '4 days';
  }
  if (lower.includes('seven days') || lower.includes('7 days') || lower.includes('सात दिन')) {
    return '7 days';
  }
  if (lower.includes('today') || lower.includes('आज से') || lower.includes('આજથી')) {
    return 'Today';
  }

  return 'Not mentioned';
}

/**
 * Deterministic Clinical Entity Extractor
 * Strictly extracts symptoms present in the text. Never invents symptoms or duration.
 */
export function extractClinicalEntities(
  text: string,
  _fallbackIgnored?: any
): ExtractedClinicalEntities {
  if (!text || !text.trim()) {
    return {
      chiefComplaint: 'No clinical complaint identified',
      duration: 'Not mentioned',
      associatedSymptom: 'None identified',
    };
  }

  const clean = text.trim();
  const lower = clean.toLowerCase();

  // Find all matched clinical symptoms
  const matchedSymptoms: string[] = [];

  for (const symptom of SYMPTOM_PATTERNS) {
    const isMatched = symptom.keywords.some((kw) => containsKeyword(lower, kw));
    if (isMatched && !matchedSymptoms.includes(symptom.label)) {
      matchedSymptoms.push(symptom.label);
    }
  }

  // 1. If NO symptoms were matched, strictly return "No clinical complaint identified"
  if (matchedSymptoms.length === 0) {
    return {
      chiefComplaint: 'No clinical complaint identified',
      duration: 'Not mentioned',
      associatedSymptom: 'None identified',
    };
  }

  // 2. First matched symptom is the Chief Complaint
  const chiefComplaint = matchedSymptoms[0];

  // 3. Any additional matched symptoms are Associated Symptoms
  const remaining = matchedSymptoms.slice(1);
  const associatedSymptom = remaining.length > 0 ? remaining.join(', ') : 'None identified';

  // 4. Extract duration strictly from text
  const duration = extractDurationOnly(clean);

  return {
    chiefComplaint,
    duration,
    associatedSymptom,
  };
}
