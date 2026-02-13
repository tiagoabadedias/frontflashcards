import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, Users, ArrowRight, ArrowLeft, Check, Target, Layers, Plus, Trash2, HelpCircle, Sparkles } from 'lucide-react';
import { useCreateCampaign } from '../hooks/useCampaigns';
import { useGroups } from '../hooks/useGroups';
import { campaignService } from '../services/campaignService';
import { CreateCampaignData, CreateQuestionForCampaignData } from '../types';
import { QuestionQuantityModal } from './QuestionQuantityModal';
import { useOnboardingActions } from '../contexts/OnboardingActionsContext';

interface CreateCampaignModalProps {
  onClose: () => void;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [questions, setQuestions] = useState<CreateQuestionForCampaignData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const { registerActions, clearActions } = useOnboardingActions();
  
  // Estado para a nova pergunta sendo adicionada
  const [newQuestion, setNewQuestion] = useState<CreateQuestionForCampaignData>({
    question: '',
    answer: '',
    explanation: '',
    isActive: true
  });

  const createCampaignMutation = useCreateCampaign();
  const { data: groups = [] } = useGroups();
  
  const { register, handleSubmit, formState: { errors }, trigger, watch } = useForm<CreateCampaignData>({
    defaultValues: {
      isActive: 'true' // Valor padrão como string para o select
    }
  });

  useEffect(() => {
    registerActions({
      goToCreateCampaignModalStep: (nextStep: number) => setStep(nextStep),
    });

    return () => clearActions(['goToCreateCampaignModalStep']);
  }, [clearActions, registerActions]);

  // Observar campos para validação visual
  const watchName = watch('name');
  const watchDesc = watch('description');
  const watchStartDate = watch('startDate');

