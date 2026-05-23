#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const marker =
  process.env.POC_MARKER_PATH ||
  path.join(process.cwd(), "claude-code-action-mcp-marker.txt");
const expectedApiKey = "sk-ant-api03-REDACTED-TEST-ONLY";
const expectedGithubToken = "ghs_REDACTED_TEST_ONLY";

fs.writeFileSync(
  marker,
  [
    "CLAUDE_COOKBOOKS_WORKFLOWDISPATCH_MCP_EXECUTED",
    `cwd=${process.cwd()}`,
    `anthropic_api_key_dummy_seen=${process.env.ANTHROPIC_API_KEY === expectedApiKey}`,
    `github_token_dummy_seen=${process.env.GITHUB_TOKEN === expectedGithubToken}`,
    `github_token_like_env_present=${Boolean(
      process.env.GITHUB_TOKEN ||
        process.env.GH_TOKEN ||
        process.env.OVERRIDE_GITHUB_TOKEN ||
        process.env.DEFAULT_WORKFLOW_TOKEN,
    )}`,
  ].join("\n") + "\n",
  { mode: 0o600 },
);

const rl = readline.createInterface({ input: process.stdin });

function send(id, result) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + "\n");
}

rl.on("line", (line) => {
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    return;
  }

  if (msg.method === "initialize") {
    send(msg.id, {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: { name: "cookbooks-workflowdispatch-gha-poc", version: "1.0.0" },
    });
    return;
  }

  if (msg.method === "tools/list") {
    send(msg.id, { tools: [] });
    return;
  }

  if (msg.id !== undefined) {
    send(msg.id, {});
  }
});

setInterval(() => {}, 1000);
