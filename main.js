const contenedorDeProductos = document.getElementById('contenedor-productos');//lugar donde se van a ubicar las cards
const cartItems = document.getElementById('cart-items');
const cartPanel = document.getElementById('cart-panel');
const botonVaciar = document.getElementById('vaciarCarrito');
const btnTerminarCompra = document.getElementById('terminar-compra');
const total = document.getElementById('total');
const toggleButton = document.getElementById('toggleCartButton');

let carrito = JSON.parse(localStorage.getItem('carrito')) || {}
const listadoDeBebidas = []


botonVaciar.addEventListener('click', () => {
    carrito = {};
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostradoraDeCarrito();
    total.innerHTML = 'Total: $0';
});

toggleButton.addEventListener('click', () => {
    cartPanel.classList.toggle('active');
    localStorage.setItem('carrito_open', cartPanel.classList.contains('active'));
});


let dejoAbiertoElCarrito =
    JSON.parse(localStorage.getItem('carrito_open')) || false

if (dejoAbiertoElCarrito) {
    cartPanel.classList.add('active')
} else {
    cartPanel.classList.remove('active')
}


function mostradoraDeCarrito() {
    let seleccionadas = listadoDeBebidas.filter(l => carrito[l.nombre])
    if (!seleccionadas.length) {
        btnTerminarCompra.disabled = true
    } else {
        btnTerminarCompra.disabled = false
    }
    cartItems.innerHTML = ''

    listadoDeBebidas.forEach((el) => {
        if (carrito[el.nombre]) {

            let prod = `<div class="product-card" id="${el.id + 'V'}">
                    <img src="${el.imagen}" />
                    <h3>Unidades compradas: ${carrito[el.nombre].cantidad}</h3>
                    <h3> ${el.nombre}</h3>
                    <span class="price">$${el.precio * carrito[el.nombre].cantidad}</span>
			</div>`
            cartItems.innerHTML += prod
        }

    })

    total.innerHTML = calculadoraTotal()
}

btnTerminarCompra.addEventListener('click', () => {
    carrito = {};
    localStorage.removeItem('carrito')
    mostradoraDeCarrito()
    Swal.fire({
        title: "Compra exitosa!",
        text: "Muchas Gracias por tu compra!",
        icon: "success"
    });
})


function renderizarCards() {
    listadoDeBebidas.forEach((el) => {
        let producto = `
			<div class="product-card" id="${el.id + 'V'}">
				<img
					src=${el.imagen}
				/>
				<h3>${el.nombre}</h3>
				<span class="price">$${el.precio}</span>
				<button class="add-to-cart">
					Agregar al carrito
				</button>
			</div>`

        contenedorDeProductos.innerHTML += producto;


    });
}

function activarBotonDeCompra() {
    const agregarAlCarrito = document.querySelectorAll('.add-to-cart')
    agregarAlCarrito.forEach((el, i) =>
        el.addEventListener('click', () => {
            const producto = listadoDeBebidas[i];
            if (carrito[producto.nombre]) {
                carrito[producto.nombre].cantidad = carrito[producto.nombre].cantidad + 1;
            }
            else {
                carrito[producto.nombre] = {
                    nombre: producto.nombre,
                    precio: producto.precio,
                    cantidad: 1,
                    imagen: producto.imagen
                };
            }
            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostradoraDeCarrito();

        })
    )
}

function calculadoraTotal() {
    let suma = 0;
    for (let i = 0; i < listadoDeBebidas.length; i++) {
        let seleccion = carrito[listadoDeBebidas[i].nombre];
        if (seleccion) {
            suma = suma + seleccion.precio * seleccion.cantidad;
        }
    }
    return `Total: $${suma}`;
}



async function traedoraDeProductos() {
    try {
        const res = await fetch('./listado.json')
        const data = await res.json()

        data.forEach((el) => {
            listadoDeBebidas.push(el)
        })

    } catch (error) {
        console.error("Error al cargar bebidas:", error)
    }
}


async function run() {
    await traedoraDeProductos()
    renderizarCards()
    activarBotonDeCompra();
    calculadoraTotal()
}

run()