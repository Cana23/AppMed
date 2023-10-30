import { PlusIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-primary p-4 flex flex-row justify-between py-4">
      <div className="text-white pl-2">
        <Link to="/">
        <h1 className="font-montserrat font-bold text-2xl hover:text-slate-300">Medicamentos</h1>
        </Link>
      </div>
      <div className="px-4 flex flex-row">
        <div className="px-4 flex flex-row">
          <div>
            <Link to="/registro">
            <button className="bg-other hover:bg-purple-400 border rounded-2xl py-1 px-2 font-montserrat flex flex-row font-bold">
              <PlusIcon className="text-slate-800 h-5 w-5" />
              <p className="font-montserrat font-bold px-2">
                Añadir medicamento
              </p>
            </button>
            </Link>
          </div>
        </div>
        <div>
          <button className="bg-other hover:bg-purple-400 border rounded-2xl py-1 px-4 font-montserrat font-bold">
            Iniciar Sesion
          </button>
        </div>
      </div>
    </header>
  );
}
