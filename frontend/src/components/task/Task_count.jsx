/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente visual que muestra el resumen de tareas por estado.               │
 * Indica cuántas están completas, pendientes o programadas para hoy.           │
 * Usa contenedores estilizados y gradientes para facilitar lectura rápida.     │
 * Ideal para incluir en la portada principal como vista general de progreso.   │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import Container from "../commons/Container";
import { Link } from "react-router-dom";

const Task_count = () => {
    return (
        <div className="flex w-full justify-center items-center p-2">
            <Container innerClass="justify-between p-5" outerClass="w-[100%]">
                <Link className="flex flex-col gap-2 no-underline items-center">
                    <p to="./completed" className="text-yellow-200 font-extrabold drop-shadow-[0_0_1px_black] text-2xl">
                        3
                    </p>
                    <p className="text-white font-poppins text-xs">Completas</p>
                </Link>
                <Link className="flex flex-col gap-2 no-underline items-center">
                    <p
                        to="./pending"
                        className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-purple-600 drop-shadow-[0_0_1px_black] font-extrabold text-2xl"
                    >
                        2
                    </p>
                    <p className="text-white font-poppins text-xs">Pendientes</p>
                </Link>
                <Link className="flex flex-col gap-2 no-underline items-center">
                    <p to="./today" className="text-purple-400 font-extrabold drop-shadow-[0_0_1px_black] text-2xl">
                        5
                    </p>
                    <p className="text-white font-poppins text-xs">Para hoy</p>
                </Link>
            </Container>
        </div>
    );
};

export default Task_count;
