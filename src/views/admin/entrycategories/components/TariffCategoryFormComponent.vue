<script>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import useData from '@/composables/useData';

export default {
    props: {
        eventid: {
            required: true,
        },
        id: {
            required: true,
        }
    },
    setup(props) {
        const collection = `tariffinscription/${props.id}`;
        const router = useRouter();
        const { isLoading, error, fetchAll, update } = useData();
        const obj = ref({
            // entry_category_id: '',
            price: ''
        })

        const fetchData = async () => {
            const response = await fetchAll(`${collection}`)
            if (response.success) {
                obj.value.price = response.data.price
            }

        };

        const saveData = async () => {
            try {
                await update('tariffinscription', props.id, obj.value);
                console.log('Producto actualizado:', obj.value);
                router.go(-1); // Redirige a la lista después de guardar
            } catch (err) {
                console.error('Error al guardar el registro:', err.message);
            }
        };


        onMounted(async () => {
            await fetchData()
        })

        return {
            obj,
            saveData
        }
    }
}

</script>

<template>

    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">Cargar Precio a la Categoria</h3>
        </div>
        <div class="p-7">
            <form @submit.prevent="saveData">
                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                            for="price">Precio</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="number" name="price" id="price" v-model="obj.price">
                    </div>

                </div>

                <div class="flex justify-end gap-4.5">
                    <button
                        class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                        type="button" @click="$router.go(-1)"> Cancel </button>
                    <button
                        class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                        type="submit"> Save </button>
                </div>
            </form>
        </div>
    </div>

</template>