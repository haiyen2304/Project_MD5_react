// import { fileURLToPath, URL } from "node:url";
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": fileURLToPath(new URL("./src", import.meta.url)),
//     },
//   }
// });

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
// import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       global: 'globalthis', // Định nghĩa alias cho `global`
//     },
//   },
//   optimizeDeps: {
//     esbuildOptions: {
//       // Thêm polyfill cho `global` và các module Node.js khác
//       plugins: [
//         NodeGlobalsPolyfillPlugin({
//            process: true,
//           buffer: true, // Polyfill cho buffer nếu cần
//         }),
//       ],
//     },
//   },
//   build: {
//     rollupOptions: {
//       plugins: [
//         rollupNodePolyFill(), // Thêm polyfill cho Rollup
//       ],
//     },
//   },
// })
// ================
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig(({ mode }) => {
//   const isProd = mode === 'production'; // Kiểm tra nếu môi trường là production
//   return {
//     plugins: [react()],
//     base: isProd ? '/production-base-url/' : '/', // URL base khác nhau cho dev/prod
//   };
// });

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
 
})