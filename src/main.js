
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
      // força reflow para garantir transição
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

// ===== Audio Reactive =====
window.addEventListener('DOMContentLoaded', () => {
  const audioControl = document.getElementById('audioControl');
  const audioToggle = document.getElementById('audioToggle');
  const audioPanel = document.getElementById('audioPanel');
  const audioStatus = document.getElementById('audioStatus');

  const audioState = {
    enabled: false,
    sourceType: null,
    stream: null,
    ctx: null,
    analyser: null,
    source: null,
    data: null,
    freq: null,
    level: 0,
    smoothLevel: 0,
    bassLevel: 0,
    bassSmooth: 0,
    bassHitUntil: 0,
  };

  function setStatus(message) {
    if (audioStatus) audioStatus.textContent = message;
  }

  function setUIActive(isActive) {
    audioControl?.classList.toggle('is-active', isActive);
    document.body.classList.toggle('audio-reactive', isActive);
    audioToggle?.setAttribute('aria-pressed', String(isActive));
  }

  function setPanelOpen(isOpen) {
    audioControl?.classList.toggle('is-open', isOpen);
    audioToggle?.setAttribute('aria-expanded', String(isOpen));
    audioPanel?.setAttribute('aria-hidden', String(!isOpen));
  }

  async function stopCapture() {
    if (audioState.stream) {
      audioState.stream.getTracks().forEach((t) => t.stop());
    }
    if (audioState.source) {
      try { audioState.source.disconnect(); } catch (_) {}
    }
    if (audioState.analyser) {
      try { audioState.analyser.disconnect(); } catch (_) {}
    }
    if (audioState.ctx) {
      try { await audioState.ctx.close(); } catch (_) {}
    }
    audioState.enabled = false;
    audioState.sourceType = null;
    audioState.stream = null;
    audioState.ctx = null;
    audioState.analyser = null;
    audioState.source = null;
    audioState.data = null;
    audioState.freq = null;
    audioState.level = 0;
    audioState.smoothLevel = 0;
    audioState.bassLevel = 0;
    audioState.bassSmooth = 0;
    audioState.bassHitUntil = 0;
    document.body.classList.remove('bass-hit');
    document.documentElement.style.setProperty('--bass-blur', '0px');
    document.documentElement.style.setProperty('--bass-shake', '0');
    setUIActive(false);
    setStatus('Desativado');
  }

  function initStream(stream, type) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      setStatus('WebAudio indisponivel');
      return;
    }

    audioState.ctx = new AudioCtx();
    audioState.analyser = audioState.ctx.createAnalyser();
    audioState.analyser.fftSize = 1024;
    audioState.analyser.smoothingTimeConstant = 0.7;
    audioState.data = new Uint8Array(audioState.analyser.fftSize);
    audioState.freq = new Uint8Array(audioState.analyser.frequencyBinCount);
    audioState.source = audioState.ctx.createMediaStreamSource(stream);
    audioState.source.connect(audioState.analyser);

    audioState.stream = stream;
    audioState.sourceType = type;
    audioState.enabled = true;

    setUIActive(true);

    if (audioState.ctx.state === 'suspended') {
      audioState.ctx.resume().catch(() => {});
    }

    stream.getTracks().forEach((track) => {
      track.onended = () => {
        stopCapture();
      };
    });
  }

  async function startCapture({ auto = false } = {}) {
    if (!navigator.mediaDevices) {
      setStatus('Navegador sem suporte');
      return;
    }

    await stopCapture();

    try {
      setStatus(auto ? 'Solicitando permissao de audio...' : 'Ativando modo musica...');
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      initStream(stream, 'display');
      setStatus('Capturando audio do sistema');
    } catch (err) {
      console.warn('[AudioReactive] Falha ao iniciar captura', err);
      setStatus('Permissao negada');
      setUIActive(false);
    }
  }

  async function startMicCapture() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('Microfone indisponivel');
      return;
    }
    await stopCapture();
    try {
      setStatus('Ativando microfone...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      initStream(stream, 'mic');
      setStatus('Capturando microfone');
    } catch (err) {
      console.warn('[AudioReactive] Falha ao iniciar microfone', err);
      setStatus('Permissao negada');
      setUIActive(false);
    }
  }

  function updateAudioAnalysis() {
    if (!audioState.enabled || !audioState.analyser || !audioState.data) {
      audioState.level = 0;
      audioState.smoothLevel *= 0.9;
      audioState.bassSmooth *= 0.9;
      document.documentElement.style.setProperty('--audio-pulse', audioState.smoothLevel.toFixed(3));
      document.documentElement.style.setProperty('--bass-blur', `${(audioState.bassSmooth * 8).toFixed(2)}px`);
      document.documentElement.style.setProperty('--bass-shake', audioState.bassSmooth.toFixed(3));
      if (audioState.bassHitUntil && performance.now() > audioState.bassHitUntil) {
        document.body.classList.remove('bass-hit');
      }
      return;
    }

    audioState.analyser.getByteTimeDomainData(audioState.data);
    audioState.analyser.getByteFrequencyData(audioState.freq);

    let sum = 0;
    for (let i = 0; i < audioState.data.length; i += 1) {
      const v = (audioState.data[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / audioState.data.length);
    const level = Math.min(1, rms * 2.6);
    audioState.level = level;
    audioState.smoothLevel = audioState.smoothLevel * 0.6 + level * 0.4;

    let bassSum = 0;
    const bassBins = Math.max(6, Math.floor(audioState.freq.length * 0.08));
    for (let i = 0; i < bassBins; i += 1) {
      bassSum += audioState.freq[i];
    }
    const bassAvg = bassSum / bassBins;
    const bassLevel = Math.min(1, (bassAvg / 255) * 2.4);
    audioState.bassLevel = bassLevel;
    audioState.bassSmooth = audioState.bassSmooth * 0.65 + bassLevel * 0.35;

    const now = performance.now();
    if (bassLevel > 0.48) {
      audioState.bassHitUntil = now + 180;
    }
    if (audioState.bassHitUntil && now < audioState.bassHitUntil) {
      document.body.classList.add('bass-hit');
    } else {
      document.body.classList.remove('bass-hit');
    }

    document.documentElement.style.setProperty('--audio-pulse', audioState.smoothLevel.toFixed(3));
    document.documentElement.style.setProperty('--bass-blur', `${(audioState.bassSmooth * 10).toFixed(2)}px`);
    document.documentElement.style.setProperty('--bass-shake', audioState.bassSmooth.toFixed(3));
  }

  audioState.update = updateAudioAnalysis;
  window.__audioReactive = audioState;

  audioToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    setPanelOpen(!audioControl?.classList.contains('is-open'));
  });

  audioPanel?.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.dataset.action === 'start-display') {
      startCapture();
      setPanelOpen(true);
    }
    if (target.dataset.action === 'start-mic') {
      startMicCapture();
      setPanelOpen(true);
    }
    if (target.dataset.action === 'stop') {
      stopCapture();
      setPanelOpen(false);
    }
  });

  document.addEventListener('click', (e) => {
    if (!audioControl || audioControl.contains(e.target)) return;
    setPanelOpen(false);
  });

  setStatus('Desativado');
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

  // Conteï¿½dos
    const CASES = {
    lastampa: {
      title: 'La Stampa Run',
      meta: ['Branding', 'UX/UI', 'Experiência', 'Growth'],
      intro:
        'La Estampa Run foi um evento proprietário desenvolvido como um produto de experiência, exigindo a criação de um ecossistema completo de marca ? do digital ao físico ? com foco em posicionamento, conversão e percepção de valor.',
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
          p: 'Atuei de forma estratégica e operacional na concepção da identidade visual, no design da experiência digital e na integração entre produto, comunicação e materiais físicos. Desenvolvi landing pages orientadas   jornada do usuário, criei sistemas visuais escaláveis e garanti consistência entre interfaces, campanhas, motion e itens físicos do evento.',
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
        'A Unidentis atua no setor de saúde, um contexto altamente regulado e sensível   confiança do usuário. O projeto envolveu a criação de materiais visuais e animações voltadas   conversão em ambientes de redes sociais, equilibrando impacto visual, clareza de mensagem e responsabilidade na comunicação.',
      sections: [
        {
          h2: 'Contexto',
          p:
            'A Unidentis atua no segmento de planos odontológicos, um contexto onde o excesso de informação, linguagem técnica e exigências regulatórias frequentemente geram fricção e dificultam a tomada de decisão do usuário.'
        },
        {
          h2: 'O desafio',
          p:
            'Criar anúncios e motions capazes de captar atenção rapidamente no feed, transmitir confiança e orientar   conversão, sem recorrer a mensagens agressivas ou promessas exageradas comuns no segmento.'
        },
        {
          h2: 'Minha atuação',
          p:
            'Fui responsável pela criação de criativos estáticos e motion design para campanhas em Feed, Stories e Reels, trabalhando narrativa curta, hierarquia visual e variações criativas voltadas   performance e escalabilidade. Estruturando o setor de marketing da Unidentis '
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
        'A Meltz Burger é um projeto de hamburgueria artesanal desenvolvido com foco em identidade, comunicação e performance, explorando design como ferramenta para gerar desejo, reconhecimento de marca e apoio direto  s estratégias de venda em um mercado altamente competitivo.',
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
          p: 'Atuei no desenvolvimento da identidade visual, direção criativa e criação de materiais para redes sociais e campanhas promocionais, focando em linguagem visual forte, consistência de marca e estímulo   decisão de compra.',
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
     (ativa blur do header sï¿½ quando rolar)
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

  /* =========================
     ABOUT (SOBRE) SCROLL STATE
     (ativa blur do header sï¿½ quando rolar)
     ========================= */
  const sobre = document.getElementById('sobre');
  const aboutScroll = document.querySelector('#sobre #rightcontent');
  if (sobre && aboutScroll) {
    const updateAboutScrollState = () => {
      sobre.classList.toggle('is-scrolled', aboutScroll.scrollTop > 4);
    };
    aboutScroll.addEventListener('scroll', updateAboutScrollState, { passive: true });
    updateAboutScrollState();
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

    // ? Suporta o novo "media" (imagem + vï¿½deo)
    // ?? E mantï¿½m compatï¿½vel com cases antigos que usam "images"
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

    // pausa vï¿½deos quando fecha (UX)
    content.querySelectorAll('video').forEach((v) => v.pause());

    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
  }

  // ? UX: ao dar play em um vï¿½deo, pausa os outros
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

  // fechar: botï¿½o X
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

  const rrOverlay = document.getElementById('rrOverlay');
  const rrCanvas = document.getElementById('rr-canvas');
  const rrClose = rrOverlay?.querySelector('.rr-close');
  const rrShell = rrOverlay?.querySelector('.rr-shell');

  const points = [];
  let hotPointIndex = 0;
  let portalOpen = false;
  let squareTargets = [];
  let portalSquares = [];
  let width = 0;
  let height = 0;
  let colors = { line: 'rgba(22,136,154,0.18)', dot: 'rgba(22,136,154,0.6)', glow: 'rgba(22,136,154,0.35)' };
  let rrColors = {
    bg: 'transparent',
    river: '#16889A',
    edge: 'rgba(22,136,154,0.85)',
    player: '#f5fdff',
    glow: 'rgba(22,136,154,0.35)',
    ui: 'rgba(22,136,154,0.9)',
  };
  const portalAnim = { start: 0, progress: 0, reveal: 0 };

  function readColors() {
    const styles = getComputedStyle(document.documentElement);
    colors = {
      line: styles.getPropertyValue('--net-line').trim() || colors.line,
      dot: styles.getPropertyValue('--net-dot').trim() || colors.dot,
      glow: styles.getPropertyValue('--net-glow').trim() || colors.glow,
    };
    const accentBlue = styles.getPropertyValue('--accent-blue').trim();
    rrColors = {
      bg: styles.getPropertyValue('--rr-bg').trim() || rrColors.bg,
      river: styles.getPropertyValue('--rr-river').trim() || rrColors.river,
      edge: accentBlue || styles.getPropertyValue('--rr-edge').trim() || rrColors.edge,
      player: accentBlue || styles.getPropertyValue('--rr-player').trim() || rrColors.player,
      glow: styles.getPropertyValue('--rr-glow').trim() || rrColors.glow,
      ui: accentBlue || styles.getPropertyValue('--rr-ui').trim() || rrColors.ui,
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
    if (portalOpen) {
      setPortalTargets();
      setOverlaySize();
      resizeGame();
    }
  }

  function setOverlaySize() {
    if (!rrShell) return;
    const size = Math.min(width, height) * 0.62;
    rrShell.style.setProperty('--rr-size', `${size}px`);
  }

  function setPortalTargets() {
    const size = Math.min(width, height) * 0.62;
    const cx = width / 2;
    const cy = height / 2;
    const ringScales = [1];
    portalSquares = ringScales.map((scale) => ({ cx, cy, size: size * scale }));

    const half = size / 2;
    squareTargets = points.map((_, i) => {
      const ringIndex = i % ringScales.length;
      const ringSize = size * ringScales[ringIndex];
      const ringHalf = ringSize / 2;
      const ringCount = Math.max(1, Math.ceil(points.length / ringScales.length) - 1);
      const t = Math.floor(i / ringScales.length) / ringCount;
      const p = t * 4;
      let x = cx;
      let y = cy;

      if (p < 1) {
        x = cx - ringHalf + ringSize * p;
        y = cy - ringHalf;
      } else if (p < 2) {
        x = cx + ringHalf;
        y = cy - ringHalf + ringSize * (p - 1);
      } else if (p < 3) {
        x = cx + ringHalf - ringSize * (p - 2);
        y = cy + ringHalf;
      } else {
        x = cx - ringHalf;
        y = cy + ringHalf - ringSize * (p - 3);
      }
      return { x, y };
    });
  }

  function isHotHit(x, y) {
    const p = points[hotPointIndex];
    if (!p) return false;
    const dx = x - p.x;
    const dy = y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < Math.max(12, p.r * 6);
  }

  function openPortal() {
    if (portalOpen) return;
    portalOpen = true;
    portalAnim.start = performance.now();
    portalAnim.progress = 0;
    portalAnim.reveal = 0;
    document.documentElement.classList.add('rr-open');
    rrOverlay?.classList.add('is-open');
    rrOverlay?.setAttribute('aria-hidden', 'false');
    setPortalTargets();
    setOverlaySize();
    startGame();
  }

  function closePortal() {
    if (!portalOpen) return;
    portalOpen = false;
    portalAnim.progress = 0;
    portalAnim.reveal = 0;
    rrShell?.style.setProperty('--rr-appear', '0');
    document.documentElement.classList.remove('rr-open');
    rrOverlay?.classList.remove('is-open');
    rrOverlay?.setAttribute('aria-hidden', 'true');
    stopGame();
    buildPoints();
  }

  function buildPoints() {
    const area = width * height;
    const count = Math.max(36, Math.min(140, Math.floor(area / 14000)));
    points.length = 0;
    for (let i = 0; i < count; i += 1) {
      const baseR = 1.2 + Math.random() * 1.8;
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        ox: (Math.random() - 0.5) * 90,
        oy: (Math.random() - 0.5) * 90,
        r: baseR,
        baseR,
      });
    }

    if (points.length) {
      hotPointIndex = Math.floor(Math.random() * points.length);
      points[hotPointIndex].isHot = true;
      points[hotPointIndex].r = Math.max(points[hotPointIndex].r, 3.2);
      points[hotPointIndex].baseR = points[hotPointIndex].r;
    }
  }

  const game = {
    running: false,
    raf: 0,
    lastTime: 0,
    ctx: rrCanvas ? rrCanvas.getContext('2d') : null,
    width: 0,
    height: 0,
    dpr: 1,
    input: { left: false, right: false },
    player: { x: 0, y: 0, size: 18 },
    segments: [],
    speed: 120,
    status: 'ready',
  };

  function resizeGame() {
    if (!rrCanvas || !rrShell || !game.ctx) return;
    const rect = rrShell.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    game.dpr = dpr;
    game.width = rect.width;
    game.height = rect.height;
    rrCanvas.width = rect.width * dpr;
    rrCanvas.height = rect.height * dpr;
    rrCanvas.style.width = `${rect.width}px`;
    rrCanvas.style.height = `${rect.height}px`;
    game.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initGame();
  }

  function initGame() {
    if (!game.ctx) return;
    game.segments = [];
    game.input.left = false;
    game.input.right = false;
    game.player.x = game.width / 2;
    game.player.y = game.height * 0.78;
    game.status = 'run';

    const gap = 26;
    const count = Math.ceil(game.height / gap) + 6;
    let prev = null;
    for (let i = 0; i < count; i += 1) {
      const y = -gap * 2 + i * gap;
      const seg = makeSegment(prev, y);
      game.segments.push(seg);
      prev = seg;
    }
  }

  function makeSegment(prev, y) {
    const margin = 40;
    const minW = game.width * 0.38;
    const maxW = game.width * 0.62;
    const baseW = prev ? prev.width : game.width * 0.52;
    const baseC = prev ? prev.center : game.width / 2;
    const width = clamp(baseW + rand(-28, 28), minW, maxW);
    const center = clamp(baseC + rand(-32, 32), margin + width / 2, game.width - margin - width / 2);
    return { y, center, width };
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getBoundsAt(y) {
    const sorted = [...game.segments].sort((a, b) => a.y - b.y);
    for (let i = 0; i < sorted.length - 1; i += 1) {
      const a = sorted[i];
      const b = sorted[i + 1];
      if (y >= a.y && y <= b.y) {
        const t = (y - a.y) / (b.y - a.y || 1);
        const center = a.center + (b.center - a.center) * t;
        const width = a.width + (b.width - a.width) * t;
        return { left: center - width / 2, right: center + width / 2 };
      }
    }
    const last = sorted[sorted.length - 1];
    return { left: last.center - last.width / 2, right: last.center + last.width / 2 };
  }

  function updateGame(dt) {
    if (game.status !== 'run') return;
    const gap = 26;
    const speed = game.speed * dt;

    for (const seg of game.segments) {
      seg.y += speed;
    }

    game.segments = game.segments.filter((seg) => seg.y < game.height + gap);
    const top = game.segments.reduce((min, s) => (s.y < min.y ? s : min), game.segments[0]);
    while (game.segments.length < Math.ceil(game.height / gap) + 6) {
      const y = top.y - gap;
      const seg = makeSegment(top, y);
      game.segments.push(seg);
    }

    const move = 240 * dt;
    if (game.input.left) game.player.x -= move;
    if (game.input.right) game.player.x += move;

    const bounds = getBoundsAt(game.player.y);
    const margin = 12;
    if (game.player.x < bounds.left + margin || game.player.x > bounds.right - margin) {
      game.status = 'crash';
    }
  }

  function drawGame() {
    if (!game.ctx) return;
    const ctx = game.ctx;
    ctx.clearRect(0, 0, game.width, game.height);

    const sorted = [...game.segments].sort((a, b) => a.y - b.y);
    ctx.strokeStyle = rrColors.edge;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (const seg of sorted) {
      ctx.lineTo(seg.center - seg.width / 2, seg.y);
    }
    ctx.stroke();
    ctx.beginPath();
    for (const seg of sorted) {
      ctx.lineTo(seg.center + seg.width / 2, seg.y);
    }
    ctx.stroke();

    const p = game.player;
    ctx.strokeStyle = rrColors.edge;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - p.size);
    ctx.lineTo(p.x - p.size * 0.7, p.y + p.size);
    ctx.lineTo(p.x + p.size * 0.7, p.y + p.size);
    ctx.closePath();
    ctx.stroke();

    if (game.status === 'crash') {
      ctx.strokeStyle = rrColors.ui;
      ctx.lineWidth = 1.5;
      ctx.font = '700 20px "M PLUS Rounded 1c", sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeText('Game Over', game.width / 2, game.height / 2 - 8);
      ctx.font = '400 12px "M PLUS Rounded 1c", sans-serif';
      ctx.strokeText('Pressione X para fechar', game.width / 2, game.height / 2 + 16);
    }
  }

  function gameLoop(ts) {
    if (!game.running) return;
    const now = ts || performance.now();
    const dt = Math.min(0.033, (now - game.lastTime) / 1000);
    game.lastTime = now;
    updateGame(dt);
    drawGame();
    game.raf = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    if (!game.ctx) return;
    resizeGame();
    game.running = true;
    game.lastTime = performance.now();
    gameLoop(game.lastTime);
  }

  function stopGame() {
    game.running = false;
    if (game.raf) cancelAnimationFrame(game.raf);
  }

  window.addEventListener('resize', resize);

  window.addEventListener('pointerdown', (e) => {
    if (portalOpen) return;
    if (isHotHit(e.clientX, e.clientY)) {
      openPortal();
    }
  });

  rrClose?.addEventListener('click', (e) => {
    e.preventDefault();
    closePortal();
  });

  window.addEventListener('keydown', (e) => {
    if (!portalOpen) return;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') game.input.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') game.input.right = true;
    if (e.key === 'Escape' || e.key === 'x' || e.key === 'X') closePortal();
  });

  window.addEventListener('keyup', (e) => {
    if (!portalOpen) return;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') game.input.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') game.input.right = false;
  });

  new MutationObserver(readColors).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  readColors();
  resize();

  function drawSquareProgress(ctx2d, cx, cy, size, t) {
    if (t <= 0) return;
    const half = size / 2;
    const total = size * 4;
    let remaining = Math.min(total, total * t);

    function drawLine(x1, y1, x2, y2, length) {
      if (remaining <= 0) return;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const step = Math.min(remaining, dist, length);
      const ratio = dist ? step / dist : 0;
      ctx2d.beginPath();
      ctx2d.moveTo(x1, y1);
      ctx2d.lineTo(x1 + dx * ratio, y1 + dy * ratio);
      ctx2d.stroke();
      remaining -= step;
    }

    const x1 = cx - half;
    const y1 = cy - half;
    const x2 = cx + half;
    const y2 = cy + half;

    drawLine(x1, y1, x2, y1, size);
    drawLine(x2, y1, x2, y2, size);
    drawLine(x2, y2, x1, y2, size);
    drawLine(x1, y2, x1, y1, size);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

    function animate() {
    ctx.clearRect(0, 0, width, height);

    const audioState = window.__audioReactive;
    audioState?.update?.();
    const audioOn = Boolean(audioState?.enabled) && !portalOpen;
    const audioLevel = audioState?.smoothLevel ?? 0;
    const waveData = audioState?.data;

    const now = performance.now();
    const portalT = portalOpen ? Math.min(1, (now - portalAnim.start) / 1200) : 0;
    const revealT = portalOpen ? Math.min(1, Math.max(0, (portalT - 0.35) / 0.65)) : 0;
    portalAnim.progress = portalT;
    portalAnim.reveal = revealT;
    if (rrShell) rrShell.style.setProperty('--rr-appear', revealT.toFixed(3));

    const baseLink = Math.min(150, Math.max(90, Math.sqrt(width * height) / 10));
    const linkDist = portalOpen ? baseLink * (0.35 + portalT * 0.5) : baseLink;
    const time = now * 0.002;
    const hotColor = `hsl(${(time * 80) % 360}, 100%, 60%)`;
    const gatherT = easeOutCubic(Math.min(1, portalT / 0.45));
    const squareT = easeInOutCubic(Math.max(0, (portalT - 0.25) / 0.65));
    const settleT = easeOutCubic(Math.max(0, (portalT - 0.65) / 0.35));
    const lineT = portalOpen ? 0.2 + squareT * 0.8 : 1;

    if (audioOn && waveData?.length) {
      const margin = Math.max(24, width * 0.08);
      const span = Math.max(1, width - margin * 2);
      const centerY = height * 0.5;
      const bassBoost = audioState?.bassSmooth ?? 0;
      const amp = height * 0.28 + audioLevel * height * 0.6 + bassBoost * height * 0.22;
      const count = Math.max(1, points.length - 1);

      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];
        const t = count ? i / count : 0;
        const sampleIndex = Math.floor(t * (waveData.length - 1));
        const sample = (waveData[sampleIndex] - 128) / 128;
        const targetX = margin + span * t;
        const targetY = centerY + sample * amp;
        const response = 0.32 + audioLevel * 0.35;
        p.x += (targetX - p.x) * 0.28;
        p.y += (targetY - p.y) * response;
      }

      const waveHue = (now * 0.06 + audioLevel * 160) % 360;
      ctx.lineWidth = 2 + audioLevel * 2.2;
      ctx.globalAlpha = 0.6 + audioLevel * 0.4;
      ctx.strokeStyle = `hsla(${waveHue}, 80%, 62%, ${0.35 + audioLevel * 0.5})`;
      ctx.beginPath();
      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else {
      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];
        if (portalOpen && squareTargets[i]) {
          const cx = width / 2;
          const cy = height / 2;
          const clusterX = cx + p.ox * (1 - gatherT);
          const clusterY = cy + p.oy * (1 - gatherT);
          const targetX = clusterX + (squareTargets[i].x - clusterX) * squareT;
          const targetY = clusterY + (squareTargets[i].y - clusterY) * squareT;
          const pull = 0.06 + squareT * 0.14 + settleT * 0.06;
          p.x += (targetX - p.x) * pull;
          p.y += (targetY - p.y) * pull;
        } else {
          p.x += p.vx;
          p.y += p.vy;
        }

        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;
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
            ctx.globalAlpha = alpha * lineT;
            ctx.strokeStyle = colors.line;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    ctx.shadowBlur = 8;
    for (let i = 0; i < points.length; i += 1) {
      const p = points[i];
      const radius = (p.baseR ?? p.r) + audioLevel * 2;
      if (!audioOn && p.isHot) {
        ctx.fillStyle = hotColor;
        ctx.shadowColor = hotColor;
        ctx.shadowBlur = 18;
      } else {
        ctx.fillStyle = colors.dot;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 8;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    if (audioOn) {
      const hue = (now * 0.08 + (audioState?.bassSmooth ?? 0) * 180) % 360;
      const flash = Math.min(1, (audioState?.bassSmooth ?? 0) * 1.7 + audioLevel * 0.7);
      const pulse = 0.2 + audioLevel * 0.8;
      document.documentElement.style.setProperty('--club-hue', hue.toFixed(1));
      document.documentElement.style.setProperty('--club-flash', flash.toFixed(3));
      document.documentElement.style.setProperty('--club-pulse', pulse.toFixed(3));
    } else {
      document.documentElement.style.setProperty('--club-flash', '0');
      document.documentElement.style.setProperty('--club-pulse', '0');
    }

    requestAnimationFrame(animate);
  }

  animate();
});
