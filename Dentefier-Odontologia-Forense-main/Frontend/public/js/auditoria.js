document.addEventListener("DOMContentLoaded", () => {
    const filterDateInput = document.getElementById('filter-date');
    const logTableBody = document.querySelector('#log-table tbody');
  
    // Função para carregar os logs de auditoria
    function loadAuditLogs(filterDate = '') {
      fetch(`/api/audit-logs?date=${filterDate}`)
        .then(response => response.json())
        .then(logs => {
          logTableBody.innerHTML = '';
          logs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${log.timestamp}</td>
              <td>${log.user}</td>
              <td>${log.action}</td>
              <td>${log.details}</td>
            `;
            logTableBody.appendChild(row);
          });
        })
        .catch(error => console.error('Erro ao carregar logs:', error));
    }
  
    // Carregar logs ao carregar a página
    loadAuditLogs();
  
    // Filtrar logs por data
    filterDateInput.addEventListener('change', (e) => {
      loadAuditLogs(e.target.value);
    });
  });
  