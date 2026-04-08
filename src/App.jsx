import React, { useState, useEffect, useRef } from 'react';
import { 
  Car, 
  ChevronRight,
  Play,
  Check,
  Dices,
  Printer
} from 'lucide-react';

// --- ELEMENTY DO LOSOWANIA (Tabela nr 3, poz. 1) ---
const PREP_GROUP_1 = [
  { id: 'p_oil', name: 'Poziom oleju silnikowego' },
  { id: 'p_coolant', name: 'Poziom płynu chłodzącego' },
  { id: 'p_brake', name: 'Poziom płynu hamulcowego' },
  { id: 'p_washer', name: 'Obecność płynu w spryskiwaczach' },
  { id: 'p_horn', name: 'Działanie sygnału dźwiękowego' }
];

const PREP_GROUP_2 = [
  { id: 'l_pos', name: 'Światła pozycyjne' },
  { id: 'l_low', name: 'Światła mijania' },
  { id: 'l_high', name: 'Światła drogowe' },
  { id: 'l_ind', name: 'Światła kierunkowskazów' },
  { id: 'l_stop', name: 'Światła hamowania "STOP"' },
  { id: 'l_rev', name: 'Światła cofania' },
  { id: 'l_haz', name: 'Światła awaryjne' },
  { id: 'l_fog', name: 'Światła przeciwmgłowe tylne' }
];

// --- POZOSTAŁE ZADANIA PLAC (KAT. B) ---
const YARD_TASKS_REMAINING = [
  { id: 'y_prep_logic', name: 'Właściwe ustawienie fotela, lusterek, zagłówka i zapięcie pasów', label: '1c' },
  { id: 'y2', name: 'Ruszanie z miejsca oraz jazda pasem ruchu do przodu i do tyłu', label: '2' },
  { id: 'y3', name: 'Parkowanie skośne (wjazd przodem - wyjazd tyłem)', label: '3' },
  { id: 'y41', name: 'Parkowanie prostopadłe (wjazd tyłem - wyjazd przodem)', label: '4.1' },
  { id: 'y42', name: 'Parkowanie prostopadłe (wjazd tyłem - wyjazd przodem)', label: '4.2' },
  { id: 'y6', name: 'Ruszanie z miejsca do przodu na wzniesieniu', label: '6' }
];

const ROAD_TASKS_OFFICIAL = [
  { id: 'r1', name: 'Włączanie się do ruchu', label: '1' },
  { id: 'r2', name: 'Jazda drogami dwukierunkowymi jednojezdniowymi', label: '2' },
  { id: 'r3', name: 'Jazda drogami dwukierunkowymi dwujezdniowymi', label: '3' },
  { id: 'r4', name: 'Jazda drogami jednokierunkowymi', label: '4' },
  { id: 'r5', name: 'Jazda przez skrzyżowania równorzędne (trzy- i czterowlotowe)', label: '5' },
  { id: 'r6', name: 'Przejazd przez skrzyżowania oznakowane znakami ustalającymi pierwszeństwo przejazdu', label: '6' },
  { id: 'r7', name: 'Przejazd przez skrzyżowania z sygnalizacją świetlną', label: '7' },
  { id: 'r8', name: 'Przejazd przez skrzyżowania, na których ruch odbywa się wokół wyspy', label: '8' },
  { id: 'r9', name: 'Przejazd przez skrzyżowania dwupoziomowe', label: '9' },
  { id: 'r10', name: 'Przejazd przez przejścia dla pieszych', label: '10' },
  { id: 'r11a', name: 'Parkowanie skośne (wjazd przodem - wyjazd tyłem)', label: '11a' },
  { id: 'r11b', name: 'Parkowanie prostopadłe (wjazd tyłem - wyjazd przodem)', label: '11b' },
  { id: 'r11c', name: 'Parkowanie równoległe (wjazd przodem - wyjazd przodem)', label: '11c' },
  { id: 'r12', name: 'Zawracanie', label: '12' },
  { id: 'r13', name: 'Przejazd przez torowisko tramwajowe i kolejowe', label: '13' },
  { id: 'r14', name: 'Przejazd przez tunel', label: '14' },
  { id: 'r15', name: 'Przejazd obok przystanku tramwajowego i autobusowego', label: '15' },
  { id: 'r16', name: 'Wyprzedzanie', label: '16' },
  { id: 'r17', name: 'Omijanie', label: '17' },
  { id: 'r18', name: 'Wymijanie', label: '18' },
  { id: 'r19', name: 'Zmiana pasa ruchu', label: '19' },
  { id: 'r20', name: 'Zmiana kierunku jazdy w prawo', label: '20' },
  { id: 'r21', name: 'Zmiana kierunku jazdy w lewo', label: '21' },
  { id: 'r22', name: 'Zawracanie na skrzyżowaniu', label: '22' },
  { id: 'r23', name: 'Hamowanie do zatrzymania we wskazanym miejscu', label: '23' },
  { id: 'r24', name: 'Hamowanie awaryjne', label: '24' },
  { id: 'r25', name: 'Rozprzęganie', label: '25' },
  { id: 'r26', name: 'Właściwa zmiana biegów - jazda energooszczędna', label: '26' },
  { id: 'r27', name: 'Hamowanie silnikiem przy zatrzymaniu i zwalnianiu - jazda energooszczędna', label: '27' },
  { id: 'r28', name: 'Przekroczenie dopuszczalnej prędkości', label: '28' },
  { id: 'r29', name: 'Zachowanie w odniesieniu do znaków poziomych', label: '29' },
  { id: 'r30', name: 'Zachowanie w odniesieniu do znaków pionowych', label: '30' },
  { id: 'r31', name: 'Zachowanie w odniesieniu do sygnałów świetlnych', label: '31' },
  { id: 'r32', name: 'Zachowanie w odniesieniu do poleceń osoby kierującej ruchem', label: '32' },
  { id: 'r33', name: 'Zachowanie w odniesieniu do innych uczestników ruchu', label: '33' },
  { id: 'r34', name: 'Respektowanie zasad techniki kierowania pojazdami', label: '34' }
];

