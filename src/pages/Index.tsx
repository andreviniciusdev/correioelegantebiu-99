
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona automaticamente para a página principal
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
};

export default Index;
