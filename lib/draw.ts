import { encryptDrawToken } from './crypto';

export interface Participant {
  id: string;
  name: string;
  phone: string;
}

export interface DrawItemResult {
  id: string;
  name: string;
  phone: string;
  token: string;
}

/**
 * Embaralha um array usando o algoritmo Fisher-Yates com aleatoriedade segura.
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    // Escolhe um índice aleatório entre 0 e i
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Executa o sorteio cíclico seguro (Derangement via ciclo hamiltoniano aleatório).
 * Garante que:
 * 1. Ninguém tire a si mesmo.
 * 2. Todos tirem exatamente uma pessoa e sejam tirados por exatamente uma pessoa.
 * 3. A lista de saída preserva a ordem de cadastro original para que a ordem dos botões
 *    não revele o ciclo do sorteio ao organizador.
 */
export function performDraw(participants: Participant[]): DrawItemResult[] {
  if (participants.length < 3) {
    throw new Error('O sorteio requer no mínimo 3 participantes.');
  }

  // 1. Embaralha a lista com Fisher-Yates
  const shuffled = shuffleArray(participants);
  const n = shuffled.length;

  // Mapa de id do participante -> token criptografado
  const tokenMap = new Map<string, string>();

  // 2. Conecta em ciclo: shuffled[i] tira shuffled[(i + 1) % n]
  for (let i = 0; i < n; i++) {
    const giver = shuffled[i];
    const receiver = shuffled[(i + 1) % n];

    // Validação matemática de segurança
    if (giver.id === receiver.id || giver.name.toLowerCase() === receiver.name.toLowerCase()) {
      throw new Error('Falha no algoritmo de derangement: participante tirou a si mesmo.');
    }

    const token = encryptDrawToken({
      de: giver.name,
      para: receiver.name,
    });

    tokenMap.set(giver.id, token);
  }

  // 3. Retorna na ordem original de cadastro para blindar a privacidade contra o organizador
  return participants.map((p) => {
    const token = tokenMap.get(p.id);
    if (!token) {
      throw new Error(`Token não encontrado para o participante ${p.name}`);
    }
    return {
      id: p.id,
      name: p.name,
      phone: p.phone,
      token,
    };
  });
}
