import { useQuery } from '@tanstack/react-query';
import { studentService } from '../../services/studentService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { Users, Search, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export const StudentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: students, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentService.getAll(),
  });

  const filteredStudents = students?.filter(student => 
    student.phoneNumber.includes(searchTerm) || 
    (student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  console.log('Students fetched:', students);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        title="Erro ao carregar alunos"
        message="Não foi possível carregar a lista de alunos. Tente novamente."
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Alunos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie e analise o desempenho dos seus alunos
          </p>
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10 w-full"
              placeholder="Buscar por telefone ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500">
            Total: <span className="font-semibold text-gray-900">{filteredStudents?.length || 0}</span> alunos
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aluno
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trilhas
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interações
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Atividade
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p>Nenhum aluno encontrado.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents?.map((student) => (
                  <tr key={student.phoneNumber} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                          
                          {student.name ? student.name.charAt(0).toUpperCase() : <Users className="h-5 w-5" />}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name || 'Desconhecido'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 w-fit">
                          {student.totalCampaigns} participações
                        </span>
                        {student.campaigns && student.campaigns.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {student.campaigns.slice(0, 3).map((c) => (
                              <span key={c.id} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                {c.name}
                              </span>
                            ))}
                            {student.campaigns.length > 3 && (
                              <span className="text-xs text-gray-400 pl-1">+{student.campaigns.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.totalQuestions} respostas
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.lastActive ? new Date(student.lastActive).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/students/${encodeURIComponent(student.phoneNumber)}`}
                        className="text-primary-600 hover:text-primary-900 inline-flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Análise
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
