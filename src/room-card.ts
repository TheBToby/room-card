import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCard, RoomCardConfig, HassEntity } from "./types";

// Hard-coded colors per entity type for active and inactive states
const TYPE_COLORS: Record<string, {
  active_bg: string;
  active_icon_color: string;
  inactive_bg: string;
  inactive_icon_color: string;
  icon: string;
}> = {
  tv: {
    active_bg: "#dfeadc",
    active_icon_color: "#688260",
    inactive_bg: "#e0e0e040",
    inactive_icon_color: "#A0A0A080",
    icon: "mdi:television",
  },
  media_player: {
    active_bg: "#e0d9f4",
    active_icon_color: "#695a99",
    inactive_bg: "#e0e0e040",
    inactive_icon_color: "#A0A0A080",
    icon: "mdi:speaker",
  },
  climate: {
    active_bg: "#e0e0e040",
    active_icon_color: "#A0A0A080",
    inactive_bg: "#e0e0e040",
    inactive_icon_color: "#A0A0A080",
    icon: "mdi:home-thermometer",
  },
  light: {
    active_bg: "#d8eaed",
    active_icon_color: "#578288",
    inactive_bg: "#e0e0e040",
    inactive_icon_color: "#A0A0A080",
    icon: "mdi:lightbulb",
  },
};


function getTypeKey(entityType: string): string {
  if (entityType === "tv") return "tv";
  if (entityType.startsWith("media_player")) return "media_player";
  if (entityType.startsWith("climate")) return "climate";
  if (entityType.startsWith("light")) return "light";
  return "light";
}

function isActive(entity: HassEntity | undefined, type: string): boolean {
  if (!entity) return false;
  const state = entity.state.toLowerCase();
  const typeKey = getTypeKey(type);
  switch (typeKey) {
    case "tv":
    case "media_player":
      return !["off", "standby", "unavailable", "unknown"].includes(state);
    case "climate":
      return state !== "off" && state !== "unavailable" && state !== "unknown";
    case "light":
      return state === "on";
    default:
      return state === "on";
  }
}

function getEntityIcon(entity: HassEntity | undefined, type: string): string {
  if (entity?.attributes.icon && typeof entity.attributes.icon === "string") {
    return entity.attributes.icon;
  }
  const typeKey = getTypeKey(type);
  return TYPE_COLORS[typeKey]?.icon || "mdi:circle";
}

/**
 * Convert a color value to a CSS string.
 * Handles hex strings and [r, g, b] arrays (from HA color_rgb selector).
 */
function colorToCSS(color: string | number[] | undefined, fallback: string): string {
  if (!color) return fallback;
  if (typeof color === "string") return color;
  if (Array.isArray(color) && color.length >= 3) {
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  }
  return fallback;
}

