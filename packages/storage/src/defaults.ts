import type { MenuItem, Preference, Rule, Session } from "@quickstart/shared";
import { uuid } from './uuid';

const now = () => new Date().toISOString();

const baseItem = (overrides: Partial<MenuItem>): MenuItem => ({
  id: uuid(),
  mode: "do",
  title: "",
  startStep: "",
  durationBucket: "2m",
  category: "career",
  tags: [],
  frictionScore: 1,
  enabled: true,
  createdAt: now(),
  updatedAt: now(),
  ...overrides,
});

export const defaultItems: MenuItem[] = [
  baseItem({
    mode: "do",
    title: "Write the next-step plan",
    startStep: "Open repo notes → write 3 bullets",
    durationBucket: "2m",
    category: "career",
    frictionScore: 1,
  }),
  baseItem({
    mode: "do",
    title: "Seed tomorrow's first block",
    startStep: "Open calendar → reserve 60 minutes",
    durationBucket: "10m",
    category: "tomorrow",
    frictionScore: 2,
  }),
  baseItem({
    mode: "do",
    title: "Career-capital micro-rep",
    startStep: "Open PR stub → add 1 TODO",
    durationBucket: "25m",
    category: "career",
    frictionScore: 3,
  }),
  baseItem({
    mode: "decide",
    title: "Pick the next constraint",
    startStep: "Choose time/energy/location",
    durationBucket: "2m",
    category: "career",
    frictionScore: 1,
  }),
  baseItem({
    mode: "decide",
    title: "Pick the next deliverable",
    startStep: "Select the next artifact",
    durationBucket: "2m",
    category: "career",
    frictionScore: 1,
  }),
  baseItem({
    mode: "drift",
    title: "10-minute walk",
    startStep: "Put on shoes → go outside",
    durationBucket: "10m",
    category: "drift",
    frictionScore: 1,
  }),
  baseItem({
    mode: "drift",
    title: "Watch one saved video",
    startStep: "Open watchlist → pick 1",
    durationBucket: "25m",
    category: "drift",
    frictionScore: 2,
  }),
];

export const defaultRules: Rule[] = [
  {
    id: uuid(),
    trigger: "new_tab",
    conditions: {},
    action: "show_mode",
  },
];

export const defaultSessions: Session[] = [];

export const defaultPreferences: Preference = {
  caps: {
    doMax: 5,
    decideMax: 3,
    driftMax: 3,
  },
  ordering: "duration",
  widgetConfig: {
    smallWidgetMode: "do",
    mediumWidgetModes: ["do", "decide", "drift"],
  },
  blocklists: {
    tags: [],
    keywords: [],
  },
};
