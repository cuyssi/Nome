/**───────────────────────────────────────────────────────────────────────────────────┐
 * Componente SwipeAction: acción visual para gestos de deslizamiento.                │
 *                                                                                    │
 * Props:                                                                             │
 *   - icon → componente de ícono (ej. HeroIcon o SVG personalizado)                  │
 *   - label → texto descriptivo de la acción                                         │
 *                                                                                    │
 * Estilo:                                                                            │
 *   - Ícono y texto en blanco, tamaño fijo para el ícono (w-8 h-8)                   │
 *   - Pensado para usarse dentro de gestos tipo swipe (ej. eliminar, editar)         │
 *                                                                                    │
 * Autor: Ana Castro                                                                  │
└────────────────────────────────────────────────────────────────────────────────────*/

export const SwipeAction = ({ icon: Icon, label }) => (
    <>
        <Icon className="text-white w-8 h-8" />
        <p className="text-white">{label}</p>
    </>
);
