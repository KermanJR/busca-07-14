// pages/redirect.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const RedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Obter os parâmetros da URL
    const { token, email } = router.query;

    // Verificar se há token e email
    if (token && email) {
      // Redirecionar para a URL desejada
      window.location.href = `/recuperar-senha.html`;
    } else {
      // Caso contrário, fazer algo diferente ou redirecionar para outra página
      // Exemplo: redirecionar para a página de erro
      router.push('/404');
    }
  }, [router.query]);

  return null;
};

export default RedirectPage;
