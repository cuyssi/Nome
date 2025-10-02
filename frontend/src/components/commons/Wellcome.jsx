/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente de bienvenida con acceso visual a tareas y calendario.            │
 * Muestra el logo principal, contador de tareas y enlaces destacados.          │
 * Utiliza contenedores estilizados para navegar entre secciones clave.         │ *                                                                              │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import logo_nome from "../../assets/logo_nome.png";
import { NotificationToggle } from "../notifications/NotificationToggle";

const Welcome = () => {
    return (
        <div className="flex w-full h-auto justify-center items-center mt-4 mb-4">
            <div className="flex flex-col w-full justify-center items-center px-4">
                <NotificationToggle />
                <img src={logo_nome} className="w-[90%] mt-10" />
            </div>
        </div>
    );
};

export default Welcome;
