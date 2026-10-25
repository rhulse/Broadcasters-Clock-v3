/**
 * The brief view: spoken time, a progress bar, and a digital readout.
 * This is the only module that touches the page.
 */
export function createTextView(root) {
  const sign = root.querySelector("[data-sign]");
  const phrase = root.querySelector("[data-phrase]");
  const bar = root.querySelector("[data-bar]");
  const digital = root.querySelector("[data-digital]");

  return {
    /**
     * @param {{ sign: string, text: string, progress: number,
     *           warning: boolean, countdown: boolean, digital: string }} model
     */
    render(model) {
      sign.textContent = model.sign;
      showPhrase(phrase, model.text);
      digital.textContent = model.digital;
      // CSS scales the fill by 0..1
      bar.style.setProperty("--progress", String(model.progress / 100));
      root.toggleAttribute("data-warning", model.warning);
      root.toggleAttribute("data-countdown", model.countdown);
    },
  };
}

/**
 * Wrap each number in a span so CSS can give it a steady width. The language
 * modules stay free of layout concerns.
 */
function showPhrase(element, text) {
  const nodes = text.split(/(\p{Nd}+)/u).map((piece, i) => {
    if (i % 2 === 0) return document.createTextNode(piece);
    const span = document.createElement("span");
    span.className = "num";
    span.textContent = piece;
    return span;
  });
  element.replaceChildren(...nodes);
}