  const handleNextStep = async () => {
    if (step === 1) {
      const isStepValid = await trigger(['name', 'description', 'startDate', 'endDate']);
      if (isStepValid) {
        setStep(prev => prev + 1);
      }
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleOpenGenerateModal = () => {
    if (!watchDesc) {
      alert('Preencha a descrição da trilha primeiro.');
      return;
    }
    setShowQuantityModal(true);
  };

  const handleGenerateQuestions = async (quantity: number) => {
    setIsGenerating(true);
    try {
      const generatedQuestions = await campaignService.generateCampaignQuestions('', {
        topic: watchDesc,
        quantity
      });
      
      setQuestions([...questions, ...generatedQuestions]);
      setShowQuantityModal(false);
    } catch (error) {
      console.error('Erro ao gerar questões:', error);
      alert('Erro ao gerar questões. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.question.trim() || !newQuestion.answer.trim()) return;
    
    setQuestions([...questions, { ...newQuestion }]);
    setNewQuestion({
      question: '',
      answer: '',
      explanation: '',
      isActive: true
    });
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateCampaignData) => {
    try {
      const formattedData = {
        ...data,
        isActive: data.isActive === 'true' || data.isActive === true,
        groups: selectedGroups,
        questions: questions
      };
      
      console.log('Submitting campaign data:', formattedData);
      
      await createCampaignMutation.mutateAsync(formattedData);
      onClose();
    } catch (error) {
      console.error("Erro ao criar campanha:", error);
      // Mantém o modal aberto para permitir nova tentativa
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        {/* Header com Progresso */}
        <div className="p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Nova Trilha</h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center justify-center px-4">
            <div className="flex items-center w-full max-w-xl relative">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
              <div 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary-500 transition-all duration-300 rounded-full"
                style={{ width: step === 1 ? '0%' : step === 2 ? '33%' : step === 3 ? '66%' : '100%', marginTop:48 }}
              ></div>
              
              <div className="flex justify-between w-full">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    step >= 1 ? 'bg-primary-500 border-primary-500 text-white' : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    <Target className="w-4 h-4" />
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step >= 1 ? 'text-primary-700' : 'text-gray-400'}`}>
                    Dados
                  </span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    step >= 2 ? 'bg-primary-500 border-primary-500 text-white' : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    <Users className="w-4 h-4" />
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step >= 2 ? 'text-primary-700' : 'text-gray-400'}`}>
                    Grupos
                  </span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    step >= 3 ? 'bg-primary-500 border-primary-500 text-white' : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step >= 3 ? 'text-primary-700' : 'text-gray-400'}`}>
                    Perguntas
                  </span>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    step >= 4 ? 'bg-primary-500 border-primary-500 text-white' : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    <Check className="w-4 h-4" />
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step >= 4 ? 'text-primary-700' : 'text-gray-400'}`}>
                    Confirmar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="create-campaign-form" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Step 1: Dados Básicos */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="label">Nome da Trilha *</label>
                  <input
                    {...register('name', { required: 'Nome é obrigatório', minLength: { value: 3, message: 'Mínimo de 3 caracteres' } })}
                    data-tour="create-campaign-name"
                    type="text"
                    className={`input ${errors.name ? 'border-red-300 focus:ring-red-200' : ''}`}
                    placeholder="Ex: Revisão de Matemática - 1º Bimestre"
                    autoFocus
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 font-medium flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-1.5"></span>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Descrição *</label>
                  <textarea
                    {...register('description', { required: 'Descrição é obrigatória' })}
                    rows={4}
                    className={`input resize-none ${errors.description ? 'border-red-300 focus:ring-red-200' : ''}`}
                    placeholder="Descreva o objetivo desta trilha, temas abordados, etc."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1 font-medium flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-1.5"></span>
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">
                      <Calendar className="w-4 h-4 inline mr-1.5 text-gray-400" />
                      Data de Início
                    </label>
                    <input
                      {...register('startDate')}
                      type="date"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">
                      <Calendar className="w-4 h-4 inline mr-1.5 text-gray-400" />
                      Data de Fim
                    </label>
                    <input
                      {...register('endDate', {
                        validate: (value) => {
                          if (watchStartDate && value && new Date(value) < new Date(watchStartDate)) {
                            return 'Data final deve ser após a data inicial';
                          }
                          return true;
                        }
                      })}
                      type="date"
                      className={`input ${errors.endDate ? 'border-red-300 focus:ring-red-200' : ''}`}
                    />
                     {errors.endDate && (
                      <p className="text-red-500 text-xs mt-1 font-medium flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-1.5"></span>
                        {errors.endDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-primary-50 rounded-lg p-4 border border-primary-100 flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Layers className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-primary-900">Status Inicial</h4>
                    <p className="text-xs text-primary-700 mt-1 mb-2">
                      Defina se a trilha já começa ativa para os alunos.
                    </p>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          {...register('isActive')}
                          value="true"
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Ativa</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          {...register('isActive')}
                          value="false"
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Inativa</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Grupos */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Vincular Grupos</h3>
                  <p className="text-sm text-gray-500">Selecione quais grupos de alunos participarão desta trilha.</p>
                </div>

                {groups.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <Users className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">Nenhum grupo cadastrado</p>
                    <p className="text-xs text-gray-400 mt-1">Crie grupos antes de vinculá-los à trilha.</p>
                  </div>
                ) : (
                  <div
                    data-tour="create-campaign-groups"
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar"
                  >
                    {groups.map((group) => (
                      <button
                        type="button"
                        key={group._id}
                        onClick={() => toggleGroupSelection(group._id!)}
                        className={`cursor-pointer p-4 rounded-lg border transition-all duration-200 flex items-center justify-between group text-left w-full ${
                          selectedGroups.includes(group._id!)
                            ? 'bg-primary-50 border-primary-200 shadow-sm'
                            : 'bg-white border-gray-200 hover:border-primary-200 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                            selectedGroups.includes(group._id!)
                              ? 'bg-primary-100 text-primary-600'
                              : 'bg-gray-100 text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-500'
                          }`}>
                            {group.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className={`font-medium text-sm ${
                              selectedGroups.includes(group._id!) ? 'text-primary-900' : 'text-gray-900'
                            }`}>
                              {group.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {group.participants?.length || 0} participantes
                            </p>
                          </div>
                        </div>
                        
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedGroups.includes(group._id!)
                            ? 'bg-primary-500 border-primary-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedGroups.includes(group._id!) && (
                            <Check className="w-3.5 h-3.5 text-white" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Perguntas (NOVO) */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Adicionar Perguntas</h3>
                  <p className="text-sm text-gray-500">Adicione perguntas à sua trilha (opcional).</p>
                  
                  <button
                    type="button"
                    onClick={handleOpenGenerateModal}
                    disabled={isGenerating || !watchDesc}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Gerar Perguntas com IA
                  </button>
                  {!watchDesc && (
                    <p className="text-xs text-red-400 mt-2">
                      Preencha a descrição no passo 1 para usar a IA.
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pergunta</label>
                    <input
                      type="text"
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                      placeholder="Digite a pergunta..."
                      className="input bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resposta Correta</label>
                    <textarea
                      value={newQuestion.answer}
                      onChange={(e) => setNewQuestion({...newQuestion, answer: e.target.value})}
                      placeholder="Digite a resposta esperada..."
                      rows={2}
                      className="input bg-white resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Explicação (Opcional)</label>
                    <textarea
                      value={newQuestion.explanation || ''}
                      onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                      placeholder="Explicação para o aluno após responder..."
                      rows={2}
                      className="input bg-white resize-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      disabled={!newQuestion.question.trim() || !newQuestion.answer.trim()}
                      className="btn btn-primary text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Pergunta
                    </button>
                  </div>
                </div>

                {/* Lista de Perguntas Adicionadas */}
                <div className="space-y-3 mt-4">
                  <h4 className="font-medium text-gray-900 text-sm flex items-center justify-between">
                    Perguntas Adicionadas 
                    <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-xs">
                      {questions.length}
                    </span>
                  </h4>
                  
                  {questions.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-4 italic">
                      Nenhuma pergunta adicionada ainda.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                      {questions.map((q, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm line-clamp-1">{q.question}</p>
                            <p className="text-gray-500 text-xs line-clamp-1 mt-1">R: {q.answer}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(index)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Confirmação */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900">Tudo pronto!</h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Revise as informações abaixo antes de criar a trilha.
                </p>

                <div className="bg-gray-50 rounded-xl p-6 text-left border border-gray-100 max-w-md mx-auto space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trilha</span>
                    <p className="text-gray-900 font-medium text-lg">{watchName}</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{watchDesc}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-200">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Grupos</span>
                      <p className="text-primary-700 font-bold text-xl mt-1">{selectedGroups.length}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Perguntas</span>
                      <p className="text-primary-700 font-bold text-xl mt-1">{questions.length}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
                      <p className="text-gray-900 font-medium mt-1 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${watch('isActive') === 'true' || watch('isActive') === true ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {watch('isActive') === 'true' || watch('isActive') === true ? 'Ativa' : 'Inativa'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        <QuestionQuantityModal
          isOpen={showQuantityModal}
          onClose={() => !isGenerating && setShowQuantityModal(false)}
          onConfirm={handleGenerateQuestions}
          isLoading={isGenerating}
        />

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between items-center">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="btn btn-secondary flex items-center px-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 font-medium text-sm px-4"
            >
              Cancelar
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              data-tour="create-campaign-next"
              className="btn btn-primary flex items-center px-6"
            >
              Próximo
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              form="create-campaign-form"
              data-tour="create-campaign-confirm"
              disabled={createCampaignMutation.isPending}
              className="btn btn-primary flex items-center px-8 shadow-lg shadow-primary-500/20"
            >
              {createCampaignMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Confirmar e Criar
                  <Check className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
