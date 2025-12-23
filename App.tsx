
import React, { useState } from 'react';
import Layout from './components/Layout';
import ImageUploader from './components/ImageUploader';
import AnalysisView from './components/AnalysisView';
import ChatInterface from './components/ChatInterface';
import ProSignals from './components/ProSignals';
import { analyzeChart } from './services/geminiService';
import { WyckoffAnalysis } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('analizador');
  const [analysis, setAnalysis] = useState<WyckoffAnalysis | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = async (base64: string) => {
    setIsLoading(true);
    setError(null);
    setOriginalImage(base64);
    try {
      const result = await analyzeChart(base64);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError("Error al analizar el gráfico. Asegúrate de que tu clave API sea válida y la imagen sea clara.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      <div className="space-y-8 pb-20">
        {activeView === 'analizador' ? (
          <>
            {/* Sección de Bienvenida */}
            <section className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Lee la Cinta del Mercado <br />
                <span className="text-indigo-500 italic">Como un Banco Profesional.</span>
              </h2>
              <p className="text-slate-400 md:text-lg">
                Sube tus gráficos para detectar las huellas del "Hombre Compuesto". Nuestra IA analiza el Volumen, la Acción del Precio y la Lógica utilizando la probada Metodología Wyckoff.
              </p>
            </section>

            {/* Sección de Acción */}
            <div className="grid grid-cols-1 gap-8">
              <ImageUploader onImageSelect={handleImageSelect} isLoading={isLoading} />
              
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-center text-sm font-medium animate-bounce">
                  <i className="fa-solid fa-circle-exclamation mr-2"></i>
                  {error}
                </div>
              )}

              {analysis && originalImage && !isLoading && (
                <div className="space-y-8 pt-4">
                  <AnalysisView analysis={analysis} originalImageBase64={originalImage} />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
                        <h3 className="text-xl font-bold mb-4">Manual de Metodología</h3>
                        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                          <p>
                            El <span className="text-indigo-400 font-bold">Método Wyckoff</span> es una técnica lógica de análisis de mercado que identifica cómo las grandes instituciones ("Dinero Inteligente") acumulan o distribuyen activos antes de los grandes movimientos de precios.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                              <h4 className="text-indigo-400 font-bold mb-1">Acumulación</h4>
                              <p className="text-xs text-slate-500">Los profesionales están comprando a los minoristas presos del pánico. Espera "Springs" y "Tests" exitosos antes de la tendencia alcista.</p>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                              <h4 className="text-rose-400 font-bold mb-1">Distribución</h4>
                              <p className="text-xs text-slate-500">Los profesionales están saliendo de posiciones para vender a minoristas codiciosos. Busca "Upthrusts" y volumen alto sin avance de precio.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-1">
                      <ChatInterface currentAnalysis={analysis} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tarjetas de Información */}
            {!analysis && !isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                {[
                  {
                    icon: 'fa-magnifying-glass-chart',
                    title: 'Escáner de Fases',
                    desc: 'Identifica si te encuentras en la Fase A, B, C, D o E del ciclo.'
                  },
                  {
                    icon: 'fa-shield-heart',
                    title: 'Detección de Trampas',
                    desc: 'Detecta Springs y Upthrusts que atrapan a los traders minoristas emocionales.'
                  },
                  {
                    icon: 'fa-chart-line',
                    title: 'IA Esfuerzo/Resultado',
                    desc: 'Calcula si el Volumen confirma el movimiento del precio o señala Agotamiento.'
                  }
                ].map((feature, idx) => (
                  <div key={idx} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors text-center group">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-all">
                      <i className={`fa-solid ${feature.icon} text-xl`}></i>
                    </div>
                    <h4 className="font-bold mb-2">{feature.title}</h4>
                    <p className="text-sm text-slate-500">{feature.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <ProSignals />
        )}
      </div>
    </Layout>
  );
};

export default App;
