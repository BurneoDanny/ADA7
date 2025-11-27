// src/utils/encodingUtils.js (o donde prefieras colocar utilidades)

// ----------------------------------------------------
// 1. Lógica de Codificación (Basada en tu lógica Python)
// ----------------------------------------------------

/**
 * Aplica el algoritmo de codificación Navhar: suma 42 y codifica en Base64.
 * @param {number[]} data_array - Array de números a codificar.
 * @returns {string} - Cadena Base64 codificada.
 */
export const navhar_encode = (data_array) => {
    const key = 42;

    // 1. Sumar la clave
    const processed_data = data_array.map((x) => x + key);

    // 2. Convertir a string separado por comas
    const data_str = processed_data.join(",");

    // 3. Codificar la cadena en Base64
    // btoa() es una función nativa del navegador para Base64.
    const encoded_b64 = btoa(data_str);

    return encoded_b64;
};

// ----------------------------------------------------
// 2. Utilidad para Descargar Archivos
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
// 3. Función Principal de Manejo de Codificación
// ----------------------------------------------------

/**
 * Lee la entrada, valida, codifica y dispara la descarga.
 * @param {File | string} inputData - El objeto File (en modo archivo) o la cadena de texto (en modo consola).
 * @param {string} inputMethod - INPUT_METHOD.FILE o INPUT_METHOD.CONSOLE.
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
        progressCallback(35);

        // 2. Parsear y validar
        const dataArray = rawData
            .split(",")
            .map(s => s.trim())
            .filter(s => s !== "")
            .map(Number);

        if (dataArray.some(isNaN)) {
            throw new Error("El contenido debe contener solo números separados por comas.");
        }
        progressCallback(60);


        // 3. Codificar
        const encodedResult = navhar_encode(dataArray);
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