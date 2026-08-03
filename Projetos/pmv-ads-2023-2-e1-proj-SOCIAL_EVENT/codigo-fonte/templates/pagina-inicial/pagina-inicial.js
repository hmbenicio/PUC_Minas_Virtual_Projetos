import { initializeData, loadData } from "../../data/data.js";

initializeData(); // Wait for asynchronous operations to complete

loadComponent('header')
loadComponent('dropdown')
loadComponent('footer')

const pesquisa = document.querySelector('#button');
pesquisa.addEventListener('click', buscar)

function buscar() {
  let nome = document.querySelector('#record').value;
  let registroEncontrado = false

  //console.log(nome == "")

  if (nome == "") { // se o nome do evento estiver vazio, retornar a mensagem de alerta
    alert('Digite um nome para pesquisar!');
    return;
  }

  let eventos = loadData('eventos');
  //console.log(eventos);
  eventos.forEach(evento => { // .forEach é o mesmo que "para cada elemento"
    if (evento.nome == nome) { // se o elemento.nome for igual ao digitado na pesquisa, retornar a informação cadastrada no JSON.
      registroEncontrado = true
      localStorage.setItem("evento", nome);
      window.location.href = "../../templates/visualizar-eventos-individuais/visualizar-eventos-individuais.html";
    }
  });

  let tarefas = loadData("tarefas");
  console.log(tarefas);
  tarefas.forEach(tarefa => { // .forEach é o mesmo que "para cada elemento"
    if (tarefa.nome == nome) {// se o elemento.nome for igual ao digitado na pesquisa, retornar a informação cadastrada no JSON.
      registroEncontrado = true
      localStorage.setItem("tarefa", nome);
      window.location.href = "../../templates/visualização-tarefas-individuais/visualização-tarefas-individuais.html";
    }
  });

  //console.log(registroEncontrado)

  if (!registroEncontrado) {
    alert('Nenhum registro encontrado!');
  }
}


