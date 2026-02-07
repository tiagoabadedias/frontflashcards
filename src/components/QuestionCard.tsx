import React from 'react';
import { User, Calendar, Star, MessageCircle } from 'lucide-react';
import { Question } from '../types';
import { format } from 'date-fns';

interface QuestionCardProps {
  question: Question;
  onClick?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onClick }) => {
  const getStatusBadge = () => {
    if (question.nota) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Star className="w-3 h-3 mr-1" />
          Avaliada
        </span>
      );
    } else if (question.retornoAluno) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <MessageCircle className="w-3 h-3 mr-1" />
          Respondida
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Aguardando
        </span>
      );
    }
  };

  const getDifficultyColor = () => {
    switch (question.difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Header com status e dificuldade */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getStatusBadge()}
          {question.difficulty && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor()}`}>
              {question.difficulty}
            </span>
          )}
        </div>
        {question.category && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {question.category}
          </span>
        )}
      </div>

      {/* Questão */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
          {question.question}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {question.answer}
        </p>
      </div>

      {/* NOVA seção: Informações do estudante */}
      {(question.name || question.phoneNumber) && (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-4">
          <div className="flex-shrink-0">
            {question.profilePicture ? (
              <img
                src={question.profilePicture}
                alt={question.name || 'Estudante'}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  // Fallback se a imagem não carregar
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center ${question.profilePicture ? 'hidden' : ''}`}>
              <User className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {question.name || 'Estudante não identificado'}
            </p>
            <p className="text-xs text-gray-500">{question.phoneNumber}</p>
            {question.answeredAt && (
              <p className="text-xs text-gray-400">
                Respondida em {format(new Date(question.answeredAt), 'dd/MM/yyyy HH:mm')}
              </p>
            )}
          </div>
          {question.nota && (
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Nota: {question.nota}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Resposta do aluno (se existir) */}
      {question.retornoAluno && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Resposta do aluno:</h4>
          <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded line-clamp-2">
            {question.retornoAluno}
          </p>
        </div>
      )}

      {/* Feedback do professor (se existir) */}
      {question.resposta && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Feedback:</h4>
          <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded line-clamp-2">
            {question.resposta}
          </p>
        </div>
      )}

      {/* Footer com data */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>
            {question.createdAt && format(new Date(question.createdAt), 'dd/MM/yyyy')}
          </span>
        </div>
        {question.return && (
          <span className="text-orange-600 font-medium">
            Marcada para devolução
          </span>
        )}
      </div>
    </div>
  );
};