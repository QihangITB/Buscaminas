import { Juego } from './juego.js';

//CODIGO HTML
const HTML_REGISTRAR = `<form id="formulario" class="registrar" method="post">
                            <div>
                                <label for="nombre">*Nombre:</label>
                                <input type="text" id="nombre" name="nombre" pattern="^[A-Z]{1}[a-z]*" required><br>
                                <span id="errorNombre" class="error"></span><br>
                            </div>
                            <div>
                                <label for="apellido">Apellido:</label>
                                <input type="text" id="apellido" name="apellido"><br>
                                <span id="errorApellido" class="error"></span>
                            </div>
                            <div>
                                <label for="fechaNacimiento">*Fecha de Nacimiento:</label>
                                <input type="date" id="fechaNacimiento" name="fechaNacimiento" min="1900-01-01" max="2025-01-01" required><br>
                                <span id="errorFechaNacimiento" class="error"></span><br>
                            </div>
                            <div>
                                <label for="nick">*Usuario (nick):</label>
                                <input type="text" id="nick" name="nick" pattern="[a-zA-Z0-9]*[0-9]$" required><br>
                                <span id="errorNick" class="error"></span><br>
                            </div>
                            <div>
                                <label for="mail">*Mail:</label>
                                <input type="email" id="mail" name="mail" pattern="[a-zA-A0-9._%+]+@itb.cat$" required><br>
                                <span id="errorMail" class="error"></span><br>
                            </div>
                            <div>
                                <label for="contraseña">*Contraseña:</label>
                                <input type="password" id="contraseña" name="contraseña" required><br>
                                <span id="errorContraseña" class="error"></span><br>
                            </div>
                            <button id="enviar" class="menuRegistrar" type="submit">Registrar</button>
                        </form>
                        <button id="registrar" hidden>REGISTRAR</button>
                        <button id="iniciarSesion" hidden>INICIAR SESION</button>
                        <button id="volver" class="menuRegistrar">Volver</button>`;

const HTML_INICIAR_SESION = `<form id="formulario" class="iniciarSesion"  method="post">
                                <div>
                                    <label for="nick">Usuario (nick):</label>
                                    <input type="text" id="nick" name="nick" pattern="[a-zA-Z0-9]*[0-9]$" required><br>
                                    <span id="errorNick" class="error"></span><br>
                                </div>
                                <div>
                                    <label for="contraseña">Contraseña:</label>
                                    <input type="password" id="contraseña" name="contraseña" required><br>
                                    <span id="errorContraseña" class="error"></span><br>
                                </div>
                                <button id="enviar" class="menuIniciarSesion" type="submit">Iniciar Sesion</button><br>
                            </form>
                            <button id="registrar" hidden>REGISTRAR</button>
                            <button id="iniciarSesion" hidden>INICIAR SESION</button>
                            <button id="volver" class="menuIniciarSesion">Volver</button>`;

const HTML_OPCIONES = `<form id="formulario" hidden>
                            <button id="enviar" type="submit" hidden>Iniciar Sesión</button>
                       </form>
                       <button id="registrar" class="menuFormulario">REGISTRAR</button>
                       <button id="iniciarSesion" class="menuFormulario">INICIAR SESION</button>
                       <button id="volver" hidden>Volver</button>`;

const HTML_TABLERO = `<form id="formulario" class="configTablero" method="post">
                            <div class="tableroInfo">
                                <label for="numeroFilas">Numero de Filas:</label>
                                <input type="number" id="numeroFilas" name="numeroFilas" pattern="[0-9]+" min="3" max="50" required>
                                <span id="errorNumeroFilas" class="error"></span>
                            </div>
                            <div class="tableroInfo">
                                <label for="numeroColumnas">Numero de Columnas:</label>
                                <input type="number" id="numeroColumnas" name="numeroColumnas" pattern="[0-9]+" min="3" max="50" required>
                                <span id="errorNumeroColumnas" class="error"></span>
                            </div>
                            <div class="tableroInfo">
                                <label for="numeroBombas">Numero de Bombas:</label>
                                <input type="number" id="numeroBombas" name="numeroBombas" pattern="[0-9]+" min="1" required>
                                <span id="errorNumeroBombas" class="error"></span>
                            </div>
                            <button id="enviar" class="menuTablero" type="submit">Jugar</button>
                      </form>`;

var juego = new Juego();

//INICIALIZACION DE FORMULARIOS
if (document.title === 'PR3_Buscaminas') {
    //Asignaremos nombre al "index.html" para facilitar la movilidad entre ventanas
    window.name = "formulario";
    //Abrira nueva pestaña para registrarse o iniciar sesion, si no hay usuario logeado.
    let botonEmpezar = document.getElementById('botonEmpezar');
    botonEmpezar.addEventListener('click', function () {
        Juego.abrirFormulario();

        let contenedorInicio = document.getElementById('secInicio');
        contenedorInicio.setAttribute('hidden', true);        
    });

    window.addEventListener('message', function (event) {
        //Mostramos el tablero y los botones
        let contenedorSaludos = document.getElementById('secSaludos');
        contenedorSaludos.removeAttribute('hidden');
        let contenedorTablero = document.getElementById('secTablero');
        contenedorTablero.removeAttribute('hidden');
        let contenedorBotones = document.getElementById('secbotones');
        contenedorBotones.removeAttribute('hidden');

        //Recuperaremos los datos guardados a traves del Local Storage, en forma de string
        let jugadorString = juego.buscarJugador(event.data);
        let tableroString = juego.buscarTablero(event.data);

        //Utilizamos el metodo convertidorJSONaObj para convertir el string a un objeto
        //Ja que con el JSON.parse no se puede acceder a los metodos privados
        juego.jugador.convertidorJSONaObj(jugadorString);
        juego.tablero.convertidorJSONaObj(tableroString);
        iniciarJuego();

    });
}

