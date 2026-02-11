import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Eye, 
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Campaign, Question, CreateQuestionForCampaignData } from '../types';
import { 
  useCampaignQuestions, 
  useCreateCampaignQuestion, 
  useDeleteCampaignQuestion 
} from '../hooks/useCampaignQuestions';
import { campaignService } from '../services/campaignService';
import { QuestionQuantityModal } from './QuestionQuantityModal';

interface CampaignQuestionsSectionProps {
  campaign: Campaign;
}

export const CampaignQuestionsSection: React.FC<CampaignQuestionsSectionProps> = ({ 
  campaign 
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);

  // Form data para criação de questão (simplificado)
  const [questionFormData, setQuestionFormData] = useState<CreateQuestionForCampaignData>({
    question: '',
    answer: '',
    explanation: '',
    isActive: true,
  });

  // Hooks
  const { data: questions = [], isLoading } = useCampaignQuestions(campaign._id!);
  const createQuestionMutation = useCreateCampaignQuestion();
  const deleteQuestionMutation = useDeleteCampaignQuestion();

  // Handlers
  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionFormData.question.trim() || !questionFormData.answer.trim()) {
      return;
    }

    try {
      await createQuestionMutation.mutateAsync({
        campaignId: campaign._id!,
        data: questionFormData,
      });
      
      // Reset form
      setQuestionFormData({
        question: '',
        answer: '',
        explanation: '',
        isActive: true,
      });
      
      setActiveTab('list');
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta questão?')) {
      try {
        await deleteQuestionMutation.mutateAsync({
          campaignId: campaign._id!,
          questionId,
        });
      } catch (error) {
        // Error already handled in hook
      }
    }
  };

  const handleOpenGenerateModal = () => {
    setShowQuantityModal(true);
  };

  const handleGenerateQuestions = async (quantity: number) => {
    setIsGenerating(true);
    try {
      const generatedQuestions = await campaignService.generateCampaignQuestions('', {
        topic: campaign.description || campaign.name,
        quantity
      });
      
      // Criar cada questão gerada
      for (const question of generatedQuestions) {
        await createQuestionMutation.mutateAsync({
          campaignId: campaign._id!,
          data: question,
        });
      }
      
      alert(`${generatedQuestions.length} questões geradas e adicionadas com sucesso!`);
      setActiveTab('list');
      setShowQuantityModal(false);
    } catch (error) {
      console.error('Erro ao gerar questões:', error);
      alert('Erro ao gerar questões. Verifique se a trilha possui descrição.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com tabs */}
      <div className="bg-white rounded-lg border">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'list'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Lista de Questões ({questions.length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'create'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ➕ Nova Questão
            </button>
          </nav>
        </div>

        {/* Conteúdo das tabs */}
        <div className="p-6">
          {/* Aba Lista */}
          {activeTab === 'list' && (
            <div>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-2 text-gray-600">Carregando questões...</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <AlertCircle className="h-12 w-12" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma questão</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comece criando a primeira questão para esta trilha.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab('create')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Questão
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question._id} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              #{index + 1}
                            </span>
                            {question.isActive ? (
                              <span title="Questão ativa">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </span>
                            ) : (
                              <span title="Questão inativa">
                                <AlertCircle className="w-4 h-4 text-gray-400" />
                              </span>
                            )}
                          </div>
                          
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            {question.question}
                          </h4>
                          
                          <div className="text-sm text-gray-600 mb-1">
                            <strong>Resposta:</strong> {question.answer}
                          </div>
                          
                          {question.explanation && (
                            <div className="text-sm text-gray-500 italic">
                              <strong>Explicação:</strong> {question.explanation}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => {
                              setSelectedQuestion(question);
                              setShowQuestionModal(true);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question._id!)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Deletar questão"
                            disabled={deleteQuestionMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Aba Criar Questão */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateQuestion} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-blue-900 mb-2">
                    ➕ Criar Nova Questão
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Adicione uma nova questão à trilha "{campaign.name}"
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenGenerateModal}
                  disabled={isGenerating}
                  className="flex items-center px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Gerar com IA
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pergunta *
                </label>
                <textarea
                  value={questionFormData.question}
                  onChange={(e) => setQuestionFormData(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Digite a pergunta aqui..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resposta Correta *
                </label>
                <textarea
                  value={questionFormData.answer}
                  onChange={(e) => setQuestionFormData(prev => ({ ...prev, answer: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Digite a resposta correta..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Explicação (opcional)
                </label>
                <textarea
                  value={questionFormData.explanation || ''}
                  onChange={(e) => setQuestionFormData(prev => ({ ...prev, explanation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Explicação da resposta ou dica para os estudantes..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={questionFormData.isActive}
                  onChange={(e) => setQuestionFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Questão ativa
                </label>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createQuestionMutation.isPending || !questionFormData.question.trim() || !questionFormData.answer.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {createQuestionMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Questão
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Modal de detalhes da questão */}
      {showQuestionModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Detalhes da Questão</h3>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pergunta:</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedQuestion.question}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resposta:</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedQuestion.answer}</p>
              </div>
              {selectedQuestion.explanation && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Explicação:</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedQuestion.explanation}</p>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedQuestion.isActive 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedQuestion.isActive ? 'Ativa' : 'Inativa'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <QuestionQuantityModal
        isOpen={showQuantityModal}
        onClose={() => !isGenerating && setShowQuantityModal(false)}
        onConfirm={handleGenerateQuestions}
        isLoading={isGenerating}
      />
    </div>
  );
};