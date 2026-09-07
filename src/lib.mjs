export function onlyNumbers(value) {
  return String(value ?? "").replace(/\D/g, "");
}

export function getPhoneNumber(country, ddd, phone) {
  const ddi = onlyNumbers(country);
  const dddValue = onlyNumbers(ddd);
  const phoneValue = onlyNumbers(phone);
  return ddi + dddValue + phoneValue;
}

/*
 * Para o Brasil:
 * DDD = 2 dígitos
 * Celular = 9 dígitos
 * Fixo = 8 dígitos
 */
export function isValidNumber(country, ddd, phone) {
  const dddValue = onlyNumbers(ddd);
  const phoneValue = onlyNumbers(phone);

  if (country === "55") {
    return (
      dddValue.length === 2 &&
      (phoneValue.length === 8 || phoneValue.length === 9)
    );
  }

  return phoneValue.length >= 6;
}

export function formatPhone(country, phone) {
  let value = onlyNumbers(phone);

  if (country !== "55") {
    return value;
  }

  if (value.length > 9) {
    value = value.slice(0, 9);
  }

  if (value.length > 5) {
    value = value.slice(0, 5) + "-" + value.slice(5);
  }

  return value;
}

export function formatDDD(ddd) {
  return onlyNumbers(ddd).slice(0, 3);
}

export function generateLink(country, ddd, phone, message) {
  const number = getPhoneNumber(country, ddd, phone);
  const text = String(message ?? "").trim();

  if (!isValidNumber(country, ddd, phone)) {
    return null;
  }

  let link = `https://wa.me/${number}`;

  if (text) {
    link += `?text=${encodeURIComponent(text)}`;
  }

  return link;
}