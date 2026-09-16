# 🎁 Amigo Oculto - Sorteio Online via WhatsApp

Aplicação moderna e segura desenvolvida em **Next.js (App Router, TypeScript e Tailwind CSS)** para realização de sorteios de Amigo Oculto com envio de links individuais e criptografados via WhatsApp.

---

## 🔒 Destaques e Segurança

- **Sigilo Total:** O organizador **NÃO** visualiza quem tirou quem na tela. O resultado de cada participante fica selado em um token cifrado.
- **Criptografia AES:** Utiliza `crypto-js` para cifrar o par `{ de: "Nome", para: "Nome Sorteado" }`, gerando tokens URL-safe.
- **Sorteio Cíclico Seguro (Derangement):** Implementação de ciclo hamiltoniano com embaralhamento Fisher-Yates, garantindo matematicamente que **ninguém tire a si mesmo** e que todos tenham um amigo oculto válido.
- **Ordem de Exibição Protegida:** A lista de botões mantém a ordem original de cadastro, impedindo que a ordem na tela revele a cadeia do sorteio.
- **Envio Direto pelo WhatsApp:** Botão individual com link formatado (`https://wa.me/55...`) contendo mensagem personalizada e link do envelope secreto.
- **Acompanhamento de Envios:** Indicadores visuais de status (enviado / copiado) e contador de progresso.
- **Experiência de Revelação:** Página com `<Suspense>`, abertura interativa do envelope e explosão de confetes com `canvas-confetti`.

---

## 🚀 Como Executar Localmente

### 1. Instalar Dependências
```bash
npm install
```

### 2. (Opcional) Variável de Ambiente
Crie um arquivo `.env.local` na raiz caso queira customizar a chave secreta de criptografia:
```env
NEXT_PUBLIC_CRYPTO_SECRET="sua-chave-secreta-super-segura"
```
*(Caso não seja definida, o sistema utiliza um fallback seguro padrão).*

### 3. Rodar o Servidor de Desenvolvimento
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### 4. Testar o Build de Produção
```bash
npm run build
npm run start
```

---

## ☁️ Deploy na Vercel

1. Suba o projeto para o seu repositório no **GitHub**, **GitLab** ou **Bitbucket**.
2. Acesse o painel da [Vercel](https://vercel.com) e clique em **"Add New Project"**.
3. Importe o repositório do projeto.
4. (Opcional) Em **Environment Variables**, adicione a variável `NEXT_PUBLIC_CRYPTO_SECRET` com o seu segredo.
5. Clique em **Deploy**. A aplicação estará no ar com HTTPS em instantes!
