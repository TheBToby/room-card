import { html, css, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCardEditor, RoomCardConfig } from "./types";

@customElement("room-card-editor")
export class RoomCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: RoomCardConfig;

  public setConfig(config: RoomCardConfig): void {
    this._config = { ...config };
  }

  private _valueChanged(ev: CustomEvent): void {
    if (!this._config || !this.hass) return;

    const target = ev.target as HTMLElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getValue = (el: any) => {
      if (el.tagName === "HA-ENTITY-PICKER") {
        return el.value;
      }
      return el.value;
    };

    const value = getValue(target);
    const name = (target as HTMLElement & { name?: string }).name;

    if (!name) return;

    const newConfig = { ...this._config };
    if (value === "" || value === undefined) {
      delete (newConfig as Record<string, unknown>)[name];
    } else {
      (newConfig as Record<string, unknown>)[name] = value;
    }

    this._config = newConfig;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }

  protected render() {
    if (!this._config || !this.hass) {
      return html`<div class="editor-placeholder">Loading...</div>`;
    }

    const entityFields = [
      { key: "tv_entity", label: "TV Entity", domain: "media_player" },
      { key: "media_player_1_entity", label: "Sonos / Media Player 1", domain: "media_player" },
      { key: "media_player_2_entity", label: "Sonos / Media Player 2", domain: "media_player" },
      { key: "climate_1_entity", label: "Climate 1 Entity", domain: "climate" },
      { key: "climate_2_entity", label: "Climate 2 Entity", domain: "climate" },
      { key: "light_1_entity", label: "Light 1 Entity", domain: "light" },
      { key: "light_2_entity", label: "Light 2 Entity", domain: "light" },
      { key: "smoke_detector_entity", label: "Smoke Detector Entity", domain: "binary_sensor" },
    ];

    return html`
      <div class="editor">
        <div class="section">
          <div class="section-title">General</div>
          ${this._renderTextField("title", "Title", this._config.title || "")}
          ${this._renderTextField("icon", "Room Icon (e.g. mdi:sofa)", this._config.icon || "")}
          ${this._renderColorField("icon_color", "Icon Color", this._config.icon_color || "var(--state-icon-color)")}
          ${this._renderColorField("background_color", "Background Color", this._config.background_color || "var(--card-background-color)")}
        </div>

        <div class="section">
          <div class="section-title">Entity Colors</div>
          ${this._renderColorField("tv_color", "TV Color", this._config.tv_color || "#7C4DFF")}
          ${this._renderColorField("media_player_color", "Media Player Color", this._config.media_player_color || "#1E88E5")}
          ${this._renderColorField("climate_color", "Climate Color", this._config.climate_color || "#FF6D00")}
          ${this._renderColorField("light_color", "Light Color", this._config.light_color || "#FDD835")}
          ${this._renderColorField("smoke_detector_color", "Smoke Detector Color", this._config.smoke_detector_color || "#EF5350")}
        </div>

        <div class="section">
          <div class="section-title">Media</div>
          ${entityFields
            .filter((e) => ["tv_entity", "media_player_1_entity", "media_player_2_entity"].includes(e.key))
            .map((e) => this._renderEntityPicker(e.key, e.label, e.domain))}
        </div>

        <div class="section">
          <div class="section-title">Climate</div>
          ${entityFields
            .filter((e) => e.key.startsWith("climate"))
            .map((e) => this._renderEntityPicker(e.key, e.label, e.domain))}
        </div>

        <div class="section">
          <div class="section-title">Lights</div>
          ${entityFields
            .filter((e) => e.key.startsWith("light"))
            .map((e) => this._renderEntityPicker(e.key, e.label, e.domain))}
        </div>

        <div class="section">
          <div class="section-title">Safety</div>
          ${entityFields
            .filter((e) => e.key.startsWith("smoke"))
            .map((e) => this._renderEntityPicker(e.key, e.label, e.domain))}
        </div>
      </div>
    `;
  }

  private _renderTextField(name: string, label: string, value: string) {
    return html`
      <ha-textfield
        .name=${name}
        .label=${label}
        .value=${value}
        @change=${this._valueChanged}
        outlined
        class="field"
      ></ha-textfield>
    `;
  }

  private _renderColorField(name: string, label: string, value: string) {
    // Only show color picker for hex values
    const isHex = value.startsWith("#");
    return html`
      <div class="color-field">
        <ha-textfield
          .name=${name}
          .label=${label}
          .value=${value}
          @change=${this._valueChanged}
          outlined
          class="field"
        ></ha-textfield>
        ${isHex
          ? html`
              <input
                type="color"
                .name=${name}
                .value=${value}
                @input=${this._valueChanged}
                class="color-picker"
              />
            `
          : nothing}
      </div>
    `;
  }

  private _renderEntityPicker(name: string, label: string, domain: string) {
    const value = (this._config as Record<string, unknown>)[name] as string | undefined;

    return html`
      <ha-entity-picker
        .hass=${this.hass}
        .name=${name}
        .value=${value || ""}
        .label=${label}
        .includeDomains=${[domain]}
        @value-changed=${this._valueChanged}
        allow-custom-entity
        outlined
        class="field"
      ></ha-entity-picker>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .editor {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
      padding-bottom: 4px;
      border-bottom: 1px solid var(--divider-color);
      margin-bottom: 4px;
    }

    .field {
      width: 100%;
    }

    .color-field {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .color-field .field {
      flex: 1;
    }

    .color-picker {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      padding: 2px;
      background: transparent;
    }

    .editor-placeholder {
      padding: 20px;
      text-align: center;
      color: var(--disabled-text-color);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "room-card-editor": RoomCardEditor;
  }
}