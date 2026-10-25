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
     *           warning: boolean, digital: string }} model
     */
    render(model) {
      sign.textContent = model.sign;
      phrase.textContent = model.text;
      digital.textContent = model.digital;
      bar.style.setProperty("--progress", `${model.progress}%`);
      root.toggleAttribute("data-warning", model.warning);
    },
  };
}
