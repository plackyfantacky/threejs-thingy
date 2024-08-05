import esbuild from 'esbuild'

await esbuild.build({
    entryPoints: [
        { out: 'dist/threejs-thingy', in: 'src/js/main.js' },
    ],
    bundle: true,
    outdir: './',
    target: ['es2018'],
    minify: false,
    sourcemap: true,
    logLevel: 'info',
    plugins: [],
})