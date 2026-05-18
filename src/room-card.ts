import { html, css, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCard, RoomCardConfig, HassEntity } from "./types";

// Icon defaults for each entity type
const ENTITY_DEFAULTS: Record<string, { icon: string; domain: string }> = {
  tv: { icon: "mdi:television", domain: "media_player" },
  media_player_1: { icon: "mdi:speaker", domain: "media_player" },
  media_player_2: { icon: "mdi:speaker", domain: "media_player" },
  climate_1: { icon: "mdi:thermostat", domain: "climate" },
  climate_2: { icon: "mdi:thermostat", domain: "climate" },
  light_1: { icon: "mdi:lightbulb", domain: "light" },
  light_2: { icon: "mdi:lightbulb", domain: "light" },
  smoke_detector: { icon: "mdi:smoke-detector", domain: "binary_sensor" },
};

function isActive(entity: HassEntity | undefined, type: string): boolean {
  if (!entity) return false;
  const state = entity.state.toLowerCase();
  switch (type) {
    case "tv":
    case "media_player_1":
    case "media_player_2":
      return !["off", "standby", "idle", "unavailable", "unknown"].includes(state);
    case "climate_1":
    case "climate_2":
      return state !== "off" && state !== "unavailable" && state !== "unknown";
    case "light_1":
    case "light_2":
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
  return ENTITY_DEFAULTS[type]?.icon || "mdi:circle";
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
      icon_color: "#4A90D9",
      background_color: "#1C1C1E",
      active_color: "#4CD964",
      inactive_color: "#636366",
    };
  }

  public setConfig(config: RoomCardConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this._config = { ...RoomCard.getStubConfig(), ...config };
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

  private _getTempEntity(): HassEntity | undefined {
    if (!this.hass || !this._config) return undefined;
    const c1 = (this._config as Record<string, unknown>).climate_1_entity as string | undefined;
    const c2 = (this._config as Record<string, unknown>).climate_2_entity as string | undefined;
    if (c1 && this.hass.states[c1]?.attributes.current_temperature !== undefined) {
      return this.hass.states[c1];
    }
    if (c2 && this.hass.states[c2]?.attributes.current_temperature !== undefined) {
      return this.hass.states[c2];
    }
    return undefined;
  }

  private _getHumidityEntity(): HassEntity | undefined {
    if (!this.hass || !this._config) return undefined;
    const c1 = (this._config as Record<string, unknown>).climate_1_entity as string | undefined;
    const c2 = (this._config as Record<string, unknown>).climate_2_entity as string | undefined;
    if (c1 && this.hass.states[c1]?.attributes.current_humidity !== undefined) {
      return this.hass.states[c1];
    }
    if (c2 && this.hass.states[c2]?.attributes.current_humidity !== undefined) {
      return this.hass.states[c2];
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

  private _renderEntityCircle(type: string) {
    if (!this._config) return nothing;
    const entityId = (this._config as Record<string, unknown>)[`${type}_entity`] as string | undefined;
    if (!entityId) return nothing;

    const entity = this._getEntity(type);
    if (!entity) return nothing;

    const active = isActive(entity, type);
    const icon = getEntityIcon(entity, type);
    const color = active ? this._config.active_color : this._config.inactive_color;

    return html`
      <div
        class="entity-circle ${active ? "active" : "inactive"}"
        style="--circle-color: ${color}"
        @click=${(e: Event) => this._handleEntityClick(e, type)}
        @dblclick=${(e: Event) => this._handleEntityDblClick(e, type)}
      >
        <ha-icon icon=${icon} style="color: ${active ? "#fff" : "#aaa"}"></ha-icon>
      </div>
    `;
  }

  protected render() {
    if (!this._config || !this.hass) {
      return html`<ha-card><div class="placeholder">Configure Room Card</div></ha-card>`;
    }

    const tempEntity = this._getTempEntity();
    const humidityEntity = this._getHumidityEntity();

    const temperature = tempEntity?.attributes.current_temperature;
    const humidity = humidityEntity?.attributes.current_humidity;

    // Collect top row entities (TV, media players) and bottom row entities (climates, lights, smoke)
    const topRowEntities = ["tv", "media_player_1", "media_player_2"].filter((type) => {
      const eid = (this._config as Record<string, unknown>)[`${type}_entity`] as string | undefined;
      return !!eid;
    });

    const bottomRowEntities = ["climate_1", "climate_2", "light_1", "light_2", "smoke_detector"].filter((type) => {
      const eid = (this._config as Record<string, unknown>)[`${type}_entity`] as string | undefined;
      return !!eid;
    });

    return html`
      <ha-card
        class="room-card"
        style="--room-bg: ${this._config.background_color}; --icon-color: ${this._config.icon_color}"
      >
        ${this._config.title
          ? html`<div class="card-header">${this._config.title}</div>`
          : nothing}
        <div class="card-body">
          <div class="entities-grid">
            <div class="entity-row">
              ${topRowEntities.map((type) => this._renderEntityCircle(type))}
            </div>
            <div class="entity-row">
              ${bottomRowEntities.map((type) => this._renderEntityCircle(type))}
            </div>
          </div>
          <div class="bottom-bar">
            ${temperature !== undefined
              ? html`
                  <div class="sensor-value">
                    <ha-icon icon="mdi:thermometer"></ha-icon>
                    <span>${temperature}${tempEntity?.attributes.temperature_unit || "°C"}</span>
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
            ${temperature === undefined && humidity === undefined
              ? html`<div class="sensor-value placeholder-text">--</div>`
              : nothing}
          </div>
          <div class="room-icon-container">
            <ha-icon
              icon=${this._config.icon || "mdi:home-outline"}
              style="color: ${this._config.icon_color}"
            ></ha-icon>
          </div>
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    ha-card.room-card {
      background: var(--room-bg, #1c1c1e);
      border-radius: 16px;
      overflow: hidden;
      position: relative;
    }

    .card-header {
      padding: 16px 16px 8px;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary-color, #fff);
      letter-spacing: 0.3px;
    }

    .card-body {
      padding: 8px 16px 12px;
      position: relative;
    }

    .entities-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .entity-row {
      display: flex;
      gap: 10px;
      justify-content: flex-start;
      flex-wrap: wrap;
    }

    .entity-circle {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--circle-color, #636366);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.15s ease, box-shadow 0.3s ease;
      position: relative;
    }

    .entity-circle:hover {
      transform: scale(1.08);
    }

    .entity-circle.active {
      box-shadow: 0 0 8px 2px rgba(76, 217, 100, 0.3);
    }

    .entity-circle.inactive {
      opacity: 0.6;
    }

    .entity-circle ha-icon {
      --mdi-icon-size: 22px;
      display: flex;
    }

    .bottom-bar {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .sensor-value {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--text-primary-color, #fff);
      font-size: 13px;
      font-weight: 500;
    }

    .sensor-value ha-icon {
      --mdi-icon-size: 16px;
      color: var(--secondary-text-color, #aaa);
    }

    .placeholder-text {
      color: var(--disabled-text-color, #666);
    }

    .room-icon-container {
      position: absolute;
      bottom: 8px;
      left: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .room-icon-container ha-icon {
      --mdi-icon-size: 24px;
    }

    .placeholder {
      padding: 20px;
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