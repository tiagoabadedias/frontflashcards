import React, { useState } from 'react';
import { X, Hash, AlertCircle, Play, Pause } from 'lucide-react';
import { Question } from '../types';

interface QuestionDetailsModalProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
}

const AudioPlayer = ({ url }: { url: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="mt-3 flex items-center gap-3 bg-white p-2 rounded-lg border border-blue-100 w-fit shadow-sm">
      <audio 
        ref={audioRef} 
        src={url} 
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
      <button
        onClick={togglePlay}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        title={isPlaying ? "Pausar" : "Ouvir resposta"}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>
      <span className="text-xs font-medium text-gray-600">
        {isPlaying ? 'Reproduzindo...' : 'Ouvir resposta em áudio'}
      </span>
    </div>
  );
};

export const QuestionDetailsModal: React.FC<QuestionDetailsModalProps> = ({
  question,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !question) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Detalhes da Questão</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Questão */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Questão
            </h3>
            <p className="text-gray-900 text-lg leading-relaxed">{question.question}</p>
          </div>

          {/* Badges */}
          <div className="flex items-center flex-wrap gap-2">
            {/* {question.difficulty && (
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  question.difficulty === 'easy'
                    ? 'bg-green-100 text-green-800'
                    : question.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Médio' : 'Difícil'}
              </span>
            )} */}
            {/* {question.type && (
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {question.type.replace('_', ' ')}
              </span>
            )} */}
            {/* {question.category && (
              <span className="flex items-center px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                <Book className="w-3 h-3 mr-1" />
                {question.category}
              </span>
            )} */}
          </div>

          {/* Opções (se houver) */}
          {question.options && question.options.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Opções
              </h3>
              <ul className="space-y-2">
                {question.options.map((option, index) => (
                  <li
                    key={index}
                    className="bg-gray-50 px-4 py-3 rounded-lg text-gray-700 flex items-start"
                  >
                    <span className="font-semibold mr-2 text-gray-500">
                      {String.fromCharCode(65 + index)})
                    </span>
                    <span>{option}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resposta Correta */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Resposta Correta
            </h3>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-gray-900 leading-relaxed">{question.answer}</p>
            </div>
          </div>

          {/* Resposta do Aluno */}
          {question.retornoAluno && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Resposta do Aluno
              </h3>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-gray-900 leading-relaxed">{question.retornoAluno}</p>
                {question.urlAudioAluno && (
                  <AudioPlayer url={question.urlAudioAluno} />
                )}
              </div>
            </div>
          )}

          {/* Nota */}
          {question.nota && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Nota
              </h3>
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-bold ${
                    parseFloat(question.nota) > 7
                      ? 'bg-green-100 text-green-800'
                      : parseFloat(question.nota) > 5
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {question.nota}
                </span>
              </div>
            </div>
          )}

          {/* Feedback do Professor */}
          {question.resposta && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Feedback do Professor
              </h3>
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                <p className="text-gray-900 leading-relaxed">{question.resposta}</p>
              </div>
            </div>
          )}

          {/* Explicação */}
          {question.explanation && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Explicação
              </h3>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-gray-900 leading-relaxed">{question.explanation}</p>
              </div>
            </div>
          )}

          {/* Tags e Metadados */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                {question.phoneNumber && (
                  <span className="flex items-center">
                    <Hash className="w-4 h-4 mr-1" />
                    Aluno: {question.phoneNumber}
                  </span>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
