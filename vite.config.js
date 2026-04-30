import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: './', // 빌드 시 자원을 상대 경로로 참조하게 만들어 줍니다 (필수)
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist', // 빌드 결과물이 나올 폴더 이름
    emptyOutDir: true
  }
});