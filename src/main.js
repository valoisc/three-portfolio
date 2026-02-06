
import './favicon.js';
import './style.css';

const ASSET_BASE = import.meta.env.BASE_URL || '/';
const assetUrl = (path) => `${ASSET_BASE}${String(path).replace(/^\/+/, '')}`;

window.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('mainNav');
  const sections = ['portfolio', 'sobre', 'contato'];
  const TRANSITION_MS = 300;
  let currentSection = null;

  function hideSection(el) {
    if (!el) return;
    el.classList.remove('is-active');
    el.classList.add('is-hiding');
    window.setTimeout(() => {
      el.style.display = 'none';
      el.classList.remove('is-hiding');
    }, TRANSITION_MS);
  }

  function hideAllSections(exceptId = null) {
    sections.forEach((id) => {
      if (id === exceptId) return;
      const el = document.getElementById(id);
      if (el && el.style.display !== 'none') {
        hideSection(el);
      }
    });
  }

  function showSection(id) {
    const el = document.getElementById(id);
    if (el) {
      if (currentSection === id) return;
      hideAllSections(id);
      el.style.display = 'block';
      // forÃ§a reflow para garantir transiÃ§Ã£o
      void el.offsetHeight;
      el.classList.add('is-active');
      currentSection = id;
    }
    nav?.classList.add('is-hidden');
    document.body.classList.add('page-open');
    const isAbout = id === 'sobre';
    document.body.classList.toggle('about-open', isAbout);
    document.documentElement.classList.toggle('about-open', isAbout);
  }

  function goHome() {
    hideAllSections();
    currentSection = null;
    window.setTimeout(() => {
      nav?.classList.remove('is-hidden');
      document.body.classList.remove('page-open');
      document.body.classList.remove('about-open');
      document.documentElement.classList.remove('about-open');
    }, TRANSITION_MS);
  }

  document.querySelectorAll('.js-nav').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.dataset.target;
      if (target) showSection(target);
    });
  });

  document.querySelectorAll('.js-back').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      goHome();
    });
  });

  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function setTheme(isDark) {
    root.classList.toggle('theme-dark', isDark);
    themeToggle?.setAttribute('aria-pressed', String(isDark));
    const label = themeToggle?.querySelector('.toggle-label');
    if (label) label.textContent = isDark ? 'Modo claro' : 'Modo noturno';
    if (themeMeta) themeMeta.setAttribute('content', isDark ? '#0B1416' : '#ffffff');
  }

  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
  setTheme(storedTheme ? storedTheme === 'dark' : prefersDark);

  themeToggle?.addEventListener('click', () => {
    const isDark = !root.classList.contains('theme-dark');
    setTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
});

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

  // Conte�dos
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

      // imagens + vídeos inline no mesmo grid
      media: [
        { type: 'image', src: assetUrl('images/laestamparun/evento.heic'), alt: 'Evento - Foto retirada por mim' },
        { type: 'image', src: assetUrl('images/laestamparun/1.png'), alt: 'Material em que fiz o Design' },
        { type: 'image', src: assetUrl('images/laestamparun/trofeu.jpg'), alt: 'Troféu que fiz para o evento' },

        { type: 'video', src: assetUrl('images/laestamparun/video1.mp4'), },
        { type: 'video', src: assetUrl('images/laestamparun/video2.mp4'), },
        { type: 'video', src: assetUrl('images/laestamparun/video3.mp4'), },
      ],
    },
    unidentis: {
      title: 'Unidentis',
      meta: ['CRO', 'Healthtech', 'Compliance'],
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
            'Os materiais fortaleceram a presença digital da marca e contribuíram para campanhas mais claras e eficientes, alinhando impacto visual, consistência de marca e foco em conversão. No primeiro ano, o digital faturou mais do que as concessionárias de planos!'
        }
      ],

      // imagens + vídeos inline no mesmo grid
      media: [
        { type: 'image', src: assetUrl('images/unidentis/1.png'), alt: 'Cartão de credenciado ' },
        { type: 'image', src: assetUrl('images/unidentis/2.jpg'), alt: 'Material em que fiz o Design' },
        { type: 'image', src: assetUrl('images/unidentis/3.jpg'), alt: 'Nosso Influenciador' },
        { type: 'image', src: assetUrl('images/unidentis/4.jpg'), alt: 'Gerente Comercial' },
        { type: 'image', src: assetUrl('images/unidentis/5.jpg'), alt: 'Cartão impresso' },

        { type: 'video', src: assetUrl('images/unidentis/1.mp4'), },
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
          p: 'No primeiro mês de trabalho de rebranding, a marca conseguiu em seu canal próprio de vendas alcançar seu primeiro faturamento recorde, não somente como experienciou um resultado positivo de LTV aumentando o retorno de clientes em até 80%'
        },
      ],

      // imagens + vídeos inline no mesmo grid
      media: [
        { type: 'image', src: assetUrl('images/meltz/1.png'), alt: 'Logotipo' },
        { type: 'image', src: assetUrl('images/meltz/2.png'), alt: 'Logotipo' },
        { type: 'image', src: assetUrl('images/meltz/3.png'), alt: 'Logotipo' },
        { type: 'image', src: assetUrl('images/meltz/4.png'), alt: 'Logotipo' },
        { type: 'image', src: assetUrl('images/meltz/5.png'), alt: 'Logotipo' },
        { type: 'image', src: assetUrl('images/meltz/6.png'), alt: 'Logotipo' },
        { type: 'image', src: assetUrl('images/meltz/7.png'), alt: 'Logotipo' },
      ],
    },
  };

  /* =========================
     PORTFOLIO SCROLL STATE
     (ativa blur do header s� quando rolar)
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

    // ? Suporta o novo "media" (imagem + v�deo)
    // ?? E mant�m compat�vel com cases antigos que usam "images"
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

    // "pulo" leve a partir da thumb (opcional)
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

    // pausa v�deos quando fecha (UX)
    content.querySelectorAll('video').forEach((v) => v.pause());

    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
  }

  // ? UX: ao dar play em um v�deo, pausa os outros
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

  // fechar: bot�o X
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

// ===== Background Network (Home) =====
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('bg-net');
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const mouse = { x: -9999, y: -9999, active: false };
  const points = [];
  let width = 0;
  let height = 0;
  let colors = { line: 'rgba(22,136,154,0.18)', dot: 'rgba(22,136,154,0.6)', glow: 'rgba(22,136,154,0.35)' };

  function readColors() {
    const styles = getComputedStyle(document.documentElement);
    colors = {
      line: styles.getPropertyValue('--net-line').trim() || colors.line,
      dot: styles.getPropertyValue('--net-dot').trim() || colors.dot,
      glow: styles.getPropertyValue('--net-glow').trim() || colors.glow,
    };
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildPoints();
  }

  function buildPoints() {
    const area = width * height;
    const count = Math.max(36, Math.min(140, Math.floor(area / 14000)));
    points.length = 0;
    for (let i = 0; i < count; i += 1) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.2 + Math.random() * 1.8,
      });
    }
  }

  function handleMove(x, y) {
    mouse.x = x;
    mouse.y = y;
    mouse.active = true;
  }

  window.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
  window.addEventListener('mouseleave', () => { mouse.active = false; });
  window.addEventListener(
    'touchmove',
    (e) => {
      const touch = e.touches?.[0];
      if (touch) handleMove(touch.clientX, touch.clientY);
    },
    { passive: true }
  );
  window.addEventListener('touchend', () => { mouse.active = false; });
  window.addEventListener('resize', resize);

  new MutationObserver(readColors).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  readColors();
  resize();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const linkDist = Math.min(150, Math.max(90, Math.sqrt(width * height) / 10));
    const mouseRange = 140;

    for (const p of points) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x <= 0 || p.x >= width) p.vx *= -1;
      if (p.y <= 0 || p.y >= height) p.vy *= -1;

      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < mouseRange) {
          const force = (mouseRange - dist) / mouseRange;
          p.vx += (dx / dist) * force * 0.05;
          p.vy += (dy / dist) * force * 0.05;
        }
      }
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i];
        const b = points[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkDist) {
          const alpha = 1 - dist / linkDist;
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = colors.line;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = colors.dot;
    ctx.shadowColor = colors.glow;
    ctx.shadowBlur = 8;
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    requestAnimationFrame(animate);
  }

  animate();
});
