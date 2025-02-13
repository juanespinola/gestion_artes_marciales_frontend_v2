      
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";


export default function useNotification() {

    const notification = (message, type = "success") => {
        return toast(message, {
          theme: "dark",
          type: type,  // Cambia el tipo de notificación
          position: "bottom-right",
          transition: "flip",
          dangerouslyHTMLString: true,
          autoClose: 5000, // Se mantiene visible por 5s
        });
      };


    return {
        notification
    }

}