if (document.title === 'Formulario') {
    if (opener === null || opener.name === null) {
        alert(`NO SE HA PODIDO CARGAR EL FORMULARIO. POR FAVOR, ENTRA DESDE EL LA PAGINA PRINCIPAL "INDEX.HTML"`);
        window.close();
    }
    if (opener.name === "formulario") {
        menuFormularioPerfil();
    } else {
        //Recuperamos la cuenta del usuario que ha iniciado sesion
        let jugadorString = juego.buscarJugador(opener.name);
        juego.jugador.convertidorJSONaObj(jugadorString);
        menuFormularioTablero();
    }
}

//FUNCIONES DEL FORMULARIO Y DEL JUEGO:

function menuFormularioPerfil() {

    const menuFormulario = document.getElementById('menu');
    const botonEnviar = document.getElementById('enviar');
    const botonRegistrar = document.getElementById('registrar');
    const botonIniciarSesion = document.getElementById('iniciarSesion');
    const botonMenu = document.getElementById('volver');

    botonRegistrar.addEventListener('click', function () {
        menuFormulario.innerHTML = HTML_REGISTRAR;
        menuFormularioPerfil();
    });

    botonIniciarSesion.addEventListener('click', function () {
        menuFormulario.innerHTML = HTML_INICIAR_SESION;
        menuFormularioPerfil();
    });

    botonMenu.addEventListener('click', function () {
        menuFormulario.innerHTML = HTML_OPCIONES;
        menuFormularioPerfil();
    });

    botonEnviar.addEventListener('click', function (event) {
        event.preventDefault();
        if (juego.configurarPerfil(event)) {
            //Si se envia el formulario, procederemos a configurar el tablero
            menuFormularioTablero();
        }
    });
}

function menuFormularioTablero() {
    const menuFormulario = document.getElementById('menu');
    menuFormulario.innerHTML = HTML_TABLERO;

    const botonEnviar = document.getElementById('enviar');

    botonEnviar.addEventListener('click', function (event) {
        event.preventDefault();
        if (juego.configurarTablero(event)) {
            //Si se envia el formulario, procederemos cerrar la pestaña para iniciar el juego
            window.close();
        }
    });

    window.addEventListener('beforeunload', function () {
        //Enviamos el nick del jugador a la pestaña padre "index.html", pueda buscar estos datos en el Local Storage
        window.opener.postMessage(juego.jugador.nick);
    });
}

function iniciarJuego() {
    //Mostramos primero el mensaje de saludo
    let elementoSaludo = document.getElementById('saludo');
    juego.saludarJugador(elementoSaludo);

    var tablero = document.getElementById('tablero');
    juego.crearTabla();
    juego.crearTablaDOM(tablero);

    var clickIzquierdo = function (event) {
        if (juego.tablero.transcursoJuego() === 0) {
            juego.revelarCasilla(event);
            juego.actualizarTablaDOM();
            //Esperamos un tiempo para validar si ha ganado o no
            setTimeout(function () {
                juego.validarVictoria();
            }, 100);
        }
    }

    var clickDerecho = function (event) {
        event.preventDefault();
        if (juego.tablero.transcursoJuego() === 0) {
            juego.alternarBandera(event);
            juego.actualizarTablaDOM();
        }
    }

    tablero.addEventListener('click', clickIzquierdo);

    tablero.addEventListener('contextmenu', clickDerecho);
    

    //FUNCIONALIDADE EXTRA: BOTON DE REINICIAR EL JUEGO 
    var botonReiniciar = document.getElementById('reiniciar');
    botonReiniciar.addEventListener('click', function () {
        //Eliminamos los eventos de click para evitar que se siga jugando
        tablero.removeEventListener('click', clickIzquierdo);
        tablero.removeEventListener('contextmenu', clickDerecho);
        iniciarJuego();
    });

    //FUNCIONALIDADE EXTRA: BOTON DE CONFIGURAR TABLERO
    var botonConfigurar = document.getElementById('config');
    botonConfigurar.addEventListener('click', function () {
        tablero.removeEventListener('click', clickIzquierdo);
        tablero.removeEventListener('contextmenu', clickDerecho);
        /*Al volver a configurar el tablero, guardamos el usuario para luego buscarlo en la nueva ventana
        Con el metodo de postMessage() no me detectaba el mensaje, por eso he optado por guardar 
        el nick en el window.name, de esta manera puedo conseguir el usuario con el opener.name.*/
        window.name = juego.jugador.nick;
        Juego.abrirFormulario();
    });

    //FUNCIONALIDADE EXTRA: BOTON DE CAMBIAR A OTRA CUENTA
    var botonCambiar = document.getElementById('cambiar');
    botonCambiar.addEventListener('click', function () {
        tablero.removeEventListener('click', clickIzquierdo);
        tablero.removeEventListener('contextmenu', clickDerecho);

        window.name = "formulario";
        Juego.abrirFormulario();
    });


    //FUNCIONALIDADE EXTRA: BOTON ELIMINAR LA CUENTA ACTUAl
    var botonEliminar = document.getElementById('eliminarActual');
    botonEliminar.addEventListener('click', function () {
        juego.eliminarJugador(juego.jugador.nick);
        window.close();
    });

    //FUNCIONALIDADE EXTRA: BOTON ELIMINAR TODAS LAS CUENTAS
    var botonEliminar = document.getElementById('eliminarTodo');
    botonEliminar.addEventListener('click', function () {
        juego.eliminarLocalStorage();
        window.close();
    });
}