window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('userRegisterForm').addEventListener('submit', async function (event) {
      event.preventDefault(); // Impede o envio padrão do formulário
  
      // Obtém os dados dos campos do formulário
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const role = document.getElementById('role').value;
  
      // Validação básica no cliente
      if (!username || !password || !role) {
        alert('Por favor, preencha todos os campos.');
        return;
      }
  
      // Cria um objeto com os dados a serem enviados para a API
      const userData = {
        username: username,
        password: password,
        role: role
      };
  
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        alert('Token JWT não encontrado. Por favor, faça login.');
        return;
      }
  
      try {
        // Faz a requisição POST para o servidor
        const response = await fetch('http://localhost:3000/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Adicionando o JWT ao cabeçalho
          },
          body: JSON.stringify(userData)
        });
  
        // Converte a resposta para JSON
        const data = await response.json();
  
        // Verifica se o registro foi bem-sucedido
        if (response.ok) {
          // Exibe uma mensagem de sucesso e, se necessário, redireciona o usuário
          alert(data.message);
          // Você pode redirecionar o usuário para outra página após o registro
          // window.location.href = '/login.html'; // Exemplo de redirecionamento para login
        } else {
          // Exibe a mensagem de erro recebida do servidor
          alert(data.message || 'Erro ao registrar usuário.');
        }
  
      } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao se comunicar com o servidor.');
      }
    });
  });
  