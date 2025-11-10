# Analyst Features

This folder contains the analyst dashboard pages:
- analyst-dashboard.component.ts — overview page with summary, recent folios snippet, and chart placeholder.
- folios-list.component.ts — full list of folios owned by the analyst with actions.
- folio-editor.component.ts — create/edit folio basic fields (slug, title, description, visibility).
- analyst-trades.component.ts — recent trades placeholder using shared Table.
- analyst-analytics.component.ts — analytics placeholder using AnalyticsService and charts placeholder.

Routes are configured under /analyst in app.routes.ts and guarded by AuthGuard and RoleGuard('analyst').
