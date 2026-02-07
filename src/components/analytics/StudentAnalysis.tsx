import React from 'react';

interface StudentSegment {
  count: number;
  percentage: number;
  criteria: string;
  students?: string[];
}

interface StudentPerformer {
  studentId: string;
  name: string;
  phoneNumber: string;
  score: number;
  questionsAnswered: number;
  lastActivity: Date;
}

interface StudentAnalysisProps {
  studentSegments: {
    excellent: StudentSegment;
    good: StudentSegment;
    developing: StudentSegment;
    needsHelp: StudentSegment;
  };
  topPerformers: StudentPerformer[];
  inactive: StudentPerformer[];
}

export const StudentAnalysisSection: React.FC<StudentAnalysisProps> = ({
  studentSegments,
  topPerformers,
  inactive
}) => {
  const renderPerformanceDistribution = () => {
    const segments = [
      { key: 'excellent', data: studentSegments.excellent, emoji: '🌟', label: 'Excelentes (90-100%)', color: 'bg-green-500' },
      { key: 'good', data: studentSegments.good, emoji: '👍', label: 'Bons (70-89%)', color: 'bg-blue-500' },
      { key: 'developing', data: studentSegments.developing, emoji: '📈', label: 'Em Desenvolvimento (50-69%)', color: 'bg-yellow-500' },
      { key: 'needsHelp', data: studentSegments.needsHelp, emoji: '🚨', label: 'Precisam Ajuda (<50%)', color: 'bg-red-500' }
    ];

    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="text-2xl mr-2">📊</span>
          DISTRIBUIÇÃO DE PERFORMANCE
        </h3>
        
        <div className="space-y-4">
          {segments.map((segment) => (
            <div key={segment.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900 flex items-center">
                  <span className="mr-2">{segment.emoji}</span>
                  {segment.label}:
                </span>
                <span className="text-sm text-gray-600">
                  {segment.data.count} estudantes ({Math.round(segment.data.percentage)}%)
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${segment.color}`}
                  style={{ width: `${Math.max(segment.data.percentage, 2)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTopPerformers = () => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="text-2xl mr-2">🏆</span>
        TOP 10 ESTUDANTES MAIS ATIVOS
      </h3>
      
      {topPerformers.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          Nenhum estudante encontrado
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Pos</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Nome</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Questões</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Último Acesso</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.slice(0, 10).map((student, index) => (
                <tr key={student.studentId} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {index < 3 && (
                        <span className="text-lg mr-2">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                      <span className="font-medium text-gray-900">{index + 1}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.phoneNumber}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.score >= 90 ? 'bg-green-100 text-green-800' :
                      student.score >= 70 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {Math.round(student.score)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {student.questionsAnswered}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {new Date(student.lastActivity).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderInactiveStudents = () => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="text-2xl mr-2">😴</span>
        ESTUDANTES INATIVOS (ALERTA)
      </h3>
      
      {inactive.length === 0 ? (
        <div className="text-green-500 text-center py-8 flex items-center justify-center">
          <span className="text-2xl mr-2">✅</span>
          Todos os estudantes estão ativos!
        </div>
      ) : (
        <>
          <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>{inactive.length} estudantes</strong> sem atividade há 3+ dias
                </p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Nome</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Telefone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Último Acesso</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {inactive.slice(0, 10).map((student) => {
                  const daysSinceLastActivity = Math.floor(
                    (new Date().getTime() - new Date(student.lastActivity).getTime()) / (1000 * 3600 * 24)
                  );
                  
                  return (
                    <tr key={student.studentId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {student.phoneNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-sm text-gray-900">
                            {new Date(student.lastActivity).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-xs text-red-600">
                            há {daysSinceLastActivity} dias
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Enviar Lembrete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {renderPerformanceDistribution()}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderTopPerformers()}
        {renderInactiveStudents()}
      </div>
    </div>
  );
};