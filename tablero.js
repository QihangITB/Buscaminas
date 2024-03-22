import { Casilla } from './casilla.js';

export class Tablero {
    numFilas;
    numColumnas;
    numBombas;
    matriz;

    constructor(filas, columnas, bombas) {
        this.numFilas = filas;
        this.numColumnas = columnas;
        this.numBombas = bombas;
        this.matriz = [];
    }

    convertidorJSONaObj(string) {
        if (string === null || string === undefined) return;

        var objeto = JSON.parse(string);
        this.numFilas = objeto.numFilas;
        this.numColumnas = objeto.numColumnas;
        this.numBombas = objeto.numBombas;
        this.matriz = objeto.matriz;
    }


    //CREACION DEL TABLERO

    generarTablero() {
        for (let fila = 0; fila < this.numFilas; fila++) {
            this.matriz[fila] = [];
            for (let columna = 0; columna < this.numColumnas; columna++) {
                this.matriz[fila][columna] = new Casilla(fila, columna);
            }
        }
    }

    generarBombas() {
        let bombasColocadas = 0;
        while (bombasColocadas < this.numBombas) {
            let fila = Math.floor(Math.random() * this.numFilas);
            let columna = Math.floor(Math.random() * this.numColumnas);
            if (!this.matriz[fila][columna].esBomba) {
                this.matriz[fila][columna].ponerBomba();
                bombasColocadas++;
            }
        }
    }


    //JUGABILIDAD DEL JUEGO

    casillaValida(fila, columna) {
        return fila >= 0 && fila < this.numFilas && columna >= 0 && columna < this.numColumnas;
    }

    contarBombasCercanas() {
        for (let fila = 0; fila < this.numFilas; fila++) {
            for (let columna = 0; columna < this.numColumnas; columna++) {
                if (this.matriz[fila][columna].esBomba) {
                    for (let i = - 1; i <= 1; i++) {
                        for (let j = - 1; j <= 1; j++) {
                            let nuevaFila = parseInt(fila) + parseInt(i);
                            let nuevaColumna = parseInt(columna) + parseInt(j);
                            if (this.casillaValida(nuevaFila, nuevaColumna)) {
                                this.matriz[nuevaFila][nuevaColumna].bombasCercanas++;
                            }
                        }
                    }
                }
            }
        }
    }

    mostrarCasillas(fila, columna) {
        this.matriz[fila][columna].revelar();
        if (this.matriz[fila][columna].bombasCercanas === 0) {
            for (let i = - 1; i <= 1; i++) {
                for (let j = - 1; j <= 1; j++) {
                    let nuevaFila = parseInt(fila) + parseInt(i);
                    let nuevaColumna = parseInt(columna) + parseInt(j);
                    if (this.casillaValida(nuevaFila, nuevaColumna) && !this.matriz[nuevaFila][nuevaColumna].revelada) {
                        this.mostrarCasillas(nuevaFila, nuevaColumna);
                    }
                }
            }
        }
    }

    mostrarBombas() {
        for (let fila = 0; fila < this.numFilas; fila++) {
            for (let columna = 0; columna < this.numColumnas; columna++) {
                if (this.matriz[fila][columna].esBomba) {
                    this.matriz[fila][columna].revelar();
                }
            }
        }
    }

    destapaCasilla(fila, columna) {
        if (this.matriz[fila][columna].esBomba) {
            this.mostrarBombas();
        } else if (!this.matriz[fila][columna].bandera){
            this.mostrarCasillas(fila, columna);
        }
    }

    transcursoJuego() {
        let contadorCasillas = 0, resultado = 0;
        for (let fila = 0; fila < this.numFilas; fila++) {
            for (let columna = 0; columna < this.numColumnas; columna++) {
                if (this.matriz[fila][columna].revelada) {
                    if(this.matriz[fila][columna].esBomba){
                        resultado = -1; //Pierde si una bomba esta revelada
                    } else {
                        contadorCasillas++;
                    }
                }
            }
        }
        if (contadorCasillas === (this.numFilas * this.numColumnas) - this.numBombas && resultado !== -1) {
            resultado = 1; //Gana si todas las casillas no-bomba están reveladas
        }
        return resultado; //Derrota = -1, Continua = 0, Victoria = 1
    }

    static validarExcesoBombas(numBombas, numFilas, numColumnas) {
        return numBombas >= (numFilas * numColumnas);
    }


    //MENSAJES PARA EL VALIDADOR DE FORMULARIO DEL TABLERO

    static mensajeValidadorNumFilas(inputNumFilas) {
        if (inputNumFilas.checkValidity()) return 'Válido';
        if (inputNumFilas.validity.valueMissing) return 'Campo obligatorio';
        if (inputNumFilas.validity.patternMismatch) return 'Debe de ser un número entero';
        if (inputNumFilas.validity.rangeUnderflow) return 'Debe de ser un número mayor a 3';
        if (inputNumFilas.validity.rangeOverflow) return 'Debe de ser un número menor a 50';
        return 'Error desconocido';
    }

    static mensajeValidadorNumColumnas(inputNumColumnas) {
        if (inputNumColumnas.checkValidity()) return 'Válido';
        if (inputNumColumnas.validity.valueMissing) return 'Campo obligatorio';
        if (inputNumColumnas.validity.patternMismatch) return 'Debe de ser un número entero';
        if (inputNumColumnas.validity.rangeUnderflow) return 'Debe de ser un número mayor a 3';
        if (inputNumColumnas.validity.rangeOverflow) return 'Debe de ser un número menor a 50';
        return 'Error desconocido';
    }

    static mensajeValidadorNumBombas(inputNumBombas, inputNumFilas, inputNumColumnas) {
        if (inputNumBombas.validity.valueMissing) return 'Campo obligatorio';
        if (Tablero.validarExcesoBombas(inputNumBombas.value, inputNumFilas.value, inputNumColumnas.value)) return 'Hay un exceso de bombas';
        if (inputNumBombas.checkValidity()) return 'Válido';
        if (inputNumBombas.validity.patternMismatch) return 'Debe de ser un número entero';
        if (inputNumBombas.validity.rangeUnderflow) return 'Debe de ser un número mayor a 1';
        return 'Error desconocido';
    }

}