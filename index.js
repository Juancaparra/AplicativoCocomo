function calcularEsfuerzo(kloc, factoresAjuste) {
    const a = 3.2;
    const b = 1.05;
    return a * Math.pow(kloc, b) * factoresAjuste;
}

function calcularDuracion(esfuerzo, numProgramadores) {
    return esfuerzo / numProgramadores;
}

function calcularEquipoNecesario(esfuerzo, duracionDeseada) {
    return esfuerzo / duracionDeseada;
}

function estimarCosto(esfuerzo, sueldoMensual, duracionEnMeses) {
    let costoTotal = 0;
    let sueldoActual = sueldoMensual;

    for (let mes = 1; mes <= duracionEnMeses; mes++) {
        costoTotal += sueldoActual * esfuerzo;
        if (mes % 12 === 0) {
            sueldoActual *= 1.05;
        }
    }

    return costoTotal;
}

function interpretarResultados(esfuerzo, duracion, equipo, costo) {
    return `
        El esfuerzo estimado es de ${esfuerzo.toFixed(2)} persona-meses.
        La duración estimada es de ${duracion.toFixed(2)} meses.
        El equipo necesario es de ${equipo.toFixed(2)} programadores.
        El costo total estimado del proyecto es de $${costo.toFixed(2)}.
    `;
}

const kloc = 50;
const factoresAjuste = 1.2;
const sueldoMensual = 2000;
const numProgramadores = 5;
const duracionDeseada = 12;

const esfuerzo = calcularEsfuerzo(kloc, factoresAjuste);
const duracion = calcularDuracion(esfuerzo, numProgramadores);
const equipo = calcularEquipoNecesario(esfuerzo, duracionDeseada);
const costo = estimarCosto(esfuerzo, sueldoMensual, duracion);

console.log(interpretarResultados(esfuerzo, duracion, equipo, costo));