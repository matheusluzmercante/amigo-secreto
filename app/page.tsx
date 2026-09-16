'use client';

import { useState, useRef } from 'react';
import {
  Gift,
  UserPlus,
  Trash2,
  Send,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Users,
  ShieldCheck,
  AlertCircle,
  PartyPopper,
} from 'lucide-react';
import { Participant, DrawItemResult, performDraw } from '@/lib/draw';
import {
  formatPhoneNumber,
  cleanPhoneNumber,
  isValidPhoneNumber,
  buildWhatsAppUrl,
} from '@/lib/phone';

export default function Home() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Estado pós-sorteio
  const [isDrawn, setIsDrawn] = useState(false);
  const [drawResults, setDrawResults] = useState<DrawItemResult[]>([]);
  const [sentMap, setSentMap] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Formatação do telefone em tempo real
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatPhoneNumber(raw);
    setPhoneInput(formatted);
    if (errorMessage) setErrorMessage(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };

  // Adicionar participante
  const handleAddParticipant = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedName = nameInput.trim();
    const cleanPhone = cleanPhoneNumber(phoneInput);

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Por favor, informe um nome com pelo menos 2 caracteres.');
      nameInputRef.current?.focus();
      return;
    }

    if (!isValidPhoneNumber(phoneInput)) {
      setErrorMessage('Informe um WhatsApp válido com DDD (ex: 21999998888).');
      return;
    }

    // Validação de nomes duplicados (insensível a maiúsculas)
    const nameExists = participants.some(
      (p) => p.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (nameExists) {
      setErrorMessage(`O participante "${trimmedName}" já foi adicionado!`);
      return;
    }

    // Validação de telefones duplicados
    const phoneExists = participants.some(
      (p) => cleanPhoneNumber(p.phone) === cleanPhone
    );
    if (phoneExists) {
      setErrorMessage('Este número de WhatsApp já foi cadastrado para outro participante.');
      return;
    }

    const newParticipant: Participant = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      name: trimmedName,
      phone: formatPhoneNumber(phoneInput),
    };

    setParticipants((prev) => [...prev, newParticipant]);
    setNameInput('');
    setPhoneInput('');
    setErrorMessage(null);

    // Foco de volta no input de nome para facilitar inserções sucessivas
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 50);
  };

  // Remover participante antes do sorteio
  const handleRemoveParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  // Executar sorteio
  const handleDraw = () => {
    if (participants.length < 3) {
      setErrorMessage('É necessário no mínimo 3 participantes para realizar o sorteio.');
      return;
    }

    try {
      const results = performDraw(participants);
      setDrawResults(results);
      setIsDrawn(true);
      setSentMap({});
      setErrorMessage(null);
      // Rola a página para o topo da lista de resultados
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao realizar sorteio.';
      setErrorMessage(msg);
    }
  };

  // Copiar link individual
  const handleCopyLink = async (id: string, token: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const revealUrl = `${origin}/revelar?token=${token}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(revealUrl);
      } else {
        // Fallback para navegadores legados
        const textArea = document.createElement('textarea');
        textArea.value = revealUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedId(id);
      setSentMap((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedId((curr) => (curr === id ? null : curr));
      }, 2500);
    } catch {
      alert(`Copie o link manualmente: ${revealUrl}`);
    }
  };

  // Enviar pelo WhatsApp
  const handleSendWhatsApp = (item: DrawItemResult) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const revealUrl = `${origin}/revelar?token=${item.token}`;
    const url = buildWhatsAppUrl(item.phone, item.name, revealUrl);

    // Marca como enviado visualmente
    setSentMap((prev) => ({ ...prev, [item.id]: true }));

    // Abre o WhatsApp em nova aba
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Reiniciar sorteio
  const handleResetConfirmed = () => {
    setIsDrawn(false);
    setDrawResults([]);
    setSentMap({});
    setShowConfirmReset(false);
    setErrorMessage(null);
  };

  const sentCount = Object.values(sentMap).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-emerald-50/20 to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <main className="max-w-3xl mx-auto space-y-8">
        {/* Cabeçalho Principal com tema festivo */}
        <header className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold shadow-xs">
            <Gift className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Sorteio 100% Secreto via WhatsApp
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Amigo Oculto <span className="text-emerald-600 dark:text-emerald-400">Online</span>
          </h1>

          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Cadastre os participantes, realize o sorteio sem que ninguém descubra quem tirou quem
            (nem mesmo o organizador!) e envie links individuais criptografados.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1 bg-white dark:bg-zinc-800/80 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Criptografia AES
            </span>
            <span className="inline-flex items-center gap-1 bg-white dark:bg-zinc-800/80 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Ninguém tira a si mesmo
            </span>
          </div>
        </header>

        {/* Mensagem de Erro Global */}
        {errorMessage && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="flex-1 font-medium">{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-700 dark:hover:text-red-200 text-xs font-bold px-2 py-1"
            >
              Fechar
            </button>
          </div>
        )}

        {/* ESTADO 1: Formulário e Lista antes do sorteio */}
        {!isDrawn ? (
          <div className="space-y-6">
            {/* Card do Formulário de Cadastro */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-zinc-200/80 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Adicionar Participante
                </h2>
              </div>

              <form onSubmit={handleAddParticipant} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                      Nome
                    </label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      placeholder="Ex: Carlos Silva"
                      value={nameInput}
                      onChange={handleNameChange}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                      WhatsApp (com DDD)
                    </label>
                    <input
                      type="tel"
                      placeholder="Ex: (21) 99999-8888"
                      value={phoneInput}
                      onChange={handlePhoneChange}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    Adicionar Participante
                  </button>
                </div>
              </form>
            </div>

            {/* Lista dos Participantes Cadastrados */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-zinc-200/80 dark:border-zinc-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Participantes Cadastrados
                  </h2>
                </div>

                {/* Contador de Participantes */}
                <div className="inline-flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    Total: <strong className="font-bold text-emerald-600 dark:text-emerald-400">{participants.length}</strong>
                  </span>
                  {participants.length < 3 ? (
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                      (Mínimo 3: falta{3 - participants.length > 1 ? 'm' : ''} {3 - participants.length})
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Pronto para sortear
                    </span>
                  )}
                </div>
              </div>

              {/* Itens da Lista */}
              {participants.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <p className="text-zinc-400 dark:text-zinc-500 text-sm">
                    Nenhum participante adicionado ainda.
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                    Preencha o nome e WhatsApp acima para começar a montar o grupo!
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/60 max-h-96 overflow-y-auto pr-1">
                  {participants.map((p) => (
                    <li
                      key={p.id}
                      className="py-3 px-3 rounded-xl flex items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {p.phone}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveParticipant(p.id)}
                        title={`Remover ${p.name}`}
                        className="cursor-pointer p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Botão Realizar Sorteio */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={handleDraw}
                  disabled={participants.length < 3}
                  className={`w-full cursor-pointer flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-base transition-all shadow-lg ${
                    participants.length >= 3
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:scale-[1.01] active:scale-[0.99]'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Realizar Sorteio Seguro</span>
                </button>
                <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-2.5">
                  Garante embaralhamento cíclico seguro: ninguém tira a si mesmo.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ESTADO 2: Pós-Sorteio (Formulário Ocultado, Lista de Envio) */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Banner de Sorteio Concluído */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold tracking-wide">
                  <PartyPopper className="w-3.5 h-3.5" /> Sorteio Realizado com Sucesso
                </div>
                <h2 className="text-2xl font-bold">
                  Envie os Envelopes Secretos!
                </h2>
                <p className="text-emerald-100 text-sm max-w-xl">
                  O organizador NÃO vê quem tirou quem. Cada participante deve abrir seu próprio
                  link exclusivo para revelar seu amigo oculto.
                </p>
              </div>

              {/* Progresso de envios */}
              <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 shrink-0 text-center sm:text-right">
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-100 block">
                  Envios Feitos
                </span>
                <span className="text-2xl font-black">
                  {sentCount} / {drawResults.length}
                </span>
              </div>
            </div>

            {/* Lista Final com Ações de Envio */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-zinc-200/80 dark:border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Send className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Links Individuais dos Participantes
                </h3>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Clique para abrir no WhatsApp ou copie o link
                </span>
              </div>

              <div className="space-y-3">
                {drawResults.map((item) => {
                  const isSent = Boolean(sentMap[item.id]);
                  const isCopied = copiedId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSent
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                          : 'bg-zinc-50/70 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/80 hover:border-zinc-300 dark:hover:border-zinc-600'
                      }`}
                    >
                      {/* Info do Participante */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm shadow-xs ${
                            isSent
                              ? 'bg-emerald-600 text-white'
                              : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
                          }`}
                        >
                          {isSent ? <Check className="w-5 h-5" /> : item.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-zinc-900 dark:text-zinc-100 text-base truncate">
                              {item.name}
                            </p>
                            {isSent && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                                Enviado ✓
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {item.phone}
                          </p>
                        </div>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 w-full sm:w-auto">
                        {/* Botão Copiar Link */}
                        <button
                          onClick={() => handleCopyLink(item.id, item.token)}
                          type="button"
                          title="Copiar Link Individual"
                          className={`cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition ${
                            isCopied
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copiar Link</span>
                            </>
                          )}
                        </button>

                        {/* Botão Enviar via WhatsApp */}
                        <button
                          onClick={() => handleSendWhatsApp(item)}
                          type="button"
                          className="flex-1 sm:flex-initial cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/25 transition-all"
                        >
                          <Send className="w-4 h-4" />
                          <span>📲 Enviar via WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Botão para Novo Sorteio */}
              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-center">
                <button
                  onClick={() => setShowConfirmReset(true)}
                  type="button"
                  className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-semibold transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  Novo Sorteio
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmação para Novo Sorteio */}
        {showConfirmReset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Iniciar Novo Sorteio?
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Os links atuais gerados serão substituídos por um novo sorteio. Certifique-se de que
                já enviou os links para todos os participantes antes de continuar.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  type="button"
                  className="flex-1 cursor-pointer py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleResetConfirmed}
                  type="button"
                  className="flex-1 cursor-pointer py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-md shadow-red-600/20 transition"
                >
                  Sim, Reiniciar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
