import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import { getActivePinia } from 'pinia';
import useNotification from './useNotification';

export default function useData() {
    // const baseUrl = `https://mart.juanespinola.dev/api/`; //prod
    const baseUrl = `http://localhost:8000/api/`; //dev
    const userStore = getActivePinia() ? useUserStore() : null;
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const { notification } = useNotification()
    // const toast = notification()
    // Configurar instancia de Axios
    const instance = axios.create({ baseURL: baseUrl });

    // Interceptor para agregar el token
    instance.interceptors.request.use(
        (config) => {
            const token = userStore?.token || null;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Función para manejar errores
    const handleError = (err) => {
        if (err.response) {
            switch (err.response.status) {
                case 400:
                    return 'Solicitud incorrecta.';
                case 401:
                    return 'No autorizado.';
                // case 409:
                //     return 'No se puede Eliminar porque cuenta con registros ';
                case 500:
                    return 'Error del servidor.';
                    
                default:
                    return 'Ocurrió un error.';
            }
        } else {
            return err.message || 'Error desconocido.';
        }
    };

    // Métodos CRUD
    const fetchAll = async (collection: string, options: any = {}) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await instance.get(collection, { ...options });
            return { success: true, data: response.data };
        } catch (err) {
            error.value = handleError(err);
            return { success: false, error: error.value };
        } finally {
            isLoading.value = false;
        }
    };

    const find = async (collection: string, id: string, options: any = {}) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await instance.get(`${collection}/${id}`, { ...options });
            return { success: true, data: response.data };
        } catch (err) {
            error.value = handleError(err);
            return { success: false, error: error.value };
        } finally {
            isLoading.value = false;
        }
    };

    const create = async (collection: string, newItem: any, options: any = {}) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await instance.post(collection, newItem, { ...options });
            return { success: true, data: response.data };
        } catch (err) {
            error.value = handleError(err);
            return { success: false, error: error.value, message: err.response.data.messages };
        } finally {
            isLoading.value = false;
        }
    };

    const update = async (collection: string, id: string, updatedItem: any, options: any = {}) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await instance.put(`${collection}/${id}`, updatedItem, { ...options });
            return { success: true, data: response.data };
        } catch (err) {
            error.value = handleError(err);
            return { success: false, error: error.value, message: err.response.data.messages };
        } finally {
            isLoading.value = false;
        }
    };

    const destroy = async (collection: string, id: string, options: any = {}) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await instance.delete(`${collection}/${id}`, { ...options });
            return { success: true, data: response.data };
        } catch (err) {
            error.value = handleError(err);
            return { success: false, error: error.value, message: err.response.data.messages };
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        error,
        fetchAll,
        find,
        create,
        update,
        destroy,
    };
}
