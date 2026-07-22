export const PATTERN_ASSET_URLS = [
  "/onboard/mask-bg-sky.png",
  "/onboard/mask-bg-cobalt.png",
  "/onboard/mask-bg-navy.png",
];

export const MASKED_CARD_ASSET_URLS = [
  "/onboard/mask-card-journal.png",
  "/onboard/mask-card-events.png",
];

export const ALL_ONBOARD_ASSET_URLS = [
  ...PATTERN_ASSET_URLS,
  ...MASKED_CARD_ASSET_URLS,
];

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.decoding = "async";

    const finish = () => resolve(src);

    img.onerror = finish;
    img.onload = () => {
      if (typeof img.decode === "function") {
        img.decode().then(finish).catch(finish);
        return;
      }
      finish();
    };

    img.src = src;

    if (img.complete) {
      if (typeof img.decode === "function") {
        img.decode().then(finish).catch(finish);
      } else {
        finish();
      }
    }
  });
}

export function preloadAssets(urls) {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  return Promise.all(urls.map(loadImage));
}

export function preloadPatternAssets() {
  return preloadAssets(PATTERN_ASSET_URLS);
}

export function preloadMaskedCardAssets() {
  return preloadAssets(MASKED_CARD_ASSET_URLS);
}
