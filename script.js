const layers = Array.from(document.querySelectorAll(".parallax-layer"));
let latestScroll = 0;
let ticking = false;

const updateParallax = () => {
  const offset = latestScroll;
  layers.forEach((layer) => {
    const speed = Number(layer.dataset.speed || 0);
    layer.style.transform = `translate3d(0, ${offset * speed}px, 0)`;
  });
  ticking = false;
};

const onScroll = () => {
  latestScroll = window.scrollY || window.pageYOffset;
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

document.body.classList.add("preloading");

window.addEventListener("load", () => {
  const exitDelay = 2600;
  setTimeout(() => {
    document.body.classList.add("preload-exit");
    document.body.classList.remove("preloading");
    setTimeout(() => {
      document.body.classList.add("boot");
      initDesktopNav();
    }, 900);
  }, exitDelay);
});

const revealItems = document.querySelectorAll(".reveal");
if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          if (entry.target.classList.contains("intel-band")) {
            startCounters();
          }
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

let countersStarted = false;
const startCounters = () => {
  if (countersStarted) {
    return;
  }
  countersStarted = true;
  const counters = document.querySelectorAll(".intel-card strong[data-value]");
  counters.forEach((counter) => {
    const targetValue = Number(counter.dataset.value || 0);
    const suffix = counter.dataset.suffix || "";
    const decimals = String(counter.dataset.value || "").includes(".") ? 1 : 0;
    const startTime = performance.now();
    const duration = 1200;
    counter.classList.add("animating");

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = (targetValue * eased).toFixed(decimals);
      counter.textContent = `${value}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counter.classList.remove("animating");
      }
    };

    requestAnimationFrame(tick);
  });
};

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navClose = document.querySelector(".nav-close");

if (navToggle && siteNav) {
  const setNav = (open) => {
    document.body.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  };

  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.contains("nav-open");
    setNav(!isOpen);
  });

  if (navClose) {
    navClose.addEventListener("click", () => setNav(false));
  }

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNav(false));
  });

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("nav-open")) {
      return;
    }
    const target = event.target;
    if (target.closest(".site-nav") || target.closest(".nav-toggle")) {
      return;
    }
    setNav(false);
  });
}

const heroFrame = document.querySelector(".hero-frame");
const modeButtons = document.querySelectorAll(".mode-btn");
const consoleLines = heroFrame ? heroFrame.querySelectorAll(".console-line") : [];

const modePresets = {
  "read-only": [
    "STATUS: GREEN",
    "MODE: READ-ONLY",
    "ACTIVE ASSURANCE: 4129",
    "ANOMALY INDEX: 0.014",
    "REVOCATIONS: 12",
    "ELEVATION REQUESTS: 5",
  ],
  "incident-response": [
    "STATUS: AMBER",
    "MODE: INCIDENT RESPONSE",
    "ACTIVE CONTAINMENT: 7",
    "ANOMALY INDEX: 0.071",
    "REVOCATIONS: 42",
    "ELEVATION REQUESTS: 18",
  ],
  lockdown: [
    "STATUS: RED",
    "MODE: LOCKDOWN",
    "ACTIVE CONTAINMENT: 24",
    "ANOMALY INDEX: 0.221",
    "REVOCATIONS: 128",
    "ELEVATION REQUESTS: 0",
  ],
};

const applyMode = (mode) => {
  if (!heroFrame) {
    return;
  }
  heroFrame.dataset.mode = mode;
  const lines = modePresets[mode] || modePresets["read-only"];
  consoleLines.forEach((line, index) => {
    if (lines[index]) {
      line.textContent = lines[index];
    }
  });
  modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === mode);
  });
  localStorage.setItem("consoleMode", mode);
};

if (modeButtons.length) {
  const savedMode = localStorage.getItem("consoleMode") || "read-only";
  applyMode(savedMode);
  modeButtons.forEach((button) => {
    button.addEventListener("click", () => applyMode(button.dataset.mode));
  });
}

const matrixCards = document.querySelectorAll(".matrix-card");
const matrixPanel = document.querySelector(".matrix-panel");
const panelTitle = matrixPanel ? matrixPanel.querySelector(".panel-title") : null;
const panelText = matrixPanel ? matrixPanel.querySelector(".panel-text") : null;
const panelStats = matrixPanel ? matrixPanel.querySelectorAll(".panel-stats strong") : [];

const matrixData = {
  air: {
    title: "Air Domain",
    text: "Flight systems with continuous posture checks and encrypted uplinks.",
    stats: ["Elevated", "98%", "2"],
  },
  land: {
    title: "Land Domain",
    text: "Edge nodes segmented by mission zone with adaptive policy enforcement.",
    stats: ["Guarded", "94%", "5"],
  },
  sea: {
    title: "Sea Domain",
    text: "Operational mesh monitoring command latency and secure routing.",
    stats: ["Controlled", "96%", "3"],
  },
  cyber: {
    title: "Cyber Domain",
    text: "Identity fusion detects lateral movement and enforces micro-segmentation.",
    stats: ["High", "91%", "11"],
  },
};

const applyMatrixSelection = (card) => {
  if (!card || !matrixPanel) {
    return;
  }
  const domain = card.dataset.domain;
  const data = matrixData[domain];
  if (!data) {
    return;
  }
  matrixCards.forEach((item) => {
    const isSelected = item === card;
    item.classList.toggle("is-selected", isSelected);
    item.setAttribute("aria-selected", String(isSelected));
  });
  matrixPanel.classList.add("is-active");
  if (panelTitle) {
    panelTitle.textContent = data.title;
  }
  if (panelText) {
    panelText.textContent = data.text;
  }
  if (panelStats.length >= 3) {
    panelStats[0].textContent = data.stats[0];
    panelStats[1].textContent = data.stats[1];
    panelStats[2].textContent = data.stats[2];
  }
  localStorage.setItem("matrixSelection", domain);
};

if (matrixCards.length) {
  const savedDomain = localStorage.getItem("matrixSelection");
  const initialCard =
    (savedDomain && document.querySelector(`.matrix-card[data-domain="${savedDomain}"]`)) ||
    matrixCards[0];
  applyMatrixSelection(initialCard);
  matrixCards.forEach((card) => {
    card.addEventListener("click", () => applyMatrixSelection(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        applyMatrixSelection(card);
      }
    });
  });
}

const modalOverlay = document.querySelector(".modal-overlay");
const modalButtons = document.querySelectorAll("[data-modal]");
const modalCloseButtons = document.querySelectorAll(".modal-close");
const downloadTrigger = document.querySelector(".download-trigger");
const downloadModal = document.querySelector(".download-modal");
const downloadStatus = document.querySelector(".download-status");
let downloadTimer = null;
let typingBuffer = "";
let typingTimer = null;

const closeModal = () => {
  if (!modalOverlay) {
    return;
  }
  modalOverlay.classList.remove("active");
  modalOverlay.querySelectorAll(".modal.active").forEach((modal) => {
    modal.classList.remove("active");
  });
  document.body.classList.remove("modal-open");
};

const deactivateModals = () => {
  if (!modalOverlay) {
    return;
  }
  modalOverlay.querySelectorAll(".modal.active").forEach((modal) => {
    modal.classList.remove("active");
  });
};

const resetTypingBuffer = () => {
  typingBuffer = "";
  if (typingTimer) {
    clearTimeout(typingTimer);
  }
};

const openModal = (modalId) => {
  if (!modalOverlay) {
    return;
  }
  const modal = document.getElementById(modalId);
  if (!modal) {
    return;
  }
  if (modal.classList.contains("download-modal")) {
    modal.classList.remove("download-active");
    modal.classList.remove("fallback");
    void modal.offsetWidth;
    modal.classList.add("download-active");
    if (downloadStatus) {
      downloadStatus.textContent = "Transfer status: queued";
    }
    if (downloadTimer) {
      clearTimeout(downloadTimer);
    }
    downloadTimer = setTimeout(() => {
      triggerDownload();
    }, 1650);
  }
  modalOverlay.classList.add("active");
  deactivateModals();
  modal.classList.add("active");
  document.body.classList.add("modal-open");
};

if (modalButtons.length) {
  modalButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      if (button.tagName === "A") {
        event.preventDefault();
      }
      const modalId = button.dataset.modal;
      if (button.classList.contains("arrow")) {
        button.classList.add("blast");
        setTimeout(() => {
          button.classList.remove("blast");
          openModal(modalId);
        }, 520);
      } else {
        openModal(modalId);
      }
    });
  });
}

if (modalOverlay) {
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });
}

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  const target = event.target;
  if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
    return;
  }
  if (event.key.length !== 1) {
    return;
  }
  typingBuffer += event.key.toLowerCase();
  typingBuffer = typingBuffer.slice(-12);
  if (typingTimer) {
    clearTimeout(typingTimer);
  }
  typingTimer = setTimeout(resetTypingBuffer, 1200);

  if (typingBuffer.includes("login")) {
    openModal("modal-login");
    resetTypingBuffer();
  } else if (typingBuffer.includes("signup")) {
    openModal("modal-signup");
    resetTypingBuffer();
  } else if (typingBuffer.includes("forgot")) {
    openModal("modal-forgot");
    resetTypingBuffer();
  }
});

const validators = {
  id: (value) => value.trim().length >= 4,
  text: (value) => value.trim().length >= 3,
  email: (value) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value.trim()),
  code: (value) => /^[0-9]{6}$/.test(value.trim()),
  "password-lite": (value) => value.trim().length >= 6,
};

const passwordScore = (value) => {
  let score = 0;
  if (value.length >= 12) score += 1;
  if (/[a-z]/.test(value)) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
};

const passwordLabel = (score) => {
  if (score <= 1) return "weak";
  if (score === 2) return "unstable";
  if (score === 3) return "guarded";
  if (score === 4) return "secure";
  return "command-grade";
};

const updateStrength = (input) => {
  const meter = document.querySelector(`.strength-meter[data-strength-for="${input.dataset.field}"]`);
  if (!meter) {
    return;
  }
  const bar = meter.querySelector(".strength-bar");
  const label = meter.querySelector(".strength-label");
  const score = passwordScore(input.value);
  const width = Math.min((score / 5) * 100, 100);
  if (bar) {
    bar.style.width = `${width}%`;
  }
  if (label) {
    label.textContent = `Key strength: ${passwordLabel(score)}`;
  }
};

const setMessage = (input, ok, message) => {
  const messageNode = document.querySelector(`.field-message[data-message-for="${input.dataset.field}"]`);
  if (!messageNode) {
    return;
  }
  messageNode.textContent = message || "";
  messageNode.classList.toggle("ok", ok);
};

const validateInput = (input) => {
  const value = input.value || "";
  const rule = input.dataset.validate;
  let ok = true;
  let message = "Clear";
  if (rule === "password") {
    const score = passwordScore(value);
    ok = score >= 4;
    message = ok ? "Key verified" : "Key weak: require 12+ chars, mixed classes";
    updateStrength(input);
  } else if (rule === "password-lite") {
    ok = validators["password-lite"](value);
    message = ok ? "Key verified" : "Key too short";
  } else if (validators[rule]) {
    ok = validators[rule](value);
    message = ok ? "Signal verified" : "Signal invalid";
  }
  input.classList.toggle("is-error", !ok);
  input.classList.toggle("is-ok", ok);
  setMessage(input, ok, message);
  return ok;
};

document.querySelectorAll(".modal-form input").forEach((input) => {
  input.addEventListener("input", () => {
    validateInput(input);
  });
});

document.querySelectorAll(".modal-form").forEach((form) => {
  const formType = form.dataset.form;
  const statusNode = document.querySelector(`.form-status[data-status="${formType}"]`);
  const submitButton = form.querySelector(".form-submit");
  if (!submitButton) {
    return;
  }
  submitButton.addEventListener("click", () => {
    const inputs = Array.from(form.querySelectorAll("input"));
    const results = inputs.map((input) => validateInput(input));
    const ok = results.every(Boolean);
    form.classList.remove("shake");
    void form.offsetWidth;
    if (ok) {
      if (statusNode) {
        statusNode.textContent = "Clearance verified. Awaiting command authorization.";
        statusNode.classList.remove("error");
        statusNode.classList.add("ok");
      }
    } else {
      if (statusNode) {
        statusNode.textContent = "Auth failure. Review highlighted inputs.";
        statusNode.classList.remove("ok");
        statusNode.classList.add("error");
      }
      form.classList.add("shake");
    }
  });
});

const initDesktopNav = () => {
  const links = Array.from(document.querySelectorAll(".site-nav a"));
  if (!links.length) {
    return;
  }
  const shuffled = links.slice().sort(() => Math.random() - 0.5);
  shuffled.forEach((link, index) => {
    link.style.setProperty("--nav-delay", `${index * 90}ms`);
  });
  document.body.classList.add("nav-boot");
};

const triggerDownload = () => {
  if (!downloadModal) {
    return;
  }
  const url = downloadModal.dataset.downloadUrl;
  if (!url) {
    if (downloadStatus) {
      downloadStatus.textContent = "Transfer status: manual required";
    }
    downloadModal.classList.add("fallback");
    return;
  }
  if (downloadStatus) {
    downloadStatus.textContent = "Transfer status: initiated";
  }
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = "readiness-brief.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => {
      if (downloadStatus) {
        downloadStatus.textContent = "Transfer status: complete";
      }
    }, 700);
  } catch {
    if (downloadStatus) {
      downloadStatus.textContent = "Transfer status: manual required";
    }
    downloadModal.classList.add("fallback");
  }
};

if (downloadTrigger) {
  downloadTrigger.addEventListener("click", triggerDownload);
}

const initOrbs = () => {
  const grid = document.querySelector(".viz-grid");
  if (!grid) {
    return null;
  }
  const orbs = Array.from(grid.querySelectorAll(".orb"));
  if (!orbs.length) {
    return null;
  }

  const rect = grid.getBoundingClientRect();
  const colors = ["red", "green", "blue", "amber", "cyan"];
  const orbState = orbs.map((orb) => {
    const size = 34 + Math.floor(Math.random() * 36);
    const maxX = Math.max(rect.width - size, 0);
    const maxY = Math.max(rect.height - size, 0);
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    const vx = (Math.random() * 50 + 20) * (Math.random() < 0.5 ? -1 : 1);
    const vy = (Math.random() * 40 + 15) * (Math.random() < 0.5 ? -1 : 1);
    const color = colors[Math.floor(Math.random() * colors.length)];

    orb.classList.remove("red", "green", "blue", "amber", "cyan");
    orb.classList.add(color);
    orb.style.setProperty("--size", `${size}px`);
    orb.style.transform = `translate(${x}px, ${y}px)`;

    return {
      orb,
      size,
      x,
      y,
      vx,
      vy,
    };
  });

  return { grid, orbs: orbState };
};

const startOrbAnimation = () => {
  const state = initOrbs();
  if (!state) {
    return;
  }
  let { grid, orbs } = state;
  let last = null;

  const updateBounds = () => {
    const rect = grid.getBoundingClientRect();
    orbs.forEach((orbState) => {
      orbState.maxX = Math.max(rect.width - orbState.size, 0);
      orbState.maxY = Math.max(rect.height - orbState.size, 0);
      orbState.x = Math.min(Math.max(0, orbState.x), orbState.maxX);
      orbState.y = Math.min(Math.max(0, orbState.y), orbState.maxY);
    });
  };

  updateBounds();
  window.addEventListener("resize", updateBounds);

  const animate = (now) => {
    if (last === null) {
      last = now;
    }
    const dt = (now - last) / 1000;
    last = now;
    const rect = grid.getBoundingClientRect();

    orbs.forEach((orbState) => {
      const maxX = Math.max(rect.width - orbState.size, 0);
      const maxY = Math.max(rect.height - orbState.size, 0);

      orbState.x += orbState.vx * dt;
      orbState.y += orbState.vy * dt;

      if (orbState.x <= 0 || orbState.x >= maxX) {
        orbState.vx *= -1;
        orbState.x = Math.min(Math.max(0, orbState.x), maxX);
      }

      if (orbState.y <= 0 || orbState.y >= maxY) {
        orbState.vy *= -1;
        orbState.y = Math.min(Math.max(0, orbState.y), maxY);
      }

      orbState.orb.style.transform = `translate(${orbState.x}px, ${orbState.y}px)`;
    });

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
};

startOrbAnimation();
