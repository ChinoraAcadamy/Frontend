import { browser } from '$app/environment';

function createA11yStore() {
    let state = $state({
        zoomLevel: 1,
        isGrayscale: false,
        isHighContrast: false,
        isReducedMotion: false,
        lineHeight: 1.5,
        letterSpacing: 0,
        wordSpacing: 0,
        fontWeight: 400,
        isDyslexiaFont: false,
        textAlign: 'left',
        cursorSize: 'default',
        colorBlindMode: 'none',
        isLinkHighlight: false,
        isHideImages: false,
        isFocusHighlight: false,
        isReadingMask: false,
        saturation: 100,
        brightness: 100,
        readingMaskY: 200
    });

    let isInitialized = $state(false);

    if (browser) {
        // Load from localStorage
        const keys = Object.keys(state);
        keys.forEach(k => {
            const saved = localStorage.getItem(`a11y_${k}`);
            if (saved !== null) {
                if (typeof state[k] === 'boolean') state[k] = saved === 'true';
                else if (typeof state[k] === 'number') state[k] = parseFloat(saved);
                else state[k] = saved;
            }
        });
        isInitialized = true;
    }

    return {
        get val() { return state; },
        get initialized() { return isInitialized; },
        save() {
            if (!browser) return;
            Object.entries(state).forEach(([k, v]) => {
                localStorage.setItem(`a11y_${k}`, String(v));
            });
        },
        reset() {
            if (!browser) return;
            Object.keys(state).forEach(k => localStorage.removeItem(`a11y_${k}`));
            location.reload();
        }
    };
}

export const a11y = createA11yStore();
