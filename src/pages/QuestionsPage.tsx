import { useState } from 'react';
import { useQuestions } from '../hooks/useQuestions';
import { QuestionFilters } from '../components/QuestionFilters';
import { QuestionDetailsModal } from '../components/QuestionDetailsModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { QuestionQueryParams, Question } from '../types';

export const QuestionsPage = () => {
  const [filters, setFilters] = useState<QuestionQueryParams>({
    limit: '20',
    offset: '0',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  
  const { data: questionsResponse, isLoading, error } = useQuestions(filters);

  const questions = questionsResponse?.data || [];
  const pagination = questionsResponse?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Questões</h1>
        <p className="mt-2 text-gray-600">
          Gerencie e acompanhe todas as questões e respostas dos estudantes
        </p>
      </div>

      {/* Filtros */}
      <QuestionFilters 
        onFiltersChange={setFilters}
        initialFilters={filters}
      />

      {/* Resultados */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-700">
            {pagination ? (
              <>
                Mostrando <span className="font-medium">{pagination.offset + 1}</span> até{' '}
                <span className="font-medium">
                  {Math.min(pagination.offset + pagination.limit, pagination.total)}
                </span>{' '}
                de <span className="font-medium">{pagination.total}</span> questões
              </>
            ) : (
              'Carregando...'
            )}
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg border">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <Alert
            type="error"
            title="Erro ao carregar questões"
            message="Não foi possível carregar as questões. Tente novamente."
          />
        ) : questions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <div className="text-gray-400 text-lg mb-2">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma questão encontrada
            </h3>
            <p className="text-gray-600">
              Nenhuma questão encontrada com os filtros aplicados.
            </p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trilha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Questão
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nota
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {questions.map((question) => (
                    <tr key={question._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {question.campaign && typeof question.campaign === 'object' ? question.campaign.name : 'N/A'}
                        </div>
                        {question.category && (
                          <div className="text-xs text-gray-500">{question.category}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {question.profilePicture ? (
                            <img
                              src={question.profilePicture}
                              alt={question.name || 'Estudante'}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {question.name ? question.name.charAt(0).toUpperCase() : '?'}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {question.name || 'Não identificado'}
                            </div>
                            <div className="text-xs text-gray-500">{question.phoneNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs line-clamp-2" title={question.question}>
                          {question.question}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {/* {question.difficulty && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {question.difficulty}
                            </span>
                          )} */}
                          {question.return && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Concluída
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {question.nota ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Avaliada
                          </span>
                        ) : question.retornoAluno ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Respondida
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Aguardando
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {question.nota ? (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            parseFloat(question.nota) > 7
                              ? 'bg-green-100 text-green-800'
                              : parseFloat(question.nota) > 5
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {question.nota}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => setSelectedQuestion(question)}
                          className="inline-flex items-center px-3 py-1.5 border border-primary-200 text-xs font-medium rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                          title="Ver detalhes"
                        >
                          Ver detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalhes */}
      {selectedQuestion && (
        <QuestionDetailsModal
          question={selectedQuestion}
          isOpen={true}
          onClose={() => setSelectedQuestion(null)}
        />
      )}
    </div>
  );
};