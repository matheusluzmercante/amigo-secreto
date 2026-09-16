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
 * Monta o texto amigável da mensagem para envio no WhatsApp.
 */
export function buildWhatsAppMessage(name: string, revealUrl: string): string {
  return (
    `🎁 *Amigo Oculto* 🎁\n\n` +
    `Olá, *${name}*! O sorteio do nosso Amigo Oculto foi realizado com sucesso.\n\n` +
    `Descubra quem você tirou clicando no seu envelope secreto individual:\n` +
    `👉 ${revealUrl}\n\n` +
    `🤫 *Atenção:* Guarde segredo até o momento da nossa revelação!`
  );
}

/**
 * Monta o link para o WhatsApp Web / App.
 */
export function buildWhatsAppUrl(phone: string, name: string, revealUrl: string): string {
  const internationalNumber = normalizeToInternationalWhatsApp(phone);
  const message = buildWhatsAppMessage(name, revealUrl);
  return `https://wa.me/${internationalNumber}?text=${encodeURIComponent(message)}`;
}
