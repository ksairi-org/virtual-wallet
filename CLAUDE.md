# Virtual Wallet

React Native / Expo + Supabase app. For coding standards run `/expo-rn-plugin:coding-standards`.

## Project Context

- Expo Router — routes in `src/app/`
- Tamagui — tokens in `src/theme/`
- Lingui i18n — catalogs in `src/i18n/locales/`
- Supabase `api` schema (not `public`)
- Stripe for payments

## Design Token Sync (Figma → Tamagui)

Token files in `src/theme/` are auto-generated from Figma. To regenerate after a design system change:

```text
Connect to Figma file $FIGMA_FILE_ID, extract all variables (colors, spacing, radius, fonts),
and generate the token files following the structure in src/theme/:
  - themes.ts       → light/dark color themes as rgba() strings
  - tokens/sizesSpaces.ts → spacing scale with `true` key at the closest value to 16
  - tokens/radius.ts      → radius scale with `true` key at the closest value to 16
Use @ksairi-org/figma-tamagui-generator for the extraction logic.
```

Or run the CLI directly: `yarn sync-design-tokens`

The sync also runs automatically on every bundler start (`yarn start`) and on every Claude session start via the expo-rn-plugin hook.

## Env Vars / Doppler

Secrets: project `mobile`, configs `dev` / `stg` / `prod`.

To add a secret:

1. Add to `env.template.yaml`: `VAR_NAME={{ .VAR_NAME }}`
2. Set in all configs: `doppler secrets set VAR_NAME="value" --project mobile --config dev|stg|prod`
3. Sync locally: `yarn sync-env-vars stg`

`EXPO_PUBLIC_` prefix required for client-side vars.

## E2E Tests (Maestro)

Flows in `.maestro/`. Run: `maestro test .maestro/<flow>.yaml`.

Bundle IDs: `com.virtual-wallet` (prod), `com.virtual-wallet.staging` (staging). Text matchers preferred over testIDs.

## OTA Updates

| Build profile | Channel |
| --- | --- |
| `store` | `production` |
| `internal` / `internal-simulator` | `staging` |
| `dev-client-*` | none |

Push: `eas update --channel production --message "description"`
