import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"

const config = {
    darkMode: "class",
    // ... existing code ...
    plugins: [tailwindcssAnimate],
} satisfies Config

export default config
