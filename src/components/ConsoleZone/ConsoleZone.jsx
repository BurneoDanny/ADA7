import React, { useState } from "react";

export default function ConsoleZone(props) {
  const { value, onChange } = props;
  const isValid = /^\d{10,}$/.test(value);

  return (
    <>
      <p className="card-description instruction-text">
        Entrada por Consola: Introduzca una cadena de mínimo 10 dígitos
        numéricos. No se permiten caracteres ni separadores.
      </p>
      <div className="console-input-group">
        <input
          type="text"
          pattern="\d*"
          minLength="10"
          placeholder="Ej: 1234567890..."
          value={value.replace(/\D/g, "")}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
          className={`console-input ${isValid ? "valid" : "invalid"}`}
        />
        <p className={`validation-message ${isValid ? "success" : "error"}`}>
          {isValid
            ? "✅ Longitud mínima (10 dígitos) alcanzada."
            : `❌ Mínimo 10 dígitos numéricos requeridos. (Actual: ${value.length})`}
        </p>
      </div>
    </>
  );
}
