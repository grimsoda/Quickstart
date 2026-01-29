import type { MenuItem, Mode, Preference } from "@quickstart/shared";

const orderItems = (items: MenuItem[], preference: Preference) => {
  if (preference.ordering === "duration") {
    const order = { "2m": 0, "10m": 1, "25m": 2 } as const;
    return [...items].sort((a, b) => order[a.durationBucket] - order[b.durationBucket]);
  }

  if (preference.ordering === "recent") {
    return [...items].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  return [...items].sort((a, b) => order[a.durationBucket] - order[b.durationBucket]);
};

const applyBlocklists = (items: MenuItem[], preference: Preference) => {
  const loweredKeywords = preference.blocklists.keywords.map((keyword) =>
    keyword.toLowerCase(),
  );

  return items.filter((item) => {
    if (!item.enabled) {
      return false;
    }

    const tagBlocked = item.tags.some((tag) => preference.blocklists.tags.includes(tag));
    if (tagBlocked) {
      return false;
    }

    const text = `${item.title} ${item.startStep}`.toLowerCase();
    return !loweredKeywords.some((keyword) => text.includes(keyword));
  });
};

export const selectMenuItems = (
  items: MenuItem[],
  mode: Mode,
  preference: Preference,
) => {
  const filtered = applyBlocklists(
    items.filter((item) => item.mode === mode),
    preference,
  );

  const ordered = orderItems(filtered, preference);
  const cap =
    mode === "do"
      ? preference.caps.doMax
      : mode === "decide"
        ? preference.caps.decideMax
        : preference.caps.driftMax;

  return ordered.slice(0, cap);
};
