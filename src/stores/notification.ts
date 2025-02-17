import { ref } from 'vue'
import { defineStore } from "pinia";
import { useToast } from 'primevue/usetoast';

export const useNotificationStore = defineStore({
    id: "notification",
    state: () => ({
        toast: useToast(),
    }),
    actions: {
        success(title, message) {
            this.toast.add({
                severity: "success",
                summary: title ?? "Correcto!",
                detail: message,
                life: 5000,
            });
        },
        info(title, message) {
            this.toast.add({
                severity: "info",
                summary: title ?? "Información",
                detail: message,
                life: 5000,
            });
        },
        warn(title, message) {
            this.toast.add({
                severity: "warn",
                summary: title ?? "Atención!",
                detail: message,
                life: 5000,
            });
        },
        error(title, message) {
            this.toast.add({
                severity: "error",
                summary: title ?? "Error!",
                detail: message,
                life: 5000,
            });
        },
        // success(message) {
        //     toast(message, {
        //         theme: "dark",
        //         type: "success",
        //         position: "bottom-right",
        //         transition: "flip",
        //         dangerouslyHTMLString: true,
        //         autoClose: 5000, // Se mantiene visible por 5s
        //     });
        // },
        // info(message) {
        //     toast(message, {
        //         type: "info",
        //         position: "bottom-right",
        //         transition: "flip",
        //         dangerouslyHTMLString: true,
        //         autoClose: 5000, // Se mantiene visible por 5s
        //     });
        // },
        // warn(message) {
        //     toast(message, {
        //         type: "warn",
        //         position: "bottom-right",
        //         transition: "flip",
        //         dangerouslyHTMLString: true,
        //         autoClose: 5000, // Se mantiene visible por 5s
        //     });
        // },
        // error(message) {
        //     toast(message, {
        //         type: "error",
        //         position: "bottom-right",
        //         transition: "flip",
        //         dangerouslyHTMLString: true,
        //         autoClose: 5000, // Se mantiene visible por 5s
        //     });
        // },
    },
});
