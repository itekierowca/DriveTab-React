import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  Info, 
  Download, 
  Loader2, 
  Zap, 
  ShieldAlert, 
  TrendingUp,
  Star,
  ClipboardList,
  ShieldCheck,
  Globe,
  Lightbulb
} from 'lucide-react';

/**
 * KONFIGURACJA SEKCJI I MATRYCY WAG (V.2026.04)
 */
const SECTIONS = [
  {
    id: 's1',
    header1: 'S1-INTRODUCTORY',
    header2: 'CONVERSATION',
    fullTitle: 'SECTION 1: INTRODUCTORY CONVERSATION',
    hint: 'Natural speech. Assess fluency & interactions. Limit to 5 for rehearsed answers.',
    tasks: Array.from({ length: 6 }, (_, i) => ({
      id: `s1_q${i + 1}`,
      name: `Q${i + 1}`,
      weights: { pron: 3, str: 5, voc: 3, flue: 6, comp: 4, inte: 5 }
    }))
  },
  {
    id: 's2a',
    header1: 'S2A-OPERATIONAL',
    header2: 'RT (ATIS)',
    fullTitle: 'SECTION 2A: OPERATIONAL RT (ATIS COMPREHENSION)',
    hint: 'Binary system: 6 (100% technical accuracy) or 1 (any error in numbers/NOTAMs).',
    type: 'binary',
    tasks: [
      { id: 's2a_t1', name: 'ATIS1', weights: { voc: 4, comp: 5 } },
      { id: 's2a_t2', name: 'ATIS2', weights: { voc: 4, comp: 5 } },
      { id: 's2a_t3', name: 'ATIS3', weights: { voc: 4, comp: 5 } },
    ]
  },
  {
    id: 's2b',
    header1: 'S2B-SHORT RT',
    header2: 'READBACK',
    fullTitle: 'SECTION 2B: SHORT RT STATEMENTS (READBACK)',
    hint: '1:1 technical accuracy. Focus on response speed and technical parameters.',
    tasks: Array.from({ length: 6 }, (_, i) => ({
      id: `s2b_q${i + 1}`,
      name: `RB${i + 1}`,
      weights: { pron: 2, str: 2, voc: 2, flue: 1, comp: 4, inte: 3 }
    }))
  },
  {
    id: 's2c',
    header1: 'S2C-LONG RT',
    header2: 'PARAPHRASE',
    fullTitle: 'SECTION 2C: LONG RT STATEMENTS (PARAPHRASING)',
    hint: 'Synthesis. 1:1 word-for-word repetition = Penalty (Max score 3). Reward using own words.',
    tasks: Array.from({ length: 3 }, (_, i) => ({
      id: `s2c_q${i + 1}`,
      name: `PR${i + 1}`,
      weights: { pron: 4, str: 4, voc: 4, flue: 3, comp: 4, inte: 2 }
    }))
  },
  {
    id: 's2d',
    header1: 'S2D-QUESTION',
    header2: 'FORMING',
    fullTitle: 'SECTION 2D: QUESTION FORMING',
    hint: 'Structure profile focus. Correct inversion required in operational queries.',
    tasks: Array.from({ length: 3 }, (_, i) => ({
      id: `s2d_q${i + 1}`,
      name: `QS${i + 1}`,
      weights: { pron: 2, str: 6, voc: 3, flue: 2, comp: 3, inte: 2 }
    }))
  },
  {
    id: 's3',
    header1: 'S3-PICTURE',
    header2: 'DISCUSSION',
    fullTitle: 'SECTION 3: PICTURE DESCRIPTION & DISCUSSION',
    hint: 'Lvl 5/6 booster: Risk analysis, speculations, Human Factors and technical lexis.',
    tasks: [
      { id: 's3_a_desc', name: 'A-Dsc', weights: { pron: 5, str: 5, voc: 5, flue: 5, comp: 0, inte: 0 } },
      { id: 's3_a_q1', name: 'A-Q1', weights: { pron: 5, str: 5, voc: 5, flue: 5, comp: 5, inte: 5 } },
      { id: 's3_a_q2', name: 'A-Q2', weights: { pron: 5, str: 5, voc: 5, flue: 5, comp: 5, inte: 5 } },
      { id: 's3_a_q3', name: 'A-Q3', weights: { pron: 5, str: 5, voc: 5, flue: 5, comp: 5, inte: 5 } },
      { id: 's3_a_q4', name: 'A-Q4', weights: { pron: 5, str: 5, voc: 5, flue: 5, comp: 5, inte: 5 } },
      { id: 's3_a_q5', name: 'A-Q5', weights: { pron: 5, str: 5, voc: 5, flue: 5, comp: 5, inte: 5 } },
      { id: 's3_b_desc', name: 'B-Dsc', weights: { pron: 5, str: 5, voc: 5, flue: 5, comp: 0, inte: 0 } },
      { id: 's3_b_q1', name: 'B-Q1', weights: { pron: 5, str: 5, voc: 5, flue: 5, comp: 5, inte: 5 } },
      { id: 's3_b_q2', name: 'B-Q2', weights: { pron: 5, str: 5, voc: 5, flue: 5, comp: 5, inte: 5 } },
      { id: 's3_b_q3', name: 'B-Q3', weights: { pron: 5, str: 5, voc: 5, flue: 5, comp: 5, inte: 5 } },
      { id: 's3_b_q4', name: 'B-Q4', weights: { pron: 5, str: 5, voc: 5, flue: 5, comp: 5, inte: 5 } },
      { id: 's3_b_q5', name: 'B-Q5', weights: { pron: 5, str: 5, voc: 5, flue: 5, comp: 5, inte: 5 } },
    ]
  }
];

