import { useEffect, useMemo, useRef, useState } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOnboardingActions } from '../contexts/OnboardingActionsContext';
import { userService } from '../services/userService';

const ONBOARDING_VERSION = 1;

type TourStep = {
  target: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto';
  route?: string;
  action?: 'openCreateGroupModal' | 'openCreateCampaignModal';
  campaignModalStep?: number;
  disableBeacon?: boolean;
  spotlightClicks?: boolean;
};

export const OnboardingTour = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { actions } = useOnboardingActions();
  const navigate = useNavigate();
  const location = useLocation();

  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const startedRef = useRef(false);

  const steps = useMemo<TourStep[]>(
    () => [
      {
        target: 'body',
        placement: 'center',
        content: 'Bem-vindo! Vou te guiar pelo básico: criar um grupo, criar uma trilha, dar o start e compartilhar o QR Code com os alunos.',
        disableBeacon: true,
      },
      {
        target: '[data-tour="nav-groups"]',
        route: '/groups',
        content: 'Vamos começar pelos Grupos. Aqui você gerencia os alunos que vão participar das trilhas.',
        disableBeacon: true,
      },
      {
        target: '[data-tour="groups-new"]',
        route: '/groups',
        action: 'openCreateGroupModal',
        content: 'Clique aqui para criar um novo grupo de alunos.',
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: '[data-tour="create-group-name"]',
        route: '/groups',
        action: 'openCreateGroupModal',
        content: 'Dê um nome para o grupo. Você também pode adicionar telefones dos participantes.',
        disableBeacon: true,
      },
      {
        target: '[data-tour="create-group-submit"]',
        route: '/groups',
        action: 'openCreateGroupModal',
        content: 'Quando estiver pronto, clique em “Criar Grupo”.',
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: '[data-tour="nav-campaigns"]',
        route: '/campaigns',
        content: 'Agora vamos para Trilhas: é aqui que você monta um fluxo completo de envio de flashcards.',
        disableBeacon: true,
      },
      {
        target: '[data-tour="campaigns-new"]',
        route: '/campaigns',
        action: 'openCreateCampaignModal',
        content: 'Clique aqui para criar uma nova trilha.',
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: '[data-tour="create-campaign-name"]',
        route: '/campaigns',
        action: 'openCreateCampaignModal',
        campaignModalStep: 1,
        content: 'Preencha o nome e a descrição da trilha. A descrição ajuda até na geração de perguntas com IA.',
        disableBeacon: true,
      },
      {
        target: '[data-tour="create-campaign-next"]',
        route: '/campaigns',
        action: 'openCreateCampaignModal',
        campaignModalStep: 1,
        content: 'Avance para selecionar os grupos que vão participar.',
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: '[data-tour="create-campaign-groups"]',
        route: '/campaigns',
        action: 'openCreateCampaignModal',
        campaignModalStep: 2,
        content: 'Selecione os grupos de alunos para vincular à trilha.',
        disableBeacon: true,
      },
      {
        target: '[data-tour="create-campaign-confirm"]',
        route: '/campaigns',
        action: 'openCreateCampaignModal',
        campaignModalStep: 4,
        content: 'No fim, confirme para criar a trilha.',
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: '[data-tour="campaigns-start"]',
        route: '/campaigns',
        content: 'Depois de criar, clique em “Iniciar” (Play) para dar o start no disparo.',
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: '[data-tour="campaigns-qrcode"]',
        route: '/campaigns',
        content: 'Com a trilha iniciada, o QR Code fica disponível. Mostre este QR Code para os alunos entrarem.',
        disableBeacon: true,
        spotlightClicks: true,
      },
      {
        target: 'body',
        placement: 'center',
        content: 'Tour concluído! Se quiser rever depois, a gente pode adicionar um botão “Reiniciar Onboarding” nas configurações.',
        disableBeacon: true,
      },
    ],
    [],
  );

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    if (startedRef.current) return;
    startedRef.current = true;

    (async () => {
      try {
        const me = await userService.me();
        const shouldRun = !me.onboarding?.completed || (me.onboarding?.version ?? 0) < ONBOARDING_VERSION;
        if (shouldRun) setRun(true);
      } catch {
        const localDone = localStorage.getItem('onboardingCompleted');
        if (!localDone) setRun(true);
      }
    })();
  }, [isAuthenticated, isLoading]);

  const handleAction = (step: TourStep) => {
    if (step.action === 'openCreateGroupModal') actions.openCreateGroupModal?.();
    if (step.action === 'openCreateCampaignModal') actions.openCreateCampaignModal?.();
    if (step.campaignModalStep) actions.goToCreateCampaignModalStep?.(step.campaignModalStep);
  };

  return (
    <Joyride
      steps={steps as any}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      disableOverlayClose
      disableCloseOnEsc
      scrollToFirstStep
      styles={{
        options: {
          zIndex: 9999,
        },
      }}
      callback={async (data: any) => {
        const { action, index, status, type, step } = data;
        const typedStep = step as TourStep | undefined;

        if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
          setRun(false);
          setStepIndex(0);
          localStorage.setItem('onboardingCompleted', 'true');
          try {
            await userService.completeOnboarding();
          } catch {}
          return;
        }

        if (typedStep?.route && location.pathname !== typedStep.route && type === EVENTS.STEP_BEFORE) {
          navigate(typedStep.route);
          return;
        }

        if (type === EVENTS.STEP_BEFORE && typedStep) {
          handleAction(typedStep);
        }

        if (type === EVENTS.TARGET_NOT_FOUND) {
          setStepIndex((prev) => prev + 1);
          return;
        }

        if (type === EVENTS.STEP_AFTER) {
          if (action === ACTIONS.NEXT) setStepIndex(index + 1);
          if (action === ACTIONS.PREV) setStepIndex(index - 1);
        }
      }}
    />
  );
};
