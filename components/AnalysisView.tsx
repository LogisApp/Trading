
import React, { useState } from 'react';
import { WyckoffAnalysis, ImageData } from '../types';
import { generateVisualEntries } from '../services/geminiService';

interface AnalysisViewProps {
  analysis: WyckoffAnalysis;
  originalImage: ImageData;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis, originalImage }) => {
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
  const [visualError, setVisualError] = useState<string | null>(null);

  const handleGenerateVisual = async () => {
    setIsGeneratingVisual(true);
    setVisualError(null);
    try {
      const result = await generateVisualEntries(originalImage, analysis);
      setAnnotatedImage(result);
    } catch (err) {
      console.error(err);
      setVisualError("Error al generar el mapa visual de entradas.");
    } finally {
      setIsGeneratingVisual(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Análisis Principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Resumen de Detección
                </span>
                <h2 className="text-2xl font-bold">{analysis.phase}</h2>
                <p className="text-slate-400 mt-1">{analysis.context}</p>
              </div>
              {analysis.isSpringOrUpthrust && (
                <div className="bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl border border-amber-500/20 flex items-center gap-2">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span className="font-bold text-sm">TRAMPA DETECTADA</span>
                </div>
              )}
            </div>

            <p className="text-slate-300 leading-relaxed mb-6">
              {analysis.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Esfuerzo vs Resultado</h4>
                <p className="text-sm">{analysis.laws.effortResult}</p>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Causa vs Efecto</h4>
                <p className="text-sm">{analysis.laws.causeEffect}</p>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Oferta vs Demanda</h4>
                <p className="text-sm">{analysis.laws.supplyDemand}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <i className="fa-solid fa-list-check text-indigo-400"></i>
              Detecciones Clave
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.detections.map((detection, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-950/30 p-3 rounded-lg border border-slate-800/50">
                  <i className="fa-solid fa-circle-check text-emerald-500 mt-1 text-xs"></i>
                  <span className="text-sm text-slate-300">{detection}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Barra Lateral de Acción y Emoción */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl -mr-10 -mt-10" />
            <h3 className="text-lg font-bold mb-4">Acciones Recomendadas</h3>
            
            <div className="space-y-4 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
                  <i className="fa-solid fa-bolt"></i>
                  Agresiva
                </div>
                <p className="text-sm bg-rose-500/5 p-3 rounded-xl border border-rose-500/10 text-slate-300">
                  {analysis.recommendations.aggressive}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase">
                  <i className="fa-solid fa-shield-halved"></i>
                  Conservadora
                </div>
                <p className="text-sm bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10 text-slate-300">
                  {analysis.recommendations.conservative}
                </p>
              </div>

              <button 
                onClick={handleGenerateVisual}
                disabled={isGeneratingVisual}
                className={`w-full mt-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/10
                  ${isGeneratingVisual 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98]'}`}
              >
                {isGeneratingVisual ? (
                  <>
                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                    Dibujando Entradas...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    Generar Plano de Entradas
                  </>
                )}
              </button>
              {visualError && <p className="text-xs text-rose-400 text-center mt-2">{visualError}</p>}
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-widest">Psicología del Mercado</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-2xl">
                <i className={`fa-solid ${analysis.emotionalState.toLowerCase().includes('pánico') || analysis.emotionalState.toLowerCase().includes('miedo') || analysis.emotionalState.toLowerCase().includes('panic') || analysis.emotionalState.toLowerCase().includes('fear') ? 'fa-face-frown-open text-rose-400' : 'fa-face-smile text-emerald-400'}`}></i>
              </div>
              <div>
                <h4 className="font-bold text-lg">{analysis.emotionalState}</h4>
                <p className="text-xs text-slate-500 italic">"La mentalidad profesional es opuesta a la de la masa."</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección del Mapa Visual de Entradas */}
      {(annotatedImage || isGeneratingVisual) && (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4 animate-in slide-in-from-bottom duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <i className="fa-solid fa-map-location-dot text-indigo-400"></i>
              Mapa Visual de Ejecución
            </h3>
            <span className="text-xs text-slate-500">Basado en Acción del Precio + Volumen</span>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video flex items-center justify-center">
            {isGeneratingVisual ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-24 h-24">
                   <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                     <i className="fa-solid fa-crosshairs text-indigo-500 text-2xl animate-pulse"></i>
                   </div>
                </div>
                <div className="text-center">
                  <p className="text-indigo-400 font-bold tracking-widest uppercase text-sm">Escaneando Puntos de Giro</p>
                  <p className="text-xs text-slate-500 mt-1">Localizando huellas del Hombre Compuesto...</p>
                </div>
              </div>
            ) : (
              <img 
                src={`data:${originalImage.mimeType};base64,${annotatedImage}`} 
                alt="Plano Visual Wyckoff" 
                className="w-full h-full object-contain"
              />
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 text-xs text-slate-400 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>Verde: Entrada Agresiva</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
              <span>Cian: Entrada Conservadora (Confirmación)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-rose-500"></div>
              <span>Rojo: Stop Loss (Invalidación)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;
