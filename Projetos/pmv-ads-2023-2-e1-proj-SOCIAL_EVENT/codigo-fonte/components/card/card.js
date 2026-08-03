// Load header component
fetch('../../components/button/button.html')
    .then(response => response.text())
    .then(data => {
        document.querySelector('.button-markup').innerHTML = data;
    });

