# Google Ads MCP server (`google-ads-fruition`)

Lets Claude Code read and change Fruition's Google Ads account (**845-729-9561**, customer ID
`8457299561`, currency AUD). Set up 2026-10-08.

## What it is

Google's official [google-ads-mcp](https://github.com/googleads/google-ads-mcp) server is
read-only. A local wrapper, `~/.config/fruition/google_ads_mcp_write.py`, imports it and mounts
a `mutate` namespace on top, so upstream updates still arrive through `uvx` and the write tools
live in one small file.

| Tool | Does |
|---|---|
| `customers_list_accessible_customers` | Lists the account IDs the signed-in user can reach |
| `search_search` | Runs a GAQL query (campaigns, keywords, metrics, conversions...) |
| `metadata_get_resource_metadata` | Lists selectable fields, metrics and segments for a resource |
| `mutate_mutate` | Any create / update / remove through `GoogleAdsService.Mutate`; `update_mask` is filled in automatically |
| `mutate_set_status` | Enables or pauses campaigns, ad groups, ads, keywords, asset groups |
| `mutate_set_campaign_daily_budget` | Sets a daily budget in AUD; refuses shared budgets unless `allow_shared_budget=true` |

All three write tools default to **`validate_only=true`**: Google validates the request,
including permissions, and nothing changes. Pass `validate_only=false` to apply. Every applied
change is appended to `~/.config/fruition/google-ads-mutations.jsonl`.

## Rules for agents

1. Use `google-ads-fruition`. The `google-ads` server is Kelin Studio's account.
2. Read before writing: find resource names with `search_search`, never guess them.
3. Dry-run first, show Edward the exact change, apply only after he confirms that change.
4. Experiment (trial) campaigns reject status, budget and date changes.
5. Conversion actions may be owned by the agency manager account, so editing them can fail
   with "Operation not permitted for current customer".

## How it is wired

| Piece | Where |
|---|---|
| MCP registration | user scope in `~/.claude.json`, command `~/.config/fruition/google-ads-mcp.sh` |
| Launcher | `~/.config/fruition/google-ads-mcp.sh` (sets env, runs the wrapper with `uvx`) |
| Write tools | `~/.config/fruition/google_ads_mcp_write.py` |
| OAuth client | Desktop client "Google Ads MCP (Claude Code)" in GCP project `fruition-ai-497409` (Internal consent screen); JSON at `~/.config/fruition/google-ads-oauth-client.json` |
| User credentials | ADC for **edward@fruitionservices.io** (ADMIN on the account) at `~/.config/fruition/gcloud-ads/application_default_credentials.json` |
| API access | Google Ads API enabled on `fruition-ai-497409` at **Explorer** level (2,880 production operations/day). Basic needs brand verification. |

No developer token: Google sunset developer tokens on 2026-09-09 and API access levels now
belong to the Cloud project. No `login-customer-id` either, because the user has direct access.

## Rebuilding on another machine

1. Copy or recreate the OAuth client JSON (Cloud console → Google Auth Platform → Clients, project
   `fruition-ai-497409`, type Desktop app).
2. Sign in (needs Edward's passkey):
   ```bash
   CLOUDSDK_CONFIG=~/.config/fruition/gcloud-ads gcloud auth application-default login \
     --scopes=https://www.googleapis.com/auth/adwords,https://www.googleapis.com/auth/cloud-platform \
     --client-id-file=$HOME/.config/fruition/google-ads-oauth-client.json
   ```
3. Put the launcher and `google_ads_mcp_write.py` in `~/.config/fruition/`, then:
   ```bash
   claude mcp add -s user google-ads-fruition -- $HOME/.config/fruition/google-ads-mcp.sh
   ```
4. Check: `claude mcp list` shows it connected, and `customers_list_accessible_customers`
   returns `8457299561`.

Google's Ads agent skills (`google-ads-api-account-diagnostics`, `-mcp-setup`, `-quickstart`)
come from the `google/skills` marketplace and are symlinked into `~/.claude/skills`.
