// Função para alternar entre as seções do formulário
function showSection(sectionId) {
    // Esconde todas as seções
    document.querySelectorAll('.form-section').forEach(section => {
      section.classList.remove('active');
    });
    
    // Mostra a seção selecionada
    document.getElementById(sectionId).classList.add('active');
    
    // Atualiza a navegação
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    document.querySelector(`.nav-link[data-section="${sectionId}"]`).classList.add('active');
    
    // Rola para o topo
    window.scrollTo(0, 0);
  }
  
  // Quando o documento estiver carregado
  document.addEventListener('DOMContentLoaded', function() {
    // Botão para ir para a próxima seção
    document.getElementById('btnProxima').addEventListener('click', function() {
      showSection('detalhesColeta');
    });
    
    // Botão para voltar para a seção anterior
    document.getElementById('btnVoltar').addEventListener('click', function() {
      showSection('novoCaso');
    });
    
    // Links de navegação
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.getAttribute('data-section');
        if (sectionId) {
          showSection(sectionId);
        }
      });
    });
  
    // Script para mostrar o campo de texto quando "Outros" for selecionado
    document.getElementById('tipoCrime').addEventListener('change', function() {
      const outroTipoCrimeContainer = document.getElementById('outroTipoCrimeContainer');
      const outroTipoCrimeTexto = document.getElementById('outroTipoCrimeTexto');
      
      if (this.value === 'Outros') {
        outroTipoCrimeContainer.style.display = 'block';
        outroTipoCrimeTexto.required = true;
      } else {
        outroTipoCrimeContainer.style.display = 'none';
        outroTipoCrimeTexto.required = false;
      }
    });
    
    // Controlar visibilidade dos campos de identificação
    document.getElementById('identificadoSelect').addEventListener('change', function() {
      const camposIdentificacao = document.getElementById('campos-identificacao');
      const isIdentificado = this.value === 'sim';
      
      // Mostrar ou esconder os campos com base na seleção
      camposIdentificacao.style.display = isIdentificado ? 'block' : 'none';
      
      // Ajuste os campos obrigatórios com base na seleção
      const campos = camposIdentificacao.querySelectorAll('input:not([type="checkbox"]), select, textarea');
      campos.forEach(campo => {
        campo.required = isIdentificado;
      });
    });
    
    // Script para mostrar campo de texto quando "Outro" for selecionado no local de exame
    document.querySelector('select[name="localExame"]').addEventListener('change', function() {
      const outroLocalContainer = document.getElementById('outroLocalContainer');
      const outroLocalTexto = document.getElementById('outroLocalTexto');
      
      if (this.value === 'Outro') {
        outroLocalContainer.style.display = 'block';
        outroLocalTexto.required = true;
      } else {
        outroLocalContainer.style.display = 'none';
        outroLocalTexto.required = false;
      }
    });
    
    // Script para mostrar campo de texto quando "Outro" for selecionado no tipo de exame
    document.querySelector('select[name="tipoExameOdontologico"]').addEventListener('change', function() {
      const outroExameContainer = document.getElementById('outroExameContainer');
      const outroExameTexto = document.getElementById('outroExameTexto');
      
      if (this.value === 'Outro') {
        outroExameContainer.style.display = 'block';
        outroExameTexto.required = true;
      } else {
        outroExameContainer.style.display = 'none';
        outroExameTexto.required = false;
      }
    });
    
    // Script para mostrar campo de upload quando "Sim" for selecionado em dados odontológicos anteriores
    document.querySelector('select[name="dadosAnteriores"]').addEventListener('change', function() {
      const uploadDadosAnteriores = document.getElementById('uploadDadosAnteriores');
      
      if (this.value === 'sim') {
        uploadDadosAnteriores.style.display = 'block';
      } else {
        uploadDadosAnteriores.style.display = 'none';
      }
    });
    
    // Tratamento para envio dos formulários
    document.getElementById('form-caso').addEventListener('submit', function(e) {
      e.preventDefault();
      // Aqui você adicionaria o código para salvar os dados do formulário
      alert('Caso cadastrado com sucesso!');
    });
    
    document.getElementById('form-detalhes').addEventListener('submit', function(e) {
      e.preventDefault();
      // Aqui você adicionaria o código para salvar os dados do formulário
      alert('Detalhes salvos com sucesso!');
    });
  });