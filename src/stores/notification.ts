import { defineStore } from "pinia";
import { useToast } from 'primevue/usetoast';

export const useNotificationStore = defineStore('notification', () => {

    const toast = useToast();

    const success = (title, message) => {
        toast.add({
            severity: "success",
            summary: title ?? "Correcto!",
            detail: message,
            life: 5000,
        });
    };

    const info = (title, message) => {
        toast.add({
            severity: "info",
            summary: title ?? "Información",
            detail: message,
            life: 5000,
        });
    };

    const warn = (title, message) => {
        toast.add({
            severity: "warn",
            summary: title ?? "Atención!",
            detail: message,
            life: 5000,
        });
    };

    const error = (title, message) => {
        console.error("Notificacion de Error")
        toast.add({
            severity: "error",
            summary: title ?? "Error!",
            detail: message,
            life: 5000,
        });
    };

    return { success, info, warn, error };
});
