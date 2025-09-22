/**───────────────────────────────────────────────────────────────────────────────────┐
 * Componente SwipeAction: acción visual para gestos de deslizamiento.                │
 *                                                                                    │
 * Props:                                                                             │
 *   - icon → componente de ícono (ej. HeroIcon o SVG personalizado)                  │
 *   - label → texto descriptivo de la acción                                         │
 *                                                                                    │
 * Autor: Ana Castro                                                                  │
└────────────────────────────────────────────────────────────────────────────────────*/

export const SwipeAction = ({ icon: Icon, label }) => (
    <>
        <Icon className="text-white w-8 h-8" />
        <p className="text-white">{label}</p>
    </>
);
