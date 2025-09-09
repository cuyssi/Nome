import { Button } from "./Button";

export function Timer({ hour, minute, onChange }) {
    return (
        <div className="flex justify-cneter gap-6 px-4 items-center mt-2">
           <div className="flex flex-col">
                <p className=" font-poppins  text-blue-600 font-semibold">Hora:</p>
                <div className="flex items-center border border-blue-400 rounded">
                    <Button
                        type="button"
                        onClick={() => onChange("hour", String((+hour + 23) % 24).padStart(2, "0"))}
                        className="px-1 text-blue-900 bg-gray-200 hover:bg-gray-400"
                    >
                        –
                    </Button>
                    <input
                        type="tel"
                        name="hour"
                        value={hour}
                        onChange={(e) => {
                            let val = Math.max(0, Math.min(23, Number(e.target.value)));
                            onChange("hour", String(val).padStart(2, "0"));
                        }}
                        className="text-center w-12 border-x border-blue-400 rounded font-normal"
                    />
                    <Button
                        type="button"
                        onClick={() => onChange("hour", String((+hour + 1) % 24).padStart(2, "0"))}
                        className="px-1 text-blue-900 bg-gray-200 hover:bg-gray-400"
                    >
                        +
                    </Button>
                </div>
            </div>

            <div className="flex flex-col">
                <p className=" font-poppins text-blue-600 font-semibold">Minutos:</p>
                <div className="flex items-center justify-center border border-blue-400 rounded">
                    <Button
                        type="button"
                        onClick={() => onChange("minute", String((+minute + 59) % 60).padStart(2, "0"))}
                        className="px-1 text-blue-900 bg-gray-200 hover:bg-gray-400"
                    >
                        –
                    </Button>
                    <input
                        type="tel"
                        name="minute"
                        value={minute}
                        onChange={(e) => {
                            let val = Math.max(0, Math.min(59, Number(e.target.value)));
                            onChange("minute", String(val).padStart(2, "0"));
                        }}
                        className="text-center w-12 border-x border-blue-400 rounded font-normal"
                    />
                    <Button
                        type="button"
                        onClick={() => onChange("minute", String((+minute + 1) % 60).padStart(2, "0"))}
                        className="px-1 text-blue-900 bg-gray-200 hover:bg-gray-400"
                    >
                        +
                    </Button>
                </div>
            </div>
        </div>
    );
}
