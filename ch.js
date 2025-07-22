//Importamos el modulo fs (viene preinstalado)
const fs = require('fs');

//Creamos un objeto
let objeto = {
  texto : "Un texto de prueba",
  numero : 3.1416,
  lista : [1, 2, 3],
  otroObjeto : {clave : "valor"},
  listaObjetos : [
    {clave : "valor"},
    {clave : "valor"},
    {inception : {
      inception : "valor"
      },
    },  
  ]
};