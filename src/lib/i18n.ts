// Static UI strings that never vary per event/parish — event-specific text
// lives in EventInfo.translations instead (see src/data/events.ts).

export type Language = "en" | "es";

export const uiStrings = {
  en: {
    nameLabel: "Name",
    emailLabel: "Email",
    phoneLabel: "Phone (optional)",
    defaultRsvpButton: "RSVP",
    submitting: "Submitting...",
    genericError: "Something went wrong submitting your info. Please try again.",
    getDirections: "Get Directions",
    poweredBy: "Powered by Parish Media Company",
    defaultSuccessTitle: "You’re on the list!",
    defaultSuccessBody: "We’ll see you at",
  },
  es: {
    nameLabel: "Nombre",
    emailLabel: "Correo electrónico",
    phoneLabel: "Teléfono (opcional)",
    defaultRsvpButton: "Confirmar Asistencia",
    submitting: "Enviando...",
    genericError: "Algo salió mal al enviar su información. Por favor, inténtelo de nuevo.",
    getDirections: "Cómo Llegar",
    poweredBy: "Desarrollado por Parish Media Company",
    defaultSuccessTitle: "¡Ya está en la lista!",
    defaultSuccessBody: "Nos vemos en",
  },
} as const satisfies Record<Language, Record<string, string>>;
