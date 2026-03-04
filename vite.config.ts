import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      'figma:asset/d4630c01b543cc75980f0b293230859d29654fbb.png': path.resolve(__dirname, './src/assets/d4630c01b543cc75980f0b293230859d29654fbb.png'),
      'figma:asset/8b7d52033414d4d2f0999bc47a30f6af9f485f36.png': path.resolve(__dirname, './src/assets/8b7d52033414d4d2f0999bc47a30f6af9f485f36.png'),
      'figma:asset/6e321558ab9ee06d335e9a166fab86aa46ff5821.png': path.resolve(__dirname, './src/assets/6e321558ab9ee06d335e9a166fab86aa46ff5821.png'),
      'figma:asset/15a7da513ab99cbb57e9735db4d4d232088838f1.png': path.resolve(__dirname, './src/assets/15a7da513ab99cbb57e9735db4d4d232088838f1.png'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 3001,
    open: true,
  },
});
