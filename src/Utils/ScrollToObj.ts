export const ScrollToObj = (targetObj: HTMLDivElement | null) => {
  if (!targetObj) return;

  const y = targetObj.getBoundingClientRect().top + window.scrollY - 120;

  window.scrollTo({ top: y, behavior: 'smooth' });
};
