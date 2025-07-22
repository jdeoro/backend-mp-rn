import fs  from 'fs';
import path from 'path';

async function obtenerNombresArchivosJSON(rutaCarpeta) {
  try {
    const archivos = await fs.promises.readdir(rutaCarpeta); // Usar fs.promises para operaciones asíncronas
    const nombresArchivos = archivos.map(archivo => archivo);

    return JSON.stringify(nombresArchivos, null, 2); // Convertir a JSON con sangría para mejor lectura
  } catch (error) {
    console.error('Error al leer la carpeta:', error);
    return null;
  }
}

// Ejemplo de uso:
const rutaCarpeta = './archivos'; // Reemplaza con la ruta de tu carpeta
obtenerNombresArchivosJSON(rutaCarpeta)
  .then(json => {
    console.log(json);
  })
  .catch(error => {
    console.error("Error durante la operación:", error);
  });