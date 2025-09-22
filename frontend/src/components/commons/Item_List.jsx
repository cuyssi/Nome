/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente Item_List: lista visual vertical de elementos.                    │
 * Renderiza un array de elementos con un componente renderizador personalizado.│
 * Soporta desplazamiento vertical con estilos optimizados para touch y scroll. │
 *                                                                              │
 * Props:                                                                       │
 *   • items: array de elementos a mostrar.                                     │
 *   • renderItem: función que recibe un elemento y retorna un JSX para render. │
 *   • className: clases adicionales para personalizar estilos del contenedor.  │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

export const Item_List = ({ items = [], renderItem, className = "" }) => {
    return (
        <div
            className={`
        flex flex-col gap-8 items-center
        w-full h-[90%]
        hide-scrollbar overflow-y-auto px-2 pb-[20rem]
        cursor-grab touch-pan-x touch-pan-y select-none ${className}
      `}
            style={{
                WebkitOverflowScrolling: "touch",
                touchAction: "pan-x pan-y",
            }}
        >
            {items.map((item) => renderItem(item))}
        </div>
    );
};