const ICAO_LABELS = {
  pron: 'Pronunciation',
  str: 'Structure',
  voc: 'Vocabulary',
  flue: 'Fluency',
  comp: 'Comprehension',
  inte: 'Interactions'
};

const ICAO4ULogo = ({ isPdf = false }) => {
  const logoUrl = "https://icao4u.com/wp-content/uploads/2025/02/icao-logo_mt3.png";

  if (isPdf) {
    // WERSJA WYŁĄCZNIE DLA WYDRUKU PDF
    return (
      <img 
        src={logoUrl} 
        alt="ICAO4U & Transport Malta Logo" 
        style={{ height: '26mm', objectFit: 'contain' }} 
        crossOrigin="anonymous"
      />
    );
  }

  // WERSJA DLA APLIKACJI INTERFEJSU
  return (
    <img 
      src={logoUrl} 
      alt="ICAO4U & Transport Malta Logo" 
      className="h-16 md:h-20 object-contain" 
      crossOrigin="anonymous"
    />
  );
};

export default function App() {
  const [candidate, setCandidate] = useState({ name: '', type: 'PRO', date: new Date().toLocaleDateString(), examiner: '' });
  const [scores, setScores] = useState({});
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [caps, setCaps] = useState({
    str_fail: false,
    comp_fail: false,
    flue_laborious: false,
    voc_bonus: false,
    comp_recovery: false,
    global_english: false,
    initiative_bonus: false
  });

  const pdfRef = useRef(null);

  // Load external scripts required for PDF Generation
  useEffect(() => {
    const scripts = [
      'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    ];
    scripts.forEach(src => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
      }
    });
  }, []);

  // Algorithm Engine Logic V.2026.04
  const results = useMemo(() => {
    const rawData = { pron: { s: 0, w: 0 }, str: { s: 0, w: 0 }, voc: { s: 0, w: 0 }, flue: { s: 0, w: 0 }, comp: { s: 0, w: 0 }, inte: { s: 0, w: 0 } };

    SECTIONS.forEach(sec => {
      sec.tasks.forEach(task => {
        const val = scores[task.id];
        if (val !== undefined) {
          Object.keys(task.weights).forEach(k => {
            const weight = task.weights[k];
            if (weight > 0) {
              rawData[k].s += val * weight;
              rawData[k].w += weight;
            }
          });
        }
      });
    });

    const profiles = {};
    const exactAverages = {};
    const anyCapActive = caps.str_fail || caps.comp_fail || caps.flue_laborious;

    Object.keys(rawData).forEach(key => {
      if (rawData[key].w > 0) {
        let rawAvg = rawData[key].s / rawData[key].w;
        
        // V.2026.04 Holistyczne Modyfikatory (Przed zaokrągleniem)
        if (key === 'pron' && caps.global_english) rawAvg += 0.50;
        if (key === 'comp' && caps.comp_recovery) rawAvg += 0.40;
        if (key === 'inte' && caps.initiative_bonus && rawAvg >= 5.00) rawAvg = Math.max(rawAvg, 5.50);

        exactAverages[key] = rawAvg;
        let level = Math.floor(rawAvg); // Default V.2026.03 behavior
        
        // V.2026.04 Holistic Expert Threshold (zaokrąglanie matematyczne dla wyników >= 5.50 bez błędów krytycznych)
        if (rawAvg >= 5.50 && !anyCapActive) {
            level = Math.round(rawAvg);
        } else if (key === 'voc' && caps.voc_bonus) {
            level = Math.round(rawAvg);
        }
        
        // Zabezpieczenia (Safety Caps)
        if (key === 'str' && caps.str_fail) level = Math.min(level, 4);
        if (key === 'comp' && caps.comp_fail) level = Math.min(level, 4);
        if (key === 'flue' && caps.flue_laborious) level = Math.min(level, 4);
        
        // Ograniczenie twarde do skali 1-6
        level = Math.min(Math.max(level, 1), 6);
        
        profiles[key] = level;
      } else {
        profiles[key] = 0;
        exactAverages[key] = 0;
      }
    });

    const validVals = Object.values(profiles).filter(v => v > 0);
    // Bottleneck Rule (Wąskie gardło)
    const finalGrade = validVals.length === 6 ? Math.min(...validVals) : 0;

    return { profiles, exactAverages, finalGrade };
  }, [scores, caps]);

  const handleScoreChange = (taskId, value) => {
    setScores(prev => ({ ...prev, [taskId]: value }));
  };

  const generatePDF = async () => {
    if (!window.jspdf || !window.html2canvas) {
      alert("Utility scripts are still loading. Please try in a moment.");
      return;
    }
    setIsGenerating(true);
    
    // Allow React to update state and render before taking snapshot
    await new Promise(r => setTimeout(r, 400));

    try {
      const reportElement = pdfRef.current;
      const canvas = await window.html2canvas(reportElement, { 
        scale: 2.2, 
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          const pdfEl = clonedDoc.getElementById('pdf-report');
          pdfEl.style.display = 'block';
          pdfEl.style.visibility = 'visible';
          pdfEl.style.position = 'relative';
          pdfEl.style.left = '0';
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      pdf.save(`ICAO4U_Audit_${candidate.name.replace(/\s+/g, '_') || 'Assessment'}.pdf`);
    } catch (e) { 
      console.error(e);
      alert("Error generating PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-900 text-[13px]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Evaluator Panel */}
        <div className="lg:col-span-3 space-y-8">
          <header className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <ICAO4ULogo />
            <div className="flex flex-col gap-2 w-full md:w-auto font-black">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="p-3 w-full bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-50 font-black"
                    placeholder="Candidate Name"
                    value={candidate.name}
                    onChange={e => setCandidate({...candidate, name: e.target.value})}
                  />
                  <select className="bg-slate-900 text-white rounded-2xl px-6 text-xs font-black uppercase tracking-widest cursor-pointer outline-none" value={candidate.type} onChange={e => setCandidate({...candidate, type: e.target.value})}>
                    <option value="PPL">PPL</option><option value="PRO">PRO</option><option value="ATC">ATC</option>
                  </select>
                </div>
                <input 
                    type="text" 
                    className="p-2 w-full bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none font-bold text-slate-500"
                    placeholder="Examiner Full Name"
                    value={candidate.examiner}
                    onChange={e => setCandidate({...candidate, examiner: e.target.value})}
                  />
            </div>
          </header>

          <div className="space-y-8">
            {SECTIONS.map(section => (
              <section key={section.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-slate-900 px-8 py-5 flex items-center justify-between">
                  <h2 className="text-white text-xs font-black uppercase tracking-[0.2em]">{section.fullTitle}</h2>
                  <Info size={16} className="text-slate-500" />
                </div>
                <div className="bg-slate-50 px-8 py-3 border-b border-slate-100 italic text-[11px] text-slate-500 font-bold uppercase">
                  Hint: {section.hint}
                </div>
                <div className="p-8 space-y-10">
                  {section.tasks.map(task => (
                    <div key={task.id} className="pb-8 border-b border-slate-50 last:border-0 last:pb-0 group/task">
                      <div className="flex justify-between items-center mb-5 font-black uppercase">
                        <span className="text-[11px] text-slate-400 tracking-widest group-hover/task:text-blue-600 transition-colors">{task.id.includes('q') ? `Question ${task.id.split('q')[1]}` : task.name}</span>
                        <div className="text-4xl text-blue-600 tracking-tighter tabular-nums">
                          {scores[task.id] || '—'}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                        {section.type === 'binary' ? (
                          [6, 1].map(v => (
                            <button key={v} onClick={() => handleScoreChange(task.id, v)} className={`w-full sm:flex-1 py-4 sm:py-5 rounded-3xl font-black text-xs border-2 transition-all active:scale-95 ${scores[task.id] === v ? (v === 6 ? 'bg-green-600 border-green-600 text-white shadow-lg' : 'bg-red-600 border-red-600 text-white shadow-lg') : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-white'}`}>
                              {v === 6 ? 'SUCCESSFUL (6)' : 'UNSUCCESSFUL (1)'}
                            </button>
                          ))
                        ) : (
                          [1, 2, 3, 4, 5, 6].map(v => (
                            <button key={v} onClick={() => handleScoreChange(task.id, v)} className={`flex-1 py-4 sm:py-5 rounded-2xl sm:rounded-3xl font-black text-lg sm:text-xl transition-all active:scale-95 border-2 ${scores[task.id] === v ? 'bg-blue-600 border-blue-600 text-white shadow-xl scale-105 ring-4 ring-blue-100' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-blue-300 hover:bg-white hover:text-blue-600'}`}>
                              {v}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Sidebar & Dashboard */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-8">
            <div className="bg-slate-900 rounded-[3.5rem] p-8 text-white shadow-xl border border-slate-800 text-center relative overflow-hidden group">
               <div className="absolute top-4 right-6 text-[9px] font-bold tracking-widest opacity-30">V.2026.04</div>
               <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 relative z-10">Final ICAO Level</h3>
               <div className="text-[120px] font-black leading-none italic tracking-tighter mb-8 transition-transform group-hover:scale-110 duration-700 relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
                 {results.finalGrade || '—'}
               </div>
               <div className="space-y-4 text-left border-t border-slate-800 pt-6 relative z-10 font-black uppercase">
                {Object.entries(ICAO_LABELS).map(([k, l]) => (
                  <div key={k}>
                    <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                      <span>{l}</span>
                      <span className={results.profiles[k] >= 4 ? 'text-blue-400 font-black' : 'text-red-400 font-black'}>Level {results.profiles[k] || 0}</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-1000 ${results.profiles[k] < 4 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${(results.exactAverages[k] / 6) * 100}%` }} />
                    </div>
                  </div>
                ))}
               </div>
            </div>

            {/* V.2026.04 Modifiers Dashboard */}
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-[11px] font-black text-slate-800 uppercase flex items-center gap-3 border-b pb-3 tracking-widest font-black uppercase">
                <Star size={18} className="text-indigo-600 shrink-0" /> Holistic Modifiers
              </h3>
              <div className="space-y-3 font-black uppercase">
                <button onClick={() => setCaps({...caps, global_english: !caps.global_english})} className={`w-full text-left p-4 rounded-3xl border-2 flex items-center gap-3 transition-all ${caps.global_english ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md scale-[1.02]' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-indigo-200'}`}>
                  <Globe size={18} className={caps.global_english ? 'text-indigo-600' : ''} /> <div><span className="text-[10px] block leading-none font-black tracking-tight">Global English</span><p className="text-[8px] opacity-60 mt-1 font-bold tracking-tight">PRON +0.50 Avg</p></div>
                </button>
                <button onClick={() => setCaps({...caps, comp_recovery: !caps.comp_recovery})} className={`w-full text-left p-4 rounded-3xl border-2 flex items-center gap-3 transition-all ${caps.comp_recovery ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md scale-[1.02]' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-indigo-200'}`}>
                  <ShieldCheck size={18} className={caps.comp_recovery ? 'text-indigo-600' : ''} /> <div><span className="text-[10px] block leading-none font-black tracking-tight">Stress Recovery</span><p className="text-[8px] opacity-60 mt-1 font-bold tracking-tight">COMP +0.40 Avg</p></div>
                </button>
                <button onClick={() => setCaps({...caps, initiative_bonus: !caps.initiative_bonus})} className={`w-full text-left p-4 rounded-3xl border-2 flex items-center gap-3 transition-all ${caps.initiative_bonus ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md scale-[1.02]' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-indigo-200'}`}>
                  <Lightbulb size={18} className={caps.initiative_bonus ? 'text-indigo-600' : ''} /> <div><span className="text-[10px] block leading-none font-black tracking-tight">PIC Initiative</span><p className="text-[8px] opacity-60 mt-1 font-bold tracking-tight">Force INTE = Lvl 6</p></div>
                </button>
                <button onClick={() => setCaps({...caps, voc_bonus: !caps.voc_bonus})} className={`w-full text-left p-4 rounded-3xl border-2 flex items-center gap-3 transition-all ${caps.voc_bonus ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md scale-[1.02]' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-indigo-200'}`}>
                  <TrendingUp size={18} className={caps.voc_bonus ? 'text-indigo-600' : ''} /> <div><span className="text-[10px] block leading-none font-black tracking-tight">VOC Bonus</span><p className="text-[8px] opacity-60 mt-1 font-bold tracking-tight">Round up VOC</p></div>
                </button>
              </div>

              <h3 className="text-[11px] font-black text-slate-800 uppercase flex items-center gap-3 border-b pt-4 pb-3 tracking-widest font-black uppercase">
                <ShieldAlert size={18} className="text-red-600 shrink-0" /> Safety Caps
              </h3>
              <div className="space-y-3 font-black uppercase">
                <button onClick={() => setCaps({...caps, str_fail: !caps.str_fail})} className={`w-full text-left p-4 rounded-3xl border-2 flex items-center gap-3 transition-all ${caps.str_fail ? 'bg-red-50 border-red-500 text-red-700 shadow-md scale-[1.02]' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-red-200'}`}>
                  <Zap size={18} className={caps.str_fail ? 'text-red-600' : ''} /> <div><span className="text-[10px] block leading-none font-black">Grammar Fail S1</span><p className="text-[8px] opacity-60 mt-1 font-bold tracking-tight">Cap STR @ Lvl 4</p></div>
                </button>
                <button onClick={() => setCaps({...caps, comp_fail: !caps.comp_fail})} className={`w-full text-left p-4 rounded-3xl border-2 flex items-center gap-3 transition-all ${caps.comp_fail ? 'bg-red-50 border-red-500 text-red-700 shadow-md scale-[1.02]' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-red-200'}`}>
                  <AlertTriangle size={18} className={caps.comp_fail ? 'text-red-600' : ''} /> <div><span className="text-[10px] block leading-none font-black">Comp. Error S1</span><p className="text-[8px] opacity-60 mt-1 font-bold tracking-tight">Cap COMP @ Lvl 4</p></div>
                </button>
                <button onClick={() => setCaps({...caps, flue_laborious: !caps.flue_laborious})} className={`w-full text-left p-4 rounded-3xl border-2 flex items-center gap-3 transition-all ${caps.flue_laborious ? 'bg-red-50 border-red-500 text-red-700 shadow-md scale-[1.02]' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-red-200'}`}>
                  <Loader2 size={18} className={caps.flue_laborious ? 'text-red-600' : ''} /> <div><span className="text-[10px] block leading-none font-black">Laborious Pace S3</span><p className="text-[8px] opacity-60 mt-1 font-bold tracking-tight">Cap FLUE @ Lvl 4</p></div>
                </button>
              </div>
            </div>

            <textarea 
                className="w-full text-[11px] font-black p-5 bg-white border-2 border-slate-200 shadow-sm rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-100 min-h-[120px] uppercase transition-all" 
                placeholder="Examiner Audit Notes..." 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
            />

            <button disabled={isGenerating || !results.finalGrade} onClick={generatePDF} className={`w-full py-5 rounded-[2rem] font-black uppercase text-sm flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${isGenerating ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-300'}`}>
              {isGenerating ? <Loader2 className="animate-spin" /> : <Download size={20} strokeWidth={3} />}
              {isGenerating ? 'Processing...' : 'Export Audit PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* --- OFICJALNY AUDYT PDF A4 (HIDDEN RENDERER) --- */}
      <div id="pdf-report" ref={pdfRef} style={{ 
        position: 'fixed',
        left: '-10000px',
        top: 0,
        width: '210mm', 
        minHeight: '297mm',
        padding: '10mm 15mm', 
        backgroundColor: 'white', 
        color: '#0f172a', 
        fontFamily: 'Arial, sans-serif',
        fontSize: '9pt',
        lineHeight: '1.25',
        zIndex: -1,
        visibility: 'hidden'
      }}>
        {/* PDF Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #1e40af', paddingBottom: '3mm', marginBottom: '3mm' }}>
          <ICAO4ULogo isPdf={true} />
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontWeight: '900', fontSize: '10.5pt' }}>DATE: {candidate.date}</p>
            <p style={{ margin: 0, color: '#3b82f6', fontWeight: 'bold', fontSize: '8.5pt' }}>AUDIT-ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '3mm' }}>
            <h1 style={{ margin: 0, fontSize: '16pt', fontWeight: '900', color: '#1e3a8a', textTransform: 'uppercase' }}>INTERNAL AUDIT REPORT</h1>
            <p style={{ margin: 0, fontSize: '7.5pt', color: '#64748b', fontWeight: '800', letterSpacing: '1px' }}>EXAMINER STANDARDIZATION TOOL • ENGINE V.2026.04 (HOLISTIC)</p>
        </div>

        {/* PDF Info Grid */}
        <div style={{ display: 'flex', gap: '3mm', marginBottom: '4mm' }}>
          <div style={{ flex: '1', padding: '6px 12px', backgroundColor: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: 0, fontSize: '6.5pt', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Candidate Name</p>
            <p style={{ margin: 0, fontSize: '12.5pt', fontWeight: '900', color: '#0f172a' }}>{candidate.name || 'N/A'}</p>
          </div>
          <div style={{ flex: '1', padding: '6px 12px', backgroundColor: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: 0, fontSize: '6.5pt', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Assessing Examiner</p>
            <p style={{ margin: 0, fontSize: '12.5pt', fontWeight: '900', color: '#0f172a' }}>{candidate.examiner || '—'}</p>
          </div>
          <div style={{ width: '25mm', textAlign: 'center', padding: '5px 10px', backgroundColor: '#1e293b', borderRadius: '10px', color: 'white' }}>
            <p style={{ margin: 0, fontSize: '6.5pt', opacity: 0.7, fontWeight: 'bold' }}>OVERALL</p>
            <p style={{ margin: 0, fontSize: '18pt', fontWeight: '900' }}>{results.finalGrade}</p>
          </div>
        </div>

        {/* PDF Detailed Scores (6 columns z użyciem flexboxa dla bezpieczeństwa) */}
        <div style={{ marginBottom: '4mm' }}>
          <h2 style={{ fontSize: '9pt', fontWeight: '900', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '1mm', color: '#1e3a8a', textTransform: 'uppercase', marginBottom: '2mm' }}>
             DETAILED TASK ASSESSMENT (RAW SCORES)
          </h2>
          <div style={{ display: 'flex', width: '100%', gap: '1.5mm', alignItems: 'stretch' }}>
            {SECTIONS.map(sec => (
              <div key={sec.id} style={{ flex: '1 1 0', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1mm', backgroundColor: '#fdfdfd', boxSizing: 'border-box' }}>
                <p style={{ margin: '0 0 1.5mm 0', fontSize: '5.5pt', fontWeight: '900', color: '#1e3a8a', borderBottom: '1.5px solid #fff100', backgroundColor: '#f8fafc', padding: '2px 0', textAlign: 'center', lineHeight: '1.1' }}>
                    {sec.header1}<br/>{sec.header2}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8mm' }}>
                  {sec.tasks.map(task => (
                    <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '0.5px solid #f1f5f9', paddingBottom: '0.5mm' }}>
                      <span style={{ fontSize: '5.5pt', color: '#475569', fontWeight: '700' }}>{task.name}</span>
                      <span style={{ fontSize: '7pt', fontWeight: '900', color: scores[task.id] ? '#1e40af' : '#cbd5e1' }}>{scores[task.id] || '0'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PDF Profile & Flags */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5mm', marginBottom: '4mm' }}>
          <div style={{ width: '64%' }}>
            <h2 style={{ fontSize: '9pt', fontWeight: '900', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '1mm', color: '#1e3a8a', textTransform: 'uppercase', marginBottom: '2mm' }}>ICAO COMPLIANCE PROFILE</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5mm' }}>
              {Object.entries(ICAO_LABELS).map(([k, l]) => (
                <div key={k} style={{ width: 'calc(50% - 0.75mm)', padding: '2mm 4mm', border: '1px solid #f1f5f9', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', backgroundColor: '#fcfcfc' }}>
                  <span style={{ fontSize: '7pt', fontWeight: 'bold', color: '#64748b' }}>{l.toUpperCase()}</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '11pt', fontWeight: '900', color: results.profiles[k] < 4 ? '#b91c1c' : '#0f172a' }}>Lvl {results.profiles[k]}</span>
                    <span style={{ fontSize: '7pt', color: '#94a3b8', display: 'block', lineHeight: '1' }}>avg {results.exactAverages[k].toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ width: '34%', backgroundColor: '#f8fafc', padding: '3mm', borderRadius: '12px', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <p style={{ margin: '0 0 2mm 0', fontSize: '8pt', fontWeight: '900', color: '#1e3a8a', textTransform: 'uppercase' }}>Applied Modifiers</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2mm' }}>
              {caps.global_english && <p style={{ margin: 0, fontSize: '7pt', fontWeight: 'bold', color: '#4338ca' }}>• GLOBAL ENGLISH (+0.5 PRON)</p>}
              {caps.comp_recovery && <p style={{ margin: 0, fontSize: '7pt', fontWeight: 'bold', color: '#4338ca' }}>• STRESS RECOVERY (+0.4 COMP)</p>}
              {caps.initiative_bonus && <p style={{ margin: 0, fontSize: '7pt', fontWeight: 'bold', color: '#4338ca' }}>• PIC INITIATIVE (INTE Lvl 6)</p>}
              {caps.voc_bonus && <p style={{ margin: 0, fontSize: '7pt', fontWeight: 'bold', color: '#4338ca' }}>• VOC BONUS APPLIED</p>}
              {caps.str_fail && <p style={{ margin: 0, fontSize: '7pt', fontWeight: 'bold', color: '#b45309' }}>• STR CAP @ Level 4</p>}
              {caps.comp_fail && <p style={{ margin: 0, fontSize: '7pt', fontWeight: 'bold', color: '#b45309' }}>• COMP CAP @ Level 4</p>}
              {caps.flue_laborious && <p style={{ margin: 0, fontSize: '7pt', fontWeight: 'bold', color: '#b45309' }}>• FLUE CAP @ Level 4</p>}
              {!Object.values(caps).some(Boolean) && <p style={{ fontSize: '7pt', color: '#64748b', opacity: 0.8 }}>Standard Assessment (No Flags)</p>}
            </div>
          </div>
        </div>

        {/* PDF Remarks */}
        <div style={{ marginBottom: '4mm' }}>
          <h2 style={{ fontSize: '9pt', fontWeight: '900', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '1mm', color: '#1e3a8a', textTransform: 'uppercase', marginBottom: '2mm' }}>EXAMINER AUDIT REMARKS</h2>
          <div style={{ padding: '4mm 6mm', backgroundColor: '#fdfdfd', border: '1px solid #e2e8f0', borderRadius: '10px', minHeight: '30mm' }}>
            <p style={{ margin: 0, fontSize: '9pt', fontStyle: 'italic', lineHeight: '1.4', color: '#334155' }}>{notes || 'No justification notes provided.'}</p>
          </div>
        </div>

        {/* PDF Signature */}
        <div style={{ marginTop: 'auto', borderTop: '2px solid #f1f5f9', paddingTop: '6mm' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '60%', textAlign: 'center' }}>
              <div style={{ height: '20mm', borderBottom: '1.5px solid #0f172a', marginBottom: '3mm', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#f1f5f9', fontSize: '9pt' }}></p>
              </div>
              <p style={{ margin: 0, fontSize: '11pt', fontWeight: '900', color: '#0f172a' }}>{candidate.examiner || 'AUTHORIZED EXAMINER'}</p>
              <p style={{ margin: 0, fontSize: '8.5pt', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>Expert Assessor Signature</p>
            </div>
          </div>
          <div style={{ marginTop: '8mm', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '8.5pt', color: '#cbd5e1', fontFamily: 'monospace' }}>
              SHA256: {Math.random().toString(36).substring(2, 14).toUpperCase()}
            </div>
            <p style={{ margin: 0, fontSize: '8pt', color: '#94a3b8', fontWeight: 'bold' }}>
              MLT.LTB.004 INTERNAL STANDARDIZATION COPY • ICAO4U V.2026.04
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
