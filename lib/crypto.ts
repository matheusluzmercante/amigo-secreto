import CryptoJS from 'crypto-js';

const SECRET_KEY =
  process.env.NEXT_PUBLIC_CRYPTO_SECRET || 'chave-secreta-amigo-oculto-2026';

export interface DrawSecretPayload {
  de: string;
  para: string;
}

/**
 * Criptografa o par { de, para } gerando um token seguro em URL-safe.
 */
export function encryptDrawToken(payload: DrawSecretPayload): string {
  const jsonStr = JSON.stringify(payload);
  const encrypted = CryptoJS.AES.encrypt(jsonStr, SECRET_KEY).toString();
  return encodeURIComponent(encrypted);
}

/**
 * Descriptografa e valida o token recebido na URL.
 * Retorna o objeto { de, para } ou null em caso de erro ou token corrompido.
 */
export function decryptDrawToken(token: string): DrawSecretPayload | null {
  try {
    if (!token || typeof token !== 'string') return null;

    // Normaliza caso a URL já tenha sido parcialmente decodificada
    let normalizedToken = token;
    try {
      normalizedToken = decodeURIComponent(token);
    } catch {
      // Se decodeURIComponent falhar, mantém o token original
      normalizedToken = token;
    }

    const bytes = CryptoJS.AES.decrypt(normalizedToken, SECRET_KEY);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedStr) {
      return null;
    }

    const parsed = JSON.parse(decryptedStr);
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.de === 'string' &&
      typeof parsed.para === 'string' &&
      parsed.de.trim().length > 0 &&
      parsed.para.trim().length > 0
    ) {
      return {
        de: parsed.de.trim(),
        para: parsed.para.trim(),
      };
    }

    return null;
  } catch (err) {
    console.error('Erro ao descriptografar token:', err);
    return null;
  }
}
