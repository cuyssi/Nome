/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente visual reutilizable con envoltura decorativa. Es el que se utiliza│
 * en botones y tarjetas en el home.                                            │
 * Aplica borde con gradiente en el exterior y fondo negro en el interior.      │
 * Acepta clases personalizadas para adaptar diseño según contexto.             │
 *                                                                              │
 * @author: Ana Castro                                                          │
└──────────────────────────────────────────────────────────────────────────────*/

const Container = ({ children, outerClass = "", innerClass = "" }) => {
    return (
        <div className={`flex justify-center items-center p-[2px] border-dynamic rounded-2xl ${outerClass}`}>
            <div
                className={`flex bg-bg_button p-2 justify-center items-center w-full border border-none rounded-2xl ${innerClass}`}
            >
                {children}
            </div>
        </div>
    );
};

export default Container;
