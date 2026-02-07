import React from 'react';

interface QuestionAnalysisProps {
  topDifficult: Array<{
    questionId: string;
    text: string;
    category: string;
    difficulty: string;
    successRate: number;
    totalAttempts: number;
    avgTime: string;
  }>;
  topEasy: Array<{
    questionId: string;
    text: string;
    category: string;
    difficulty: string;
    successRate: number;
    totalAttempts: number;
    avgTime: string;
  }>;
  byCategory: Array<{
    category: string;
    totalQuestions: number;
    avgScore: number;
    avgTime: string;
    completionRate: number;
  }>;
  campaignQuestions?: Array<{
    questionId: string;
    text: string;
    category: string;
    difficulty: string;
    successRate: number;
    totalAttempts: number;
    avgTime: string;
    responses: number;
    avgScore: number;
  }>;
}

export const QuestionAnalysisSection: React.FC<QuestionAnalysisProps> = ({
  topDifficult,
  topEasy,
  byCategory,
  campaignQuestions = []
}) => {
  const renderAllQuestionsTable = () => {
    // Combina questões difíceis e fáceis em uma única lista
    const allQuestions = [...topDifficult, ...topEasy];
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="text-2xl mr-2">❓</span>
          Questões
        </h3>
        
        {allQuestions.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            Nenhuma questão encontrada
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">#</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Questão</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Acertos</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Categoria</th>
                </tr>
              </thead>
              <tbody>
                {allQuestions.slice(0, 20).map((question, index) => (
                  <tr key={question.questionId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      <div className="max-w-md">
                        <p className="truncate" title={question.text}>
                          {question.text}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        question.successRate >= 80 ? 'bg-green-100 text-green-800' :
                        question.successRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        question.successRate >= 40 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {Math.round(question.successRate)}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {question.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderCategoryAnalysis = () => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="text-2xl mr-2">📚</span>
        PERFORMANCE POR MATÉRIA
      </h3>
      
      {byCategory.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          Nenhuma categoria encontrada
        </div>
      ) : (
        <div className="space-y-4">
          {byCategory.map((category) => {
            const percentage = category.avgScore;
            const width = Math.max(percentage, 5); // Mínimo de 5% para visualização
            
            return (
              <div key={category.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">
                    {category.category}:
                  </span>
                  <span className="text-sm text-gray-600">
                    {Math.round(percentage)}% ({category.totalQuestions} questões)
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      percentage >= 80 ? 'bg-green-500' :
                      percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderCampaignQuestions = () => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="text-2xl mr-2">📋</span>
        QUESTÕES DA CAMPANHA
      </h3>
      
      {campaignQuestions.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          Nenhuma questão cadastrada na campanha
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Questão</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Respostas</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Taxa de Sucesso</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Nota Média</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {campaignQuestions.map((question) => (
                <tr key={question.questionId} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">
                      {question.text.length > 60 ? `${question.text.substring(0, 60)}...` : question.text}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      question.responses > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {question.responses}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        question.successRate >= 80 ? 'bg-green-100 text-green-800' :
                        question.successRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        question.successRate >= 40 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {question.responses > 0 ? `${Math.round(question.successRate)}%` : 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900">
                      {question.responses > 0 ? `${question.avgScore.toFixed(1)}/10` : 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {question.responses === 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        📝 Não respondida
                      </span>
                    ) : question.successRate >= 80 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Bem dominada
                      </span>
                    ) : question.successRate < 50 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        🔥 Precisa atenção
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        📊 Moderada
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {renderCampaignQuestions()}
      
      {renderAllQuestionsTable()}
      
      {renderCategoryAnalysis()}
    </div>
  );
};