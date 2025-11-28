// src/utils/encodingUtils.js

// ----------------------------------------------------
// 1. Lógica de Codificación (Basada en tu algoritmo)
// ----------------------------------------------------

/**
 * Implementa el algoritmo de codificación de "reemplazo por el vecino no usado más cercano".
 * NOTA: Este algoritmo asume que los números de entrada son dígitos o valores pequeños
 * para que la búsqueda del reemplazo termine rápidamente.
 * @param {string} cadena - La cadena de dígitos a codificar (ej. "12341").
 * @returns {string} - La cadena codificada.
 */
const codificar = (cadena) => {
    // Usamos un Set para la verificación rápida de 'usados'
    const usados = new Set();
    const partes = [];

    // Convertimos la cadena en un array de caracteres para iterar
    for (const digito of cadena) {
        // Validación: Solo procesamos si el carácter es un dígito
        if (isNaN(digito) || digito === ' ') continue;

        const num = parseInt(digito, 10);

        // --- Lógica Principal del Algoritmo ---

        if (!usados.has(num)) {
            // Caso 1: El número no ha sido usado
            partes.push(String(num));
            usados.add(num);
        } else {
            // Caso 2: El número ya ha sido usado, buscar reemplazo
            let distancia = 1;
            let reemplazo = null;
            let dist_usada = 0;

            while (reemplazo === null) {
                const candidato_izq = num - distancia;
                const candidato_der = num + distancia;

                // 1. Buscar a la izquierda
                if (!usados.has(candidato_izq)) {
                    reemplazo = candidato_izq;
                    dist_usada = -distancia;
                }
                // 2. Buscar a la derecha
                else if (!usados.has(candidato_der)) {
                    reemplazo = candidato_der;
                    dist_usada = distancia;
                }
                // 3. Ninguno encontrado, aumentar distancia y seguir
                else {
                    distancia += 1;
                }
            }

            // Agregar el formato de reemplazo
            partes.push(`[${reemplazo}:d${dist_usada}]`);
            // El reemplazo se considera "usado"
            usados.add(reemplazo);
        }
    }

    return partes.join("");
};

// ----------------------------------------------------
// 2. Utilidad para Descargar Archivos (sin cambios)
// ----------------------------------------------------

/**
 * Fuerza la descarga de datos como un archivo.
 * @param {string | Blob} data - El contenido del archivo (cadena codificada).
 * @param {string} filename - Nombre del archivo de salida.
 * @param {string} type - MIME type del archivo.
 */
export const downloadFile = (data, filename, type = "text/plain") => {
    // Aseguramos que los datos sean un Blob si son una cadena
    const blob = data instanceof Blob ? data : new Blob([data], { type: type });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Limpieza
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};

// ----------------------------------------------------
// 3. Función Principal de Manejo de Codificación (Actualizada)
// ----------------------------------------------------

/**
 * Lee la entrada, valida, codifica con el nuevo algoritmo y dispara la descarga.
 * @param {File | string} inputData - El objeto File (en modo archivo) o la cadena de texto (en modo consola).
 * @param {string} inputMethod - "file" o "console".
 * @param {(progress: number) => void} progressCallback - Función para reportar el progreso.
 */
export const EncodeFile = async (inputData, inputMethod, progressCallback) => {
    let rawData = null;
    let originalFilename = "data";

    try {
        // 1. Determinar la fuente de los datos
        progressCallback(20);
        if (inputMethod === "file" && inputData instanceof File) {
            rawData = await inputData.text();
            originalFilename = inputData.name.replace(/\.[^/.]+$/, "");
        } else if (inputMethod === "console" && typeof inputData === 'string') {
            rawData = inputData;
        } else {
            throw new Error("Datos de entrada o método inválido.");
        }

        // *** VALIDACIÓN ADICIONAL: Archivo vacío ***
        if (rawData.trim() === "") {
            throw new Error("El archivo de entrada no debe estar vacío.");
        }

        progressCallback(35);

        // 2. Validar que contenga solo números (dígitos)
        // Se eliminan espacios y saltos de línea para la validación más estricta de solo dígitos.
        const cleanedData = rawData.replace(/[\s\n\r]/g, '');

        // Verifica si la cadena contiene CUALQUIER cosa que no sea un dígito (0-9)
        // La validación original de tu código se basaba en comas, este algoritmo
        // trabaja sobre una cadena de dígitos.
        if (!/^\d+$/.test(cleanedData)) {
            // Si hay comas, la validación fallará, lo cual es correcto si esperamos SÓLO dígitos
            // Si se esperan números separados por comas, la validación debería ser: /^\d+(,\d+)*$/
            // Basado en tu algoritmo que itera CADA digito, asumiremos una cadena de SÓLO dígitos.
            throw new Error("El contenido debe contener solo dígitos (0-9), sin separadores.");
        }

        progressCallback(60);

        // 3. Codificar usando el nuevo algoritmo
        // El nuevo algoritmo 'codificar' espera una cadena de dígitos.
        const encodedResult = codificar(cleanedData);
        progressCallback(90);

        // 4. Descargar
        const encodedFilename = `${originalFilename}_codificado.txt`;
        downloadFile(encodedResult, encodedFilename);

        return { success: true, filename: encodedFilename };

    } catch (error) {
        progressCallback(0);
        console.error("Error en el proceso de codificación:", error.message);
        return { success: false, error: error.message };
    }
};