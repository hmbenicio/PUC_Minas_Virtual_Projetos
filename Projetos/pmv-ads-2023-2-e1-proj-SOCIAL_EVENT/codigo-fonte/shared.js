async function loadData(entity) {
    const data = await fetch('../../data/data.json')
        .then(response => response.json());
    return data[entity];
}

function loadComponent(component_name) {
    _loadHTML(`../../components/${component_name}/${component_name}.html`, `#${component_name}`);
    _loadCSS(`../../components/${component_name}/${component_name}.css`);
    _loadJS(`../../components/${component_name}/${component_name}.js`);
}

function _loadHTML(path, selector) {
    fetch(path)
        .then(response => response.text())
        .then(data => document.querySelector(selector).innerHTML = data)
        .catch(error => {
            console.error('Erro ao carregar o component:', error);
        })
}

function _loadCSS(path) {
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = path;
    document.head.appendChild(link)
}

function _loadJS(path) {
    let script = document.createElement('script');
    script.src = path;
    document.body.append(script)
}
