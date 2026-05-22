// Home Assistant type declarations for custom card development

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>
  ): Promise<unknown>;
  connection: {
    subscribeMessage(
      callback: (message: unknown) => void,
      message: Record<string, unknown>
    ): Promise<() => void>;
  };
  panels: Record<string, unknown>;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
  context: {
    id: string;
    parent_id: string | null;
    user_id: string | null;
  };
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

export interface RoomCardConfig extends LovelaceCardConfig {
  type: string;
  title?: string;
  area?: string;
  icon?: string;
  icon_color?: string;
  icon_background_color?: string;
  tv_entity?: string;
  media_player_1_entity?: string;
  media_player_2_entity?: string;
  climate_1_entity?: string;
  climate_2_entity?: string;
  light_1_entity?: string;
  light_2_entity?: string;
}

export interface LovelaceCardEditor extends HTMLElement {
  setConfig(config: RoomCardConfig): void;
  hass?: HomeAssistant;
}

export interface LovelaceCard extends HTMLElement {
  setConfig(config: RoomCardConfig): void;
  hass?: HomeAssistant;
  getCardSize(): number;
}