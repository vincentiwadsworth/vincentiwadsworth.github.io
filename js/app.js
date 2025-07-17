document.addEventListener('DOMContentLoaded', () => {
    const librosContainer = document.getElementById('libros-container');
    const etiquetasFiltroContainer = document.getElementById('etiquetas-filtro');
    let libros = [];
    let etiquetasUnicas = [];

    fetch('data/libros.json')
        .then(response => response.json())
        .then(data => {
            libros = data;
            etiquetasUnicas = obtenerEtiquetasUnicas(libros);
            crearFiltros(etiquetasUnicas);
            mostrarLibros(libros);
        })
        .catch(error => {
            console.error('Error al cargar los datos de los libros:', error);
            librosContainer.innerHTML = '<p>No se pudieron cargar los libros. Inténtalo de nuevo más tarde.</p>';
        });

    function mostrarLibros(listaLibros) {
        librosContainer.innerHTML = ''; // Limpiar el contenedor
        listaLibros.forEach(libro => {
            const libroCard = document.createElement('div');
            libroCard.classList.add('libro-card');

            libroCard.innerHTML = `
                <h3>${libro.titulo}</h3>
                <p><strong>Autora:</strong> ${libro.autora}</p>
                <p><strong>Año:</strong> ${libro.publicacion}</p>
                <p>${libro.descripcion}</p>
                <div class="tags-container">
                    ${libro.etiquetas.map(etiqueta => `<span class="tag">${etiqueta}</span>`).join('')}
                </div>
            `;
            librosContainer.appendChild(libroCard);
        });
    }

    function obtenerEtiquetasUnicas(listaLibros) {
        const todasLasEtiquetas = listaLibros.flatMap(libro => libro.etiquetas);
        return [...new Set(todasLasEtiquetas)];
    }

    function crearFiltros(etiquetas) {
        const botonTodos = document.createElement('button');
        botonTodos.textContent = 'Mostrar Todos';
        botonTodos.classList.add('filtro-btn', 'active');
        botonTodos.addEventListener('click', () => {
            mostrarLibros(libros);
            setActiveButton(botonTodos);
        });
        etiquetasFiltroContainer.appendChild(botonTodos);

        etiquetas.sort().forEach(etiqueta => {
            const botonFiltro = document.createElement('button');
            botonFiltro.textContent = etiqueta;
            botonFiltro.classList.add('filtro-btn');
            botonFiltro.addEventListener('click', () => {
                const librosFiltrados = libros.filter(libro => libro.etiquetas.includes(etiqueta));
                mostrarLibros(librosFiltrados);
                setActiveButton(botonFiltro);
            });
            etiquetasFiltroContainer.appendChild(botonFiltro);
        });
    }

    function setActiveButton(activeButton) {
        const botones = document.querySelectorAll('.filtro-btn');
        botones.forEach(button => button.classList.remove('active'));
        activeButton.classList.add('active');
    }
});