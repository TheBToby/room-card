import "./room-card";
import "./room-card-editor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const windowAny = window as any;

// Register the card with Home Assistant's custom card system
windowAny.customCards = windowAny.customCards || [];
windowAny.customCards.push({
  type: "room-card",
  name: "Room Card",
  description: "A custom card that shows an overview of a room with entities like TVs, speakers, climate, lights, and smoke detectors.",
  documentationURL: "https://github.com/TheBToby/room-card",
});