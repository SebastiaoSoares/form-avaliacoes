const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

async function submitReview(responses) {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', 
      },
      body: JSON.stringify({ responses: responses }) 
    });

    if (response.ok) {
      return { 
        status: 'success', 
        message: 'Avaliação enviada com sucesso! Muito obrigado.' 
      };
    } else {
      return { 
        status: 'error', 
        message: 'Ops, tivemos um problema ao enviar. Tente novamente.' 
      };
    }

  } catch (error) {
    console.error('Error sending data:', error);
    return { 
      status: 'error', 
      message: 'Erro de conexão. Verifique a internet do tablet.' 
    };
  }
}

export default submitReview;