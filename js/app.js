let cliente = {
    mesa: '',
    hora: '',
    pedida: []
};

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}
const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    //revisar si hay campos vacios, .some va a verificar que al menos uno cumpla la condicion
    const camposVacios = [mesa, hora].some(campo => campo === '');

    if (camposVacios) {
        //verificar si ya hay una alerta
        const existeAlerta = document.querySelector('.invalid-feedback');

        if (!existeAlerta) {
            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Todos los campos son obligatorios';
            //va a insertarlo despues del form
            document.querySelector('.modal-body form').appendChild(alerta);
            //va a eliminar la alerta despues de 3 segundos
            setTimeout(() => {
                alerta.remove();
            }, 3000);
        }
        return;
        //console.log('Si hay al menos un campo vacio');
    }

    //Asignar datos del formulario a cliente, una copia del objeto q hicimos arriba y luego se le asigne la mesa y la hora
    cliente = { ...cliente, mesa, hora };

    //ocultar modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();  //hide es un metodo de bootstrap para ocultarlo

    //Mostrar las secciones
    mostrarSecciones();
    //Obtener datos de la API
    obtenerPlatillos();
}
function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none'); //usamos selectorAll porque requiero mas de una
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none')); //eliminamos la clase display none
}
//para consultar los platillos a la API
function obtenerPlatillos() {
    const url = `http://localhost:4000/platillos`;
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarPlatillos(resultado))
        .catch(error => console.log(error))
}
function mostrarPlatillos(platillos) {
    const contenido = document.querySelector('#platillos .contenido');
    //iteramos en los platillos y foreach nos permite ir accediendo a cada platillo
    platillos.forEach(platillo => {
        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('DIV');
        precio.classList.add('col-md-3', 'py-3', 'fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3', 'py-3');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number'; //le decimos que el tipo de dato va a ser numero
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        //Función que detecta la cantidad y el platillo que se esta agregando
        inputCantidad.onchange = function () {
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({ ...platillo, cantidad }); //lo convierto en objeto y le paso el platillo y la cantidad
        }

        const agregar = document.createElement('DIV');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);

        contenido.appendChild(row);
    })
}

function agregarPlatillo(producto) {
    //extraer el pedido actual
    let { pedido } = cliente;

    //revisar que la cantidad sea mayor a 0
    if (producto.cantidad > 0) {
        //comprueba si el elemento ya existe en el array
        if (pedido.some(articulo => articulo.id === producto.id)) {
            //el articulo ya existe, actualizamos la cantidad
            const pedidoActualizado = pedido.map(articulo => {
                //identificamos que articulo es que queremos actualizar
                if (articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            });
            //se asigna el nuevo arreglo a cliente.pedido
            cliente.pedido = [...pedidoActualizado];
        } else {
            cliente.pedido = [...pedido, producto]; //en caso que no exista se tiene que agregar el elemento 
        }
    } else {
        //eliminar elementos cuando la cantidad es 0
        const resultado = pedido.filter(articulo => articulo.id !== producto.id);
        cliente.pedido= [...resultado];
    }
    
}

