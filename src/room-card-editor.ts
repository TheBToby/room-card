import { css, html, LitElement, nothing } from "lit";
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

    const newConfig = { ...this._config, ...ev.detail.value } as RoomCardConfig;
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
      return nothing;
    }

    return html`
      <div class="editor">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${[
            {
              type: "grid",
              name: "",
              flatten: true,
              schema: [
                {
                  name: "title",
                  selector: { text: {} },
                },
                {
                  name: "icon",
                  selector: { icon: {} },
                },
              ],
            },
            {
              type: "grid",
              name: "",
              flatten: true,
              schema: [
                {
                  name: "icon_color",
                  selector: { color_rgb: {} },
                },
                {
                  name: "icon_background_color",
                  selector: { color_rgb: {} },
                },
              ],
            },
          ]}
          .computeLabel=${(schema: { name?: string }) => {
            const labels: Record<string, string> = {
              title: "Title",
              icon: "Room Icon",
              icon_color: "Icon Color",
              icon_background_color: "Icon Background",
            };
            return labels[schema.name || ""] || schema.name || "";
          }}
          @value-changed=${this._valueChanged}
        ></ha-form>

        <div class="section">
          <h3>Entity Colors</h3>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${[
              {
                type: "grid",
                name: "",
                flatten: true,
                schema: [
                  { name: "tv_color", selector: { color_rgb: {} } },
                  { name: "media_player_color", selector: { color_rgb: {} } },
                ],
              },
              {
                type: "grid",
                name: "",
                flatten: true,
                schema: [
                  { name: "climate_color", selector: { color_rgb: {} } },
                  { name: "light_color", selector: { color_rgb: {} } },
                ],
              },
              {
                type: "grid",
                name: "",
                flatten: true,
                schema: [
                  { name: "smoke_detector_color", selector: { color_rgb: {} } },
                ],
              },
            ]}
            .computeLabel=${(schema: { name?: string }) => {
              const labels: Record<string, string> = {
                tv_color: "TV",
                media_player_color: "Media Player",
                climate_color: "Climate",
                light_color: "Light",
                smoke_detector_color: "Smoke Detector",
              };
              return labels[schema.name || ""] || schema.name || "";
            }}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>

        <div class="section">
          <h3>Media</h3>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${[
              {
                name: "tv_entity",
                selector: { entity: { domain: "media_player" } },
              },
              {
                name: "media_player_1_entity",
                selector: { entity: { domain: "media_player" } },
              },
              {
                name: "media_player_2_entity",
                selector: { entity: { domain: "media_player" } },
              },
            ]}
            .computeLabel=${(schema: { name?: string }) => {
              const labels: Record<string, string> = {
                tv_entity: "TV",
                media_player_1_entity: "Media Player 1",
                media_player_2_entity: "Media Player 2",
              };
              return labels[schema.name || ""] || schema.name || "";
            }}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>

        <div class="section">
          <h3>Climate</h3>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${[
              {
                name: "climate_1_entity",
                selector: { entity: { domain: "climate" } },
              },
              {
                name: "climate_2_entity",
                selector: { entity: { domain: "climate" } },
              },
            ]}
            .computeLabel=${(schema: { name?: string }) => {
              const labels: Record<string, string> = {
                climate_1_entity: "Climate 1",
                climate_2_entity: "Climate 2",
              };
              return labels[schema.name || ""] || schema.name || "";
            }}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>

        <div class="section">
          <h3>Lights</h3>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${[
              {
                name: "light_1_entity",
                selector: { entity: { domain: "light" } },
              },
              {
                name: "light_2_entity",
                selector: { entity: { domain: "light" } },
              },
            ]}
            .computeLabel=${(schema: { name?: string }) => {
              const labels: Record<string, string> = {
                light_1_entity: "Light 1",
                light_2_entity: "Light 2",
              };
              return labels[schema.name || ""] || schema.name || "";
            }}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>

        <div class="section">
          <h3>Safety</h3>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${[
              {
                name: "smoke_detector_entity",
                selector: { entity: { domain: "binary_sensor" } },
              },
            ]}
            .computeLabel=${(schema: { name?: string }) => {
              const labels: Record<string, string> = {
                smoke_detector_entity: "Smoke Detector",
              };
              return labels[schema.name || ""] || schema.name || "";
            }}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .editor {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 16px;
    }

    .section h3 {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "room-card-editor": RoomCardEditor;
  }
}