
function cargarPacks() {
    const contenedor = document.getElementById('lista-packs');
    
    if (!contenedor) return; 

    fetch('/api/packs')
        .then(res => {
            if (!res.ok) throw new Error("Error en la respuesta del servidor");
            return res.json();
        })
        .then(data => {
            contenedor.innerHTML = ''; 

            data.forEach(pack => {
                // 1. Convertimos la cantidad a número para validar
                const stockActual = parseInt(pack.cantidad);

                // 2. Solo dibujamos la tarjeta si hay stock disponible
                if (stockActual > 0) {
                    contenedor.innerHTML += `
                        <div class="card">
                            <h3>${pack.negocio}</h3>
                            <p><strong>${pack.producto}</strong></p>
                            <p class="price">$${Number(pack.precioOferta).toLocaleString('es-CO')}</p>
                            <div class="badge-cantidad">${pack.cantidad} disponibles</div>
                            <p class="direccion-texto"> ${pack.direccionRecogida || 'Dirección no disponible'}</p>

                            <div class="selector-compra">
                                <label>¿Cuántos desea comprar?</label>
                                <input type="number" id="cant-reserva-${pack.id}" 
                                       value="1" min="1" max="${stockActual}" class="input-reserva">
                            </div>
                            <p><small>Horario: ${pack.horaRecogida || 'Consultar'}</small></p>
                            <button onclick="realizarReserva(${pack.id})" class="btn-reservar">Reservar ahora</button>
                        </div>
                    `;
                }
            });

            // 3. Validación extra: si no se agregó ninguna tarjeta, avisamos al usuario
            if (contenedor.innerHTML === '') {
                contenedor.innerHTML = `
                    <div class="mensaje-vacio">
                        <p>🥦 ¡Vaya! Por ahora se han agotado todos los alimentos disponibles.</p>
                        <p>¡Vuelve pronto para seguir rescatando comida!</p>
                    </div>
                `;
            }
        })
        .catch(err => console.error("Error cargando packs:", err));
}

// --- 2. PUBLICAR NUEVO PACK (PANEL) ---
function enviarPack() {
    const user = JSON.parse(localStorage.getItem('ecoFoodUser'));
    const cantidadNum = document.getElementById('cantidad').value;
    const unidad = document.getElementById('unidadMedida').value;

    if (!user) return alert("Debes iniciar sesión para publicar");

    // CAPTURA DE VALORES
   const productoInput = document.getElementById('producto').value;
    const precioInput = document.getElementById('precioOferta').value;
    const hInicio = document.getElementById('horaInicio').value;
    const hFin = document.getElementById('horaFin').value;
    const cantidadInput = document.getElementById('cantidad').value; // El número
    const unidadInput = document.getElementById('unidadMedida').value; // El select (libras/unidades)
    const direccion = document.querySelector('input[placeholder*="Carrera 6"]').value;
    const cantidadConUnidad = `${cantidadInput} ${unidadInput}`;
    const rangoHoras = `${hInicio} - ${hFin}`;

    // VALIDACIÓN
    if (!productoInput || !precioInput || !hInicio || !hFin || !cantidadInput || !direccion ){
        return alert("Por favor, completa todos los campos del formulario.");
    }
    

    const nuevoPack = {
        negocio: user.nombreNegocio,
        producto: productoInput,
        precioOferta: precioInput,
        horaRecogida: rangoHoras,
        usuario_id: user.id,
        cantidad: cantidadConUnidad,
        direccionRecogida: direccion
    };

    

    fetch('/api/packs', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(nuevoPack)
    })
    .then(res => res.json())
    .then(() => {
        alert('¡Pack publicado con éxito!');
        location.reload(); // Recargamos para limpiar y actualizar
    })
    .catch(err => console.error("Error al publicar:", err));
}


// Modifica tu función para que reciba la dirección
function mostrarModalPago(cantidad, total, direccion) {
    const detalles = document.getElementById('detalles-pago');
    const contenedorDireccion = document.getElementById('direccion-modal');

    // Insertar detalles del pago
    detalles.innerHTML = `
        <p>Has reservado: <strong>${cantidad} unidad(es)</strong></p>
        <p class="total-grande">Total a pagar: <strong>$${total.toLocaleString('es-CO')}</strong></p>
    `;

    // Insertar la dirección del establecimiento
    contenedorDireccion.innerHTML = `
        <p style="margin-top: 10px; color: #555;">
            📍 <strong>Lugar de recogida:</strong><br>
            ${direccion || 'Dirección no especificada'}
        </p>
    `;

    document.getElementById('modalPago').style.display = 'block';
}

