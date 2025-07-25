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
import Task_count from "../task/Task_count";
import Container from "./Container";

const Welcome = () => {
    return (
        <div>
            <div className="flex flex-col items-center text-center mt-8">
                <img src={logo_nome} className="w-[100%]" />

                <div className="flex flex-col gap-4 w-full mt-12 justify-center items-center ">
                    <Task_count className="h-20" />
                    <div className="flex justify-between w-[100%] gap-4 p-2">
                        <Container outerClass="w-[50%]">
                            <Link to="./tasks" className="flex  gap-2 justify-center items-center p-2">
                                <NotebookPen className="w-6 text-white border border-black" />
                                <p className="text-white font font-poppins">Deberes</p>
                            </Link>
                        </Container>
                        <Container outerClass="w-[50%]">
                            <Link to="./tasks" className="flex  gap-2 justify-center items-center p-2">
                                <CalendarDays className="w-6 text-white border border-black" />
                                <p className="text-white font font-poppins">Calendario</p>
                            </Link>
                        </Container>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
