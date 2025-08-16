/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente de bienvenida con acceso visual a tareas y calendario.            │
 * Muestra el logo principal, contador de tareas y enlaces destacados.          │
 * Utiliza contenedores estilizados para navegar entre secciones clave.         │ *                                                                              │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import { Link } from "react-router-dom";
import { NotebookPen, CalendarDays } from "lucide-react";
import logo_nome from "../../assets/logo_nome.png";
import Container from "./Container";

const Welcome = () => {
    return (
        <div className="flex flex-col w-full justify-center items-center px-4">
            <img src={logo_nome} className="w-[100%] mt-6 mb-4" />

            <div className="flex flex-col w-full mt-8">
                <div className="flex w-full justify-between">
                    <div className="w-full pr-2 ">
                        <Container className="w-[100%] py-3">
                            <Link to="./tasks" className="flex justify-center items-center gap-1 py-2">
                                <NotebookPen className="w-6 text-white" />
                                <p className="text-white font-poppins">Deberes</p>
                            </Link>
                        </Container>
                    </div>

                    <div className="w-full pl-2">
                        <Container className="w-[100%] py-3">
                            <Link to="./tasks" className="flex justify-center items-center gap-1 py-2">
                                <CalendarDays className="w-6 text-white" />
                                <p className="text-white font-poppins">Calendario</p>
                            </Link>
                        </Container>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
