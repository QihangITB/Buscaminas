export class Jugador{
    nombre;
    apellido;
    fechaNacimiento;
    #edad;
    nick;
    mail;
    contraseña;

    constructor(nombre, apellido, fechaNacimiento, nick, mail, contraseña){
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
        this.#edad = Jugador.calcularEdad(fechaNacimiento);
        this.nick = nick;
        this.mail = mail;
        this.contraseña = contraseña;
    }

    convertidorJSONaObj(string) {
        if (string === null || string === undefined) return;
        
        var objeto = JSON.parse(string);
        this.nombre = objeto.nombre;
        this.apellido = objeto.apellido;
        this.fechaNacimiento = objeto.fechaNacimiento;
        this.#edad = Jugador.calcularEdad(objeto.fechaNacimiento);
        this.nick = objeto.nick;
        this.mail = objeto.mail;
        this.contraseña = objeto.contraseña;
        this.score = objeto.score;
        this.fechaScore = objeto.fechaScore;
    }

    get edad() { return this.#edad; }

    actualizarPuntos(){
        this.score++;
    }

    actualizarFechaPuntos(){
        this.fechaScore = Date.now();
    }
    
    static calcularEdad(fecha){
        const fechaNacimiento = new Date(fecha);
        const fechaActual = new Date();

        let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
        if (fechaNacimiento.getMonth() > fechaActual.getMonth() || (fechaNacimiento.getMonth() === fechaActual.getMonth() && fechaNacimiento.getDate() > fechaActual.getDate())) {
            edad--;
        }
        return edad;
    }

    static validarMayorEdad(fechaNacimiento) { 
        let edad = Jugador.calcularEdad(fechaNacimiento);
        return edad >= 18; 
    }

    static validarNickExistente(nick){
        for (var key in localStorage) {
            if (key === nick) {
                return true;
            }
        }
        return false;
    }


    //MENSAJES PARA EL VALIDADOR DE FORMULARIO DEL JUGADOR

    static mensajeValidadorNombre(inputNombre) {
        if (inputNombre.checkValidity()) return 'Válido';
        if (inputNombre.validity.valueMissing) return 'Campo obligatorio';
        if (inputNombre.validity.patternMismatch) return 'El primer caracter debe de ser en mayúscula y el resto en minúscula';
        return 'Error desconocido';
    }

    static mensajeValidadorFN(inputFechaNacimiento) {
        if (inputFechaNacimiento.validity.valueMissing) return 'Campo obligatorio';
        if (!Jugador.validarMayorEdad(inputFechaNacimiento.value)) return 'Debes de ser mayor de edad';
        if (inputFechaNacimiento.checkValidity()) return 'Válido';
        return 'Error desconocido';
    }

    static mensajeValidadorNick(inputNick) {
        if (Jugador.validarNickExistente(inputNick.value)) return 'El nombre de usuario ya existe';
        if (inputNick.checkValidity()) return 'Válido';
        if (inputNick.validity.valueMissing) return 'Campo obligatorio';
        if (inputNick.validity.patternMismatch) return 'El nombre de usuario debe de acabar con un número';
        return 'Error desconocido';
    }

    static mensajeValidadorMail(inputMail) {
        if (inputMail.checkValidity()) return 'Válido';
        if (inputMail.validity.valueMissing) return 'Campo obligatorio';
        if (inputMail.validity.patternMismatch) return 'Debe de ser un correo del ITB (@itb.cat)';
        return 'Error desconocido';
    }

    static mensajeValidadorContraseña(inputContraseña) {
        if (inputContraseña.checkValidity()) return 'Válido';
        if (inputContraseña.validity.valueMissing) return 'Campo obligatorio';
        return 'Error desconocido';
    }
}