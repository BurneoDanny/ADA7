// src/utils/decodingUtils.js (o donde prefieras colocar utilidades)

// ----------------------------------------------------
// 1. Lógica de Decodificación (Basada en tu algoritmo)
// ----------------------------------------------------

/**
 * Implementa el algoritmo de decodificación para revertir el "reemplazo por el vecino no usado más cercano".
 * Busca partes literales (dígitos) o partes codificadas ([valor:ddistancia])
 * y calcula el valor original (original = valor - distancia).
 * @param {string} codigo_str - La cadena codificada (ej. "20[1:d-1]...").
 * @returns {string} - La cadena original de dígitos.
 */
const decodificar = (codigo_str) => {
    const resultado = [];
    let i = 0;

    // Mantenemos un conjunto de caracteres válidos para los números (para números negativos también)
    const isDigitOrSign = (char) => {
        return (char >= '0' && char <= '9') || char === '-';
    };

    while (i < codigo_str.length) {
        if (codigo_str[i] === '[') {
            // Caso 1: Encontramos una parte codificada (Ej: [1:d-1])
            const cierre = codigo_str.indexOf(']', i);
            if (cierre === -1) {
                // Manejar error si no se encuentra ']'
                throw new Error("Formato de codificación inválido: falta ']'");
            }

            const contenido = codigo_str.substring(i + 1, cierre);

            // La expresión regular separa el número (incluyendo signo) y la distancia (incluyendo signo 'd')
            const match = contenido.match(/^(-?\d+):d(-?\d+)$/);

            if (!match) {
                // Manejar error si el contenido no coincide con el formato esperado [VALOR:dDISTANCIA]
                throw new Error("Formato de contenido codificado inválido: " + contenido);
            }

            const valor = parseInt(match[1], 10);
            const distancia = parseInt(match[2], 10);

            // Fórmula de Decodificación: original = valor - distancia
            const original = valor - distancia;
            resultado.push(String(original));

            i = cierre + 1; // Continuar después del ']'

        } else if (isDigitOrSign(codigo_str[i])) {
            // Caso 2: Encontramos un dígito o el inicio de un número literal
            let num_str = "";
            let start = i;

            // Consumir el signo si existe (solo al inicio del número)
            if (codigo_str[i] === '-') {
                num_str += codigo_str[i];
                i++;
            }

            // Consumir todos los dígitos
            while (i < codigo_str.length && codigo_str[i] >= '0' && codigo_str[i] <= '9') {
                num_str += codigo_str[i];
                i++;
            }

            // Si solo se encontró el signo '-' o nada, es un error o un carácter no manejado, 
            // pero para este algoritmo, solo avanzamos si realmente encontramos un número.
            if (num_str.length > 0 && num_str !== '-') {
                resultado.push(num_str);
            } else {
                // Si solo era un signo flotando, retrocedemos i para que el bucle principal lo omita/maneje,
                // o simplemente avanzamos i en el bucle principal para manejar el caracter no válido.
                // Dado que solo esperamos '[' o un número, si no era un número válido, lo manejamos como 'otro caracter'.
                // Para simplicidad, si no encontramos un número válido, retrocedemos y dejamos que el bucle principal avance 'i' en el 'SINO'.
                i = start; // Revertir el avance de 'i'
                i++; // Permite al bucle principal avanzar para manejar el caracter
            }

        } else {
            // Caso 3: Carácter no reconocido (ej. un espacio en medio de la cadena codificada)
            i++;
        }
    }

    return resultado.join("");
};

// ----------------------------------------------------
// 2. Utilidad para Descargar Archivos (sin cambios)
// ----------------------------------------------------

/**
 * Fuerza la descarga de datos como un archivo.
 * @param {string | Blob} data - El contenido del archivo (cadena decodificada).
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
// 3. Función Principal de Manejo de Decodificación
// ----------------------------------------------------

// La función principal se renombra y se simplifica para aceptar SÓLO archivos.
/**
 * Lee el archivo de entrada, valida que no esté vacío, decodifica y dispara la descarga.
 * @param {File} inputFile - El objeto File.
 * @param {(progress: number) => void} progressCallback - Función para reportar el progreso.
 */
export const DecodeFile = async (inputFile, progressCallback) => {
    let rawData = null;
    let originalFilename = "data";
    const INPUT_METHOD = "file"; // Fijo para decodificación de archivo

    try {
        // 1. Validar que la entrada sea un objeto File
        if (!(inputFile instanceof File)) {
            throw new Error("Se requiere un objeto File para la decodificación.");
        }

        progressCallback(20);

        // 2. Leer el contenido del archivo
        rawData = await inputFile.text();
        originalFilename = inputFile.name.replace(/\.[^/.]+$/, "");

        // 3. VALIDACIÓN: Archivo vacío
        if (rawData.trim() === "") {
            throw new Error("El archivo de entrada no debe estar vacío.");
        }

        progressCallback(40);

        // 4. Decodificar
        // La decodificación se realiza sobre la cadena de texto leída directamente.
        const decodedResult = decodificar(rawData);
        progressCallback(80);

        // 5. Descargar
        const decodedFilename = `${originalFilename}_decodificado.txt`;
        downloadFile(decodedResult, decodedFilename);

        progressCallback(100);
        return { success: true, filename: decodedFilename };

    } catch (error) {
        progressCallback(0);
        console.error("Error en el proceso de decodificación:", error.message);
        return { success: false, error: error.message };
    }
};