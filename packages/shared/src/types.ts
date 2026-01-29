export type Mode = "do" | "decide" | "drift";

export type DurationBucket = "2m" | "10m" | "25m";

export type MenuCategory = "career" | "tomorrow" | "drift";

export type MenuItem = {
  id: string;
  mode: Mode;
  title: string;
  startStep: string;
  durationBucket: DurationBucket;
  category: MenuCategory | null;
  tags: string[];
  frictionScore: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RuleTrigger = "new_tab" | "unlock" | "time_window" | "post_busy_block";

export type RuleAction = "show_mode" | "pin_item" | "start_timer";

export type Rule = {
  id: string;
  trigger: RuleTrigger;
  conditions: Record<string, string | number | boolean>;
  action: RuleAction;
};

export type SessionOutcome = "done" | "partial" | "aborted";

export type Session = {
  id: string;
  itemId: string;
  startedAt: string;
  endedAt: string | null;
  device: "web" | "mobile";
  outcome: SessionOutcome;
  notes?: string;
};

export type Preference = {
  caps: {
    doMax: number;
    decideMax: number;
    driftMax: number;
  };
  ordering: "duration" | "recent";
  widgetConfig: {
    smallWidgetMode: Mode;
    mediumWidgetModes: Mode[];
  };
  blocklists: {
    tags: string[];
    keywords: string[];
  };
};
