/**
 * Utilitários para formatação, validação e links de WhatsApp.
 */

// Emojis completos via Unicode escapes para uso no Clipboard (Ctrl+V)
const EMOJI_PRESENTE = '\u{1F381}';   // 🎁
const EMOJI_FESTA = '\u{1F389}';      // 🎉
const EMOJI_APONTANDO = '\u{1F449}';  // 👉
const EMOJI_SEGREDO = '\u{1F92B}';    // 🤫

/**
 * Remove todos os caracteres não numéricos.
 */
export function cleanPhoneNumber(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Aplica máscara de telefone brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export function formatPhoneNumber(value: string): string {
  const digits = cleanPhoneNumber(value);

  if (digits.length <= 2) {
    return digits.length > 0 ? `(${digits}` : '';
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  // 11 dígitos ou mais (máximo 11 padrão brasileiro móvel)
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

/**
 * Valida se o número possui DDD e 8 ou 9 dígitos (10 ou 11 dígitos no total).
 */
export function isValidPhoneNumber(value: string): boolean {
  const digits = cleanPhoneNumber(value);
  // Se começou com 55 e tem 12 ou 13 dígitos
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return true;
  }
  return digits.length === 10 || digits.length === 11;
}

/**
 * Normaliza o número para o padrão internacional com DDI 55 do Brasil.
 */
export function normalizeToInternationalWhatsApp(value: string): string {
  const digits = cleanPhoneNumber(value);
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return digits;
  }
  return `55${digits}`;
}

/**
 * Mensagem para URL wa.me: usa caracteres tipográficos universais (Unicode BMP)
 * imunes à corrupção de protocolo no WhatsApp Desktop do Windows.
 */
export function buildWhatsAppMessageUrl(name: string, revealUrl: string): string {
  return [
    '★ *AMIGO OCULTO* ★',
    '',
    `Olá, *${name}*! O sorteio já aconteceu! ✦`,
    '',
    'Descubra quem você tirou abrindo seu envelope secreto:',
    `➔ ${revealUrl}`,
    '',
    '❖ *Aviso:* Guarde segredo até o dia da revelação!',
  ].join('\n');
}

/**
 * Mensagem completa com emojis reais para cópia direta (Ctrl+V) no WhatsApp Desktop/Web.
 */
export function buildWhatsAppMessageClipboard(name: string, revealUrl: string): string {
  return [
    `${EMOJI_PRESENTE} *AMIGO OCULTO* ${EMOJI_PRESENTE}`,
    '',
    `Olá, *${name}*! O sorteio já aconteceu! ${EMOJI_FESTA}`,
    '',
    'Descubra quem você tirou abrindo seu envelope secreto:',
    `${EMOJI_APONTANDO} ${revealUrl}`,
    '',
    `${EMOJI_SEGREDO} *Aviso:* Guarde segredo até o dia da revelação!`,
  ].join('\n');
}

/**
 * Alias padrão para mensagem de URL.
 */
export const buildWhatsAppMessage = buildWhatsAppMessageUrl;

/**
 * Monta o link para o WhatsApp Web / App com caracteres BMP universais.
 */
export function buildWhatsAppUrl(phone: string, name: string, revealUrl: string): string {
  const internationalNumber = normalizeToInternationalWhatsApp(phone);
  const message = buildWhatsAppMessageUrl(name, revealUrl);
  return `https://wa.me/${internationalNumber}?text=${encodeURIComponent(message)}`;
}
