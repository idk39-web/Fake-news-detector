import React, { useState, useEffect } from 'react';
import { 
  Key, 
  X, 
  Check, 
  AlertCircle, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Sparkles, 
  RefreshCw 
} from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeyUpdated }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [maskedServerKey, setMaskedServerKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Fetch current key status on modal open
  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('user_gemini_api_key') || '';
      setApiKey(storedKey);

      fetch('/api/key')
        .then((res) => res.json())
        .then((data) => {
          if (data.maskedKey) {
            setMaskedServerKey(data.maskedKey);
            if (!storedKey && data.isCustom) {
              // Show that default key is already active
            }
          }
        })
        .catch((err) => console.error('Failed to get key status:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveKey = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!apiKey.trim()) {
      setStatusMessage({ text: 'Por favor introduce una clave API válida.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al actualizar la clave API.');
      }

      localStorage.setItem('user_gemini_api_key', apiKey.trim());
      setMaskedServerKey(data.maskedKey);
      setStatusMessage({
        text: '¡Clave API guardada y configurada exitosamente!',
        type: 'success',
      });
      if (onKeyUpdated) onKeyUpdated();
    } catch (err: any) {
      setStatusMessage({ text: err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestKey = async () => {
    const keyToTest = apiKey.trim() || undefined;
    setIsTesting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: keyToTest }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'La clave API no es válida para llamar al modelo.');
      }

      setStatusMessage({
        text: '¡Conexión exitosa! La clave API está activa y responde correctamente.',
        type: 'success',
      });
    } catch (err: any) {
      setStatusMessage({
        text: `Fallo al probar la clave: ${err.message}`,
        type: 'error',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 z-10 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Configuración de Llave API</h3>
              <p className="text-xs text-slate-500">Administra o cambia tu clave de Gemini AI</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status pill */}
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Clave activa en el servidor:</span>
          <span className="font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-800 font-bold">
            {maskedServerKey || 'No configurada'}
          </span>
        </div>

        <form onSubmit={handleSaveKey} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="api-key-input" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Tu Clave API (Gemini)
              </label>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                Obtener nueva clave <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                id="api-key-input"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Pega aquí tu clave API de Gemini"
                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title={showKey ? 'Ocultar' : 'Mostrar'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              La clave que proporcionaste se encuentra guardada y activa en el servidor. Puedes probar la conexión o actualizarla en cualquier momento.
            </p>
          </div>

          {/* Feedback message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{statusMessage.text}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={isTesting}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-500" />
                  <span>Probando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Probar Conexión</span>
                </>
              )}
            </button>

            <button
              type="submit"
              disabled={isLoading || !apiKey.trim()}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              {isLoading ? (
                <span>Guardando...</span>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar y Aplicar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
