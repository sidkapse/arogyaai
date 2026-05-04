import { registerSW } from 'virtual:pwa-register';

let updateSW: ((reloadPage?: boolean) => Promise<void>) | undefined;
let _onNeedRefresh: (() => void) | undefined;

export function initSW() {
  updateSW = registerSW({
    onNeedRefresh() {
      _onNeedRefresh?.();
    },
    onOfflineReady() {
      console.log('[PWA] Ready to work offline');
    },
  });
}

export function onNeedRefresh(cb: () => void) {
  _onNeedRefresh = cb;
}

export function applyUpdate() {
  updateSW?.(true);
}
