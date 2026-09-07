const country = document.querySelector("#country");
const ddd = document.querySelector("#ddd");
const phone = document.querySelector("#phone");
const message = document.querySelector("#message");

const generatedLink = document.querySelector("#generatedLink");
const copyButton = document.querySelector("#copyButton");
const openButton = document.querySelector("#openButton");
const status = document.querySelector("#status");
const counter = document.querySelector("#counter");


/* =========================
   HELPERS
========================= */

function onlyNumbers(value) {
  return value.replace(/\D/g, "");
}


function getPhoneNumber() {
  const ddi = onlyNumbers(country.value);
  const dddValue = onlyNumbers(ddd.value);
  const phoneValue = onlyNumbers(phone.value);

  return ddi + dddValue + phoneValue;
}


function isValidNumber() {
  const dddValue = onlyNumbers(ddd.value);
  const phoneValue = onlyNumbers(phone.value);

  /*
   * Para o Brasil:
   * DDD = 2 dígitos
   * Celular = 9 dígitos
   * Fixo = 8 dígitos
   */

  if (country.value === "55") {
    return (
      dddValue.length === 2 &&
      (phoneValue.length === 8 || phoneValue.length === 9)
    );
  }

  /*
   * Para outros países fazemos
   * uma validação mínima.
   */

  return phoneValue.length >= 6;
}


/* =========================
   FORMAT NUMBER
========================= */

function formatPhone() {

  let value = onlyNumbers(phone.value);

  if (country.value !== "55") {
    phone.value = value;
    return;
  }

  /*
   * Celular brasileiro
   * 99999-9999
   */

  if (value.length > 9) {
    value = value.slice(0, 9);
  }

  if (value.length > 5) {
    value =
      value.slice(0, 5) +
      "-" +
      value.slice(5);
  }

  phone.value = value;
}


function formatDDD() {
  ddd.value = onlyNumbers(ddd.value).slice(0, 3);
}


/* =========================
   BUILD LINK
========================= */

function generateLink() {

  const number = getPhoneNumber();
  const text = message.value.trim();

  if (!isValidNumber()) {

    generatedLink.textContent = "https://wa.me/";

    status.textContent = "Informe um número válido";
    status.classList.remove("valid");

    copyButton.disabled = true;
    openButton.disabled = true;

    return;
  }

  let link = `https://wa.me/${number}`;

  if (text) {
    link += `?text=${encodeURIComponent(text)}`;
  }

  generatedLink.textContent = link;

  status.textContent = "Link pronto";
  status.classList.add("valid");

  copyButton.disabled = false;
  openButton.disabled = false;

  copyButton.dataset.link = link;
  openButton.dataset.link = link;
}


/* =========================
   EVENTS
========================= */

country.addEventListener("change", () => {

  phone.value = "";

  generateLink();

});


ddd.addEventListener("input", () => {

  formatDDD();
  generateLink();

});


phone.addEventListener("input", () => {

  formatPhone();
  generateLink();

});


message.addEventListener("input", () => {

  counter.textContent =
    `${message.value.length}/1000`;

  generateLink();

});


/* =========================
   COPY
========================= */

copyButton.addEventListener("click", async () => {

  const link = copyButton.dataset.link;

  if (!link) return;

  try {

    await navigator.clipboard.writeText(link);

    const original = copyButton.innerHTML;

    copyButton.innerHTML = "✓ Copiado";

    setTimeout(() => {
      copyButton.innerHTML = original;
    }, 1500);

  } catch {

    /*
     * Fallback para ambientes
     * onde Clipboard API não está disponível.
     */

    const textarea = document.createElement("textarea");

    textarea.value = link;

    document.body.appendChild(textarea);

    textarea.select();

    document.execCommand("copy");

    textarea.remove();

  }

});


/* =========================
   OPEN WHATSAPP
========================= */

openButton.addEventListener("click", () => {

  const link = openButton.dataset.link;

  if (!link) return;

  window.open(
    link,
    "_blank",
    "noopener,noreferrer"
  );

});


/* =========================
   INITIAL STATE
========================= */

generateLink();
