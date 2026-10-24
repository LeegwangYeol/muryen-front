git commit --amend -m "[Jules daily] Fix middleware path prefix matching and InteractivePlayer SSR

What was wrong (file and line)
- \`middleware.ts\`: Line 12 used \`pathname.startsWith(prefix)\`, which allowed bypassing auth (e.g., \`/daily-bypass\` would match \`/daily\`).
- \`components/video/interactive-player.tsx\`: Line 4 statically imported \`ReactPlayer\`, causing SSR hydration errors (\`A dynamic import callback was invoked without --experimental-vm-modules\` during tests, breaking component bounds).

The fix
- Updated \`middleware.ts\` to exact match or subpath match: \`pathname === prefix || pathname.startsWith(prefix + \"/\")\`.
- Changed \`InteractivePlayer\` to use \`next/dynamic\` for \`ReactPlayer\` with \`ssr: false\` to avoid SSR mismatch issues.

How it was verified (build/test command and result)
- \`npm test\` runs cleanly (31 suites, 269 tests passed).
- \`npm run build\` generates all 25 routes properly without static bailouts.

Not fixed
- \`A suspended resource finished loading inside a test...\` (Act warning during tests) remains unchanged per instructions as it doesn't block pass.
- Warnings for \`ResponsiveContainer\` width/height in jsdom.

Assumptions
- Q: Do we need a dynamic import for \`ReactPlayer\`? A: Yes, \`PROJECT.md\` expects it and tests fail without it when executed in jsdom.
- Q: Did \`startsWith(\"/daily\")\` allow open redirect bypasses? A: Yes, a path like \`/daily-public\` would be matched as protected, causing unintended lockouts or bypasses.

Prompt feedback
- none"