export default function App() {
  const [screen, setScreen] = useState('intro');
  const [formData, setFormData] = useState({
    name: 'TOMASZ ZAJĄC',
    pkk: 'PL/14/2024/0012348',
    pesel: '78112934567',
    examiner: 'RAFAŁ MATUSZEWSKI',
    word: 'WORD WARSZAWA',
    date: '08.04.2026',
    timeStart: '18:41',
    includeHp: true
  });

  const [drawResult, setDrawResult] = useState({ item1: null, item2: null });
  const [scores, setScores] = useState({});
  const [hpState, setHpState] = useState({ currentIndex: 0, results: [], currentHits: [], videoTime: 0, isPlaying: false });
  const [verdict, setVerdict] = useState('POZYTYWNY');
  
  const canvasRef = useRef(null);

  // --- HOOKS LOGIC ---
  useEffect(() => {
    if (screen !== 'hp' || !hpState.isPlaying) return;
    const t = setInterval(() => {
      setHpState(prev => {
        const nextTime = prev.videoTime + 0.1;
        if (nextTime >= 5) {
          clearInterval(t);
          setTimeout(() => {
            const best = prev.currentHits.length > 0 ? Math.max(...prev.currentHits.map(h => h.pts)) : 0;
            const nextIdx = prev.currentIndex + 1;
            if (nextIdx < 5) {
              setHpState(p => ({...p, currentIndex: nextIdx, results: [...p.results, best], currentHits: [], videoTime: 0, isPlaying: true}));
            } else {
              setHpState(p => ({...p, results: [...p.results, best], isPlaying: false}));
              setScreen('yard');
            }
          }, 600);
          return { ...prev, videoTime: 5, isPlaying: false };
        }
        return { ...prev, videoTime: nextTime };
      });
    }, 100);
    return () => clearInterval(t);
  }, [screen, hpState.isPlaying]);

  const performDraw = () => {
    const i1 = PREP_GROUP_1[Math.floor(Math.random() * PREP_GROUP_1.length)];
    const i2 = PREP_GROUP_2[Math.floor(Math.random() * PREP_GROUP_2.length)];
    setDrawResult({ item1: i1, item2: i2 });
  };

  const updateScore = (id, delta) => {
    const current = scores[id] || { errors: 0, done: false };
    const nextErrors = Math.max(0, current.errors + delta);
    const nextData = { errors: nextErrors, done: nextErrors > 0 ? false : current.done };
    const newScores = { ...scores, [id]: nextData };
    setScores(newScores);
    const anyFail = Object.values(newScores).some(v => v.errors >= 2);
    setVerdict(anyFail ? 'NEGATYWNY' : 'POZYTYWNY');
  };

  const toggleTask = (id) => {
    const current = scores[id] || { errors: 0, done: false };
    if (current.errors > 0) return;
    setScores({ ...scores, [id]: { ...current, done: !current.done } });
  };

  const getOfficialTask1Score = () => {
    const ids = [drawResult.item1?.id, drawResult.item2?.id, 'y_prep_logic'];
    let maxErrors = 0;
    let allDone = true;
    ids.forEach(id => {
      const s = scores[id] || { errors: 0, done: false };
      if (s.errors > maxErrors) maxErrors = s.errors;
      if (!s.done && s.errors === 0) allDone = false;
    });
    return { errors: maxErrors, done: allDone };
  };

  // --- PDF GENERATOR ---
  const generatePDF = () => {
    const sigData = canvasRef.current?.toDataURL() || '';
    const hpSum = hpState.results.length > 0 ? hpState.results.reduce((a, b) => a + b, 0) : 11;
    const isPos = verdict === 'POZYTYWNY';
    const task1Aggregated = getOfficialTask1Score();

    // Hand-drawn SVG symbols for human-like marking
    const handX = `<svg viewBox="0 0 14 14" width="14" height="14" style="display:block;"><path d="M2 2 L12 12 M12 2 L2 12" stroke="#c0392b" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg>`;
    const handCheck = `<svg viewBox="0 0 14 14" width="16" height="16" style="display:block; margin-top:-2px;"><path d="M2 7 L5 11 L12 2" stroke="#1a6b3a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;

    const renderOfficialCell = (scoreData) => {
      const s = scoreData || { errors: 0, done: false };
      const boxStyle = "display:inline-flex; align-items:center; justify-content:center; width:13px; height:13px; border:0.5pt solid #000; background:#fff; margin-left:2px;";
      
      return `
        <div style="display:flex; align-items:center; justify-content:center; font-family:Arial, sans-serif;">
          <span style="font-size:8.5pt; margin-right:1px; font-weight:bold;">1</span>
          <div style="${boxStyle}">${s.errors >= 1 ? handX : ''}</div>
          <span style="font-size:8.5pt; margin-left:4px; margin-right:1px; font-weight:bold;">2</span>
          <div style="${boxStyle}">${s.errors >= 2 ? handX : ''}</div>
          <div style="display:inline-flex; align-items:center; justify-content:center; width:15px; height:15px; border:0.6pt solid #000; margin-left:8px; background:#fff;">
            ${s.done && s.errors === 0 ? handCheck : ''}
          </div>
        </div>
      `;
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @page { size: A4; margin: 0; }
          body { font-family: 'Arial', sans-serif; font-size: 8.2pt; color: #000; margin: 8mm; line-height: 1.15; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          table { width: 100%; border-collapse: collapse; }
          .hdr-cell { border: 0.6pt solid #000; padding: 3px 6px; vertical-align: top; }
          .title-doc { text-align: center; font-weight: bold; font-size: 10.5pt; padding: 7px 0; border-top: 1.8pt solid #000; margin-top: 4px; }
          .col-hdr { background: #e0e0e0 !important; border: 0.6pt solid #000; padding: 2px; text-align: center; }
          .task-row td { border: 0.6pt solid #000; padding: 2px 4px; height: 18px; vertical-align: middle; }
          .task-num { width: 22px; text-align: center; font-weight: bold; }
          .task-score { width: 95px; text-align: center; }
          .result-box { border: 2.8pt solid ${isPos ? '#1a6b3a' : '#c0392b'}; color: ${isPos ? '#1a6b3a' : '#c0392b'}; padding: 8px 24px; font-size: 22pt; font-weight: 900; display: inline-block; text-transform: uppercase; margin-top: 8px; }
          .stamp-area { width: 200px; text-align: center; position: relative; margin-top: 35px; }
          .footer-line { font-size: 6.2pt; color: #111; margin-top: 6px; border-top: 0.4pt solid #000; padding-top: 3px; }
          .hp-diag { border: 0.6pt solid #000; padding: 3px 5px; font-weight: bold; font-size: 7.8pt; margin: 4px 0; background: #fafafa; }
        </style>
      </head>
      <body>
        <table>
          <tr>
            <td class="hdr-cell" style="width:58%;">Nazwisko i imię osoby egzaminowanej<br><strong>${formData.name} ${formData.pesel}</strong></td>
            <td class="hdr-cell">Data i godzina części praktycznej egzaminu państwowego<br><strong>${formData.date} / ${formData.timeStart}</strong></td>
            <td class="hdr-cell" style="width:8%; text-align:center;">Kategoria<br><strong style="font-size:12pt;">B</strong></td>
          </tr>
          <tr>
            <td class="hdr-cell">Godzina rozpoczęcia / zakończenia egzaminu<br><strong>${formData.timeStart} / ...</strong></td>
            <td class="hdr-cell">Nr zestawu (nie dotyczy kat. AM, A1, A2, A, B, B1)<br><strong>—</strong></td>
            <td class="hdr-cell" style="text-align:center;">WORD<br><strong style="font-size:7.5pt;">${formData.word}</strong></td>
          </tr>
        </table>

        <div class="title-doc">ARKUSZ PRZEBIEGU CZĘŚCI PRAKTYCZNEJ EGZAMINU PAŃSTWOWEGO NA PRAWO JAZDY</div>

        <div style="display:flex;">
          <div style="flex:1; border-right: 0.3pt solid #000;">
            <table>
              <tr>
                <td class="col-hdr" style="width:22px;">Poz.</td>
                <td class="col-hdr">Plac manewrowy / ruch drogowy</td>
                <td class="col-hdr" style="width:95px;">
                  <div style="font-weight:bold; font-size:9.5pt; margin-bottom:1px;">Ocena</div>
                  <div style="font-size:6.5pt; font-weight:normal; letter-spacing:0.2px;">N-neg. P-poz.</div>
                </td>
              </tr>
              <tr class="task-row"><td class="task-num">1</td><td style="font-size:7.8pt;">Przygotowanie do jazdy</td><td class="task-score">${renderOfficialCell(task1Aggregated)}</td></tr>
              <tr class="task-row"><td class="task-num">2</td><td style="font-size:7.8pt;">Ruszanie z miejsca oraz jazda pasem ruchu</td><td class="task-score">${renderOfficialCell(scores['y2'])}</td></tr>
              <tr class="task-row"><td class="task-num">3</td><td style="font-size:7.8pt;">Parkowanie skośne (wjazd przodem - wyjazd tyłem)</td><td class="task-score">${renderOfficialCell(scores['y3'])}</td></tr>
              <tr class="task-row"><td class="task-num">4.1</td><td style="font-size:7.8pt;">Parkowanie prostopadłe (wjazd tyłem - wyjazd przodem)</td><td class="task-score">${renderOfficialCell(scores['y41'])}</td></tr>
              <tr class="task-row"><td class="task-num">4.2</td><td style="font-size:7.8pt;">Parkowanie prostopadłe (wjazd tyłem - wyjazd przodem)</td><td class="task-score">${renderOfficialCell(scores['y42'])}</td></tr>
              <tr class="task-row"><td class="task-num">6</td><td style="font-size:7.8pt;">Ruszanie z miejsca do przodu na wzniesieniu</td><td class="task-score">${renderOfficialCell(scores['y6'])}</td></tr>
              <tr><td colspan="3" class="col-hdr" style="text-align:left; padding-left:10px; font-size:7pt;">Ruch drogowy</td></tr>
              ${ROAD_TASKS_OFFICIAL.slice(0, 12).map(t => `<tr class="task-row"><td class="task-num">${t.label}</td><td style="font-size:7.8pt;">${t.name}</td><td class="task-score">${renderOfficialCell(scores[t.id])}</td></tr>`).join('')}
            </table>
          </div>
          <div style="flex:1;">
            <table>
              <tr>
                <td class="col-hdr" style="width:22px;">Poz.</td>
                <td class="col-hdr">Ruch drogowy</td>
                <td class="col-hdr" style="width:95px;">
                  <div style="font-weight:bold; font-size:9.5pt; margin-bottom:1px;">Ocena</div>
                  <div style="font-size:6.5pt; font-weight:normal; letter-spacing:0.2px;">N-neg. P-poz.</div>
                </td>
              </tr>
              ${ROAD_TASKS_OFFICIAL.slice(12).map(t => `<tr class="task-row"><td class="task-num">${t.label}</td><td style="font-size:7.8pt;">${t.name}</td><td class="task-score">${renderOfficialCell(scores[t.id])}</td></tr>`).join('')}
            </table>
          </div>
        </div>

        <div class="hp-diag">TEST HP (diagnostyczny): ${formData.includeHp ? `${hpSum}/30 pkt` : 'nie przeprowadzono'} — nie wpływa na wynik egzaminu</div>

        <div style="display:flex; justify-content:space-between; margin-top:8px;">
          <div style="flex:1;">
            <strong>Uwagi:</strong><br>
            <div style="min-height:35px; border-bottom:0.5pt dashed #666; width:95%; font-style:italic; font-size:7.5pt; margin-top:5px;">
              Wylosowano: 1. ${drawResult.item1?.name}, 2. ${drawResult.item2?.name}. ${verdict === 'NEGATYWNY' ? 'Wynik negatywny.' : ''}
            </div>
            <div style="margin-top:12px;"><strong>Wynik egzaminu:</strong><br><div class="result-box">${verdict}</div></div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:flex-end;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=85x85&data=DRIVETAB-${formData.pesel}" style="width:82px; height:82px; border:0.6pt solid #000;" />
            <div class="stamp-area">
              ${sigData ? `<img src="${sigData}" style="max-height:60px; position:absolute; bottom:5px; left:50%; transform:translateX(-50%);" />` : ''}
              <div style="border-top:0.6pt solid #000; font-size:6.8pt; padding-top:2px;">(podpis i pieczęć egzaminatora)</div>
            </div>
          </div>
        </div>
        <div class="footer-line">Nr PKK: ${formData.pkk} | Arkusz elektroniczny - Rozp. MI z dn. 24.11.2023 r. (Dz.U. poz. 2659) | DriveTab v2.4 | ${new Date().toLocaleString('pl-PL')}</div>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      win.onload = () => {
        setTimeout(() => { win.print(); URL.revokeObjectURL(url); }, 400);
      };
    }
  };

  // --- RENDER HELPERS ---
  const renderTaskItem = (t) => {
    const s = scores[t.id] || { errors: 0, done: false };
    const isSpecial = t.id && (t.id.startsWith('p_') || t.id.startsWith('l_'));
    return (
      <div key={t.id || t.label} className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${s.errors >= 2 ? 'bg-rose-500/10 border-rose-500/50' : s.done ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-900 border-slate-800'}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${s.errors > 0 ? 'bg-rose-500 text-white' : s.done ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-500'}`}>
          {s.errors > 0 ? s.errors : s.done ? <Check size={12} strokeWidth={3} /> : '–'}
        </div>
        <div className="flex-1 cursor-pointer" onClick={() => toggleTask(t.id)}>
          <h4 className={`text-xs font-bold ${isSpecial ? 'text-emerald-400' : 'text-slate-200'} leading-tight`}>{t.label && !isSpecial ? `${t.label}. ` : ''}{t.name}</h4>
        </div>
        <div className="flex gap-1">
          <button onClick={() => updateScore(t.id, -1)} className="w-9 h-9 bg-slate-800 text-white rounded-lg active:scale-90 shadow-sm">-</button>
          <button onClick={() => updateScore(t.id, 1)} className="w-9 h-9 bg-slate-800 text-white rounded-lg active:scale-90 shadow-sm">+</button>
        </div>
      </div>
    );
  };

  // --- SCREEN RENDERING ---
  if (screen === 'intro') return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-emerald-400 p-3 rounded-xl text-black shadow-lg"><Car size={32} /></div>
          <h1 className="text-3xl font-black text-white">DriveTab <span className="text-emerald-400">Pro</span></h1>
        </div>
        <div className="space-y-3 mb-8 text-xs font-medium text-slate-400 uppercase tracking-widest">
          <div className="space-y-1"><label>Kandydat</label><input className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div className="space-y-1"><label>Nr PKK</label><input className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500" value={formData.pkk} onChange={e => setFormData({...formData, pkk: e.target.value})} /></div>
          <div className="space-y-1"><label>PESEL</label><input className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500" value={formData.pesel} onChange={e => setFormData({...formData, pesel: e.target.value})} /></div>
          <div className="space-y-1">
            <label>Tryb</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none" value={formData.includeHp ? 'hp' : 'no_hp'} onChange={e => setFormData({...formData, includeHp: e.target.value === 'hp'})}>
              <option value="hp">Tryb Urzędowy (z HP)</option>
              <option value="no_hp">Skrócony (bez HP)</option>
            </select>
          </div>
        </div>
        <button onClick={() => { performDraw(); setHpState(p => ({...p, isPlaying: formData.includeHp})); setScreen(formData.includeHp ? 'hp' : 'yard'); }} className="w-full bg-emerald-400 text-black font-black p-5 rounded-2xl active:scale-95 shadow-xl uppercase">Rozpocznij</button>
      </div>
    </div>
  );

  if (screen === 'hp') return (
    <div className="flex flex-col min-h-screen bg-black items-center justify-center cursor-pointer" onClick={() => setHpState(p => ({...p, currentHits: [...p.currentHits, {pts: 5}]}))}>
      <div className="text-white/10 text-9xl font-black italic uppercase">Wideo {hpState.currentIndex+1}</div>
      <div className="text-emerald-500 font-mono mt-4 uppercase">Klip Egzaminacyjny... {hpState.videoTime.toFixed(1)}s</div>
      <div className="absolute bottom-10 text-white/40 text-[10px] uppercase tracking-widest animate-pulse">Kliknij w ekran po wykryciu zagrożenia</div>
    </div>
  );

  const yardTasksForDisplay = screen === 'yard' ? [
    { id: drawResult.item1?.id, name: drawResult.item1?.name, label: '1a' },
    { id: drawResult.item2?.id, name: drawResult.item2?.name, label: '1b' },
    ...YARD_TASKS_REMAINING
  ] : ROAD_TASKS_OFFICIAL;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-[10px] font-black ${screen === 'yard' ? 'bg-amber-400' : 'bg-emerald-400'} text-black`}>{screen === 'yard' ? 'PLAC' : 'RUCH'}</span>
          <h2 className="text-white font-bold text-sm truncate max-w-[120px]">{formData.name}</h2>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black ${verdict === 'POZYTYWNY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{verdict}</div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-2 pb-32">
        {yardTasksForDisplay.map(t => renderTaskItem(t))}
      </main>
      <footer className="fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 p-4 flex gap-2">
        <button onClick={() => { if(confirm('Przerwać?')) setScreen('intro'); }} className="px-4 py-4 bg-rose-500/10 text-rose-500 font-bold rounded-xl text-xs uppercase">Reset</button>
        {screen === 'yard' ? (
          <button onClick={() => setScreen('road')} className="flex-1 py-4 bg-emerald-400 text-black font-black rounded-xl text-sm flex items-center justify-center gap-2 uppercase">Do Ruchu <ChevronRight size={18} /></button>
        ) : (
          <div className="flex-1 flex flex-col gap-2">
            <div className="bg-white rounded-xl h-24 relative overflow-hidden">
              <canvas ref={canvasRef} className="w-full h-full cursor-crosshair touch-none" 
                onMouseDown={(e) => { const r = canvasRef.current.getBoundingClientRect(); const ctx = canvasRef.current.getContext('2d'); ctx.beginPath(); ctx.moveTo(e.clientX-r.left, e.clientY-r.top); canvasRef.current.isDrawing = true; }}
                onMouseMove={(e) => { if (!canvasRef.current.isDrawing) return; const r = canvasRef.current.getBoundingClientRect(); const ctx = canvasRef.current.getContext('2d'); ctx.lineTo(e.clientX-r.left, e.clientY-r.top); ctx.strokeStyle='#000'; ctx.lineWidth=2.5; ctx.stroke(); }}
                onMouseUp={() => canvasRef.current.isDrawing = false} 
                onTouchStart={(e) => { const r = canvasRef.current.getBoundingClientRect(); const ctx = canvasRef.current.getContext('2d'); const t = e.touches[0]; ctx.beginPath(); ctx.moveTo(t.clientX-r.left, t.clientY-r.top); canvasRef.current.isDrawing = true; }}
                onTouchMove={(e) => { if (!canvasRef.current.isDrawing) return; const r = canvasRef.current.getBoundingClientRect(); const ctx = canvasRef.current.getContext('2d'); const t = e.touches[0]; ctx.lineTo(t.clientX-r.left, t.clientY-r.top); ctx.strokeStyle='#000'; ctx.lineWidth=2.5; ctx.stroke(); }}
                onTouchEnd={(e) => { canvasRef.current.isDrawing = false; }}
              />
              <div className="absolute top-2 left-3 text-[7px] text-slate-400 uppercase font-black pointer-events-none tracking-widest">Podpis Egzaminatora</div>
            </div>
            <button onClick={generatePDF} className="w-full py-4 bg-emerald-400 text-black font-black rounded-xl text-sm flex items-center justify-center gap-2 uppercase shadow-lg shadow-emerald-500/20"><Printer size={18} /> Generuj PDF</button>
          </div>
        )}
      </footer>
    </div>
  );
}    fullTitle: 'SECTION 2A: OPERATIONAL RT (ATIS COMPREHENSION)',
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
