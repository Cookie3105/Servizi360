// server/utils/validazione.js

export const campoRichiesto = (campo, nome) => {
  if (!campo || campo === "") {
    throw new Error(`Il campo "${nome}" è obbligatorio.`);
  }
};

export const numeroValido = (valore, nome) => {
  if (isNaN(valore)) throw new Error(`"${nome}" deve essere un numero.`);
};
