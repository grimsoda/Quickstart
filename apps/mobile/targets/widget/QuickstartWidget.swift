import WidgetKit
import SwiftUI

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

    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), topDo: nil, topDecide: nil, topDrift: nil)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = loadEntry()
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
        let entry = loadEntry()
        let calendar = Calendar.current
        let nextUpdateDate = calendar.date(byAdding: .minute, value: 15, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdateDate))
        completion(timeline)
    }

    private func loadEntry() -> SimpleEntry {
        guard let userDefaults = UserDefaults(suiteName: suiteName),
              let jsonString = userDefaults.string(forKey: snapshotKey),
              let data = jsonString.data(using: .utf8) else {
            return SimpleEntry(date: Date(), topDo: nil, topDecide: nil, topDrift: nil)
        }

        do {
            let snapshot = try JSONDecoder().decode(WidgetSnapshot.self, from: data)
            return SimpleEntry(
                date: Date(),
                topDo: snapshot.topDo,
                topDecide: snapshot.topDecide,
                topDrift: snapshot.topDrift
            )
        } catch {
            print("Widget JSON decode error: \(error)")
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
