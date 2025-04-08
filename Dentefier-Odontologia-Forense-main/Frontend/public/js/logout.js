document.addEventListener('DOMContentLoaded', () => {
    const redirectButton = document.getElementById('redirectButton');
    
    redirectButton.addEventListener('click', () => {
      // Redireciona para a página inicial
      window.location.href = 'index.html';
    });
  });
  