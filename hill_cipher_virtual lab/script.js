// ============================================================
// HILL CIPHER VIRTUAL LAB
// Segmented navigation + theory interactions + procedures
// + encryption/decryption simulation + test record keeping
// ============================================================

// ---------------------------
// SECTION NAVIGATION
// ---------------------------
const navItems = [...document.querySelectorAll(".nav-item")];
const contentSections = [...document.querySelectorAll(".content-section")];

function showSection(targetId) {
  contentSections.forEach((section) => {
    section.classList.toggle("active", section.id === targetId);
  });

  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.target === targetId);
  });

  window.scrollTo({ top: document.querySelector(".hero").offsetHeight, behavior: "smooth" });
}

navItems.forEach((item) => {
  item.addEventListener("click", () => showSection(item.dataset.target));
});

document.querySelectorAll(".jump-btn").forEach((button) => {
  button.addEventListener("click", () => showSection(button.dataset.jump));
});

// ---------------------------
// THEORY TABS
// ---------------------------
const theoryTabs = [...document.querySelectorAll(".theory-tab")];
const theoryPanels = [...document.querySelectorAll(".theory-panel")];

theoryTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    theoryTabs.forEach((item) => item.classList.remove("active"));
    theoryPanels.forEach((panel) => panel.classList.remove("active"));

    tab.classList.add("active");
    document
      .querySelector(`[data-theory-panel="${tab.dataset.theory}"]`)
      .classList.add("active");
  });
});

// ---------------------------
// KPA WORKED EXAMPLE TOGGLE
// ---------------------------
const kpaToggleBtn = document.getElementById("kpaToggleBtn");
const kpaWorkedExample = document.getElementById("kpaWorkedExample");

if (kpaToggleBtn && kpaWorkedExample) {
  kpaToggleBtn.addEventListener("click", () => {
    const isOpen = kpaWorkedExample.hidden === false;
    kpaWorkedExample.hidden = isOpen;
    kpaToggleBtn.setAttribute("aria-expanded", String(!isOpen));
    const labelSpan = kpaToggleBtn.childNodes[kpaToggleBtn.childNodes.length - 1];
    labelSpan.textContent = isOpen ? " View Worked Example" : " Hide Worked Example";
  });
}

// ---------------------------
// PROCEDURE TABS
// ---------------------------
const procedureModes = [...document.querySelectorAll(".procedure-mode")];
const procedurePanels = [...document.querySelectorAll(".procedure-panel")];

procedureModes.forEach((button) => {
  button.addEventListener("click", () => {
    procedureModes.forEach((item) => item.classList.remove("active"));
    procedurePanels.forEach((panel) => panel.classList.remove("active"));

    button.classList.add("active");
    document
      .querySelector(`[data-procedure-panel="${button.dataset.procedureMode}"]`)
      .classList.add("active");
  });
});

// ---------------------------
// SIMULATION CHOOSER
// ---------------------------
const simulationChooser = document.getElementById("simulationChooser");
const encryptionSimulation = document.getElementById("encryptionSimulation");
const decryptionSimulation = document.getElementById("decryptionSimulation");

document.querySelectorAll("[data-sim-choice]").forEach((button) => {
  button.addEventListener("click", () => {
    simulationChooser.classList.add("hidden");
    const choice = button.dataset.simChoice;

    encryptionSimulation.classList.toggle("hidden", choice !== "encrypt");
    decryptionSimulation.classList.toggle("hidden", choice !== "decrypt");
  });
});

document.querySelectorAll(".change-mode-btn").forEach((button) => {
  button.addEventListener("click", () => {
    stopEncryptionPlayback();
    stopDecryptionPlayback();
    encryptionSimulation.classList.add("hidden");
    decryptionSimulation.classList.add("hidden");
    simulationChooser.classList.remove("hidden");
  });
});

// ---------------------------
// COMMON HILL CIPHER HELPERS
// ---------------------------
function mod26(value) {
  return ((value % 26) + 26) % 26;
}

function cleanLetters(text) {
  return text.toUpperCase().replace(/[^A-Z]/g, "");
}

function charToNumber(char) {
  return char.charCodeAt(0) - 65;
}

function numberToChar(number) {
  return String.fromCharCode(mod26(number) + 65);
}

function formatKey(key) {
  return `[[${key[0][0]},${key[0][1]}],[${key[1][0]},${key[1][1]}]]`;
}

function multiplyMatrixVector(matrix, vector) {
  const raw = [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1],
  ];

  return {
    raw,
    reduced: raw.map(mod26),
  };
}

// ---------------------------
// TEST RECORD STORAGE
// ---------------------------
const STORAGE_KEY = "hillCipherVirtualLabRecordsV3";

function loadRecords() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { encryptions: [], decryptions: [] };

    const parsed = JSON.parse(stored);
    return {
      encryptions: Array.isArray(parsed.encryptions) ? parsed.encryptions : [],
      decryptions: Array.isArray(parsed.decryptions) ? parsed.decryptions : [],
    };
  } catch {
    return { encryptions: [], decryptions: [] };
  }
}

let testRecords = loadRecords();

function saveRecords() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(testRecords));
  } catch {
    // The lab still works even if browser storage is unavailable.
  }
  renderRecordTables();
}

function timestamp() {
  return new Date().toLocaleString();
}

function addEncryptionRecord(record) {
  testRecords.encryptions.unshift({
    id: Date.now() + Math.random(),
    time: timestamp(),
    ...record,
  });

  // Keep the table readable.
  testRecords.encryptions = testRecords.encryptions.slice(0, 30);
  saveRecords();
}

