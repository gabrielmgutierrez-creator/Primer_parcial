
const form = document.getElementById('formCotizacion');
const nombreInput = document.getElementById('nombre');
const pesoInput = document.getElementById('peso');
const distanciaInput = document.getElementById('distancia');
const descuentoInput = document.getElementById('descuento');
const resultadoDiv = document.getElementById('resultado');
const contenidoResultado = document.getElementById('contenidoResultado');

function esSoloTexto(valor) {

    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    return regex.test(valor);
}

function calcularCotizacion(event) {
    event.preventDefault(); 

    limpiarErrores();

    const nombre = nombreInput.value.trim();
    const pesoKg = parseFloat(pesoInput.value);
    const distanciaKm = parseInt(distanciaInput.value);
    const codigoDescuento = descuentoInput.value.trim();

    let esValido = true;

    if (!nombre) {
    mostrarError('errorNombre', 'El nombre es obligatorio');
    marcarError(nombreInput);
    esValido = false;
} else if (!esSoloTexto(nombre)) {
    mostrarError('errorNombre', 'El nombre solo debe contener letras y espacios');
    marcarError(nombreInput);
    esValido = false;
}

    if (isNaN(pesoKg) || pesoKg <= 0) {
        mostrarError('errorPeso', 'Ingrese un peso válido mayor a 0');
        marcarError(pesoInput);
        esValido = false;
    }

    if (isNaN(distanciaKm) || distanciaKm <= 0) {
        mostrarError('errorDistancia', 'Ingrese una distancia válida mayor a 0');
        marcarError(distanciaInput);
        esValido = false;
    }

    if (!esValido) {
        return;
    }

    const costoPeso = pesoKg * 2.0;
    const costoDistancia = distanciaKm * 0.05;
    const subtotal = costoPeso + costoDistancia;

    let totalConDescuento = subtotal;
    let descuentoAplicado = 0;

    if (codigoDescuento.toUpperCase() === 'DESCUENTO10') {
        descuentoAplicado = subtotal * 0.10;
        totalConDescuento = subtotal - descuentoAplicado;
    } else if (codigoDescuento.toUpperCase() === 'DESCUENTO20') {
        descuentoAplicado = subtotal * 0.20;
        totalConDescuento = subtotal - descuentoAplicado;
    } else if (codigoDescuento.toUpperCase() === 'ENVIOGRATIS') {
        descuentoAplicado = costoDistancia;
        totalConDescuento = subtotal - descuentoAplicado;
    }

    const impuesto = totalConDescuento * 0.08;
    const totalFinal = totalConDescuento + impuesto;

    mostrarResultado({
        nombre,
        costoPeso,
        costoDistancia,
        subtotal,
        descuentoAplicado,
        totalConDescuento,
        impuesto,
        totalFinal
    });
}


function mostrarResultado(datos) {
    contenidoResultado.innerHTML = `
        <div class="resultado-item">
            <span class="label"> Cliente:</span>
            <span class="valor">${datos.nombre}</span>
        </div>
        <div class="resultado-item">
            <span class="label"> Costo por peso (${(datos.costoPeso / 2.0).toFixed(2)} kg × $2.00):</span>
            <span class="valor">$${datos.costoPeso.toFixed(2)}</span>
        </div>
        <div class="resultado-item">
            <span class="label"> Costo por distancia (${(datos.costoDistancia / 0.05).toFixed(0)} km × $0.05):</span>
            <span class="valor">$${datos.costoDistancia.toFixed(2)}</span>
        </div>
        <div class="resultado-item">
            <span class="label"> Subtotal:</span>
            <span class="valor">$${datos.subtotal.toFixed(2)}</span>
        </div>
        ${datos.descuentoAplicado > 0 ? `
            <div class="resultado-item" style="color: #2ecc71;">
                <span class="label"> Descuento aplicado:</span>
                <span class="valor">-$${datos.descuentoAplicado.toFixed(2)}</span>
            </div>
            <div class="resultado-item">
                <span class="label"> Total con descuento:</span>
                <span class="valor">$${datos.totalConDescuento.toFixed(2)}</span>
            </div>
        ` : ''}
        <div class="resultado-item">
            <span class="label"> Impuesto (8%):</span>
            <span class="valor">$${datos.impuesto.toFixed(2)}</span>
        </div>
        <div class="resultado-item total">
            <span class="label"> Total final:</span>
            <span class="valor">$${datos.totalFinal.toFixed(2)}</span>
        </div>
    `;

    resultadoDiv.style.display = 'block';
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function mostrarError(id, mensaje) {
    document.getElementById(id).textContent = mensaje;
}

function limpiarErrores() {
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
    document.querySelectorAll('input').forEach(el => el.classList.remove('error'));
}

function marcarError(input) {
    input.classList.add('error');
}

form.addEventListener('submit', calcularCotizacion);

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        this.classList.remove('error');
        const errorId = 'error' + this.id.charAt(0).toUpperCase() + this.id.slice(1);
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = '';
        }
    });
});

console.log(' Calculadora de envíos cargada correctamente');