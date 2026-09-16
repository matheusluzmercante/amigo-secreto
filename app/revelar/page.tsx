'use client';

import { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { decryptDrawToken } from '@/lib/crypto';
import {
  Gift,
  Sparkles,
  EyeOff,
  AlertTriangle,
  Home,
  ShieldCheck,
  PartyPopper,
  Lock,
} from 'lucide-react';

function RevealContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const data = useMemo(() => {
    if (!token) return null;
    return decryptDrawToken(token);
  }, [token]);

  const hasError = !token || !data;

  const fireConfetti = () => {
    // Explosão central
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'],
    });

    // Explosões laterais em cascata
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.65 },
        colors: ['#10b981', '#f59e0b', '#ef4444'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.65 },
        colors: ['#3b82f6', '#ec4899', '#8b5cf6'],
      });
    }, 200);
  };

  const handleReveal = () => {
    setIsRevealed(true);
    fireConfetti();
  };

  const handleToggleHide = () => {
    setIsRevealed(false);
  };

  // Tratamento de erro (token inválido ou corrompido)
  if (hasError || !data) {
    return (
      <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-red-200 dark:border-red-900/50 text-center animate-in fade-in zoom-in duration-300">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          Envelope Não Encontrado
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
          Este link parece inválido, incompleto ou foi corrompido. Certifique-se de que copiou o
          endereço por completo ou solicite ao organizador que reenvie seu link.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow"
        >
          <Home className="w-4 h-4" />
          Voltar para a Página Inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Saudação ao participante */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          Link Secreto Criptografado
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Olá, <span className="text-emerald-600 dark:text-emerald-400">{data.de}</span>! 🎁
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base mt-2">
          Seu amigo oculto já foi sorteado! Toque abaixo para abrir seu envelope secreto.
        </p>
      </div>

      {/* Card do Envelope */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden transition-all duration-300">
        {/* Detalhe festivo de fundo */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        {!isRevealed ? (
          /* Estado Não Revelado */
          <div className="flex flex-col items-center text-center py-4">
            <div className="relative w-24 h-24 mb-6 flex items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/30 transform hover:scale-105 transition-transform duration-300">
              <Gift className="w-12 h-12 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-amber-950 shadow">
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
              Envelope Lacrado
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mb-8">
              Certifique-se de que ninguém está olhando sua tela antes de abrir o resultado!
            </p>

            <button
              onClick={handleReveal}
              type="button"
              className="w-full group cursor-pointer relative flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white font-bold text-lg shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
              <span>Revelar meu Amigo Oculto ✨</span>
            </button>
          </div>
        ) : (
          /* Estado Revelado */
          <div className="flex flex-col items-center text-center py-2 animate-in fade-in zoom-in-95 duration-400">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-amber-950 shadow-md">
              <PartyPopper className="w-8 h-8" />
            </div>

            <span className="text-xs uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-500 mb-1">
              Seu amigo oculto sorteado é:
            </span>

            {/* Nome em Grande Destaque */}
            <div className="w-full my-4 p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-900/40 border-2 border-emerald-500/40 dark:border-emerald-500/30 shadow-inner">
              <p className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-300 tracking-wide break-words">
                {data.para}
              </p>
            </div>

            {/* Aviso de Segredo */}
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-sm font-medium mb-6">
              🤫 <strong>Guarde segredo</strong> até o dia da revelação!
            </div>

            {/* Ações auxiliares */}
            <div className="flex flex-col sm:flex-row gap-2.5 w-full">
              <button
                onClick={handleToggleHide}
                type="button"
                className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-semibold transition-colors"
              >
                <EyeOff className="w-4 h-4" />
                Ocultar Nome
              </button>
              <button
                onClick={fireConfetti}
                type="button"
                className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 text-sm font-semibold transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Mais Confetes!
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rodapé informativo */}
      <div className="mt-8 text-center text-xs text-zinc-400 dark:text-zinc-500 space-y-1">
        <p>Amigo Oculto Seguro &bull; Criptografia Ponta a Ponta</p>
        <p>
          <Link href="/" className="hover:underline text-zinc-500 dark:text-zinc-400">
            Criar um novo sorteio de Amigo Oculto
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RevealPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zinc-50 via-emerald-50/20 to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 p-4 sm:p-6 font-sans">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm font-medium">
              Abrindo envelope...
            </p>
          </div>
        }
      >
        <RevealContent />
      </Suspense>
    </div>
  );
}
