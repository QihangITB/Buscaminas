import { Tablero } from './tablero.js';
import { Jugador } from './jugador.js';

export class Juego {
    tablero;
    jugador;

    constructor() {
        this.tablero = new Tablero();
        this.jugador = new Jugador();
    }

    //Abre una nueva ventana para el formulario
    static abrirFormulario() { window.open('formulario.html', 'Formulario', 'width=700, height=700'); }

    saludarJugador(idMensaje){
        if (this.jugador.apellido === "") {
            idMensaje.innerHTML = `Bienvenido al Buscaminas <span>${this.jugador.nombre}</span>!`;
        } else {
            idMensaje.innerHTML = `Bienvenido al Buscaminas <span>${this.jugador.nombre}</span>, <span>${this.jugador.apellido}</span>!`;
        }
    }


    //FUNCIONES DE CONFIGURACION DE FORMULARIO

    assignarColorFormulario(mensajeError) {
        if (mensajeError.textContent == "Válido") {
            mensajeError.style.color = 'Green';
        } else {
            mensajeError.style.color = 'Red';
        }
    }

    //Esta funcion devolvera un boleano segun si ha pasado o no el formulario
    configurarPerfil(event) {
        const formulario = document.getElementById('formulario');
        const opcionEscogido = formulario.className;

        //Selectores comunes para el registro y el inicio de sesion:
        var inputNick = document.getElementById('nick');
        var inputContraseña = document.getElementById('contraseña');
        var errorNick = document.getElementById('errorNick');
        var errorContraseña = document.getElementById('errorContraseña');

        if (opcionEscogido === 'registrar') {

            var inputNombre = document.getElementById('nombre');
            var inpuApellido = document.getElementById('apellido');
            var inputFechaNacimiento = document.getElementById('fechaNacimiento');
            var inputMail = document.getElementById('mail');
            var errorNombre = document.getElementById('errorNombre');
            var errorFechaNacimiento = document.getElementById('errorFechaNacimiento');
            var errorMail = document.getElementById('errorMail');

            //Aparte de validar los campos del formulario, tambien tenemos que tenner en cuenta las validaciones personalizadas
            if (!formulario.checkValidity() || !Jugador.validarMayorEdad(inputFechaNacimiento.value) || Jugador.validarNickExistente(inputNick.value)) {
                event.preventDefault(); //Cancela el envio del formulario

                errorNombre.textContent = Jugador.mensajeValidadorNombre(inputNombre);
                this.assignarColorFormulario(errorNombre);

                errorFechaNacimiento.textContent = Jugador.mensajeValidadorFN(inputFechaNacimiento);
                this.assignarColorFormulario(errorFechaNacimiento);

                errorNick.textContent = Jugador.mensajeValidadorNick(inputNick);
                this.assignarColorFormulario(errorNick);

                errorMail.textContent = Jugador.mensajeValidadorMail(inputMail);
                this.assignarColorFormulario(errorMail);

                errorContraseña.textContent = Jugador.mensajeValidadorContraseña(inputContraseña);
                this.assignarColorFormulario(errorContraseña);

                return false; //Error con el formulario

            } else {
                this.jugador = new Jugador(inputNombre.value, inpuApellido.value, inputFechaNacimiento.value, inputNick.value, inputMail.value, inputContraseña.value);
                this.añadirJugador();

                return true; //Se ha creado un nuevo perfil
            }

        } else if (opcionEscogido === 'iniciarSesion') {
            if (!formulario.checkValidity()) {
                event.preventDefault();

                errorNick.textContent = "Valor inválido";
                this.assignarColorFormulario(errorNick);
                
                errorContraseña.textContent = "Valor inválido";
                this.assignarColorFormulario(errorContraseña);

                return false; //Error con el formulario

            } else {
                let datosJugador = this.buscarJugador(inputNick.value);

                if (datosJugador === null) {
                    errorNick.textContent = "El nombre de usuario no existe";
                    errorNick.style.color = 'Red';
                    errorContraseña = "";
                    return false; //No se ha encontrado el perfil

                } else {
                    errorNick.textContent = "Jugador encontrado";
                    errorNick.style.color = 'Green';
                    let datosJugadorObj = JSON.parse(datosJugador)

                    if (datosJugadorObj.contraseña === inputContraseña.value) {
                        this.jugador = datosJugadorObj;
                        return true; //Se ha iniciado sesion con el perfil

                    } else {
                        errorContraseña.textContent = "Contraseña incorrecta";
                        errorContraseña.style.color = 'Red';
                        return false; //Contraseña incorrecta
                    }
                }
            }
        }
    }

