import * as path from "path";
import { execSync } from "node:child_process";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

interface CommitInfo {
  hash: string;
  shortHash: string;
  date: string;
  tags: string[];
}

interface CommitHistory {
  lastCommit: CommitInfo;
  lastRelease: CommitInfo;
}

function getCommitInfo(commitHash: string): CommitInfo {
  const shortHash = execSync(`git log -1 --format="%h" ${commitHash}`).toString().trim();
  const date = execSync(`git log -1 --format="%cI" ${commitHash}`).toString().trim();
  const tags = execSync(`git tag --points-at ${commitHash}`).toString().split('\n').filter((l) => l.length > 0);

  return {
    hash: commitHash,
    shortHash,
    date,
    tags,
  }
}

function getReleaseHistory(): CommitHistory {
  const lastCommitHash = execSync('git log -1 --format="%H"').toString().trim();

  // Get the last commit containing a tag (aka a release)
  const allSortedTags = execSync('git tag --sort=committerdate').toString().split('\n').filter((s) => s.length > 0);
  const lastTag = allSortedTags[allSortedTags.length - 1];
  const lastReleaseCommitHash = execSync(`git rev-list -n 1 ${lastTag}`).toString().trim();

  return {
    lastCommit: getCommitInfo(lastCommitHash),
    lastRelease: getCommitInfo(lastReleaseCommitHash),
  }
}

const commitInfo = getReleaseHistory();

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