@customElement("room-card")
export class RoomCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: RoomCardConfig;

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement("room-card-editor");
  }

  public static getStubConfig(): Record<string, unknown> {
    return {
      title: "Living Room",
      icon: "mdi:sofa",
      icon_color: "#ffffff",
      icon_background_color: "#4A90D9",
    };
  }

  public setConfig(config: RoomCardConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this._config = { ...(RoomCard.getStubConfig() as RoomCardConfig), ...config };
  }

  public getCardSize(): number {
    return 4;
  }

  private _getConfigValue(key: string): unknown {
    if (!this._config) return undefined;
    return (this._config as Record<string, unknown>)[key];
  }

  private _getEntity(type: string): HassEntity | undefined {
    if (!this.hass || !this._config) return undefined;
    const entityId = this._getConfigValue(`${type}_entity`) as string | undefined;
    if (!entityId) return undefined;
    return this.hass.states[entityId];
  }

  private _getTempInfo(): {
    current?: number;
    setpoint?: number;
    unit?: string;
  } {
    if (!this.hass || !this._config) return {};
    const c1 = this._getConfigValue("climate_1_entity") as string | undefined;
    const c2 = this._getConfigValue("climate_2_entity") as string | undefined;

    for (const entityId of [c1, c2]) {
      if (entityId && this.hass.states[entityId]) {
        const entity = this.hass.states[entityId];
        const current = entity.attributes.current_temperature as number | undefined;
        const setpoint = (entity.attributes.temperature ?? entity.attributes.target_temp_high) as number | undefined;
        const unit = (entity.attributes.temperature_unit as string) || "°C";
        if (current !== undefined) {
          return { current, setpoint, unit };
        }
      }
    }
    return {};
  }

  private _getHumidity(): number | undefined {
    if (!this.hass || !this._config) return undefined;
    const c1 = this._getConfigValue("climate_1_entity") as string | undefined;
    const c2 = this._getConfigValue("climate_2_entity") as string | undefined;
    for (const entityId of [c1, c2]) {
      if (entityId && this.hass.states[entityId]?.attributes.current_humidity !== undefined) {
        return this.hass.states[entityId].attributes.current_humidity as number;
      }
    }
    return undefined;
  }

  private _fire(type: string, detail?: Record<string, unknown>): void {
    this.dispatchEvent(
      new CustomEvent(type, {
        bubbles: true,
        composed: true,
        detail,
      })
    );
  }

  private _handleEntityClick(ev: Event, type: string): void {
    ev.stopPropagation();
    const entityId = this._getConfigValue(`${type}_entity`) as string | undefined;
    if (!entityId) return;
    this._fire("hass-more-info", { entityId });
  }

  private async _handleEntityDblClick(ev: Event, type: string): Promise<void> {
    ev.stopPropagation();
    if (!this.hass || !this._config) return;
    const entityId = this._getConfigValue(`${type}_entity`) as string | undefined;
    if (!entityId) return;
    const domain = entityId.split(".")[0];
    const entity = this.hass.states[entityId];
    if (!entity) return;

    if (domain === "media_player") {
      const newState = entity.state === "off" ? "turn_on" : "turn_off";
      await this.hass.callService("media_player", newState, { entity_id: entityId });
    } else if (domain === "light") {
      await this.hass.callService("light", "toggle", { entity_id: entityId });
    } else if (domain === "climate") {
      await this.hass.callService("climate", entity.state === "off" ? "turn_on" : "turn_off", {
        entity_id: entityId,
      });
    }
  }


  private _renderEntityCircle(type: string) {
    if (!this._config) return nothing;
    const entityId = this._getConfigValue(`${type}_entity`) as string | undefined;
    if (!entityId) return nothing;

    const entity = this._getEntity(type);
    if (!entity) return nothing;

    const active = isActive(entity, type);
    const icon = getEntityIcon(entity, type);
    const typeKey = getTypeKey(type);
    const typeColor = TYPE_COLORS[typeKey] || TYPE_COLORS["light"];
    const bgColor = active ? typeColor.active_bg : typeColor.inactive_bg;
    const iconColor = active ? typeColor.active_icon_color : typeColor.inactive_icon_color;

    return html`
      <div
        class="entity-status ${active ? "entity-status--active" : ""}"
        style="--status-bg: ${bgColor}; --status-icon-color: ${iconColor}"
        @click=${(e: Event) => this._handleEntityClick(e, type)}
        @dblclick=${(e: Event) => this._handleEntityDblClick(e, type)}
      >
        <ha-icon icon=${icon}></ha-icon>
      </div>
    `;
  }

  /**
   * Render a column of entity circles for the same type.
   */
  private _renderTypeColumn(types: string[]) {
    const configuredTypes = types.filter(
      (type) => !!this._getConfigValue(`${type}_entity`)
    );

    if (configuredTypes.length === 0) return nothing;

    return html`
      <div class="type-column">
        ${configuredTypes.map((type) => this._renderEntityCircle(type))}
      </div>
    `;
  }

  protected render() {
    if (!this._config || !this.hass) {
      return html`<ha-card><div class="placeholder">Configure Room Card</div></ha-card>`;
    }

    const { current: temperature, setpoint, unit } = this._getTempInfo();
    const humidity = this._getHumidity();

    const iconBgColor = colorToCSS(
      this._getConfigValue("icon_background_color") as string | number[] | undefined,
      "#4A90D9"
    );
    const iconColor = colorToCSS(
      this._getConfigValue("icon_color") as string | number[] | undefined,
      "#ffffff"
    );

    // Define entity type groups (stacked vertically)
    const typeGroups = [
      { types: ["tv"] },
      { types: ["media_player_1", "media_player_2"] },
      { types: ["climate_1", "climate_2"] },
      { types: ["light_1", "light_2"] },
    ];

    const hasAnyEntities = typeGroups.some((group) =>
      group.types.some((type) => !!this._getConfigValue(`${type}_entity`))
    );

    return html`
      <ha-card class="room-card">
        <div class="room-card__content">
          <header class="room-card__header">
            <h1 class="room-card__name">${this._config.title || ""}</h1>
            <div class="room-card__temp-hum">
              ${temperature !== undefined
                ? html`
                    <span class="temp-value">
                      ${temperature}${unit || "°C"}
                      ${setpoint !== undefined
                        ? html`<span class="temp-setpoint">/ ${setpoint}${unit || "°C"}</span>`
                        : nothing}
                    </span>
                  `
                : nothing}
              ${humidity !== undefined
                ? html`
                    <span class="hum-value">
                      <ha-icon icon="mdi:water-percent"></ha-icon>
                      ${humidity}%
                    </span>
                  `
                : nothing}
            </div>
          </header>

          ${hasAnyEntities
            ? html`
                <aside class="room-card__status">
                  ${typeGroups.map((group) => this._renderTypeColumn(group.types))}
                </aside>
              `
            : nothing}
        </div>

        <!-- Room icon overlapping bottom-left corner -->
        <div
          class="room-card__icon"
          style="--icon-bg: ${iconBgColor}; --icon-color: ${iconColor}"
        >
          <ha-icon
            icon=${(this._getConfigValue("icon") as string) || "mdi:home-outline"}
          ></ha-icon>
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    ha-card.room-card {
      position: relative;
      overflow: hidden;
      border-radius: var(--ha-card-border-radius, 12px);
    }

    .room-card__content {
      padding: 16px 16px 20px;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 2;
    }

    /* Header with title and temp/humidity */
    .room-card__header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 12px;
    }

    .room-card__name {
      font-size: 20px;
      font-weight: 300;
      margin: 0;
      color: var(--primary-text-color);
    }

    .room-card__temp-hum {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }

    .temp-value {
      font-size: 20px;
      font-weight: 400;
      color: var(--primary-text-color);
    }

    .temp-setpoint {
      font-size: 14px;
      font-weight: 300;
      color: var(--secondary-text-color);
    }

    .hum-value {
      font-size: 14px;
      font-weight: 300;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .hum-value ha-icon {
      --mdi-icon-size: 16px;
    }

    /* Entity status area - right side, with margin for icon */
    .room-card__status {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      align-items: flex-end;
      gap: 10px;
      margin-left: 80px;
      padding-top: 16px;
      min-height: 50px;
    }

    /* Column of same-type entities stacked vertically */
    .type-column {
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: center;
    }

    /* Entity status circle - matches reference EntityTypeStatus pattern */
    .entity-status {
      width: 38px;
      height: 38px;
      border-radius: 9999px;
      background-color: var(--status-bg, var(--disabled-text-color));
      border: 2px solid var(--status-icon-color, var(--secondary-text-color));
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.3;
      cursor: pointer;
      transition: opacity 0.25s ease, transform 0.15s ease;
      box-sizing: border-box;
    }

    .entity-status--active {
      opacity: 1;
    }

    .entity-status:hover {
      opacity: 0.8;
    }

    .entity-status:active {
      transform: scale(0.92);
    }

    .entity-status ha-icon {
      --mdi-icon-size: 20px;
      color: var(--status-icon-color, var(--secondary-text-color));
    }

    /* Room icon - large circle at bottom-left, overlapping card corner */
    .room-card__icon {
      position: absolute;
      left: -15px;
      bottom: -15px;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: var(--icon-bg, #4A90D9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
      pointer-events: none;
    }

    .room-card__icon ha-icon {
      --mdi-icon-size: 57px;
      color: var(--icon-color, #ffffff);
      margin-top: 6px;
      margin-right: 6px;
    }

    .placeholder {
      padding: 24px;
      text-align: center;
      color: var(--disabled-text-color);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "room-card": RoomCard;
  }
}