import {
  formatPhone,
  formatDDD,
  generateLink,
} from "./lib.mjs";

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
   BUILD LINK
========================= */

function buildLink() {
  const link = generateLink(
    country.value,
    ddd.value,
    phone.value,
    message.value,
  );

  if (!link) {
    generatedLink.textContent = "https://wa.me/";
    status.textContent = "Informe um número válido";
    status.classList.remove("valid");

    copyButton.disabled = true;
    openButton.disabled = true;

    return;
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
  buildLink();
});

ddd.addEventListener("input", () => {
  ddd.value = formatDDD(ddd.value);
  buildLink();
});

phone.addEventListener("input", () => {
  phone.value = formatPhone(country.value, phone.value);
  buildLink();
});

message.addEventListener("input", () => {
  counter.textContent = `${message.value.length}/1000`;
  buildLink();
});


/* =========================
   COPY
========================= */

copyButton.addEventListener("click", async () => {
  const link = copyButton.dataset.link;

  if (!link) return;

  try {
    await navigator.clipboard.writeText(link);
  } catch {
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

  if (link) {
    window.open(link, "_blank", "noopener,noreferrer");
  }
});


/* =========================
   INITIAL STATE
========================= */

buildLink();

