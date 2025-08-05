document.addEventListener('DOMContentLoaded', () => {
    const ramos = document.querySelectorAll('.ramo');
    const modal = document.getElementById('modal-requisitos');
    const spanCerrar = document.querySelector('.cerrar-modal');
    const listaRequisitos = document.getElementById('lista-requisitos');

    // Cargar estado de ramos aprobados desde localStorage
    let ramosAprobados = JSON.parse(localStorage.getItem('ramosAprobados')) || [];

    function actualizarRamos() {
        ramos.forEach(ramo => {
            const id = ramo.id;
            const requisitos = ramo.dataset.requisitos ? ramo.dataset.requisitos.split(',') : [];
            let requisitosCumplidos = true;

            for (const req of requisitos) {
                if (!ramosAprobados.includes(req)) {
                    requisitosCumplidos = false;
                    break;
                }
            }

            // Actualizar clases de aprobado
            if (ramosAprobados.includes(id)) {
                ramo.classList.add('aprobado');
            } else {
                ramo.classList.remove('aprobado');
            }

            // Actualizar clases de bloqueado
            if (!requisitosCumplidos) {
                ramo.classList.add('bloqueado');
            } else {
                ramo.classList.remove('bloqueado');
            }
        });
    }

    function guardarRamos() {
        localStorage.setItem('ramosAprobados', JSON.stringify(ramosAprobados));
    }

    function mostrarModalRequisitos(requisitosFaltantes) {
        listaRequisitos.innerHTML = '';
        requisitosFaltantes.forEach(reqId => {
            const ramoReq = document.getElementById(reqId);
            if (ramoReq) {
                const li = document.createElement('li');
                li.textContent = ramoReq.textContent;
                listaRequisitos.appendChild(li);
            }
        });
        modal.style.display = 'block';
    }

    ramos.forEach(ramo => {
        ramo.addEventListener('click', () => {
            const id = ramo.id;
            const requisitos = ramo.dataset.requisitos ? ramo.dataset.requisitos.split(',') : [];
            const requisitosFaltantes = [];

            requisitos.forEach(req => {
                if (!ramosAprobados.includes(req)) {
                    requisitosFaltantes.push(req);
                }
            });

            if (requisitosFaltantes.length > 0) {
                mostrarModalRequisitos(requisitosFaltantes);
                return;
            }
            
            // Si no está bloqueado, se puede aprobar/desaprobar
            if (ramosAprobados.includes(id)) {
                // Desaprobar: quitar de la lista
                ramosAprobados = ramosAprobados.filter(ramoId => ramoId !== id);
            } else {
                // Aprobar: añadir a la lista
                ramosAprobados.push(id);
            }
            
            guardarRamos();
            actualizarRamos();
        });
    });

    // Eventos del modal
    spanCerrar.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Inicializar estado al cargar la página
    actualizarRamos();
});
