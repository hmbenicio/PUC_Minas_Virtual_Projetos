import { initializeData, loadData, updateData } from "../../data/data.js";

initializeData();

loadComponent('header');
loadComponent('dropdown');
loadComponent('footer');

var card_list, cursor;

card_list = document.querySelector('.card-list');

const currentPage = new URLSearchParams(window.location.search).get('page').toLowerCase();
const dataset = loadData(currentPage);
const add_link = document.querySelector('#add-link');
let info_link = '';

if(currentPage == 'eventos') {
  add_link.href = '../../templates/Cadastro-de-Evento/index.html';
  info_link =  '../../templates/visualizar-eventos-individuais/visualizar-eventos-individuais.html';
} else if (currentPage == 'tarefas') {
  add_link.href = '../../templates/Cadastro-de-Tarefa/index.html';
  info_link =  '../../templates/visualização-tarefas-individuais/visualização-tarefas-individuais.html';
} else {
  alert('Erro 404: Página não encontrada.');
}

const title = document.querySelector('#title')
const left_button = document.querySelector('#previous');
const right_button = document.querySelector('#next');

document.addEventListener('DOMContentLoaded', function() {
  title.innerHTML = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
  cursor = 0;
  loadCardComponents(dataset);
})

left_button.addEventListener('click', function() {
  if (cursor > 0) {
    cursor--;
    loadCardComponents(dataset);
  }
});

right_button.addEventListener('click', function() {
  if(cursor < dataset.length - 3) {
    cursor++;
    loadCardComponents(dataset);
  }
});

async function loadCardComponents(data) {
  card_list.innerHTML = '';
  for(var i = cursor; i < cursor + 3; i++) {
    try{
      const response = await fetch('../../components/card/card.html')
      const card = await response.text()
      _renderCardComponent(card, data[i])
    }
    catch(error) {
        console.error('Erro ao carregar card:', error);
    }
  }
}


function _renderCardComponent(card, data) {

  let item = document.createElement('li');
  item.innerHTML = card;

  let content = item.querySelector('.content ul');

  Object.values(data).forEach(value => {
      let text_li = document.createElement('li');
      text_li.innerText = value;
      content.appendChild(text_li);
  })

  let info = item.querySelector('#info');

  info.addEventListener('click', () => {
    localStorage.setItem(currentPage.slice(0,-1), data.nome);
    window.location.href = info_link;
  });

  let remove = item.querySelector('#remove');
  remove.addEventListener('click', () => {
    updateData(currentPage, dataset.filter(obj => obj !== data));
    location.reload();
  })

  card_list.appendChild(item);
}
