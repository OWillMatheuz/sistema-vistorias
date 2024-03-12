// Quando o DOM estiver totalmente carregado, execute este código
document.addEventListener("DOMContentLoaded", function () {
  // Captura de elementos do DOM
  const form = document.getElementById("vistoriaForm");
  const historicoList = document.getElementById("historico");
  const apagarTudoButton = document.getElementById("apagarTudo");
  const exportarPDFButton = document.getElementById("exportarPDF");

  // Evento de envio do formulário
  form.addEventListener("submit", function (event) {
    // Impede o comportamento padrão do envio do formulário
    event.preventDefault();

    // Extrai valores do formulário
    const numeroVistoria = document.getElementById("numeroVistoria").value;
    const tipoVistoria = document.getElementById("tipoVistoria").value;
    const metragem = parseFloat(document.getElementById("metragem").value);
    const teste = document.getElementById("teste").value;
    const data = formatarData(new Date(document.getElementById("data").value));

    let soma = 0;

    // Cálculo do valor da vistoria com base no tipo
    if (tipoVistoria === "entrada") {
      if (metragem > 500) {
        soma += 283;
      } else {
        soma += 34;
        if (metragem > 50) {
          soma += 0.6 * (metragem - 50);
        }
      }
    } else if (tipoVistoria === "saida") {
      if (metragem > 500) {
        soma += 337;
      } else {
        soma += 39;
        if (metragem > 50) {
          soma += 0.7 * (metragem - 50);
        }
      }
    } else if (tipoVistoria === "constatacao") {
      if (metragem <= 50) {
        soma += 0;
      } else {
        soma += 0.7 * (metragem - 50);
      }
    }

    // Adiciona custo de teste, se aplicável
    if (teste === "sim") {
      soma += 12;
    }

    // Salva a vistoria
    salvarVistoria(numeroVistoria, tipoVistoria, metragem, teste, soma, data);
    // Exibe o histórico atualizado
    exibirHistorico();
  });

  // Função para salvar vistoria no histórico
  function salvarVistoria(numero, tipo, metragem, teste, soma, data) {
    var vistoria = {
      data: data,
      numero: numero,
      tipo: tipo,
      metragem: metragem,
      teste: teste,
      soma: soma.toFixed(2), // Arredondando para 2 casas decimais
    };

    // Obtém o histórico atual do armazenamento local ou inicializa um array vazio
    var historico =
      JSON.parse(localStorage.getItem("historicoVistorias")) || [];
    // Adiciona a nova vistoria ao histórico
    historico.push(vistoria);
    // Salva o histórico atualizado no armazenamento local
    localStorage.setItem("historicoVistorias", JSON.stringify(historico));
  }

  // Função para exibir o histórico de vistorias
  function exibirHistorico() {
    // Obtém o histórico do armazenamento local ou inicializa um array vazio
    var historico =
      JSON.parse(localStorage.getItem("historicoVistorias")) || [];
    // Limpa a lista de histórico atual
    historicoList.innerHTML = "";

    // Para cada vistoria no histórico, cria elementos HTML correspondentes e os adiciona à lista
    historico.forEach(function (vistoria, index) {
      var listItem = document.createElement("li");
      listItem.style.display = "flex";
      listItem.style.flexDirection = "column";

      // Cria elementos para cada detalhe da vistoria
      var dataElement = document.createElement("span");
      dataElement.textContent = "Data: " + vistoria.data;
      dataElement.classList.add("black-text"); // Adiciona a classe "black-text"

      var numeroElement = document.createElement("span");
      numeroElement.textContent = "Código da Casa: " + vistoria.numero;
      numeroElement.classList.add("black-text"); // Adiciona a classe "black-text"

      var tipoElement = document.createElement("span");
      tipoElement.textContent = "Tipo: " + vistoria.tipo;
      tipoElement.classList.add("black-text"); // Adiciona a classe "black-text"

      var metragemElement = document.createElement("span");
      metragemElement.textContent = "Metragem: " + vistoria.metragem;
      metragemElement.classList.add("black-text"); // Adiciona a classe "black-text"

      var testeElement = document.createElement("span");
      testeElement.textContent =
        "Teste Elétrico/ Hidráulico: " + vistoria.teste;
      testeElement.classList.add("black-text"); // Adiciona a classe "black-text"

      var somaElement = document.createElement("span");
      somaElement.textContent = "Valor Vistoria: R$ " + vistoria.soma;
      somaElement.classList.add("black-text"); // Adiciona a classe "black-text"

      // Botão para apagar a vistoria
      var deleteButton = document.createElement("button");
      deleteButton.textContent = "Apagar";
      deleteButton.addEventListener("click", function () {
        // Solicita confirmação do usuário antes de apagar a vistoria
        if (confirm("Tem certeza que deseja apagar esta vistoria?")) {
          // Remove a vistoria do histórico
          historico.splice(index, 1);
          // Atualiza o histórico no armazenamento local
          localStorage.setItem("historicoVistorias", JSON.stringify(historico));
          // Exibe o histórico atualizado
          exibirHistorico();
        }
      });

      // Adiciona os elementos à lista de vistorias
      listItem.appendChild(dataElement);
      listItem.appendChild(numeroElement);
      listItem.appendChild(tipoElement);
      listItem.appendChild(metragemElement);
      listItem.appendChild(testeElement);
      listItem.appendChild(somaElement);
      listItem.appendChild(deleteButton);

      historicoList.appendChild(listItem);
    });
  }

  // Evento de clique no botão "Apagar Tudo"
  apagarTudoButton.addEventListener("click", function () {
    // Solicita confirmação do usuário antes de apagar todo o histórico
    if (confirm("Tem certeza que deseja apagar todo o histórico?")) {
      // Remove o histórico do armazenamento local
      localStorage.removeItem("historicoVistorias");
      // Exibe o histórico vazio
      exibirHistorico();
    }
  });

  // Evento de clique no botão "Exportar PDF"
  exportarPDFButton.addEventListener("click", function () {
    // Chama a função para exportar o histórico para PDF
    exportarParaPDF();
  });

  // Função para exportar o histórico para PDF
  function exportarParaPDF() {
    // Obtém todos os elementos de texto que serão exportados para PDF
    const textElements = document.querySelectorAll("#historico .black-text");

    // Armazena as propriedades de estilo atuais dos elementos de texto
    const originalStyles = [];
    textElements.forEach(function (element) {
      originalStyles.push({
        element: element,
        color: element.style.color,
      });
    });

    // Define a cor do texto como preto para todos os elementos de texto
    textElements.forEach(function (element) {
      element.style.color = "black";
    });

    // Cria um elemento HTML temporário para armazenar o histórico
    const historicoHTML = document.createElement("div");
    historicoHTML.appendChild(historicoList.cloneNode(true));

    // Define o nome do arquivo PDF
    const filename = "historico_vistorias.pdf";

    // Converte o HTML para PDF e salva o arquivo
    html2pdf().from(historicoHTML).save(filename);

    // Restaura as propriedades de estilo originais dos elementos de texto
    originalStyles.forEach(function (style) {
      style.element.style.color = style.color;
    });
  }

  // Função para formatar a data no formato "dd/mm/aaaa"
  function formatarData(data) {
    // Ajusta o fuso horário
    data = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
    // Extrai dia, mês e ano
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    // Retorna a data formatada
    return `${dia}/${mes}/${ano}`;
  }

  // Exibe o histórico inicialmente ao carregar a página
  exibirHistorico();
});
