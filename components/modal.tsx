import { useRouter } from "next/router";
import { useEffect } from "react";

export default function MyModal() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Prevent the default behavior of closing the modal
        event.preventDefault();
      }
    };

    const modal = document.getElementById("my_modal_5");
    if (modal) {
      modal.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (modal) {
        modal.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);

  return (
    <dialog id="my_modal_5" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-center">Game over</h3>
        <p className="py-4 text-center">
          Tu respuesta es incorrecta. Podes volver mañana y seguir desafiando
          tus conocimientos!
        </p>
        <div className="modal-action justify-center w-full">
          <button className="btn w-full" onClick={() => router.push("/")}>
            Salir
          </button>
        </div>
      </div>
    </dialog>
  );
}
