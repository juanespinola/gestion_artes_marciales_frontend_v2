import { ref } from 'vue';
import axios from 'axios';

export default function useData() {
    let baseUrl: string = `http://localhost:8000/api/`
    // const data = ref([]);
    // const object = ref<any>({});
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Leer (GET)
    const fetchAll = async (collection: string, options: object = {}) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axios.get(`${baseUrl}${collection}`);
            // data.value = response.data;
            return { success: true, data: response.data };
        } catch (err: any) {
            if (err.response) {
                // Manejo específico según el código de estado
                switch (err.response.status) {
                    case 400:
                        error.value = 'Solicitud incorrecta.';
                        break;
                    case 401:
                        error.value = 'No autorizado.';
                        break;
                    case 500:
                        error.value = 'Error del servidor.';
                        break;
                    default:
                        error.value = 'Ocurrió un error.';
                }
            } else {
                error.value = err.message || 'Error desconocido.';
            }
            return { success: false, error: error.value };
        } finally {
            isLoading.value = false;
        }
    };

    // Encontrar (GET por ID)
    const find = async (collection: string, id: string,  options: object = {}) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axios.get(`${baseUrl}${collection}/${id}`);
            // object.value = response.data;
            return { success: true, data: response.data };
        } catch (err: any) {
            if (err.response) {
                // Manejo específico según el código de estado
                switch (err.response.status) {
                    case 400:
                        error.value = 'Solicitud incorrecta.';
                        break;
                    case 401:
                        error.value = 'No autorizado.';
                        break;
                    case 500:
                        error.value = 'Error del servidor.';
                        break;
                    default:
                        error.value = 'Ocurrió un error.';
                }
            } else {
                error.value = err.message || 'Error desconocido.';
            }
            return { success: false, error: error.value };
        } finally {
            isLoading.value = false;
        }
    };

    // Crear (POST)
    const create = async (collection: string, newItem: any,  options: object = {}) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axios.post(`${baseUrl}${collection}`, newItem);
            // data.value.push(response.data);
            return { success: true, data: response.data };
        } catch (err: any) {
            if (err.response) {
                // Manejo específico según el código de estado
                switch (err.response.status) {
                    case 400:
                        error.value = 'Solicitud incorrecta.';
                        break;
                    case 401:
                        error.value = 'No autorizado.';
                        break;
                    case 500:
                        error.value = 'Error del servidor.';
                        break;
                    default:
                        error.value = 'Ocurrió un error.';
                }
            } else {
                error.value = err.message || 'Error desconocido.';
            }
            return { success: false, error: error.value };
        } finally {
            isLoading.value = false;
        }
    };

    // Actualizar (PUT o PATCH)
    const update = async (collection: string, id: string, updatedItem: any,  options: object = {}) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axios.patch(`${baseUrl}${collection}/${id}`, updatedItem);
            // const index = data.value.findIndex((item: any) => item.id === id);
            // if (index !== -1) {
            //     data.value[index] = response.data;
            // }
            return { success: true, data: response.data };
        } catch (err: any) {
            if (err.response) {
                // Manejo específico según el código de estado
                switch (err.response.status) {
                    case 400:
                        error.value = 'Solicitud incorrecta.';
                        break;
                    case 401:
                        error.value = 'No autorizado.';
                        break;
                    case 500:
                        error.value = 'Error del servidor.';
                        break;
                    default:
                        error.value = 'Ocurrió un error.';
                }
            } else {
                error.value = err.message || 'Error desconocido.';
            }
            return { success: false, error: error.value };
        } finally {
            isLoading.value = false;
        }
    };

    // Eliminar (DELETE)
    const destroy = async (collection: string, id: string,  options: object = {}) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axios.delete(`${baseUrl}${collection}/${id}`);
            // data.value = data.value.filter((item: any) => item.id !== id);
            return { success: true, data: response.data };
        } catch (err: any) {
            if (err.response) {
                // Manejo específico según el código de estado
                switch (err.response.status) {
                    case 400:
                        error.value = 'Solicitud incorrecta.';
                        break;
                    case 401:
                        error.value = 'No autorizado.';
                        break;
                    case 500:
                        error.value = 'Error del servidor.';
                        break;
                    default:
                        error.value = 'Ocurrió un error.';
                }
            } else {
                error.value = err.message || 'Error desconocido.';
            }
            return { success: false, error: error.value };
        } finally {
            isLoading.value = false;
        }
    };

    return {
        // data,
        // object,
        isLoading,
        error,
        fetchAll,
        create,
        update,
        destroy,
        find,
    };
}