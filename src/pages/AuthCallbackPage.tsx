import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { jwtDecode } from 'jwt-decode';

export const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokenAndUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      try {
        // Tenta decodificar o token para pegar email
        // Assumindo que o token JWT tem campo email e sub (id)
        const decoded: any = jwtDecode(token);
        
        // Se o backend retornar nome e avatar na query string no futuro seria melhor,
        // mas por enquanto vamos pegar do token se tiver ou usar placeholder
        // O ideal é chamar /auth/me aqui, mas vamos simplificar
        
        const user = {
          id: decoded.sub || 'temp',
          name: decoded.name || decoded.email?.split('@')[0] || 'Usuário',
          email: decoded.email || 'email@example.com',
          avatar: decoded.picture || decoded.avatar
        };

        setTokenAndUser(token, user);
        navigate('/dashboard');
      } catch (error) {
        console.error('Erro ao processar login:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setTokenAndUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
};
