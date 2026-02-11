import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface QuestionQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  isLoading: boolean;
}

export const QuestionQuantityModal: React.FC<QuestionQuantityModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading
}) => {
  const [quantity, setQuantity] = useState(3);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(quantity);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60] animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-lg font-bold text-gray-900">Gerar com IA</h3>
            </div>
            {!isLoading && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-6">
            Quantas perguntas você deseja que a inteligência artificial gere para esta trilha?
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade de Questões
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  disabled={isLoading}
                />
                <span className="w-8 text-center font-bold text-indigo-600 border border-indigo-100 bg-indigo-50 rounded-md py-1">
                  {quantity}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {isLoading && (
          <div className="bg-indigo-50 px-6 py-3 border-t border-indigo-100">
            <p className="text-xs text-indigo-700 text-center animate-pulse">
              Isso pode levar alguns segundos. A IA está analisando o conteúdo...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
