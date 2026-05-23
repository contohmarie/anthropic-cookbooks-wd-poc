# Claude Cookbooks workflow_dispatch MCP validation

This tester-owned repository validates the workflow pattern from `anthropics/claude-cookbooks`:

```text
workflow_dispatch pr_number
  -> checkout refs/pull/<PR>/head
  -> run Claude Code with dummy workflow secrets
  -> PR-controlled .mcp.json starts a project stdio MCP server
```

The validation uses dummy values only and points Claude Code at a failing local API base URL.

