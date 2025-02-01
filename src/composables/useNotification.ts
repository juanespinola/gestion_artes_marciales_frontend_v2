      
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";


export default function useNotification() {

    const notification = () => {

        return toast("Hello! Wow so easy!", {
            "theme": "dark",
            "type": "success",
            "position": "bottom-right",
            "transition": "flip",
            "dangerouslyHTMLString": true
          })
    }



    return {
        notification
    }

}