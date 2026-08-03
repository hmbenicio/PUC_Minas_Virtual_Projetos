import { initializeData, loadData, updateData } from "../../data/data.js";

initializeData();

loadComponent('header');
loadComponent('dropdown');
loadComponent('footer');

let participantes = [];

const button = document.querySelector('#button');
button.addEventListener('click', cadastrarTarefa);

function cadastrarTarefa() {
    const names = ["nome", "fornecedor", "data", "custo"];
    let tarefas = loadData('tarefas'),  tarefa = {};
    
    for(let name of names) {
        tarefa[name] = document.querySelector(`input[name=${name}]`).value;
    }

    tarefa['participantes'] = participantes; 

    tarefas.push(tarefa);
    updateData('tarefas', tarefas);

    alert('Cadastro realizado com sucesso!');
};

const input_button = document.getElementById('input_button');
input_button.addEventListener('click', adicionar);

function adicionar() {  
    var nome = document.getElementById("nome_completo").value; // Pega o valor que o usuário está digitando dentro do input.
  
    if (nome.length === 0) {
        alert('Digite o nome do participante!');
        return;
    }

    participantes.push(nome);
    recarregar_lista()
};

const input_button2 = document.getElementById('input_button2');
input_button2.addEventListener('click', remover);

function remover() {
    let nome = document.getElementById("nome_completo").value; // Pega o valor que o usuário está digitando dentro do input.

    if (nome.length === 0) {
        alert('Digite o nome do participante!');
        return;
    }

    if(participantes.indexOf(nome) !== -1) {
        var stringToRemove = nome;

        var index = participantes.indexOf(nome);
        
        if (index !== -1) {
            // Remove the string from the array using splice
            participantes.splice(index, 1);
        }

        recarregar_lista()
    } else {
        alert('Participante não pertence a lista de participantes!');
        return;
    }
};

function recarregar_lista() {
    let ul = document.getElementById('lista_participantes');

    if (ul) {
        // Remove all <li> elements from the <ul>
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }

        participantes.forEach((participante) => {
            let li = document.createElement('li');
            li.innerText = participante;
            ul.appendChild(li);
        });
    }
}