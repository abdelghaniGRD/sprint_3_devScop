const DURATION = 10 * 60 * 1000; // 10 minutes en millisecondes

// Enregistrer : la donnée + la date d'enregistrement
export function setCache(key, data) {
  localStorage.setItem(
    key,
    JSON.stringify({ data: data, savedAt: Date.now() })
  );
}

// Lire : renvoie la donnée si elle existe et a moins de 10 minutes, sinon null
export function getCache(key) {
  const entry = JSON.parse(localStorage.getItem(key)); // null si la clé n'existe pas
  if (entry && Date.now() - entry.savedAt < DURATION) {
    return entry.data;
  }
  return null;
}
