import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { X, User, CheckCircle, XCircle, Clock, MessageSquare, Play, Pause } from 'lucide-react';
import { LoadingSpinner } from '../LoadingSpinner';

interface StudentDetailsModalProps {
  student: {
    phoneNumber: string;
    name: string;
  };
  onClose: () => void;
  campaignId?: string;
}

interface InteractionHistory {
  id: string;
  question: string;
  answer: string;
  studentAnswer: string;
  score: string;
  sentAt: string;
  answeredAt: string;
  status: 'answered' | 'pending';
  feedback?: string;
  urlAudioAluno?: string; // Novo campo de áudio
}

interface StudentDetailsData {
  student: {
    phoneNumber: string;
    name: string;
    totalSent: number;
    totalAnswered: number;
    averageScore: number;
  };
  history: InteractionHistory[];
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({ student, onClose, campaignId }) => {
  const { id: paramCampaignId } = useParams<{ id: string }>();
  const activeCampaignId = campaignId || paramCampaignId;

  const [data, setData] = useState<StudentDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Prevenir rolagem do body quando o modal estiver aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!activeCampaignId || !student.phoneNumber) return;
      
      try {
        setLoading(true);
        console.log(`Buscando detalhes para: Campaign=${activeCampaignId}, Student=${student.phoneNumber}`);
        const result = await analyticsService.getStudentDetails(activeCampaignId, student.phoneNumber);
        setData(result);
      } catch (err: any) {
        console.error('Erro ao buscar detalhes:', err);
        setError(`Erro ao carregar detalhes: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [activeCampaignId, student.phoneNumber]);

  // Fechar ao clicar fora
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 7) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Componente interno para o player de áudio
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
      <div className="mt-2 flex items-center gap-2 bg-gray-100 p-2 rounded-lg w-fit">
        <audio 
          ref={audioRef} 
          src={url} 
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          title={isPlaying ? "Pausar" : "Ouvir resposta"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <span className="text-xs font-medium text-gray-600">
          {isPlaying ? 'Reproduzindo...' : 'Ouvir áudio'}
        </span>
      </div>
    );
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-scale-in relative">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
              <p className="text-sm text-gray-500">{student.phoneNumber}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>{error}</p>
            </div>
          ) : data ? (
            <div className="space-y-8">
              
              {/* Stats Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Nota Média</p>
                  <p className={`text-2xl font-bold ${data.student.averageScore >= 7 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {data.student.averageScore.toFixed(1)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Questões Respondidas</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {data.student.totalAnswered} <span className="text-sm text-gray-400 font-normal">/ {data.student.totalSent}</span>
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Taxa de Resposta</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {data.student.totalSent > 0 
                      ? Math.round((data.student.totalAnswered / data.student.totalSent) * 100) 
                      : 0}%
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  Histórico de Interações
                </h3>
                
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                  {data.history.map((interaction, index) => (
                    <div key={interaction.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      
                      {/* Icon Indicator */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-gray-100 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow text-gray-500 z-10">
                        {interaction.status === 'answered' 
                          ? <CheckCircle className={`w-5 h-5 ${parseFloat(interaction.score) >= 7 ? 'text-green-500' : 'text-yellow-500'}`} />
                          : <Clock className="w-5 h-5 text-gray-400" />
                        }
                      </div>
                      
                      {/* Card */}
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-medium text-gray-400">
                            {new Date(interaction.sentAt).toLocaleString('pt-BR')}
                          </span>
                          {interaction.status === 'answered' && (
                            <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getScoreColor(parseFloat(interaction.score))}`}>
                              Nota: {interaction.score}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-900 font-medium mb-3">
                          {interaction.question}
                        </p>

                        {interaction.status === 'answered' ? (
                          <div className="space-y-3 bg-gray-50 p-3 rounded-lg text-sm">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Resposta do Aluno:</p>
                              <p className="text-gray-800">{interaction.studentAnswer}</p>
                              {interaction.urlAudioAluno && (
                                <AudioPlayer url={interaction.urlAudioAluno} />
                              )}
                            </div>
                            
                            {interaction.feedback && (
                              <div className="pt-2 border-t border-gray-200">
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" /> Feedback da IA:
                                </p>
                                <p className="text-gray-600 italic">{interaction.feedback}</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-2 rounded-lg text-sm">
                            <Clock className="w-4 h-4" />
                            <span>Aguardando resposta...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
