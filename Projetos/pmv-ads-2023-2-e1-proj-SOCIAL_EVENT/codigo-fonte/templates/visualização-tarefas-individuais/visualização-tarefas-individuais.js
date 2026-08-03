loadComponent('header')
loadComponent('dropdown')
loadComponent('footer')

loadData('tarefas').then(tarefas => {
  tarefas.forEach(tarefa => {
    let nomeTarefa = localStorage.getItem("tarefa");
console.log(nomeTarefa)

    if (tarefa.nome === nomeTarefa) {
      document.querySelector('#nome-tarefa').innerText = tarefa.nome;
      document.querySelector('#nome-fornecedor').innerText = tarefa.fornecedor;
      document.querySelector('#data-tarefa').innerText = tarefa.data;
      document.querySelector('#custo-tarefa').innerText = tarefa.custo;
      let ul = document.getElementById('lista_responsavel');
      evento.responsaveis.forEach((responsavel) => {
        let li = document.createElement('li');
        li.innerText = responsavel;
        ul.appendChild(li);
      });
    }
  })
});