# Room Card

A custom [Home Assistant](https://www.home-assistant.io/) Lovelace card that shows an overview of a room with its entities.

![Room Card](https://img.shields.io/badge/HA_Card-Room_Card-blue)

## Features

- 📺 Up to 1 TV entity
- 🔊 Up to 2 Sonos/Media Player entities
- 🌡️ Up to 2 Climate entities
- 💡 Up to 2 Light entities
- 🔥 Up to 1 Smoke Detector entity
- 🌡️ Automatic temperature & humidity display from climate entities
- 🎨 Fully customizable colors and icons
- 🖱️ Click to open entity details, double-click to toggle
- ✏️ Graphical UI configuration editor

## Installation

### HACS (recommended)

1. Add this repository as a custom repository in HACS:
   - Go to HACS → Frontend → Custom Repositories
   - Add: `https://github.com/TheBToby/room-card`
   - Category: `Lovelace`
2. Search for "Room Card" and install it
3. Restart Home Assistant (or refresh your browser cache)

### Manual Installation

1. Download `room-card.js` from the [repository root](https://github.com/TheBToby/room-card/blob/main/room-card.js)
2. Copy it to your `www/community/room-card/` directory
3. Add the resource to your Lovelace configuration:
   - Go to Settings → Dashboards → Resources → Add Resource
   - URL: `/hacsfiles/room-card/room-card.js`
   - Type: `JavaScript Module`
4. Refresh your browser

## Configuration

Add the card via the Home Assistant UI editor or use YAML:

```yaml
type: custom:room-card
title: Living Room
icon: mdi:sofa
icon_color: "var(--state-icon-color)"
background_color: "var(--card-background-color)"
tv_color: "#7C4DFF"
media_player_color: "#1E88E5"
climate_color: "#FF6D00"
light_color: "#FDD835"
smoke_detector_color: "#EF5350"
tv_entity: media_player.living_room_tv
media_player_1_entity: media_player.sonos_living_room
media_player_2_entity: media_player.sonos_kitchen
climate_1_entity: climate.living_room
climate_2_entity: climate.living_room_2
light_1_entity: light.living_room_ceiling
light_2_entity: light.living_room_lamp
smoke_detector_entity: binary_sensor.living_room_smoke
```

### Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `type` | string | ✅ | - | Must be `custom:room-card` |
| `title` | string | ❌ | `"Living Room"` | Card title |
| `icon` | string | ❌ | `"mdi:sofa"` | Room icon (Material Design Icons) |
| `icon_color` | string | ❌ | `var(--state-icon-color)` | Color of the room icon |
| `background_color` | string | ❌ | `var(--card-background-color)` | Card background color |
| `active_color` | string | ❌ | `var(--primary-color)` | Default color for active entities |
| `inactive_color` | string | ❌ | `var(--disabled-text-color)` | Default color for inactive entities |
| `tv_color` | string | ❌ | `"#7C4DFF"` | Active color for TV entities (purple) |
| `media_player_color` | string | ❌ | `"#1E88E5"` | Active color for media player entities (blue) |
| `climate_color` | string | ❌ | `"#FF6D00"` | Active color for climate entities (orange) |
| `light_color` | string | ❌ | `"#FDD835"` | Active color for light entities (yellow) |
| `smoke_detector_color` | string | ❌ | `"#EF5350"` | Active color for smoke detector entities (red) |
| `tv_entity` | string | ❌ | - | TV media player entity ID |
| `media_player_1_entity` | string | ❌ | - | First Sonos/media player entity ID |
| `media_player_2_entity` | string | ❌ | - | Second Sonos/media player entity ID |
| `climate_1_entity` | string | ❌ | - | First climate entity ID |
| `climate_2_entity` | string | ❌ | - | Second climate entity ID |
| `light_1_entity` | string | ❌ | - | First light entity ID |
| `light_2_entity` | string | ❌ | - | Second light entity ID |
| `smoke_detector_entity` | string | ❌ | - | Smoke detector binary sensor entity ID |

## Card Layout

```
┌─────────────────────────────────────┐
│  Title                              │
│                                     │
│  🏠          📺  🔊🔊  🌡️🌡️  💡💡  🔥  │  ← Icon left, entities right (stacked by type)
│                                     │
│  ─────────────────────────────────  │
│  🌡 22°C / 21°C        💧 45%      │  ← Current temp / setpoint + Humidity
└─────────────────────────────────────┘
```

Each entity type has its own color (Material You inspired):
- 📺 TV: Purple (`#7C4DFF`)
- 🔊 Media Players: Blue (`#1E88E5`)
- 🌡️ Climate: Orange (`#FF6D00`)
- 💡 Lights: Yellow (`#FDD835`)
- 🔥 Smoke Detector: Red (`#EF5350`)

## Interactions

- **Single click** on an entity circle → Opens the entity detail popup
- **Double click** on an entity circle → Toggles the entity on/off
- Entities that are not configured are automatically hidden
- Temperature and humidity are automatically read from configured climate entities

## Development

### Prerequisites

- Node.js 18+
- npm

### Build

```bash
npm install
npm run build
```

### Watch mode

```bash
npm run watch
```

The built file will be `room-card.js` in the project root.

## License

MIT License