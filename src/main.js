import './style.css';
//import './three/scene.js';
import './favicon.js';

// ===== Case Modal (Portfolio) =====
window.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('caseOverlay');
  const shell = overlay?.querySelector('.case-shell');
  const content = document.getElementById('caseContent');
  const closeBtn = overlay?.querySelector('.case-close');

  if (!overlay || !content) {
    console.warn('[CaseModal] #caseOverlay ou #caseContent não encontrado no HTML.');
    return;
  }

  // Conteúdos
  const CASES = {
    lastampa: {
      title: 'La Stampa Run',
      meta: ['Branding', 'UX/UI', 'Experiência', 'Growth'],
      intro:
        'La Estampa Run foi um evento proprietário desenvolvido como um produto de experiência, exigindo a criação de um ecossistema completo de marca — do digital ao físico — com foco em posicionamento, conversão e percepção de valor.',
      sections: [
        {
          h2: 'Contexto',
          p: 'O projeto surgiu da necessidade de criar um evento esportivo proprietário que se diferenciasse de corridas genéricas do mercado. Mais do que identidade visual, era necessário construir uma experiência coerente, capaz de transmitir credibilidade, engajar o público e sustentar valor antes, durante e após o evento.',
        },
        {
          h2: 'O desafio',
          p: 'O principal desafio foi estruturar uma marca e uma jornada que funcionassem de forma integrada em múltiplos pontos de contato. A identidade precisava ser forte e legível em movimento, enquanto o ambiente digital exigia clareza de informação e redução de fricção para garantir conversão no processo de inscrição.',
        },
        {
          h2: 'Minha atuação',
          p: 'Atuei de forma estratégica e operacional na concepção da identidade visual, no design da experiência digital e na integração entre produto, comunicação e materiais físicos. Desenvolvi landing pages orientadas à jornada do usuário, criei sistemas visuais escaláveis e garanti consistência entre interfaces, campanhas, motion e itens físicos do evento.',
        },
        {
          h2: 'Resultado',
          p: 'O evento ganhou identidade própria e uma experiência consistente entre digital e físico. A clareza na jornada e a integração entre marca, conteúdo e materiais contribuíram para maior percepção de valor e um processo de inscrição mais direto para o usuário.',
        },
      ],

      // ✅ imagens + vídeos inline no mesmo grid
      media: [
        { type: 'image', src: '/images/laestamparun/evento.heic', alt: 'Evento - Foto retirada por mim' },
        { type: 'image', src: '/images/laestamparun/1.png', alt: 'Material em que fiz o Design' },
        { type: 'image', src: '/images/laestamparun/trofeu.jpg', alt: 'Troféu que fiz para o evento' },

        { type: 'video', src: '/images/laestamparun/video1.mp4', },
        { type: 'video', src: '/images/laestamparun/video2.mp4', },
        { type: 'video', src: '/images/laestamparun/video3.mp4', },
      ],
    },
    unidentis: {
  title: 'Unidentis',
  meta: [ 'CRO', 'Healthtech', 'Compliance'],
  intro:
    'A Unidentis atua no setor de saúde, um contexto altamente regulado e sensível à confiança do usuário. O projeto envolveu a criação de materiais visuais e animações voltadas à conversão em ambientes de redes sociais, equilibrando impacto visual, clareza de mensagem e responsabilidade na comunicação.',
  sections: [
    {
      h2: 'Contexto',
      p:
        'A Unidentis atua no segmento de planos odontológicos, um contexto onde o excesso de informação, linguagem técnica e exigências regulatórias frequentemente geram fricção e dificultam a tomada de decisão do usuário.'
    },
    {
      h2: 'O desafio',
      p:
        'Criar anúncios e motions capazes de captar atenção rapidamente no feed, transmitir confiança e orientar à conversão, sem recorrer a mensagens agressivas ou promessas exageradas comuns no segmento.'
    },
    {
      h2: 'Minha atuação',
      p:
        'Fui responsável pela criação de criativos estáticos e motion design para campanhas em Feed, Stories e Reels, trabalhando narrativa curta, hierarquia visual e variações criativas voltadas à performance e escalabilidade. Estruturando o setor de marketing da Unidentis '
    },
    {
      h2: 'Resultado',
      p:
        'Os materiais fortaleceram a presença digital da marca e contribuíram para campanhas mais claras e eficientes, alinhando impacto visual, consistência de marca e foco em conversão. No primeiro ano, o digital faturou mais do que as concessionária de planos!'
    }
  ],

      // ✅ imagens + vídeos inline no mesmo grid
      media: [
        { type: 'image', src: '/images/unidentis/1.png', alt: 'Cartão de credenciado ' },
        { type: 'image', src: '/images/unidentis/2.jpg', alt: 'Material em que fiz o Design' },
        { type: 'image', src: '/images/unidentis/3.jpg', alt: 'Nosso Influenciador' },
        { type: 'image', src: '/images/unidentis/4.jpg', alt: 'Gerente Comercial' },
        { type: 'image', src: '/images/unidentis/5.jpg', alt: 'Cartão impresso' },

        { type: 'video', src: '/images/unidentis/1.mp4', },
      ],
    },
    meltz: {
      title: 'Meltz Burger',
      meta: ['Branding', 'Marketing', 'Performance', 'Food Service'],
      intro:
        'A Meltz Burger é um projeto de hamburgueria artesanal desenvolvido com foco em identidade, comunicação e performance, explorando design como ferramenta para gerar desejo, reconhecimento de marca e apoio direto às estratégias de venda em um mercado altamente competitivo.',
      sections: [
        {
          h2: 'Contexto',
          p: 'A Meltz Burger é uma hamburgueria artesanal inserida em um mercado altamente competitivo, onde diferenciação de marca, clareza de posicionamento e comunicação visual consistente são fundamentais para atrair e reter clientes.',
        },
        {
          h2: 'O desafio',
          p: 'O principal desafio foi construir uma identidade e uma comunicação capazes de gerar desejo imediato, reforçar percepção de qualidade e sustentar conversão em canais digitais, especialmente redes sociais e materiais promocionais.',
        },
        {
          h2: 'Minha atuação',
          p: 'Atuei no desenvolvimento da identidade visual, direção criativa e criação de materiais para redes sociais e campanhas promocionais, focando em linguagem visual forte, consistência de marca e estímulo à decisão de compra.',
        },
        {
          h2: 'Resultado',
          p: 'No primeiro mês de trabalho de rebranding, a marca conseguiu em seu canal próprio de vendas alcançar seu primeiro faturamento recorde, não somente como experienciou um resultado positivo de LTV aumentando o retorno de clientes em até 80%',
        },
      ],

      // ✅ imagens + vídeos inline no mesmo grid
      media: [
        { type: 'image', src: '/images/meltz/1.png', alt: 'Logotipo' },
        { type: 'image', src: '/images/meltz/2.png', alt: 'Logotipo' },
        { type: 'image', src: '/images/meltz/3.png', alt: 'Logotipo' },
        { type: 'image', src: '/images/meltz/4.png', alt: 'Logotipo' },
        { type: 'image', src: '/images/meltz/5.png', alt: 'Logotipo' },
        { type: 'image', src: '/images/meltz/6.png', alt: 'Logotipo' },
        { type: 'image', src: '/images/meltz/7.png', alt: 'Logotipo' },
      ],
    },
  };

  /* =========================
     PORTFOLIO SCROLL STATE
     (ativa blur do header só quando rolar)
     ========================= */
  const portfolio = document.getElementById('portfolio');
  if (portfolio) {
    portfolio.addEventListener(
      'scroll',
      () => {
        portfolio.classList.toggle('is-scrolled', portfolio.scrollTop > 4);
      },
      { passive: true }
    );
  }

  let isOpen = false;

  function renderCase(caseId) {
    const c = CASES[caseId];
    if (!c) {
      content.innerHTML = `<div class="case-hero"><h1>Case não encontrado</h1></div>`;
      return;
    }

    const meta = c.meta?.map((m) => `<span>• ${m}</span>`).join(' ') ?? '';

    const sections =
      c.sections
        ?.map(
          (s) => `
          <div class="case-section">
            <h2>${s.h2}</h2>
            <p style="margin:0; opacity:.9; line-height:1.7;">${s.p}</p>
          </div>
        `
        )
        .join('') ?? '';

    // ✅ Suporta o novo "media" (imagem + vídeo)
    // 🔁 E mantém compatível com cases antigos que usam "images"
    const mediaArray = Array.isArray(c.media)
      ? c.media
      : Array.isArray(c.images)
        ? c.images.map((src) => ({ type: 'image', src }))
        : [];

    const mediaBlock = mediaArray.length
      ? `
        <div class="case-section">
          <h2>Aplicações</h2>
          <div class="case-grid">
            ${mediaArray
              .map((m) => {
                if (m.type === 'video') {
                  return `
                    <video
                      class="case-video"
                      src="${m.src}"
                      ${m.poster ? `poster="${m.poster}"` : ''}
                      controls
                      playsinline
                      preload="metadata"
                    ></video>
                  `;
                }

                // default = image
                return `<img src="${m.src}" alt="${m.alt ?? ''}" loading="lazy">`;
              })
              .join('')}
          </div>
        </div>
      `
      : '';

    content.innerHTML = `
      <div class="case-hero">
        <h1>${c.title}</h1>
        <div class="case-meta">${meta}</div>
        <p style="margin:0; opacity:.85; line-height:1.7;">${c.intro}</p>
      </div>
      ${sections}
      ${mediaBlock}
    `;
  }

  function openCase(caseId, thumbEl) {
    if (isOpen) return;
    isOpen = true;

    renderCase(caseId);

    // trava scroll do fundo
    document.documentElement.style.overflow = 'hidden';

    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');

    // “pulo” leve a partir da thumb (opcional)
    if (thumbEl && shell) {
      const from = thumbEl.getBoundingClientRect();
      const to = shell.getBoundingClientRect();

      const dx = from.left + from.width / 2 - (to.left + to.width / 2);
      const dy = from.top + from.height / 2 - (to.top + to.height / 2);
      const sx = Math.max(0.2, from.width / to.width);
      const sy = Math.max(0.2, from.height / to.height);

      shell.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.0 },
          { transform: 'translate(0,0) scale(1,1)', opacity: 1.0 },
        ],
        { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' }
      );
    }
  }

  function closeCase() {
    if (!isOpen) return;
    isOpen = false;

    // pausa vídeos quando fecha (UX)
    content.querySelectorAll('video').forEach((v) => v.pause());

    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
  }

  // ✅ UX: ao dar play em um vídeo, pausa os outros
  content.addEventListener(
    'play',
    (e) => {
      const target = e.target;
      if (!(target instanceof HTMLVideoElement)) return;

      content.querySelectorAll('video').forEach((v) => {
        if (v !== target) v.pause();
      });
    },
    true
  );

  // abre ao clicar na thumb
  document.querySelectorAll('.js-case').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openCase(btn.dataset.case, btn);
    });
  });

  // fechar: botão X
  closeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeCase();
  });

  // fechar: clicar fora
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCase();
  });

  // fechar: ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCase();
  });
});

const btnProjetos = document.getElementById("btn-projetos");
const btnSobre = document.getElementById("btn-sobre");
const btnContato = document.getElementById("btn-contato");

btnProjetos?.addEventListener("click", () => {
  console.log("Clique: Projetos");
  // Exemplo: window.location.href = "/projetos";
});

btnSobre?.addEventListener("click", () => {
  console.log("Clique: Sobre");
  // Exemplo: window.location.href = "/sobre";
});

btnContato?.addEventListener("click", () => {
  console.log("Clique: Contato");
  // Exemplo: window.location.href = "/contato";
});