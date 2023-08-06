# threejs-thingy

Super janky WordPress plugin that adds a shortcode to output and render a ThreeJS scene.

### Usage

1. Add your GLB (glft) file to `/3d_assets`
2. Modify `/src/js/main.js` to suit your needs. Pay attention to `dracoLoader.setDecoderPath` on line 28 and `loader.setPath` on line 33. These should be updated depending on the file path on the server. Use the commented out lines during testing to avoid CORS issues.
3. Run `npm run dev` to use the Vite local server for testing (http://localhost:5173/index.html)
4. Run `npm run build` to output to `/dist/threejs-thingy.js`
5. Cross your fingers and hope it works

6. (note for plackyfantacky: rewrite this later)
