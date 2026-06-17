import * as path from "path";
import { execSync } from "node:child_process";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

interface CommitInfo {
  hash: string;
  shortHash: string;
  date: string;
  lastTag: string;
  lastCommitTags: string[];
}

function safeDate(value?: string): string {
  if (value) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }
  return new Date().toISOString();
}

function getCommitInfo(): CommitInfo {
  const envHash = process.env.GIT_COMMIT_HASH;
  const envShortHash = process.env.GIT_COMMIT_SHORT_HASH;
  const envDate = process.env.GIT_COMMIT_DATE;
  const envVersion = process.env.APP_VERSION;
  if (envHash || envShortHash || envDate || envVersion) {
    const hash = envHash ?? '';
    return {
      hash,
      shortHash: envShortHash || (hash ? hash.slice(0, 7) : ''),
      date: safeDate(envDate),
      lastTag: envVersion ?? '',
      lastCommitTags: envVersion ? [envVersion] : [],
    };
  }

  try {
    const shortHash = execSync('git rev-parse --short HEAD').toString().trim();
    const lastCommit = execSync('git log -1').toString();
    const lastCommitTags = execSync('git tag --contains HEAD').toString().trim().split(' ');
    const lastCommitLines = lastCommit.split('\n').map((l) => l.trim());

    const hash = lastCommitLines[0].split(' ')[1].trim();
    const dateLine = lastCommitLines.find((l) => l.includes('Date:'));
    const date = dateLine
      ? safeDate(dateLine.substring(dateLine.indexOf('Date:') + 1).trim())
      : new Date().toISOString();

    const allSortedTags = execSync('git tag --sort=committerdate').toString().split('\n').filter((s) => s.length > 0);
    const lastTag = allSortedTags[allSortedTags.length - 1];

    return {
      hash, shortHash, date, lastTag, lastCommitTags: lastCommitTags.filter((t) => t.length > 0),
    };
  } catch {
    return { hash: '', shortHash: '', date: new Date().toISOString(), lastTag: '', lastCommitTags: [] };
  }
}

const commitInfo = getCommitInfo();

export default defineConfig({
  base: '/',
  css: {
    preprocessorOptions: {
      less: {
        math: "always",
      },
    },
  },
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: './build',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
    chunkSizeWarningLimit: 750
  },
  resolve: {
    alias: {
      "../../theme.config": path.resolve(
        __dirname,
        "./src/semantic-ui/theme.config"
      ),
    },
  },
  assetsInclude: ['**/*.md'],
  define: {
    __LAST_COMMIT_INFO: JSON.stringify(commitInfo),
  },
})
