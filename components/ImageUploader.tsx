
import React, { useRef, useState } from 'react';
import { ImageData } from '../types';

interface ImageUploaderProps {
  onImageSelect: (image: ImageData) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fullDataUri = reader.result as string;
        setPreview(fullDataUri);
        
        // Extraer mimeType y base64 puro
        const matches = fullDataUri.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          onImageSelect({
            mimeType: matches[1],
            data: matches[2]
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div 
        onClick={isLoading ? undefined : triggerUpload}
        className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer h-64 overflow-hidden
          ${isLoading ? 'border-slate-700 bg-slate-900/50 cursor-not-allowed' : 'border-indigo-500/30 bg-slate-900 hover:bg-slate-800 hover:border-indigo-500/50'}`}
      >
        {preview ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={preview} alt="Vista previa del gráfico" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
            <div className="relative z-10 text-center">
              <i className="fa-solid fa-image text-3xl text-indigo-400 mb-2"></i>
              <p className="text-sm font-medium">Cambiar Imagen del Gráfico</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-cloud-arrow-up text-2xl text-indigo-400"></i>
            </div>
            <h3 className="text-lg font-semibold mb-1">Subir Gráfico de Mercado</h3>
            <p className="text-slate-400 text-sm max-w-xs">
              Sube una captura de tu gráfico (TradingView, MT4, etc.) para un Análisis Wyckoff con IA.
            </p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-indigo-400 font-medium animate-pulse">Consultando al Hombre Compuesto...</p>
            <p className="text-xs text-slate-400 mt-2">Analizando Volumen y Spread de Precio</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