function realizarReserva(idPack) {
    const input = document.getElementById(`cant-reserva-${idPack}`);
    const cantidadSoli = parseInt(input.value);
    const card = input.closest('.card');
    const direccion = card.querySelector('.direccion-texto').innerText.replace('📍 ', '');
    const precioTexto = card.querySelector('.price').innerText;
    const precioNumerico = parseInt(precioTexto.replace(/\D/g, ''));

    if (isNaN(cantidadSoli) || cantidadSoli <= 0) {
        return alert("Por favor, ingresa una cantidad válida.");
    }

    if (!confirm(`¿Deseas reservar ${cantidadSoli} unidad(es)?`)) return;

    fetch(`/api/packs/reservar/${idPack}`, {
        method: 'PUT', // Usamos PUT porque estamos actualizando la cantidad
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidadReserva: cantidadSoli })
    })
    .then(res => res.json())
    .then(data => {
        if (data.exito) {
            const total = precioNumerico * cantidadSoli;
            mostrarModalPago(cantidadSoli, total,direccion);
        } else {
            // Aquí se mostrará el mensaje: "No es posible reservar esa cantidad..."
            alert(data.mensaje);
        }
    })
    .catch(err => {
        console.error("Error en reserva:", err);
        alert("No se pudo completar la reserva.");
    });

    function mostrarModalPago(cantidad, total,direccion) {
    const detalles = document.getElementById('detalles-pago');
    const contenedorDireccion = document.getElementById('direccion-modal');
    detalles.innerHTML = `
        <p>Has reservado: <strong>${cantidad} unidad(es)</strong></p>
        <p class="total-grande">Total a pagar: <strong>$${total.toLocaleString('es-CO')}</strong></p>
    `;

    if (contenedorDireccion) {
        contenedorDireccion.innerHTML = `
            <div style="background: #f1f8e9; padding: 10px; border-radius: 8px; margin: 10px 0; border-left: 5px solid #2e7d32;">
                <p style="margin:0; font-size: 0.9rem;">📍 <strong>Recoger en:</strong></p>
                <p style="margin:0; font-weight: bold;">${direccion}</p>
            </div>
        `;
    }

    document.getElementById('modalPago').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modalPago').style.display = 'none';
    location.reload();
}
}

// --- 3. CERRAR SESIÓN ---
function cerrarSesion() {
    localStorage.removeItem('ecoFoodUser');
    alert("Sesión cerrada correctamente");
    window.location.href = 'index.html';
}

// --- 4. LÓGICA AL CARGAR LA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    const userRaw = localStorage.getItem('ecoFoodUser');
    const user = (userRaw && userRaw !== "undefined")? JSON.parse(userRaw) : null;

    if (!user && window.location.pathname.includes('panel.html')) {
        // Si no hay usuario, podrías redirigir al login o simplemente no hacer nada
        window.location.href = 'login.html';
      
    }
    
    // A. Control del Menú Navegación
    const menuInvitado = document.getElementById('menu-invitado');
    const menuUsuario = document.getElementById('menu-usuario');
    const nombreNav = document.getElementById('nombre-negocio-nav');

    if (user && user.nombreNegocio) {
        if (nombreNav) nombreNav.innerText = `🏪 ${user.nombreNegocio}`;
        if (menuInvitado) menuInvitado.style.display = 'none';
        if (menuUsuario) menuUsuario.style.display = 'flex';
    } else {
        if (menuInvitado) menuInvitado.style.display = 'flex';
        if (menuUsuario) menuUsuario.style.display = 'none';
    }

    // B. Saludo en el Panel
    const saludoNegocio = document.getElementById('nombre-negocio-panel');
    if (user && saludoNegocio) {
        saludoNegocio.innerText = user.nombreNegocio;
    }

    // C. Carga inicial de packs
    cargarPacks();
});

document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            // Añade o quita la clase 'active' al menú y al botón
            navMenu.classList.toggle("active");
            navToggle.classList.toggle("active");
        });
    }
});