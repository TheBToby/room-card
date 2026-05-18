import { html, css, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCard, RoomCardConfig, HassEntity } from "./types";

// Default colors per entity type (Material You inspired)
const TYPE_COLORS: Record<string, { active: string; inactive: string; icon: string }> = {
  tv: { active: "#7C4DFF", inactive: "#4A3A7A", icon: "mdi:television" },
  media_player: { active: "#1E88E5", inactive: "#1A3A5C", icon: "mdi:speaker" },
  climate: { active: "#FF6D00", inactive: "#5C3A1A", icon: "mdi:home-thermometer" },
  light: { active: "#FDD835", inactive: "#5C5420", icon: "mdi:lightbulb" },
  smoke_detector: { active: "#EF5350", inactive: "#5C2020", icon: "mdi:smoke-detector-variant" },
};

function getTypeKey(entityType: string): string {
  if (entityType === "tv") return "tv";
  if (entityType.startsWith("media_player")) return "media_player";
  if (entityType.startsWith("climate")) return "climate";
  if (entityType.startsWith("light")) return "light";
  if (entityType === "smoke_detector") return "smoke_detector";
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
    case "smoke_detector":
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
      background_color: "var(--card-background-color)",
      active_color: "var(--primary-color)",
      inactive_color: "var(--disabled-text-color)",
      tv_color: "#7C4DFF",
      media_player_color: "#1E88E5",
      climate_color: "#FF6D00",
      light_color: "#FDD835",
      smoke_detector_color: "#EF5350",
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

  private _getEntity(type: string): HassEntity | undefined {
    if (!this.hass || !this._config) return undefined;
    const entityId = (this._config as Record<string, unknown>)[`${type}_entity`] as string | undefined;
    if (!entityId) return undefined;
    return this.hass.states[entityId];
  }

  private _getTempInfo(): {
    current?: number;
    setpoint?: number;
    unit?: string;
  } {
    if (!this.hass || !this._config) return {};
    const c1 = (this._config as Record<string, unknown>).climate_1_entity as string | undefined;
    const c2 = (this._config as Record<string, unknown>).climate_2_entity as string | undefined;

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
    const c1 = (this._config as Record<string, unknown>).climate_1_entity as string | undefined;
    const c2 = (this._config as Record<string, unknown>).climate_2_entity as string | undefined;
    for (const entityId of [c1, c2]) {
      if (entityId && this.hass.states[entityId]?.attributes.current_humidity !== undefined) {
        return this.hass.states[entityId].attributes.current_humidity as number;
      }
    }
    return undefined;
  }

  private _fire(type: string, detail?: Record<string, unknown>): void {
    const event = new CustomEvent(type, {
      bubbles: true,
      composed: true,
      detail,
    });
    this.dispatchEvent(event);
  }

  private _handleEntityClick(ev: Event, type: string): void {
    ev.stopPropagation();
    if (!this.hass || !this._config) return;
    const entityId = (this._config as Record<string, unknown>)[`${type}_entity`] as string | undefined;
    if (!entityId) return;
    this._fire("hass-more-info", { entityId });
  }

  private async _handleEntityDblClick(ev: Event, type: string): Promise<void> {
    ev.stopPropagation();
    if (!this.hass || !this._config) return;
    const entityId = (this._config as Record<string, unknown>)[`${type}_entity`] as string | undefined;
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
    } else if (domain === "binary_sensor") {
      this._fire("hass-more-info", { entityId });
    }
  }

  private _getTypeColor(type: string): { active: string; inactive: string } {
    const typeKey = getTypeKey(type);
    const configColor = (this._config as Record<string, unknown>)[`${typeKey}_color`] as string | undefined;
    const defaults = TYPE_COLORS[typeKey] || TYPE_COLORS["light"];
    return {
      active: configColor || defaults.active,
      inactive: defaults.inactive,
    };
  }

  private _renderEntityCircle(type: string) {
    if (!this._config) return nothing;
    const entityId = (this._config as Record<string, unknown>)[`${type}_entity`] as string | undefined;
    if (!entityId) return nothing;

    const entity = this._getEntity(type);
    if (!entity) return nothing;

    const active = isActive(entity, type);
    const icon = getEntityIcon(entity, type);
    const colors = this._getTypeColor(type);
    const color = active ? colors.active : colors.inactive;

    return html`
      <div
        class="entity-circle ${active ? "active" : "inactive"}"
        style="--circle-color: ${color}"
        @click=${(e: Event) => this._handleEntityClick(e, type)}
        @dblclick=${(e: Event) => this._handleEntityDblClick(e, type)}
      >
        <ha-icon icon=${icon}></ha-icon>
      </div>
    `;
  }

  /**
   * Render a column of entity circles for the same type.
   * Entities of the same type are stacked vertically.
   */
  private _renderTypeColumn(types: string[]) {
    const configuredTypes = types.filter((type) => {
      const eid = (this._config as Record<string, unknown>)[`${type}_entity`] as string | undefined;
      return !!eid;
    });

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

    // Define entity type groups (stacked vertically)
    const typeGroups = [
      { types: ["tv"], label: "tv" },
      { types: ["media_player_1", "media_player_2"], label: "media_player" },
      { types: ["climate_1", "climate_2"], label: "climate" },
      { types: ["light_1", "light_2"], label: "light" },
      { types: ["smoke_detector"], label: "smoke_detector" },
    ];

    const hasAnyEntities = typeGroups.some((group) =>
      group.types.some((type) => !!((this._config as Record<string, unknown>)[`${type}_entity`] as string | undefined))
    );

    return html`
      <ha-card
        class="room-card"
        style="--room-bg: ${this._config.background_color}; --icon-bg: ${this._config.icon_background_color}"
      >
        <div class="card-content">
          ${this._config.title
            ? html`<div class="card-header">${this._config.title}</div>`
            : nothing}

          <div class="card-body">
            ${hasAnyEntities
              ? html`
                  <div class="entities-area">
                    ${typeGroups.map((group) => this._renderTypeColumn(group.types))}
                  </div>
                `
              : nothing}
          </div>

          <div class="bottom-bar">
            ${temperature !== undefined
              ? html`
                  <div class="sensor-value">
                    <ha-icon icon="mdi:thermometer"></ha-icon>
                    <span class="temp-current">${temperature}${unit || "°C"}</span>
                    ${setpoint !== undefined
                      ? html`<span class="temp-setpoint">/ ${setpoint}${unit || "°C"}</span>`
                      : nothing}
                  </div>
                `
              : nothing}
            ${humidity !== undefined
              ? html`
                  <div class="sensor-value">
                    <ha-icon icon="mdi:water-percent"></ha-icon>
                    <span>${humidity}%</span>
                  </div>
                `
              : nothing}
          </div>
        </div>

        <!-- Room icon circle overlapping bottom-left corner -->
        <div
          class="room-icon-circle"
          style="background: var(--icon-bg, #4A90D9)"
        >
          <ha-icon
            icon=${this._config.icon || "mdi:home-outline"}
            style="color: ${this._config.icon_color}"
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
      background: var(--room-bg, var(--card-background-color, #1c1c1e));
      border-radius: 28px;
      overflow: visible;
      position: relative;
    }

    .card-content {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .card-header {
      font-size: 18px;
      font-weight: 500;
      color: var(--primary-text-color, #fff);
      letter-spacing: 0.1px;
      padding-bottom: 0;
    }

    .card-body {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      min-height: 48px;
    }

    /* Room icon circle overlapping bottom-left corner */
    .room-icon-circle {
      position: absolute;
      bottom: -30px;
      left: -30px;
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: var(--icon-bg, #4A90D9);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      z-index: 1;
    }

    .room-icon-circle ha-icon {
      --mdi-icon-size: 36px;
      color: #ffffff;
      margin-top: 8px;
      margin-right: 8px;
    }

    /* Entities on the right */
    .entities-area {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      justify-content: flex-end;
      flex-wrap: wrap;
    }

    /* Column of same-type entities stacked vertically */
    .type-column {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
    }

    .entity-circle {
      width: 44px;
      height: 44px;
      border-radius: 22px;
      background: var(--circle-color, var(--disabled-text-color, #636366));
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                  transform 0.15s cubic-bezier(0.4, 0, 0.2, 1),
                  box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }

    .entity-circle:hover {
      transform: scale(1.06);
    }

    .entity-circle:active {
      transform: scale(0.95);
    }

    .entity-circle.active {
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15),
                  0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    .entity-circle.inactive {
      opacity: 0.5;
    }

    .entity-circle ha-icon {
      --mdi-icon-size: 22px;
      color: #fff;
      display: flex;
    }

    /* Bottom bar with temperature and humidity */
    .bottom-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
    }

    .sensor-value {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--primary-text-color, #fff);
      font-size: 14px;
      font-weight: 400;
    }

    .sensor-value ha-icon {
      --mdi-icon-size: 18px;
      color: var(--secondary-text-color, #aaa);
    }

    .temp-current {
      font-weight: 500;
    }

    .temp-setpoint {
      color: var(--secondary-text-color, #aaa);
      font-size: 13px;
    }

    .placeholder {
      padding: 24px;
      text-align: center;
      color: var(--disabled-text-color, #666);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "room-card": RoomCard;
  }
}