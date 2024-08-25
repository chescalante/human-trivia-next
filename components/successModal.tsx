import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SuccessModal({ callback }: { callback: any }) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Prevent the default behavior of closing the modal
        event.preventDefault();
      }
    };

    const modal = document.getElementById("my_modal_success");
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
    <dialog id="my_modal_success" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-center">Muy bien!</h3>
        <p className="py-4 text-center">Seguí jugando</p>
        <div className="modal-action justify-center w-full">
          <button className="btn w-full" onClick={() => callback()}>
            Continuar
          </button>
        </div>
      </div>
    </dialog>
  );
}
