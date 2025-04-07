// Exemplo de envio de formulário de login (main.js)
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const data = {
        username: formData.get('username'),
        password: formData.get('password')
      };
      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
          // Armazena o token e redireciona conforme o perfil
          localStorage.setItem('jwtToken', result.token);
          if (result.user.role === 'admin') {
            window.location.href = 'dashboard_admin.html';
          } else if (result.user.role === 'perito') {
            window.location.href = 'dashboard_perito.html';
          } else if (result.user.role === 'assistente') {
            window.location.href = 'dashboard_assistente.html';
          }
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Erro no login:', error);
      }
    });
  }
});
