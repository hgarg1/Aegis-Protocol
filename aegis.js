const tabs = Array.from(document.querySelectorAll(".tab"));
const panels = Array.from(document.querySelectorAll(".tab-panel"));
const squareGrid = document.querySelector("#square-grid");
const geoGrid = document.querySelector("#geo-grid");
const modalTriggers = Array.from(document.querySelectorAll("[data-modal]"));
const modalCloses = Array.from(document.querySelectorAll("[data-close]"));
const particleField = document.querySelector("#particle-field");
const wizardModal = document.querySelector("#modal-concierge");
const wizardSteps = Array.from(document.querySelectorAll(".wizard-step"));
const wizardPanels = Array.from(document.querySelectorAll(".wizard-panel"));
const wizardActions = Array.from(document.querySelectorAll("[data-wizard]"));

const activateTab = (target) => {
  tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.tab === target));
  panels.forEach((panel) =>
    panel.classList.toggle("is-active", panel.dataset.panel === target)
  );
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activateTab(tab.dataset.tab);
  });
});

const buildGrid = (target, count) => {
  if (!target) return;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i += 1) {
    fragment.appendChild(document.createElement("span"));
  }
  target.appendChild(fragment);
};

const pulseGrid = (target, className, count) => {
  if (!target) return;
  const cells = Array.from(target.children);
  cells.forEach((cell) => cell.classList.remove(className));
  for (let i = 0; i < count; i += 1) {
    const cell = cells[Math.floor(Math.random() * cells.length)];
    cell.classList.add(className);
  }
};

buildGrid(squareGrid, 120);
buildGrid(geoGrid, 48);

pulseGrid(squareGrid, "is-active", 10);
pulseGrid(geoGrid, "is-hot", 6);

window.setInterval(() => {
  pulseGrid(squareGrid, "is-active", 10);
  pulseGrid(geoGrid, "is-hot", 6);
}, 1800);

const spawnParticles = () => {
  if (!particleField) return;
  const count = 48;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement("span");
    const size = Math.random() > 0.8 ? 3 : 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 6}s`;
    particle.style.animationDuration = `${10 + Math.random() * 10}s`;
    fragment.appendChild(particle);
  }
  particleField.appendChild(fragment);
};

spawnParticles();

const openModal = (id) => {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
};

const closeModal = (id) => {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
};

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const target = trigger.dataset.modal;
    if (target) openModal(target);
  });
});

modalCloses.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const target = trigger.dataset.close;
    if (target) closeModal(target);
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const open = document.querySelector(".modal.is-open");
  if (open) closeModal(open.id);
});

const setWizardStep = (step) => {
  wizardSteps.forEach((item) =>
    item.classList.toggle("is-active", item.dataset.step === String(step))
  );
  wizardPanels.forEach((panel) =>
    panel.classList.toggle("is-active", panel.dataset.panel === String(step))
  );
  if (wizardModal) wizardModal.dataset.step = String(step);
};

const getWizardStep = () => Number(wizardModal?.dataset.step || "1");

wizardActions.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.wizard;
    const current = getWizardStep();
    const next = direction === "next" ? current + 1 : current - 1;
    const bounded = Math.max(1, Math.min(4, next));
    setWizardStep(bounded);
    if (direction === "next" && current === 4) {
      closeModal("modal-concierge");
    }
  });
});

setWizardStep(1);
