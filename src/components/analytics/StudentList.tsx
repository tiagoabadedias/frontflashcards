import React, { useState } from 'react';
import { StudentResult } from '../../services/analyticsService';
import { Search, ChevronUp, ChevronDown, User, ChevronRight } from 'lucide-react';
import { StudentDetailsModal } from './StudentDetailsModal';

interface StudentListProps {
  students: StudentResult[];
  campaignId?: string;
}

export const StudentList: React.FC<StudentListProps> = ({ students, campaignId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'avgScore' | 'questionsAnswered' | 'lastActivity'>('lastActivity');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);

  // Filtrar e ordenar estudantes
  const filteredAndSortedStudents = React.useMemo(() => {
    let result = [...(students || [])];

    // Filtro de busca
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        student => 
          student.name?.toLowerCase().includes(lowerTerm) || 
          student.phoneNumber?.includes(lowerTerm)
      );
    }

    // Ordenação
    result.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      // Tratamento especial para datas
      if (sortField === 'lastActivity') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      // Tratamento para valores undefined
      if (valA === undefined) valA = 0;
      if (valB === undefined) valB = 0;

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, searchTerm, sortField, sortDirection]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (score >= 7) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return 'Excelente';
    if (score >= 7) return 'Bom';
    if (score >= 5) return 'Regular';
    return 'Crítico';
  };

  return (
    <>
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              Desempenho dos Alunos
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Listagem detalhada de {students?.length || 0} alunos participantes
            </p>
          </div>
          
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar aluno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Aluno
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
                  onClick={() => handleSort('questionsAnswered')}
                >
                  <div className="flex items-center gap-1">
                    Participação
                    {sortField === 'questionsAnswered' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
                  onClick={() => handleSort('avgScore')}
                >
                  <div className="flex items-center gap-1">
                    Nota Média
                    {sortField === 'avgScore' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
                  onClick={() => handleSort('lastActivity')}
                >
                  <div className="flex items-center gap-1">
                    Última Atividade
                    {sortField === 'lastActivity' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <User className="w-12 h-12 text-gray-300 mb-2" />
                      <p className="text-base font-medium text-gray-900">Nenhum aluno encontrado</p>
                      <p className="text-sm text-gray-500">Tente ajustar os filtros de busca</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedStudents.map((student, index) => (
                  <tr 
                    key={`${student.phoneNumber}-${index}`} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium group-hover:bg-primary-200 transition-colors">
                          {student.name ? student.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{student.name || 'Sem nome'}</div>
                          <div className="text-sm text-gray-500">{student.phoneNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {student.questionsAnswered} respondidas
                        </span>
                        {student.questionsSent && student.questionsSent > 0 && (
                          <span className="text-xs text-gray-500">
                            de {student.questionsSent} enviadas ({Math.round((student.questionsAnswered / student.questionsSent) * 100)}%)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getScoreColor(student.avgScore)}`}>
                        {typeof student.avgScore === 'number' ? student.avgScore.toFixed(1) : '0.0'} - {getScoreLabel(student.avgScore)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.lastActivity ? new Date(student.lastActivity).toLocaleString('pt-BR') : 'Nunca'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedStudent && (
        <StudentDetailsModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)}
          campaignId={campaignId} 
        />
      )}
    </>
  );
};
