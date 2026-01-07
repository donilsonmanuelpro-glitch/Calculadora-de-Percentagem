
import React, { useState, useMemo } from 'react';
import { CalculatorCard } from './components/CalculatorCard';
import { CalculationMode, InsightResponse } from './types';
import { getMathInsight } from './services/geminiService';

const App: React.FC = () => {
  // Mode 1: x% of y
  const [val1A, setVal1A] = useState('10');
  const [val1B, setVal1B] = useState('100');

  // Mode 2: y + x%
  const [val2A, setVal2A] = useState('100');
  const [val2B, setVal2B] = useState('10');

  // Mode 3: y - x%
  const [val3A, setVal3A] = useState('100');
  const [val3B, setVal3B] = useState('15');

  // UI State
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // AI Insights
  const [insight, setInsight] = useState<InsightResponse | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [activeInsightMode, setActiveInsightMode] = useState<CalculationMode | null>(null);

  const format = (n: number) => {
    return Number.isInteger(n) ? n.toString() : n.toFixed(2).replace(/\.?0+$/, "");
  };

  // Results calculation
  const res1 = useMemo(() => {
    const p = parseFloat(val1A) || 0;
    const v = parseFloat(val1B) || 0;
    return (p / 100) * v;
  }, [val1A, val1B]);

  const fullText1 = useMemo(() => {
    return `${val1A || 0} porcento de ${val1B || 0} é igual a ${format(res1)}`;
  }, [val1A, val1B, res1]);

  const res2 = useMemo(() => {
    const v = parseFloat(val2A) || 0;
    const p = parseFloat(val2B) || 0;
    return v + (v * p / 100);
  }, [val2A, val2B]);

  const fullText2 = useMemo(() => {
    return `${val2A || 0} mais ${val2B || 0} porcento é igual a ${format(res2)}`;
  }, [val2A, val2B, res2]);

  const res3 = useMemo(() => {
    const v = parseFloat(val3A) || 0;
    const p = parseFloat(val3B) || 0;
    return v - (v * p / 100);
  }, [val3A, val3B]);

  const fullText3 = useMemo(() => {
    return `${val3A || 0} menos ${val3B || 0} porcento é igual a ${format(res3)}`;
  }, [val3A, val3B, res3]);

  const fetchInsight = async (mode: CalculationMode) => {
    setLoadingInsight(true);
    setActiveInsightMode(mode);
    
    let v1, v2, res;
    if (mode === CalculationMode.PERCENT_OF) { v1 = parseFloat(val1A); v2 = parseFloat(val1B); res = res1; }
    else if (mode === CalculationMode.ADD_PERCENT) { v1 = parseFloat(val2B); v2 = parseFloat(val2A); res = res2; }
    else { v1 = parseFloat(val3B); v2 = parseFloat(val3A); res = res3; }

    const data = await getMathInsight(mode, v1, v2, res);
    setInsight(data);
    setLoadingInsight(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Percentagem</h1>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none">Calculadora Inteligente</p>
            </div>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <button className="text-indigo-600 font-bold">Simples</button>
            <button 
              onClick={() => setIsAboutOpen(true)}
              className="hover:text-indigo-600 transition-colors"
            >
              Sobre
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Cálculos de Percentagem</h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Uma ferramenta completa para resolver qualquer problema matemático envolvendo percentagens de forma rápida e precisa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: x% of y */}
          <div className="flex flex-col gap-4">
            <CalculatorCard 
              title="Calcule a Percentagem de um Valor"
              description="Cálculo básico para descobrir uma parte de um valor total."
              val1Label="Qual Percentagem que Deseja Calcular?"
              val1Value={val1A}
              val1Suffix="%"
              onVal1Change={setVal1A}
              val2Label="Qual é o Valor?"
              val2Value={val1B}
              onVal2Change={setVal1B}
              result={format(res1)}
              fullText={fullText1}
              accentColor="indigo"
            />
            <button 
              onClick={() => fetchInsight(CalculationMode.PERCENT_OF)}
              className="self-end text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 uppercase tracking-tighter"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg>
              Explicar com IA
            </button>
          </div>

          {/* Card 2: y + x% */}
          <div className="flex flex-col gap-4">
            <CalculatorCard 
              title="Calcule o Valor + Percentagem (%)"
              description="Ideal para calcular aumentos salariais ou taxas sobre um valor."
              val1Label="Qual Valor Deseja Calcular?"
              val1Value={val2A}
              onVal1Change={setVal2A}
              val2Label="Quantas Percentagens Deseja Aumentar?"
              val2Value={val2B}
              val2Suffix="%"
              onVal2Change={setVal2B}
              result={format(res2)}
              fullText={fullText2}
              accentColor="emerald"
            />
            <button 
              onClick={() => fetchInsight(CalculationMode.ADD_PERCENT)}
              className="self-end text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 uppercase tracking-tighter"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg>
              Explicar com IA
            </button>
          </div>

          {/* Card 3: y - x% */}
          <div className="flex flex-col gap-4">
            <CalculatorCard 
              title="Calcule o Valor - Percentagem (%)"
              description="Perfeito para calcular descontos em compras e promoções."
              val1Label="Qual Valor Deseja Calcular?"
              val1Value={val3A}
              onVal1Change={setVal3A}
              val2Label="Quantas Percentagens Deseja Diminuir?"
              val2Value={val3B}
              val2Suffix="%"
              onVal2Change={setVal3B}
              result={format(res3)}
              fullText={fullText3}
              accentColor="rose"
            />
            <button 
              onClick={() => fetchInsight(CalculationMode.SUBTRACT_PERCENT)}
              className="self-end text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 uppercase tracking-tighter"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg>
              Explicar com IA
            </button>
          </div>

          {/* Card 4 (Bonus Tip) */}
          <div className="bg-indigo-900 rounded-3xl p-8 text-white flex flex-col justify-between shadow-2xl shadow-indigo-200">
            <div>
              <div className="bg-indigo-500/30 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Dica de Ouro</h3>
              <p className="text-indigo-100/80 leading-relaxed mb-6">
                Sabia que as percentagens são reversíveis? <br/>
                <strong>8% de 50 é o mesmo que 50% de 8.</strong> <br/>
                Ambos resultam em 4. Às vezes, inverter os números torna o cálculo mental muito mais simples!
              </p>
            </div>
            <div className="p-4 bg-indigo-800/50 rounded-2xl border border-indigo-700/50">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-sm font-medium text-indigo-200">Pronto para o próximo cálculo.</span>
               </div>
            </div>
          </div>
        </div>

        {/* AI Insight Section */}
        {(loadingInsight || insight) && (
          <div className="mt-12 bg-white rounded-3xl p-8 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
                <h3 className="text-lg font-bold text-slate-800">Explicação do Assistente</h3>
              </div>
              <button onClick={() => setInsight(null)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {loadingInsight ? (
              <div className="space-y-4">
                <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse"></div>
              </div>
            ) : insight && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-bold text-indigo-600 uppercase mb-2">A Lógica</h4>
                  <p className="text-slate-600 leading-relaxed">{insight.explanation}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Exemplo Real</h4>
                  <p className="text-slate-700 font-medium italic">"{insight.realWorldExample}"</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* About Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsAboutOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Sobre o Autor</h2>
              <button 
                onClick={() => setIsAboutOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-indigo-600 uppercase">Nome</label>
                <p className="text-lg font-semibold text-slate-800">Donilson Bernardo Bumba Manuel</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-indigo-600 uppercase">WhatsApp</label>
                  <a href="https://wa.me/244931191045" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
                    931191045
                  </a>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-indigo-600 uppercase">País</label>
                  <p className="text-slate-700 font-medium">Angola 🇦🇴</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 border-t border-slate-100 pt-6">
                <label className="text-xs font-bold text-indigo-600 uppercase">Data de Criação</label>
                <p className="text-slate-500">22 de Fevereiro de 2025</p>
              </div>

              <button 
                onClick={() => setIsAboutOpen(false)}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 mt-24 pb-12 border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
        <p>© 2025 Donilson Manuel. Todos os direitos reservados.</p>
        <div className="flex gap-6">
          <button onClick={() => setIsAboutOpen(true)} className="hover:text-slate-600">Informações do Autor</button>
          <a href="#" className="hover:text-slate-600">Política de Privacidade</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
