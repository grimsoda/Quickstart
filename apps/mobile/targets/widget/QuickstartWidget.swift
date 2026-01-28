import WidgetKit
import SwiftUI
import os

// MARK: - Data Models

struct MenuItem: Codable {
    let title: String?
}

struct WidgetSnapshot: Codable {
    let topDo: MenuItem?
    let topDecide: MenuItem?
    let topDrift: MenuItem?
}

// MARK: - Timeline Provider

struct Provider: TimelineProvider {
    // App Group ID must match the one in entitlements
    let suiteName = "group.com.quickstart.app"
    let snapshotKey = "widgetSnapshot"
    private let logger = Logger(subsystem: "com.quickstart.app", category: "Widget")

    func placeholder(in context: Context) -> SimpleEntry {
        logger.log("placeholder called - generating placeholder entry")
        return SimpleEntry(date: Date(), topDo: nil, topDecide: nil, topDrift: nil)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        logger.log("getSnapshot called - loading entry for snapshot")
        let entry = loadEntry()
        logger.log("getSnapshot - returning entry with topDo: \(entry.topDo?.title ?? "nil"), topDecide: \(entry.topDecide?.title ?? "nil"), topDrift: \(entry.topDrift?.title ?? "nil")")
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
        logger.log("getTimeline called - loading entry for timeline")
        let entry = loadEntry()
        let calendar = Calendar.current
        guard let nextUpdateDate = calendar.date(byAdding: .minute, value: 15, to: Date()) else {
            logger.error("getTimeline - failed to calculate nextUpdateDate, using current date")
            let timeline = Timeline(entries: [entry], policy: .atEnd)
            completion(timeline)
            return
        }
        logger.log("getTimeline - creating timeline with entry: topDo=\(entry.topDo?.title ?? "nil"), topDecide=\(entry.topDecide?.title ?? "nil"), topDrift=\(entry.topDrift?.title ?? "nil"), nextUpdate=\(nextUpdateDate)")
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdateDate))
        completion(timeline)
    }

    private func loadEntry() -> SimpleEntry {
        logger.log("loadEntry called - attempting to load data from UserDefaults")

        guard let userDefaults = UserDefaults(suiteName: suiteName) else {
            logger.error("loadEntry - failed to access UserDefaults with suite name: \(suiteName)")
            return SimpleEntry(date: Date(), topDo: nil, topDecide: nil, topDrift: nil)
        }
        logger.log("loadEntry - successfully accessed UserDefaults")

        guard let jsonString = userDefaults.string(forKey: snapshotKey) else {
            logger.error("loadEntry - no data found in UserDefaults for key: \(snapshotKey)")
            return SimpleEntry(date: Date(), topDo: nil, topDecide: nil, topDrift: nil)
        }
        logger.log("loadEntry - found JSON string in UserDefaults: \(jsonString.prefix(100))")

        guard let data = jsonString.data(using: .utf8) else {
            logger.error("loadEntry - failed to convert JSON string to UTF8 data")
            return SimpleEntry(date: Date(), topDo: nil, topDecide: nil, topDrift: nil)
        }

        do {
            let snapshot = try JSONDecoder().decode(WidgetSnapshot.self, from: data)
            logger.log("loadEntry - successfully decoded JSON snapshot: topDo=\(snapshot.topDo?.title ?? "nil"), topDecide=\(snapshot.topDecide?.title ?? "nil"), topDrift=\(snapshot.topDrift?.title ?? "nil")")
            let entry = SimpleEntry(
                date: Date(),
                topDo: snapshot.topDo,
                topDecide: snapshot.topDecide,
                topDrift: snapshot.topDrift
            )
            logger.log("loadEntry - returning entry: topDo=\(entry.topDo?.title ?? "nil"), topDecide=\(entry.topDecide?.title ?? "nil"), topDrift=\(entry.topDrift?.title ?? "nil")")
            return entry
        } catch {
            logger.error("loadEntry - JSON decode error: \(error.localizedDescription)")
            logger.error("loadEntry - full error details: \(String(describing: error))")
            return SimpleEntry(date: Date(), topDo: nil, topDecide: nil, topDrift: nil)
        }
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let topDo: MenuItem?
    let topDecide: MenuItem?
    let topDrift: MenuItem?
}

// MARK: - Views

struct ItemLine: View {
    let label: String
    let title: String?

    var body: some View {
        HStack(spacing: 6) {
            Text(label)
                .font(.body)
                .foregroundStyle(.primary)
                .lineLimit(1)
            Text(title ?? "Add item")
                // #6b7280 is (107, 114, 128)
                .foregroundStyle(Color(red: 107/255, green: 114/255, blue: 128/255))
                .lineLimit(1)
        }
    }
}

struct QuickstartWidgetEntryView : View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Quickstart")
                .font(.headline)
                .foregroundStyle(.primary)

            if family == .systemSmall {
                // Parity with JS: Small widget shows Do and Tomorrow (mapped to topDecide)
                ItemLine(label: "Do", title: entry.topDo?.title)
                ItemLine(label: "Tomorrow", title: entry.topDecide?.title)
            } else {
                // Parity with JS: Medium widget shows Do, Decide, Drift
                ItemLine(label: "Do", title: entry.topDo?.title)
                ItemLine(label: "Decide", title: entry.topDecide?.title)
                ItemLine(label: "Drift", title: entry.topDrift?.title)
            }
            
            Spacer()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .containerBackground(.fill.tertiary, for: .widget)
    }
}

// MARK: - Widget Configuration

struct QuickstartWidget: Widget {
    let kind: String = "QuickstartWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            QuickstartWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Quickstart")
        .description("View your top tasks.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

// MARK: - Bundle

@main
struct QuickstartWidgetBundle: WidgetBundle {
    var body: some Widget {
        QuickstartWidget()
    }
}