function addDecryptionRecord(record) {
  testRecords.decryptions.unshift({
    id: Date.now() + Math.random(),
    time: timestamp(),
    ...record,
  });

  testRecords.decryptions = testRecords.decryptions.slice(0, 30);
  saveRecords();
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderRecordTables() {
  const encryptionBody = document.getElementById("encryptionRecordsBody");
  const decryptionBody = document.getElementById("decryptionRecordsBody");

  document.getElementById("encryptionCount").textContent = testRecords.encryptions.length;
  document.getElementById("decryptionCount").textContent = testRecords.decryptions.length;

  if (testRecords.encryptions.length === 0) {
    encryptionBody.innerHTML =
      '<tr class="empty-row"><td colspan="6">No encryption tests recorded yet.</td></tr>';
  } else {
    encryptionBody.innerHTML = testRecords.encryptions
      .map(
        (record, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHTML(record.input)}</td>
            <td>${escapeHTML(record.processed)}</td>
            <td><code>${escapeHTML(record.key)}</code></td>
            <td><strong>${escapeHTML(record.ciphertext)}</strong></td>
            <td>${escapeHTML(record.time)}</td>
          </tr>
        `
      )
      .join("");
  }

  if (testRecords.decryptions.length === 0) {
    decryptionBody.innerHTML =
      '<tr class="empty-row"><td colspan="6">No decryption tests recorded yet.</td></tr>';
  } else {
    decryptionBody.innerHTML = testRecords.decryptions
      .map(
        (record, index) => `
          <tr>
            <td>${index + 1}</td>
            <td><strong>${escapeHTML(record.ciphertext)}</strong></td>
            <td><code>${escapeHTML(record.key)}</code></td>
            <td>${escapeHTML(record.plaintext)}</td>
            <td>${escapeHTML(record.status)}</td>
            <td>${escapeHTML(record.time)}</td>
          </tr>
        `
      )
      .join("");
  }
}

document.getElementById("clearRecordsBtn").addEventListener("click", () => {
  const confirmed = window.confirm("Clear all recorded encryption and decryption tests?");
  if (!confirmed) return;

  testRecords = { encryptions: [], decryptions: [] };
  saveRecords();
});

renderRecordTables();

// ============================================================
// ENCRYPTION
// ============================================================
const plaintextInput = document.getElementById("plaintext");
const keyInputs = [
  document.getElementById("k00"),
  document.getElementById("k01"),
  document.getElementById("k10"),
  document.getElementById("k11"),
];

const encryptBtn = document.getElementById("encryptBtn");
const exampleBtn = document.getElementById("exampleBtn");
const resetBtn = document.getElementById("resetBtn");

const encryptionMessage = document.getElementById("message");
const summaryCard = document.getElementById("summaryCard");
const encryptionWalkthrough = document.getElementById("simulationCard");

const cleanTextEl = document.getElementById("cleanText");
const numericTextEl = document.getElementById("numericText");
const keyTextEl = document.getElementById("keyText");
const cipherTextEl = document.getElementById("cipherText");

const stepPanel = document.getElementById("stepPanel");
const stepCounter = document.getElementById("stepCounter");
const progressBar = document.getElementById("progressBar");
const prevBtn = document.getElementById("prevBtn");
const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");

let encryptionSteps = [];
let currentEncryptionStep = 0;
let encryptionTimer = null;
let lastEncryptionResult = null;

function getEncryptionKey() {
  const values = keyInputs.map((input) => Number(input.value));

  if (values.some((value) => !Number.isFinite(value))) {
    throw new Error("Every key matrix cell must contain a valid number.");
  }

  return [
    [values[0], values[1]],
    [values[2], values[3]],
  ];
}

function makeBlocks(values) {
  const blocks = [];
  for (let i = 0; i < values.length; i += 2) {
    blocks.push([values[i], values[i + 1]]);
  }
  return blocks;
}

function encryptHillCipher(text, key) {
  const originalClean = cleanLetters(text);

  if (!originalClean) {
    throw new Error("Please enter at least one alphabetic character.");
  }

  let processed = originalClean;
  let padded = false;

  if (processed.length % 2 !== 0) {
    processed += "X";
    padded = true;
  }

  const numbers = [...processed].map(charToNumber);
  const blocks = makeBlocks(numbers);

  const calculations = blocks.map((block, index) => {
    const result = multiplyMatrixVector(key, block);

    return {
      index,
      input: block,
      inputLetters: block.map(numberToChar).join(""),
      raw: result.raw,
      reduced: result.reduced,
      outputLetters: result.reduced.map(numberToChar).join(""),
    };
  });

  return {
    input: text,
    processed,
    padded,
    numbers,
    blocks,
    calculations,
    ciphertext: calculations.map((item) => item.outputLetters).join(""),
  };
}

function setEncryptionMessage(text, type = "") {
  encryptionMessage.textContent = text;
  encryptionMessage.className = `message ${type}`.trim();
}

function createTokenRow(chars, numbers) {
  return `
    <div class="token-row">
      ${chars
        .map(
          (char, index) =>
            `<span class="token">${char}<br><small>${numbers[index]}</small></span>`
        )
        .join("")}
    </div>
  `;
}

function buildEncryptionSteps(result, key) {
  const steps = [];

  steps.push({
    title: "Step 1 — Normalize and prepare plaintext",
    html: `
      <p>Convert the input to uppercase, remove unsupported symbols, and add padding if necessary.</p>
      <div class="math-box">
        <div class="math-line">Processed text = ${result.processed}</div>
        <div class="math-line">${result.padded ? "Odd length → X was appended as padding." : "Even length → no padding required."}</div>
      </div>
    `,
  });

  steps.push({
    title: "Step 2 — Convert letters to numbers",
    html: `
      <p>Apply the mapping <strong>A=0, B=1, ..., Z=25</strong>.</p>
      ${createTokenRow([...result.processed], result.numbers)}
      <div class="math-box">
        <div class="math-line">${result.processed} → [${result.numbers.join(", ")}]</div>
      </div>
    `,
  });

  steps.push({
    title: "Step 3 — Form plaintext column vectors",
    html: `
      <p>A 2×2 key uses blocks of two numbers.</p>
      <div class="block-row">
        ${result.blocks
          .map(
            (block) =>
              `<span class="block">${block.map(numberToChar).join("")} → [${block[0]}, ${block[1]}]ᵀ</span>`
          )
          .join("")}
      </div>
    `,
  });

  steps.push({
    title: "Step 4 — Apply the key matrix",
    html: `
      <p>Use <strong>C = K × P (mod 26)</strong> for every block.</p>
      <div class="math-box">
        <div class="math-line">K = [ ${key[0][0]}  ${key[0][1]} ]</div>
        <div class="math-line">    [ ${key[1][0]}  ${key[1][1]} ]</div>
      </div>
    `,
  });

  let encryptionBlocksHTML = "";

  result.calculations.forEach((calc) => {
    const [p0, p1] = calc.input;
    const [raw0, raw1] = calc.raw;
    const [out0, out1] = calc.reduced;

    encryptionBlocksHTML += `
      <div class="math-box">
        <div class="math-line">Block ${calc.inputLetters}: [${p0}, ${p1}]ᵀ</div>
        <div class="math-line">Row 1 = ${key[0][0]}×${p0} + ${key[0][1]}×${p1} = ${raw0}</div>
        <div class="math-line">Row 2 = ${key[1][0]}×${p0} + ${key[1][1]}×${p1} = ${raw1}</div>
        <div class="math-line">${raw0} mod 26 = ${out0}</div>
        <div class="math-line">${raw1} mod 26 = ${out1}</div>
        <div class="math-line">Encrypted block = ${calc.outputLetters}</div>
      </div>
    `;
  });

  steps.push({
    title: `Step ${steps.length + 1} — Multiply K by each plaintext vector`,
    html: `
      <p>Apply <strong>C = K × P (mod 26)</strong> to every block and reduce modulo 26.</p>
      ${encryptionBlocksHTML}
    `,
  });

  steps.push({
    title: `Step ${steps.length + 1} — Combine encrypted blocks`,
    html: `
      <div class="block-row">
        ${result.calculations
          .map(
            (calc) =>
              `<span class="block">${calc.inputLetters} → ${calc.outputLetters}</span>`
          )
          .join("")}
      </div>
      <div class="result-banner">Final Ciphertext: ${result.ciphertext}</div>
    `,
  });

  return steps;
}

function renderEncryptionStep() {
  if (!encryptionSteps.length) return;

  const step = encryptionSteps[currentEncryptionStep];
  stepPanel.innerHTML = `<h3>${step.title}</h3>${step.html}`;
  stepCounter.textContent = `Step ${currentEncryptionStep + 1} of ${encryptionSteps.length}`;
  progressBar.style.width = `${((currentEncryptionStep + 1) / encryptionSteps.length) * 100}%`;

  prevBtn.disabled = currentEncryptionStep === 0;
  nextBtn.disabled = currentEncryptionStep === encryptionSteps.length - 1;
}

function stopEncryptionPlayback() {
  if (encryptionTimer) {
    clearInterval(encryptionTimer);
    encryptionTimer = null;
  }

  playBtn.textContent = "▶ Play";
}

function startEncryptionPlayback() {
  stopEncryptionPlayback();
  playBtn.textContent = "⏸ Pause";

  encryptionTimer = setInterval(() => {
    if (currentEncryptionStep >= encryptionSteps.length - 1) {
      stopEncryptionPlayback();
      return;
    }

    currentEncryptionStep += 1;
    renderEncryptionStep();
  }, 1800);
}

function runEncryption() {
  stopEncryptionPlayback();

  try {
    const key = getEncryptionKey();
    const result = encryptHillCipher(plaintextInput.value, key);

    cleanTextEl.textContent = result.processed;
    numericTextEl.textContent = result.numbers.join(", ");
    keyTextEl.textContent = formatKey(key);
    cipherTextEl.textContent = result.ciphertext;

    encryptionSteps = buildEncryptionSteps(result, key);
    currentEncryptionStep = 0;
    lastEncryptionResult = {
      key,
      ciphertext: result.ciphertext,
      processed: result.processed,
    };

    summaryCard.classList.remove("hidden");
    encryptionWalkthrough.classList.remove("hidden");
    renderEncryptionStep();

    addEncryptionRecord({
      input: plaintextInput.value,
      processed: result.processed,
      key: formatKey(key),
      ciphertext: result.ciphertext,
    });

    setEncryptionMessage(
      `Encryption complete.${result.padded ? " X padding was added." : ""} The run was added to Test Records.`,
      "success"
    );
  } catch (error) {
    summaryCard.classList.add("hidden");
    encryptionWalkthrough.classList.add("hidden");
    encryptionSteps = [];
    setEncryptionMessage(error.message, "error");
  }
}

encryptBtn.addEventListener("click", runEncryption);

exampleBtn.addEventListener("click", () => {
  plaintextInput.value = "HELP";
  keyInputs[0].value = 3;
  keyInputs[1].value = 3;
  keyInputs[2].value = 2;
  keyInputs[3].value = 5;
  runEncryption();
});

resetBtn.addEventListener("click", () => {
  stopEncryptionPlayback();
  plaintextInput.value = "";
  keyInputs.forEach((input) => (input.value = ""));
  summaryCard.classList.add("hidden");
  encryptionWalkthrough.classList.add("hidden");
  encryptionSteps = [];
  currentEncryptionStep = 0;
  setEncryptionMessage("");
});

prevBtn.addEventListener("click", () => {
  stopEncryptionPlayback();
  if (currentEncryptionStep > 0) {
    currentEncryptionStep -= 1;
    renderEncryptionStep();
  }
});

nextBtn.addEventListener("click", () => {
  stopEncryptionPlayback();
  if (currentEncryptionStep < encryptionSteps.length - 1) {
    currentEncryptionStep += 1;
    renderEncryptionStep();
  }
});

playBtn.addEventListener("click", () => {
  if (!encryptionSteps.length) return;

  if (encryptionTimer) {
    stopEncryptionPlayback();
    return;
  }

  if (currentEncryptionStep === encryptionSteps.length - 1) {
    currentEncryptionStep = 0;
    renderEncryptionStep();
  }

  startEncryptionPlayback();
});

// ============================================================
// DECRYPTION & KEY INVERTIBILITY
// ============================================================
const decInputs = [
  document.getElementById("dec-a"),
  document.getElementById("dec-b"),
  document.getElementById("dec-c"),
  document.getElementById("dec-d"),
];

const checkKeyBtn = document.getElementById("checkKeyBtn");
const startDecryptBtn = document.getElementById("startDecryptBtn");
const useEncryptionBtn = document.getElementById("useEncryptionBtn");
const prevDecryptBtn = document.getElementById("prevDecryptBtn");
const playDecryptBtn = document.getElementById("playDecryptBtn");
const nextDecryptBtn = document.getElementById("nextDecryptBtn");
const resetDecryptBtn = document.getElementById("resetDecryptBtn");

const ciphertextInput = document.getElementById("ciphertext-input");
const decryptionMessage = document.getElementById("decryption-message");
const decryptionStepPanel = document.getElementById("decryption-step");
const decStepCounter = document.getElementById("decStepCounter");
const decryptionProgress = document.getElementById("decryption-progress");
const decryptionResultEl = document.getElementById("decryption-result");

let decryptionSteps = [];
let currentDecryptionStep = 0;
let decryptionTimer = null;
let finalDecryptedText = "";

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }

  return a;
}

function getDecryptionKey() {
  const values = decInputs.map((input) => Number(input.value));

  if (values.some((value) => !Number.isFinite(value))) {
    throw new Error("Every decryption key matrix cell must contain a valid number.");
  }

  return [
    [values[0], values[1]],
    [values[2], values[3]],
  ];
}

function determinant2x2(matrix) {
  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
}

function modularInverse(value, modulus = 26) {
  const normalized = mod26(value);

  for (let candidate = 1; candidate < modulus; candidate++) {
    if ((normalized * candidate) % modulus === 1) {
      return candidate;
    }
  }

  return null;
}

function inverseMatrix2x2(matrix) {
  const [a, b] = matrix[0];
  const [c, d] = matrix[1];

  const determinant = determinant2x2(matrix);
  const determinantInverse = modularInverse(determinant, 26);

  if (determinantInverse === null) return null;

  return [
    [
      mod26(determinantInverse * d),
      mod26(determinantInverse * -b),
    ],
    [
      mod26(determinantInverse * -c),
      mod26(determinantInverse * a),
    ],
  ];
}

function setDecryptionMessage(text, type = "") {
  decryptionMessage.textContent = text;
  decryptionMessage.className = `message ${type}`.trim();
}

function checkKey() {
  try {
    const key = getDecryptionKey();
    const determinant = determinant2x2(key);
    const gcdValue = gcd(determinant, 26);
    const result = document.getElementById("key-result");

    if (gcdValue !== 1) {
      result.innerHTML = `
        <div class="invalid-key">
          <h4>❌ Key is NOT invertible</h4>
          <p>det(K) = <strong>${determinant}</strong></p>
          <p>gcd(${determinant}, 26) = <strong>${gcdValue}</strong></p>
          <p>Because the gcd is not 1, a modular inverse key does not exist.</p>
        </div>
      `;
      return false;
    }

    const determinantInverse = modularInverse(determinant, 26);
    const inverseKey = inverseMatrix2x2(key);

    result.innerHTML = `
      <div class="valid-key">
        <h4>✓ Key is invertible</h4>
        <p>det(K) = <strong>${determinant}</strong></p>
        <p>gcd(${determinant}, 26) = <strong>1</strong></p>
        <p>det(K)⁻¹ mod 26 = <strong>${determinantInverse}</strong></p>
        <pre>K⁻¹ = [ ${inverseKey[0][0]}  ${inverseKey[0][1]} ]
      [ ${inverseKey[1][0]}  ${inverseKey[1][1]} ]</pre>
      </div>
    `;
    return true;
  } catch (error) {
    setDecryptionMessage(error.message, "error");
    return false;
  }
}

function buildDecryptionSteps(
  ciphertext,
  key,
  determinant,
  gcdValue,
  determinantInverse,
  inverseKey
) {
  const steps = [];
  const blocks = [];

  for (let i = 0; i < ciphertext.length; i += 2) {
    blocks.push(ciphertext.slice(i, i + 2));
  }

  steps.push({
    title: "Step 1 — Read ciphertext",
    html: `
      <p>Decrypt the ciphertext using the same key matrix that was used for encryption.</p>
      <div class="result-banner">Ciphertext: ${ciphertext}</div>
    `,
  });

  steps.push({
    title: "Step 2 — Calculate the determinant",
    html: `
      <div class="math-box">
        <div class="math-line">K = [ ${key[0][0]}  ${key[0][1]} ]</div>
        <div class="math-line">    [ ${key[1][0]}  ${key[1][1]} ]</div>
        <div class="math-line"></div>
        <div class="math-line">det(K) = ad − bc</div>
        <div class="math-line">det(K) = (${key[0][0]}×${key[1][1]}) − (${key[0][1]}×${key[1][0]}) = ${determinant}</div>
      </div>
    `,
  });

  steps.push({
    title: "Step 3 — Check key invertibility",
    html: `
      <p>The key is valid for decryption only when gcd(det(K), 26) = 1.</p>
      <div class="math-box">
        <div class="math-line">gcd(${determinant}, 26) = ${gcdValue}</div>
      </div>
      <div class="result-banner">✓ The key is invertible modulo 26.</div>
    `,
  });

  steps.push({
    title: "Step 4 — Find the determinant's modular inverse",
    html: `
      <div class="math-box">
        <div class="math-line">${determinant}⁻¹ mod 26 = ${determinantInverse}</div>
        <div class="math-line">${determinant} × ${determinantInverse} = ${determinant * determinantInverse}</div>
        <div class="math-line">${determinant * determinantInverse} mod 26 = 1</div>
      </div>
    `,
  });

  steps.push({
    title: "Step 5 — Calculate the inverse key matrix",
    html: `
      <p>For a 2×2 matrix, swap a and d, negate b and c, multiply by det(K)⁻¹, then reduce modulo 26.</p>
      <div class="math-box">
        <div class="math-line">K⁻¹ = [ ${inverseKey[0][0]}  ${inverseKey[0][1]} ]</div>
        <div class="math-line">      [ ${inverseKey[1][0]}  ${inverseKey[1][1]} ]</div>
      </div>
    `,
  });

  steps.push({
    title: "Step 6 — Convert ciphertext to column vectors",
    html: `
      <p>Apply A=0, B=1, ..., Z=25 and group the values in pairs.</p>
      <div class="block-row">
        ${blocks
          .map((block) => {
            const a = charToNumber(block[0]);
            const b = charToNumber(block[1]);
            return `<span class="block">${block} → [${a}, ${b}]ᵀ</span>`;
          })
          .join("")}
      </div>
    `,
  });

  let plaintext = "";
  let multiplicationHTML = "";

  blocks.forEach((block) => {
    const vector = [charToNumber(block[0]), charToNumber(block[1])];
    const result = multiplyMatrixVector(inverseKey, vector);
    const recovered = result.reduced.map(numberToChar).join("");
    plaintext += recovered;

    multiplicationHTML += `
      <div class="math-box">
        <div class="math-line">Block ${block}: [${vector[0]}, ${vector[1]}]ᵀ</div>
        <div class="math-line">Row 1 = ${inverseKey[0][0]}×${vector[0]} + ${inverseKey[0][1]}×${vector[1]} = ${result.raw[0]}</div>
        <div class="math-line">Row 2 = ${inverseKey[1][0]}×${vector[0]} + ${inverseKey[1][1]}×${vector[1]} = ${result.raw[1]}</div>
        <div class="math-line">${result.raw[0]} mod 26 = ${result.reduced[0]}</div>
        <div class="math-line">${result.raw[1]} mod 26 = ${result.reduced[1]}</div>
        <div class="math-line">Recovered block = ${recovered}</div>
      </div>
    `;
  });

  steps.push({
    title: "Step 7 — Multiply K⁻¹ by each ciphertext vector",
    html: multiplicationHTML,
  });

  steps.push({
    title: "Step 8 — Convert recovered numbers to letters",
    html: `
      <p>Convert the final values back to letters using A=0, ..., Z=25.</p>
      <div class="result-banner">Final plaintext: ${plaintext}</div>
    `,
  });

  finalDecryptedText = plaintext;
  return steps;
}

function renderDecryptionStep() {
  if (!decryptionSteps.length) return;

  const step = decryptionSteps[currentDecryptionStep];
  decryptionStepPanel.innerHTML = `<h3>${step.title}</h3>${step.html}`;
  decStepCounter.textContent = `Step ${currentDecryptionStep + 1} of ${decryptionSteps.length}`;
  decryptionProgress.style.width =
    `${((currentDecryptionStep + 1) / decryptionSteps.length) * 100}%`;

  prevDecryptBtn.disabled = currentDecryptionStep === 0;
  nextDecryptBtn.disabled = currentDecryptionStep === decryptionSteps.length - 1;

  if (currentDecryptionStep === decryptionSteps.length - 1) {
    decryptionResultEl.textContent = finalDecryptedText;
  }
}

function stopDecryptionPlayback() {
  if (decryptionTimer) {
    clearInterval(decryptionTimer);
    decryptionTimer = null;
  }

  playDecryptBtn.textContent = "▶ Play";
}

function startDecryptionPlayback() {
  stopDecryptionPlayback();
  playDecryptBtn.textContent = "⏸ Pause";

  decryptionTimer = setInterval(() => {
    if (currentDecryptionStep >= decryptionSteps.length - 1) {
      stopDecryptionPlayback();
      return;
    }

    currentDecryptionStep += 1;
    renderDecryptionStep();
  }, 1800);
}

function runDecryption() {
  stopDecryptionPlayback();

  try {
    const ciphertext = cleanLetters(ciphertextInput.value);

    if (!ciphertext) {
      throw new Error("Please enter ciphertext.");
    }

    if (ciphertext.length % 2 !== 0) {
      throw new Error("Ciphertext length must be even for a 2×2 key.");
    }

    const key = getDecryptionKey();
    const determinant = determinant2x2(key);
    const gcdValue = gcd(determinant, 26);

    if (gcdValue !== 1) {
      checkKey();
      throw new Error("The selected key is not invertible modulo 26.");
    }

    const determinantInverse = modularInverse(determinant, 26);
    const inverseKey = inverseMatrix2x2(key);

    decryptionSteps = buildDecryptionSteps(
      ciphertext,
      key,
      determinant,
      gcdValue,
      determinantInverse,
      inverseKey
    );

    currentDecryptionStep = 0;
    decryptionResultEl.textContent = "—";
    renderDecryptionStep();
    checkKey();

    addDecryptionRecord({
      ciphertext,
      key: formatKey(key),
      plaintext: finalDecryptedText,
      status: "Invertible ✓",
    });

    setDecryptionMessage(
      "Decryption steps generated successfully. The run was added to Test Records.",
      "success"
    );
  } catch (error) {
    setDecryptionMessage(error.message, "error");
  }
}

checkKeyBtn.addEventListener("click", checkKey);
startDecryptBtn.addEventListener("click", runDecryption);

useEncryptionBtn.addEventListener("click", () => {
  if (!lastEncryptionResult) {
    setDecryptionMessage(
      "No encryption has been performed in this page session yet. Run encryption first.",
      "error"
    );
    return;
  }

  ciphertextInput.value = lastEncryptionResult.ciphertext;
  decInputs[0].value = lastEncryptionResult.key[0][0];
  decInputs[1].value = lastEncryptionResult.key[0][1];
  decInputs[2].value = lastEncryptionResult.key[1][0];
  decInputs[3].value = lastEncryptionResult.key[1][1];

  checkKey();
  setDecryptionMessage("Last encryption ciphertext and key copied successfully.", "success");
});

prevDecryptBtn.addEventListener("click", () => {
  stopDecryptionPlayback();
  if (currentDecryptionStep > 0) {
    currentDecryptionStep -= 1;
    renderDecryptionStep();
  }
});

nextDecryptBtn.addEventListener("click", () => {
  stopDecryptionPlayback();
  if (currentDecryptionStep < decryptionSteps.length - 1) {
    currentDecryptionStep += 1;
    renderDecryptionStep();
  }
});

playDecryptBtn.addEventListener("click", () => {
  if (!decryptionSteps.length) return;

  if (decryptionTimer) {
    stopDecryptionPlayback();
    return;
  }

  if (currentDecryptionStep === decryptionSteps.length - 1) {
    currentDecryptionStep = 0;
    decryptionResultEl.textContent = "—";
    renderDecryptionStep();
  }

  startDecryptionPlayback();
});

resetDecryptBtn.addEventListener("click", () => {
  stopDecryptionPlayback();
  decryptionSteps = [];
  currentDecryptionStep = 0;
  finalDecryptedText = "";
  decryptionStepPanel.innerHTML =
    '<p>Click <strong>Start Decryption</strong> to begin.</p>';
  decStepCounter.textContent = "Step 0 of 8";
  decryptionProgress.style.width = "0%";
  decryptionResultEl.textContent = "—";
  prevDecryptBtn.disabled = true;
  nextDecryptBtn.disabled = true;
  setDecryptionMessage("");
});

// Initial decryption state.
prevDecryptBtn.disabled = true;
nextDecryptBtn.disabled = true;
checkKey();

// ---------------------------
// QUIZ & SELF ASSESSMENT
// ---------------------------

const quizQuestions = [
  // ── Q1–Q7 CONCEPTUAL ──────────────────────────────────────────────────
  {
    id: 1,
    category: "Conceptual",
    question: "A student selects a key matrix whose determinant is 12. Since 12 ≠ 0, they conclude that the matrix can be used for a Hill Cipher operating modulo 26.\n\nWhat is wrong with this reasoning?",
    options: [
      "A. A non-zero determinant is sufficient for a modular inverse. Since 12 is non-zero modulo 26, this matrix is invertible modulo 26.",
      "B. The determinant must be relatively prime to 26 (gcd(det(K), 26) = 1) for the key matrix to have a modular inverse. Since gcd(12, 26) = 2, this matrix is not invertible modulo 26.",
      "C. The determinant only needs to be relatively prime to 13. Since gcd(12, 13) = 1, this matrix is invertible modulo 26.",
      "D. Dividing the determinant and modulus by their gcd gives 6 and 13. Since gcd(6, 13) = 1, the original matrix is invertible modulo 26."
    ],
    correct: "B",
    explanation: "B is correct. A Hill Cipher key matrix K is invertible modulo 26 if and only if gcd(det(K), 26) = 1. Here det(K) = 12 and gcd(12, 26) = 2, so 12 has no multiplicative inverse modulo 26 and the matrix is not invertible modulo 26. A non-zero determinant alone is insufficient. Being relatively prime to 13 alone is also insufficient: the determinant must be relatively prime to both 2 and 13. Dividing 12 and 26 by their gcd changes the modulus and does not give an inverse modulo 26.",
    solution: null
  },
  {
    id: 2,
    category: "Conceptual",
    question: "Two different plaintext blocks produce the same ciphertext block when encrypted using a particular Hill Cipher key matrix.\n\nWhich property of the key matrix is most likely violated?",
    options: [
      "A. The matrix is symmetric",
      "B. Its entries are greater than 26",
      "C. Its determinant has no multiplicative inverse modulo 26",
      "D. Its determinant is negative before applying modulo 26"
    ],
    correct: "C",
    explanation: "A valid Hill Cipher key must represent an invertible transformation modulo 26. If the determinant does not possess a multiplicative inverse modulo 26, the key matrix is not invertible, preventing unique recovery of plaintext.",
    solution: null
  },
  {
    id: 3,
    category: "Conceptual",
    question: "A student correctly calculates the ordinary inverse K⁻¹ of a Hill Cipher key matrix using real-number arithmetic and obtains fractional values. They directly multiply this inverse with the ciphertext.\n\nWhy can this approach fail?",
    options: [
      "A. Hill Cipher does not use matrix inversion during decryption",
      "B. Hill Cipher requires the inverse to exist in modular arithmetic rather than simply over the real numbers",
      "C. Fractional values are automatically converted into alphabet characters",
      "D. The ciphertext must always be transposed before decryption"
    ],
    correct: "B",
    explanation: "Hill Cipher operates over modular arithmetic. The required inverse is K⁻¹ (mod 26), not the ordinary real-number matrix inverse.",
    solution: null
  },
  {
    id: 4,
    category: "Conceptual",
    question: "Consider a Hill Cipher using a 3×3 key matrix. A plaintext message contains 14 characters.\n\nWhich statement correctly describes how the message should be handled?",
    options: [
      "A. The final two characters should be discarded because they cannot form a complete block",
      "B. Two padding characters must be added because every block must contain three characters",
      "C. One padding character must be added so that the plaintext forms five complete blocks",
      "D. No padding is required because matrix multiplication automatically handles incomplete blocks"
    ],
    correct: "C",
    explanation: "A 3×3 Hill Cipher processes plaintext in blocks of 3. Since 14 = 4(3) + 2, one padding character is required to obtain 15 = 5×3 complete blocks.",
    solution: null
  },
  {
    id: 5,
    category: "Conceptual",
    question: "Suppose the determinant of a Hill Cipher key matrix is −5. A student immediately rejects the key because its determinant is negative.\n\nWhich statement is correct?",
    options: [
      "A. The student is correct because negative determinants cannot have modular inverses",
      "B. The matrix must first be transposed before checking the determinant",
      "C. The determinant should be reduced modulo 26 and then checked for a multiplicative inverse",
      "D. The absolute value of the determinant must always be used"
    ],
    correct: "C",
    explanation: "Negative numbers are valid in modular arithmetic. For example, −5 ≡ 21 (mod 26). The relevant condition is whether the resulting reduced determinant is relatively prime to 26.",
    solution: null
  },
  {
    id: 6,
    category: "Conceptual",
    question: "During Hill Cipher decryption, a student correctly finds the determinant of the key matrix and its multiplicative inverse modulo 26, but forgets to calculate the adjugate of the key matrix.\n\nWhat is the consequence?",
    options: [
      "A. There is no problem because the determinant inverse itself is the inverse matrix",
      "B. The complete modular inverse of the key matrix cannot be constructed",
      "C. Only the first plaintext character will be incorrect",
      "D. Applying modulo 26 twice will compensate for the missing adjugate"
    ],
    correct: "B",
    explanation: "The inverse of a matrix modulo 26 is constructed as K⁻¹ = det(K)⁻¹ × adj(K) (mod 26). The modular inverse of the determinant alone is insufficient.",
    solution: null
  },
  {
    id: 7,
    category: "Conceptual",
    question: "What is an important cryptographic weakness of the classical Hill Cipher?",
    options: [
      "A. It cannot encrypt more than one character",
      "B. It requires extremely large amounts of storage",
      "C. Its linear structure makes it vulnerable to known-plaintext attacks",
      "D. It does not use matrix operations"
    ],
    correct: "C",
    explanation: "Hill Cipher encryption is a linear transformation. If an attacker obtains enough corresponding plaintext–ciphertext pairs, the linear relationships can be used to recover the key matrix.",
    solution: null
  },
  // ── Q8–Q10 CALCULATION ─────────────────────────────────────────────────
  {
    id: 8,
    category: "Problem Solving",
    question: "For the key matrix\n\nK = [[7, 8], [11, 11]]\n\nWhat is the multiplicative inverse of its determinant modulo 26?",
    options: [
      "A. 7",
      "B. 9",
      "C. 15",
      "D. 19"
    ],
    correct: "A",
    explanation: "det(K) = (7×11) − (8×11) = 77 − 88 = −11 ≡ 15 (mod 26). We need 15x ≡ 1 (mod 26). Since 15 × 7 = 105 = 4×26 + 1, the inverse is 7.",
    solution: "det(K) = (7 × 11) − (8 × 11)\n       = 77 − 88 = −11\n\n−11 mod 26 = 15\n\nFind x such that 15x ≡ 1 (mod 26):\n  15 × 7 = 105 = 4 × 26 + 1\n\n∴  15⁻¹ ≡ 7 (mod 26)\n\nCorrect answer: A (7)"
  },
  {
    id: 9,
    category: "Problem Solving",
    question: "Using A=0, B=1, …, Z=25, encrypt the plaintext HI using\n\nK = [[3, 3], [2, 5]]\n\nwhere C = KP (mod 26) and P is a column vector.",
    options: [
      "A. TC",
      "B. CT",
      "C. HI",
      "D. XZ"
    ],
    correct: "A",
    explanation: "H=7, I=8. KP = [3×7+3×8, 2×7+5×8] = [45, 54]. Mod 26: 45→19=T, 54→2=C. Result: TC.",
    solution: "H = 7,  I = 8\n\nP = [7]\n    [8]\n\nKP = [3 3] [7]   [3×7 + 3×8]   [45]\n     [2 5] [8] = [2×7 + 5×8] = [54]\n\n45 mod 26 = 19  →  T\n54 mod 26 =  2  →  C\n\nHI  →  TC\nCorrect answer: A (TC)"
  },
  {
    id: 10,
    category: "Problem Solving",
    question: "A ciphertext block TC was generated using the Hill Cipher key\n\nK = [[3, 3], [2, 5]]\n\nusing A=0, B=1, …, Z=25.\n\nFind K⁻¹ (mod 26), decrypt the ciphertext, and determine the plaintext block.",
    options: [
      "A. HI",
      "B. IH",
      "C. TC",
      "D. XR"
    ],
    correct: "A",
    explanation: "det(K)=9, 9⁻¹≡3 (mod 26). adj(K)=[[5,−3],[−2,3]]. K⁻¹=3×adj mod 26=[[15,17],[20,9]]. TC=[19,2]. P=K⁻¹C mod 26=[319 mod 26, 398 mod 26]=[7,8]=HI.",
    solution: "det(K) = 3×5 − 3×2 = 9\n9 × 3 = 27 ≡ 1 (mod 26)  →  det⁻¹ = 3\n\nadj(K) = [ 5  −3]\n         [−2   3]\n\nK⁻¹ = 3 × adj(K) mod 26\n     = [15  −9] mod 26  =  [15 17]\n       [−6   9]             [20  9]\n\nTC → T=19, C=2\nC = [19]\n    [ 2]\n\nP = K⁻¹ × C mod 26\n\nRow 1: 15×19 + 17×2 = 285 + 34 = 319\n  319 mod 26 = 7  →  H\n\nRow 2: 20×19 + 9×2 = 380 + 18 = 398\n  398 mod 26 = 8  →  I\n\nTC  →  HI\nCorrect answer: A (HI)"
  }
];

// State
let qzCurrent   = 0;                           // index of displayed question
let qzAnswers   = new Array(10).fill(null);    // user's selected option letter per Q
let qzSubmitted = false;

// DOM refs
const qzStage       = document.getElementById("quizStage");
const qzNavDots     = document.getElementById("quizNavDots");
const qzProgressLbl = document.getElementById("quizProgressLabel");
const qzProgressBar = document.getElementById("quizProgressBar");
const qzPrevBtn     = document.getElementById("quizPrevBtn");
const qzNextBtn     = document.getElementById("quizNextBtn");
const qzSubmitBtn   = document.getElementById("quizSubmitBtn");
const qzWarning     = document.getElementById("quizWarning");
const qzScoreCard   = document.getElementById("quizScoreCard");
const qzScoreText   = document.getElementById("quizScoreText");
const qzScorePct    = document.getElementById("quizScorePercent");
const qzScoreMsg    = document.getElementById("quizScoreMessage");
const qzReview      = document.getElementById("quizReview");
const retakeQuizBtn = document.getElementById("retakeQuizBtn");

// ── helpers ──────────────────────────────────────────────────────────────

function qzScoreMessage(score) {
  if (score >= 9) return "Excellent understanding of Hill Cipher concepts.";
  if (score >= 7) return "Good understanding. Review a few concepts to strengthen your knowledge.";
  if (score >= 5) return "Fair understanding. Revisiting the Theory and Procedure sections is recommended.";
  return "Review the Theory and Procedure sections before attempting the quiz again.";
}

function qzLetterFromIndex(i) {
  return ["A","B","C","D"][i];
}

function qzIsCorrectAnswer(question, letter) {
  return letter === question.correct;
}

// ── render navigator dots ─────────────────────────────────────────────────

function qzRenderDots() {
  qzNavDots.innerHTML = "";
  quizQuestions.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.className = "quiz-dot";
    btn.textContent = i + 1;
    btn.setAttribute("aria-label", "Go to question " + (i + 1));
    if (i === qzCurrent)       btn.classList.add("dot-current");
    else if (qzAnswers[i])     btn.classList.add("dot-answered");
    btn.addEventListener("click", () => { qzCurrent = i; qzRender(); });
    qzNavDots.appendChild(btn);
  });
}

// ── render progress bar & label ───────────────────────────────────────────

function qzRenderProgress() {
  const n = qzCurrent + 1;
  const total = quizQuestions.length;
  qzProgressLbl.textContent = "Question " + n + " of " + total;
  qzProgressBar.style.width = (n / total * 100) + "%";
}

// ── render question stage ─────────────────────────────────────────────────

function qzRenderStage() {
  const q = quizQuestions[qzCurrent];
  const chosen = qzAnswers[qzCurrent];

  // category label
  const cat = document.createElement("p");
  cat.className = "quiz-q-category";
  cat.textContent = q.category + " • Question " + q.id + " of 10";

  // question text — preserve newlines
  const qText = document.createElement("h3");
  qText.innerHTML = q.question.split("\n").map(l => l.trim() ? l : "").join("<br>");

  // options list
  const ul = document.createElement("ul");
  ul.className = "quiz-options-list";
  ul.setAttribute("role", "radiogroup");

  q.options.forEach((opt, i) => {
    const letter = qzLetterFromIndex(i);
    const li = document.createElement("li");
    li.setAttribute("role", "radio");
    li.setAttribute("tabindex", "0");
    li.setAttribute("aria-checked", chosen === letter ? "true" : "false");
    li.textContent = opt;

    if (chosen === letter) li.classList.add("opt-selected");
    if (qzSubmitted) {
      li.classList.add("opt-locked");
      if (qzIsCorrectAnswer(q, letter)) li.classList.add("opt-correct-reveal");
      else if (chosen === letter) li.classList.add("opt-wrong-reveal");
    } else {
      li.addEventListener("click", () => qzSelectAnswer(letter));
      li.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); qzSelectAnswer(letter); }
      });
    }
    ul.appendChild(li);
  });

  qzStage.innerHTML = "";
  qzStage.appendChild(cat);
  qzStage.appendChild(qText);
  qzStage.appendChild(ul);
}

// ── render navigation buttons ─────────────────────────────────────────────

function qzRenderNavButtons() {
  const last = qzCurrent === quizQuestions.length - 1;
  qzPrevBtn.disabled = qzCurrent === 0;

  if (qzSubmitted) {
    qzNextBtn.style.display = last ? "none" : "";
    qzSubmitBtn.style.display = "none";
  } else if (last) {
    qzNextBtn.style.display = "none";
    qzSubmitBtn.style.display = "";
  } else {
    qzNextBtn.style.display = "";
    qzSubmitBtn.style.display = "none";
  }
}

// ── full render ───────────────────────────────────────────────────────────

function qzRender() {
  qzRenderDots();
  qzRenderProgress();
  qzRenderStage();
  qzRenderNavButtons();
}

// ── select answer ─────────────────────────────────────────────────────────

function qzSelectAnswer(letter) {
  if (qzSubmitted) return;
  qzAnswers[qzCurrent] = letter;
  qzWarning.textContent = "";
  qzRender();
}

// ── navigation ────────────────────────────────────────────────────────────

qzPrevBtn.addEventListener("click", () => {
  if (qzCurrent > 0) { qzCurrent--; qzRender(); }
});

qzNextBtn.addEventListener("click", () => {
  if (qzCurrent < quizQuestions.length - 1) { qzCurrent++; qzRender(); }
});

// ── submission ────────────────────────────────────────────────────────────

qzSubmitBtn.addEventListener("click", () => {
  const unanswered = qzAnswers.reduce((acc, a, i) => a === null ? [...acc, i+1] : acc, []);
  if (unanswered.length > 0) {
    qzWarning.textContent =
      unanswered.length === 1
        ? "Question " + unanswered[0] + " is unanswered. Please answer it before submitting."
        : unanswered.length + " questions are unanswered (Q" + unanswered.join(", Q") + "). Please answer them before submitting.";
    return;
  }
  qzWarning.textContent = "";
  qzSubmitted = true;

  // calculate score
  const score = quizQuestions.reduce((sum, q, i) => sum + (qzIsCorrectAnswer(q, qzAnswers[i]) ? 1 : 0), 0);
  const pct   = Math.round(score / quizQuestions.length * 100);

  qzScoreText.textContent  = score + " / " + quizQuestions.length;
  qzScorePct.textContent   = pct + "%";
  qzScoreMsg.textContent   = qzScoreMessage(score);
  qzScoreCard.classList.remove("hidden");

  // render review
  qzRenderReview();

  // re-render current question in submitted state
  qzRender();

  qzScoreCard.scrollIntoView({ behavior: "smooth", block: "center" });
});

// ── review ────────────────────────────────────────────────────────────────

function qzRenderReview() {
  qzReview.innerHTML = "";
  qzReview.classList.remove("hidden");

  const heading = document.createElement("h3");
  heading.className = "quiz-review-heading";
  heading.textContent = "Answer Review";
  qzReview.appendChild(heading);

  quizQuestions.forEach((q, i) => {
    const chosen  = qzAnswers[i];
    const correct = qzIsCorrectAnswer(q, chosen);

    const item = document.createElement("div");
    item.className = "quiz-review-item";

    // question number
    const num = document.createElement("p");
    num.className = "review-q-num";
    num.textContent = (q.category === "Problem Solving" ? "Problem Solving — " : "Conceptual — ") + "Question " + q.id;
    item.appendChild(num);

    // question text
    const qp = document.createElement("p");
    qp.className = "review-q-text";
    qp.innerHTML = q.question.split("\n")[0]; // first line as summary
    item.appendChild(qp);

    // badges
    const badges = document.createElement("div");
    badges.className = "quiz-review-badges";

    const resultBadge = document.createElement("span");
    resultBadge.className = "review-badge " + (correct ? "badge-correct" : "badge-incorrect");
    resultBadge.textContent = correct ? "✓ Correct" : "✗ Incorrect";
    badges.appendChild(resultBadge);

    const chosenBadge = document.createElement("span");
    chosenBadge.className = "review-badge badge-chosen";
    chosenBadge.textContent = "Your answer: " + chosen;
    badges.appendChild(chosenBadge);

    if (!correct) {
      const ansBadge = document.createElement("span");
      ansBadge.className = "review-badge badge-answer";
      ansBadge.textContent = "Correct answer: " + q.correct;
      badges.appendChild(ansBadge);
    }

    item.appendChild(badges);

    // explanation
    const exp = document.createElement("p");
    exp.className = "quiz-review-explanation";
    exp.textContent = q.explanation;
    item.appendChild(exp);

    // expandable solution for calculation questions
    if (q.solution) {
      const toggle = document.createElement("button");
      toggle.className = "quiz-solution-toggle";
      toggle.textContent = "▶ View Solution";
      toggle.setAttribute("aria-expanded", "false");

      const body = document.createElement("pre");
      body.className = "quiz-solution-body hidden";
      body.textContent = q.solution;

      toggle.addEventListener("click", () => {
        const open = !body.classList.contains("hidden");
        body.classList.toggle("hidden", open);
        toggle.textContent = open ? "▶ View Solution" : "▼ Hide Solution";
        toggle.setAttribute("aria-expanded", String(!open));
      });

      item.appendChild(toggle);
      item.appendChild(body);
    }

    qzReview.appendChild(item);
  });
}

// ── retry ─────────────────────────────────────────────────────────────────

retakeQuizBtn.addEventListener("click", () => {
  qzAnswers   = new Array(10).fill(null);
  qzCurrent   = 0;
  qzSubmitted = false;
  qzWarning.textContent = "";
  qzScoreCard.classList.add("hidden");
  qzReview.classList.add("hidden");
  qzReview.innerHTML = "";
  qzRender();
  document.getElementById("quiz").scrollIntoView({ behavior: "smooth", block: "start" });
});

// ── init ──────────────────────────────────────────────────────────────────
qzRender();
