/**
 * Utilitários para formatação, validação e links de WhatsApp.
 */

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
 * Monta o texto simples e direto da mensagem para envio ou cópia no WhatsApp.
 */
export function buildWhatsAppMessage(nome: string, link: string): string {
  return [
    '🎁 *AMIGO OCULTO* 🎁',
    '',
    `Olá, *${nome}*! Seu amigo oculto já foi sorteado! 🎉`,
    '',
    'Abra o envelope para descobrir quem é:',
    `👉 ${link}`,
    '',
    '🤫 *Guarde segredo!*',
  ].join('\n');
}

/**
 * Aliases para compatibilidade.
 */
export const buildWhatsAppMessageClipboard = buildWhatsAppMessage;
export const buildWhatsAppMessageUrl = buildWhatsAppMessage;

/**
 * Monta o link para o WhatsApp Web / App no formato padrão api.whatsapp.com.
 */
export function buildWhatsAppUrl(phone: string, nome: string, link: string): string {
  let numeroLimpo = cleanPhoneNumber(phone);
  if (numeroLimpo.startsWith('55') && (numeroLimpo.length === 12 || numeroLimpo.length === 13)) {
    numeroLimpo = numeroLimpo.slice(2);
  }
  const mensagem = buildWhatsAppMessage(nome, link);
  return `https://api.whatsapp.com/send?phone=55${numeroLimpo}&text=${encodeURIComponent(mensagem)}`;
}
