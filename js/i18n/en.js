/** @type {import("./index.js").Language} */
export default {
  code: "en",
  name: "English",

  format(t) {
    switch (t.kind) {
      case "countdown":
        return { sign: "", text: `${plural(t.seconds, "second")} to ${t.hour}` };
      case "oclock":
        return { sign: t.sign, text: `${t.hour} O'Clock` };
      case "half":
        return { sign: t.sign, text: `Half past ${t.hour}` };
      case "quarter":
        return { sign: t.sign, text: `Quarter ${t.direction} ${t.hour}` };
      default:
        return {
          sign: t.sign,
          text: `${plural(t.count, "minute")} ${t.direction} ${t.hour}`,
        };
    }
  },
};

function plural(n, word) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}
