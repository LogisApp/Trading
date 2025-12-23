
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewChange('analizador')}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <i className="fa-solid fa-microscope text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Wyckoff Lens AI
              </h1>
              <p className="text-xs text-indigo-400 font-medium tracking-wider uppercase">Detector de Huella Institucional</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-6">
            <button 
              onClick={() => onViewChange('analizador')}
              className={`text-sm font-medium transition-colors ${activeView === 'analizador' ? 'text-indigo-400 border-b-2 border-indigo-400 pb-1' : 'text-slate-400 hover:text-white'}`}
            >
              Analizador
            </button>
            <button 
              onClick={() => onViewChange('señales-pro')}
              className={`text-sm font-medium transition-colors flex items-center gap-2 ${activeView === 'señales-pro' ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : 'text-slate-400 hover:text-white'}`}
            >
              <i className="fa-solid fa-crown text-xs"></i>
              Señales Pro
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">
        {children}
      </main>
      <footer className="bg-slate-950 border-t border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Wyckoff Lens AI. Análisis de Contexto Profesional.
          </p>
          <p className="text-xs text-slate-600 mt-2 italic">
            Aviso legal: El trading implica riesgos. Wyckoff Lens proporciona análisis basados en lógica, no asesoramiento financiero.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
