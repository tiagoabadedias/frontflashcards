import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { studentService } from '../../services/studentService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { ArrowLeft, BookOpen, BarChart3, MessageSquare, CheckCircle, Clock, Volume2 } from 'lucide-react';
import { useState } from 'react';

export const StudentDetails = () => {
  const { phoneNumber } = useParams<{ phoneNumber: string }>();
  const decodedPhone = decodeURIComponent(phoneNumber || '');

  const { data: student, isLoading, error } = useQuery({
    queryKey: ['student', decodedPhone],
    queryFn: () => studentService.getDetails(decodedPhone),
    enabled: !!decodedPhone,
  });

  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);

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
        title="Erro ao carregar análise"
        message="Não foi possível carregar os detalhes do aluno. Tente novamente."
      />
    );
  }

  if (!student) return null;

  const toggleTrack = (trackId: string) => {
    if (expandedTrack === trackId) {
      setExpandedTrack(null);
    } else {
      setExpandedTrack(trackId);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/students" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar para lista
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Análise do Aluno
            <span className="text-lg font-normal text-gray-500">({student.phoneNumber})</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {student.name !== 'Unknown' ? student.name : 'Nome não identificado'}
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card p-6 flex items-center">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 mr-4">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Trilhas Participadas</p>
            <p className="text-2xl font-bold text-gray-900">{student.globalStats.totalTracks}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center">
          <div className="p-3 rounded-xl bg-violet-50 text-violet-600 mr-4">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total de Respostas</p>
            <p className="text-2xl font-bold text-gray-900">{student.globalStats.totalQuestions}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 mr-4">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Média Global</p>
            <p className="text-2xl font-bold text-gray-900">
              {student.globalStats.averageScore.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold text-gray-900 mt-8">Desempenho por Trilha</h2>

      <div className="space-y-4">
        {student.tracks.map((track) => (
          <div key={track.campaignId} className="card overflow-hidden">
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              onClick={() => toggleTrack(track.campaignId)}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between sm:justify-start sm:gap-4 mb-2 sm:mb-0">
                  <h3 className="text-base font-semibold text-gray-900">{track.campaignName}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    track.averageScore >= 7 ? 'bg-green-100 text-green-800' :
                    track.averageScore >= 5 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Média: {track.averageScore.toFixed(1)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {track.totalQuestions} interações
                  </span>
                </div>
              </div>
              <div className="text-primary-600 text-sm font-medium">
                {expandedTrack === track.campaignId ? 'Ocultar detalhes' : 'Ver detalhes'}
              </div>
            </div>

            {expandedTrack === track.campaignId && (
              <div className="bg-gray-50 border-t border-gray-100 p-6 animate-fade-in">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Histórico de Respostas</h4>
                <div className="space-y-4">
                  {track.questions.map((q) => (
                    <div key={q.questionId} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium text-gray-900 flex-1 pr-4">{q.question}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-xs text-gray-400 flex items-center whitespace-nowrap">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(q.answeredAt).toLocaleDateString('pt-BR')}
                           </span>
                           <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              Number(q.score) >= 7 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                           }`}>
                              Nota: {q.score}
                           </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium text-gray-700">Resposta: </span>
                        {q.answer}
                      </div>
                      
                      {/* Exibição do áudio se existir */}
                      {q.audioUrl && (
                        <div className="mb-2 p-2 bg-purple-50 rounded border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Volume2 className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-700">Áudio da Resposta:</span>
                          </div>
                          <audio 
                            controls 
                            className="w-full h-8"
                            preload="none"
                          >
                            <source src={q.audioUrl} type="audio/oga" />
                            <source src={q.audioUrl} type="audio/ogg" />
                            <source src={q.audioUrl} type="audio/wav" />
                            Seu navegador não suporta o elemento de áudio.
                          </audio>
                        </div>
                      )}
                      
                      {q.feedback && (
                        <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded mt-2">
                           <span className="font-medium">Feedback: </span>
                           {q.feedback}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
