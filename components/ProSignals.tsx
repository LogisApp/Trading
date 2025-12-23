
import React, { useState } from 'react';
import { investigatePair } from '../services/geminiService';
import { InvestigationResult } from '../types';

const ProSignals: React.FC = () => {
  const [searchPair, setSearchPair] = useState('');
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [investigationResults, setInvestigationResults] = useState<InvestigationResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleInvestigate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const pair = searchPair.trim();
    if (!pair) return;

    setIsInvestigating(true);
    setError(null);
    try {
      const result = await investigatePair(pair);
      setInvestigationResults(prev => [result, ...prev]);
      setSearchPair('');
    } catch (err) {
      console.error(err);
      setError("Error al investigar el par. Intente con otro activo.");
    } finally {
      setIsInvestigating(false);
    }
  };

  const popularPairs = ['BTC/USD', 'ETH/USD', 'EUR/USD', 'GOLD', 'NASDAQ', 'TESLA'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Encabezado */}
      <div className="bg-gradient-to-br from-amber-500/10 to-indigo-500/10 border border-amber-500/20 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <i className="fa-solid fa-crown text-amber-500/20 text-8xl -mr-8 -mt-8"></i>
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2">Panel de Señales <span className="text-amber-500">PRO</span></h2>
          <p className="text-slate-400 max-w-2xl mb-6">
            Investigación en tiempo real utilizando inteligencia de búsqueda profunda. 
            Escribe un par o activo para detectar huellas institucionales actuales.
          </p>

          <form onSubmit={handleInvestigate} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input 
                type="text" 
                value={searchPair}
                onChange={(e) => setSearchPair(e.target.value)}
                placeholder="Ej: BTC/USD, AAPL, Oro..."
                className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500 transition-all"
                disabled={isInvestigating}
              />
            </div>
            <button 
              type="submit"
              disabled={isInvestigating || !searchPair.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold px-8 py-3 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              {isInvestigating ? (
                <>
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                  Investigando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-satellite-dish"></i>
                  Escanear
                </>
              )}
            </button>
          </form>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {popularPairs.map(p => (
              <button 
                key={p} 
                onClick={() => {setSearchPair(p); handleInvestigate();}}
                disabled={isInvestigating}
                className="text-xs bg-slate-800/50 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white px-3 py-1.5 rounded-full transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-center text-sm font-medium">
          {error}
        </div>
      )}

      {/* Lista de Resultados de Investigación */}
      <div className="space-y-6">
        {investigationResults.length === 0 && !isInvestigating ? (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 p-12 rounded-3xl text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
              <i className="fa-solid fa-magnifying-glass-chart text-2xl"></i>
            </div>
            <h4 className="text-slate-400 font-medium">No hay investigaciones activas</h4>
            <p className="text-xs text-slate-600 mt-2">Usa el buscador para iniciar un escaneo profundo de activos específicos.</p>
          </div>
        ) : (
          investigationResults.map((res, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 animate-in slide-in-from-top-4 duration-500 group">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-amber-500">{res.pair}</h3>
                    <span className="text-xs font-bold px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg uppercase tracking-widest border border-indigo-500/20">Análisis Pro</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Escaneado a las {res.timestamp}</p>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-xs text-emerald-500 font-bold uppercase tracking-tighter">Live Intelligence</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none mb-8">
                <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800/50 text-slate-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                  {res.analysis}
                </div>
              </div>

              {res.sources.length > 0 && (
                <div className="border-t border-slate-800 pt-6">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Fuentes Consultadas (Grounding):</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {res.sources.map((source, idx) => (
                      <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-slate-800/30 hover:bg-slate-800 border border-slate-800 rounded-xl p-3 transition-all group/source"
                      >
                        <i className="fa-solid fa-link text-indigo-400 text-xs"></i>
                        <span className="text-xs text-slate-400 group-hover/source:text-white transition-colors truncate">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {isInvestigating && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center animate-pulse">
            <div className="flex flex-col items-center gap-4">
               <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-amber-500 font-bold tracking-widest uppercase">Escaneando Mercados...</p>
               <p className="text-xs text-slate-500">Buscando huellas institucionales recientes de {searchPair || 'activo'}</p>
            </div>
          </div>
        )}
      </div>

      <div className="text-center pb-8">
        <p className="text-xs text-slate-600 flex items-center justify-center gap-2">
          <i className="fa-solid fa-lock text-amber-500/50"></i>
          Algoritmo de detección avanzado basado en lógica Wyckoff y análisis de sentimiento de noticias globales.
        </p>
      </div>
    </div>
  );
};

export default ProSignals;
