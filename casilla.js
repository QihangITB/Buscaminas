export class Casilla{
    coordX;
    coordY;
    esBomba;
    revelada;
    bandera;
    bombasCercanas;
    
    constructor(x, y){
        this.coordX = x;
        this.coordY = y;
        this.esBomba = false;
        this.revelada = false;
        this.bandera = false;
        this.bombasCercanas = 0;
    }

    cambiarBandera(){
        this.bandera = !this.bandera;
    }
    
    revelar(){
        this.revelada = true;
    }

    ponerBomba(){
        this.esBomba = true;
    }
}