/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente contenedor reutilizable, es el contenedor que contiene las tasks  │
 * y las bags.                                                                  │
 * Envuelve los elementos en una card con borde estético.                       │
 * Permite pasar clases custom vía props para ajustar el diseño.                │
 *                                                                              │
 * @author: Ana Castro                                                          │
└─────────────────────────────────────────────────────────────────────────────*/

export const Container_Card = ({ children, outerClass = "", innerClass = "" }) => {
    return (
        <div className={`w-full border border-none p-[2px] rounded-xl pl-2 ${outerClass} `}>
            <div
                className={`flex bg-bg_button flex-row justify-between ${innerClass} items-center w-full p-2 font-bold bg-bg rounded-xl min-h-[5.8rem]`}
            >
                {children}
            </div>
        </div>
    );
};
