loadComponent('header')
loadComponent('dropdown')
loadComponent('footer')

loadData('eventos').then(eventos => {
  console.log(eventos);
  eventos.forEach(evento => {  
    let nomeEvento = localStorage.getItem("evento");
    if (evento.nome === nomeEvento) {
      document.getElementById('nome-evento').innerText = evento.nome;
      document.getElementById('data-evento').innerText = evento.data;
      document.getElementById('endereco-evento').innerText = evento.endereço;
      document.getElementById('custo-evento').innerText = evento.custo;
      let ul = document.getElementById('lista_convidados');
      evento.convidados.forEach((convidado) => {
        let li = document.createElement('li');
        li.innerText = convidado;
        ul.appendChild(li);
      });

    }
  })
});

