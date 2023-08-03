import path from 'path'
import { defineConfig } from 'vite'
import dns from 'dns'

dns.setDefaultResultOrder('verbatim')

let pkg = require('./package.json')

export default defineConfig({
	server: {
		host: '0.0.0.0',
	},
	build: {
		rollupOptions: {
			output: {
				entryFileNames: `${pkg.config.project}.js`,
			}
		}
	}
})