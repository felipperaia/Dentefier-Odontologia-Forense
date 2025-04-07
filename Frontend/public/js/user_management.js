// frontend/public/js/user_management.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const btnSearch = document.getElementById('btnSearch');
    const btnNewUser = document.getElementById('btnNewUser');
    const usersTableBody = document.querySelector('#usersTable tbody');
    const messageDiv = document.getElementById('message');
  
    // Função para buscar usuários via API
    async function fetchUsers(query = '') {
      try {
        // Obter o token JWT (ajuste conforme sua lógica de armazenamento do token)
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`http://localhost:3000/api/users?search=${query}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (response.ok) {
          renderUsers(result.data);
        } else {
          showMessage(result.message);
        }
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        showMessage('Erro ao buscar usuários.');
      }
    }
  
    // Renderiza a lista de usuários na tabela
    function renderUsers(users) {
      usersTableBody.innerHTML = '';
      if (!users || users.length === 0) {
        usersTableBody.innerHTML = '<tr><td colspan="4">Nenhum usuário encontrado.</td></tr>';
        return;
      }
      users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${user.username}</td>
          <td>${user.email || ''}</td>
          <td>${user.role}</td>
          <td>
            <button class="btn-edit" data-id="${user._id}">Editar</button>
            <button class="btn-delete" data-id="${user._id}">Excluir</button>
            <button class="btn-reset" data-id="${user._id}">Reset Senha</button>
          </td>
        `;
        usersTableBody.appendChild(tr);
      });
      attachActionEvents();
    }
  
    // Adiciona eventos aos botões de ação
    function attachActionEvents() {
      document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          // Redireciona para a página de edição (implemente user_edit.html conforme necessário)
          window.location.href = `user_edit.html?id=${id}`;
        });
      });
      document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-id');
          if (confirm('Tem certeza que deseja excluir este usuário?')) {
            await deleteUser(id);
          }
        });
      });
      document.querySelectorAll('.btn-reset').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-id');
          const newPassword = prompt('Digite a nova senha para este usuário:');
          if (newPassword) {
            await resetUserPassword(id, newPassword);
          }
        });
      });
    }
  
    // Função para excluir um usuário
    async function deleteUser(id) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        showMessage(result.message);
        fetchUsers();
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        showMessage('Erro ao excluir usuário.');
      }
    }
  
    // Função para resetar a senha do usuário (administrador)
    async function resetUserPassword(id, newPassword) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`http://localhost:3000/api/users/reset-password/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ newPassword })
        });
        const result = await response.json();
        showMessage(result.message);
      } catch (error) {
        console.error('Erro ao resetar senha:', error);
        showMessage('Erro ao resetar senha.');
      }
    }
  
    // Exibe uma mensagem temporária na tela
    function showMessage(msg) {
      messageDiv.textContent = msg;
      setTimeout(() => {
        messageDiv.textContent = '';
      }, 4000);
    }
  
    // Evento de busca
    btnSearch.addEventListener('click', () => {
      const query = searchInput.value.trim();
      fetchUsers(query);
    });
  
    // Evento para cadastrar novo usuário
    btnNewUser.addEventListener('click', () => {
      window.location.href = 'user_register.html';
    });
  
    // Carrega a lista de usuários ao iniciar
    fetchUsers();
  });
  