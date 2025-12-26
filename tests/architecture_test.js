
/* Architecture Stack Test */
const tests = [
  {
    name: "Architecture Section Exists",
    check: () => !!document.querySelector("#architecture")
  },
  {
    name: "Scroll Zone Exists",
    check: () => !!document.querySelector(".stack-scroll-zone")
  },
  {
    name: "Sticky View Configured",
    check: () => {
      const el = document.querySelector(".stack-sticky-view");
      const style = window.getComputedStyle(el);
      return style.position === "sticky" || style.position === "-webkit-sticky";
    }
  },
  {
    name: "Layers Present",
    check: () => {
      const top = document.querySelector(".layer-top");
      const mid = document.querySelector(".layer-mid");
      const bot = document.querySelector(".layer-bot");
      return !!(top && mid && bot);
    }
  },
  {
    name: "No Overflow Hidden on Parent",
    check: () => {
      const section = document.querySelector("#architecture");
      const style = window.getComputedStyle(section);
      return style.overflow !== "hidden" && style.overflowX !== "hidden" && style.overflowY !== "hidden";
    }
  }
];

console.log("Running Architecture Tests...");
let passed = 0;
tests.forEach(t => {
  try {
    if (t.check()) {
      console.log(`[PASS] ${t.name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${t.name}`);
    }
  } catch (e) {
    console.error(`[ERROR] ${t.name}: ${e.message}`);
  }
});

if (passed === tests.length) {
  console.log("All systems nominal. Stack visualization integrity verified.");
} else {
  console.log(`Systems check failed. ${tests.length - passed} anomalies detected.`);
}