    configurarTablero(event) {
        const formulario = document.getElementById('formulario');

        var inputNumeroFilas = document.getElementById('numeroFilas');
        var inputNumeroColumnas = document.getElementById('numeroColumnas');
        var inputNumeroBombas = document.getElementById('numeroBombas');
        var errorNumeroFilas = document.getElementById('errorNumeroFilas');
        var errorNumeroColumnas = document.getElementById('errorNumeroColumnas');
        var errorNumeroBombas = document.getElementById('errorNumeroBombas');

        if (!formulario.checkValidity() || Tablero.validarExcesoBombas(inputNumeroBombas.value, inputNumeroFilas.value, inputNumeroColumnas.value)) {
            event.preventDefault();

            errorNumeroFilas.textContent = Tablero.mensajeValidadorNumFilas(inputNumeroFilas);
            this.assignarColorFormulario(errorNumeroFilas);
            
            errorNumeroColumnas.textContent = Tablero.mensajeValidadorNumColumnas(inputNumeroColumnas);
            this.assignarColorFormulario(errorNumeroColumnas);
            
            errorNumeroBombas.textContent = Tablero.mensajeValidadorNumBombas(inputNumeroBombas, inputNumeroFilas, inputNumeroColumnas);
            this.assignarColorFormulario(errorNumeroBombas);
            return false;

        } else {
            this.tablero = new Tablero(inputNumeroFilas.value, inputNumeroColumnas.value, inputNumeroBombas.value);
            this.añadirTablero();
            
            return true;
        }
    }


    //FUNCIONES PARA EL CONTROL DEL LOCAL STORAGE

    añadirJugador() {
        //Guardamos el Objeto en String al localSotorage con clave "usuario+i"
        let jugadorString = JSON.stringify(this.jugador);
        localStorage.setItem(this.jugador.nick, jugadorString);
    }

    añadirTablero() {
        let tableroString = JSON.stringify(this.tablero);
        //Guardamos el objeto de tablero con una clave formado por:
        //"T_": Indicando que es un tablero
        //"nombre usuario": para poder buscar los tableros de un usuario especifico
        localStorage.setItem("T_" + this.jugador.nick, tableroString);
    }

    eliminarJugador(jugador) {
        //Se eliminara el perfil del jugador junto con su tablero
        localStorage.removeItem(jugador);
        localStorage.removeItem("T_" + jugador);
    }

    eliminarLocalStorage() {
        localStorage.clear();
    }

    buscarJugador(nick) {
        for (var key in localStorage) {
            if (key === nick) {
                return localStorage.getItem(key);
            }
        }
        return null;
    }

    buscarTablero(nick) {
        for (var key in localStorage) {
            if (key === "T_" + nick) {
                return localStorage.getItem(key);
            }
        }
        return null;
    }


    //FUNCIONES DE LA PARTIDA

    crearTabla() {
        this.tablero.generarTablero();
        this.tablero.generarBombas();
        this.tablero.contarBombasCercanas();
    }

    crearTablaDOM(idTablero) {
        idTablero.innerHTML = "";
        this.tablero.matriz.forEach(fila => {
            const filaElemento = document.createElement('tr');
            filaElemento.className = 'fila';
            fila.forEach(casilla => {
                const casillaElemento = document.createElement('td');
                casillaElemento.className = `X:${casilla.coordX} Y:${casilla.coordY}` + " " + "casilla";
                filaElemento.appendChild(casillaElemento);
            });
            idTablero.appendChild(filaElemento);
        });
    }

    actualizarTablaDOM() {
        this.tablero.matriz.forEach(fila => {
            fila.forEach(casilla => {                
                const casillaElemento = document.querySelector(`.X\\:${casilla.coordX}.Y\\:${casilla.coordY}.casilla`);
                if (casilla.revelada) {
                    casillaElemento.innerHTML = casilla.esBomba ? '💣' : casilla.bombasCercanas;
                    casillaElemento.style.backgroundColor = casilla.esBomba ? 'lightcoral' : casilla.bombasCercanas > 0 ? 'lightgreen' : 'lightBlue';

                } else {
                    casillaElemento.innerHTML = casilla.bandera ? '🚩' : '';
                    casillaElemento.style.backgroundColor = casilla.bandera ? 'rgb(241, 230, 67)' : 'rgb(139, 139, 139)';
                }
            });
        });
    }

    revelarCasilla(event) {
        //Creamos un array CLASS = ['X:0', 'Y:0', casilla]
        const CLASS = event.target.className.split(' ');
        //Extraemos el valor numerico de X y de Y, cogiendo desde la posicion 2 hasta el final, por si tiene mas de un digito
        const X = CLASS[0].substring(2, CLASS[0].length);
        const Y = CLASS[1].substring(2, CLASS[1].length);
        //Los valores lo pasamos a la funcion "destapaCasilla()"
        this.tablero.destapaCasilla(X, Y);
    }

    alternarBandera(event) {
        const CLASS = event.target.className.split(' ');
        const X = CLASS[0].substring(2, CLASS[0].length);
        const Y = CLASS[1].substring(2, CLASS[1].length);
        this.tablero.matriz[X][Y].cambiarBandera();
    }

    validarVictoria() {
        let resultado = this.tablero.transcursoJuego();
        if (resultado === 1) {
            alert('VICTORIA');
        } else if (resultado === -1) {
            alert('DERROTA');
        }
    }
}