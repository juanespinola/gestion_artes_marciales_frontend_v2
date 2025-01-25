<script>
import { ref, onMounted, computed, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'


export default {
    components: {

    },
    props: {
        data: {
            type: Array,
            required: true
        },
        selected: {
            type: Array,
            required: false
        },
        title: {
            type: String,
            required: true
        },
        model: {
            type: String,
            required: true,
        }

    },
    setup(props) {
        // Referencias y datos reactivos
        const target = ref(null);
        const options = ref(props.data.map((data) => ({ id: data.id, name: data.name })));
        const selected = ref(props.selected ? [...props.selected.map((rol) => ({ id: rol.id, name: rol.name }))] : []);
        const show = ref(false);

        // Métodos
        const open = () => {
            show.value = true;
        };

        const isOpen = () => {
            return show.value === true;
        };

        const loadOptions = () => {
            const optionsEl = document.getElementById('multiSelect');
            if (optionsEl) {
                options.value = Array.from(optionsEl.options).map((option) => ({
                    value: option.value,
                    text: option.text,
                    selected: option.selected,
                }));
            }
        };

        const select = (index, event) => {
            if (!options.value[index]) return; // Validar índice

            if (!options.value[index].selected) {
                options.value[index].selected = true;
                selected.value.push({ id: options.value[index].id, name: options.value[index].name });
            } else {
                options.value[index].selected = false;
                selected.value = selected.value.filter((item) => item.id !== options.value[index].id);
            }
        };

        const remove = (index) => {
            const newOptions = [...options.value];
            if (selected.value.includes(index)) {
                selected.value = selected.value.filter((i) => i !== index);
                options.value = newOptions;
                props.selected.value = selected.value.filter((i) => i !== index);
            }
        };

        const selectedValues = computed(() =>
            selected.value.map((item) => item.id)
        );

        // Click fuera para cerrar el dropdown
        onClickOutside(target, () => {
            show.value = false;
        });

        // Ciclo de vida
        onMounted(() => {
            loadOptions();
        });

        watch(
            () => props.data,
            (newData) => {
                options.value = newData.map((data) => ({ id: data.id, name: data.name }));
            },
            { immediate: true }
        );

        watch(() => props.selected, (newData) => {
            selected.value = newData.map((option) => ({ id: option.id, name: option.name }))
        }, { immediate: true }); // Ejecutar en la primera renderización


        return {
            target,
            options,
            selected,
            show,
            open,
            isOpen,
            select,
            remove,
            selectedValues,
        };
    },
};
</script>

<template>
    <div class="relative z-50">
        <label class="mb-3 block text-sm font-medium text-black dark:text-white">
            {{ title }}
        </label>
        <div>
            <select class="hidden" id="multiSelect">
                <option v-for="row in options" :key="row.id" :value="row.id">{{ row.name }}</option>
            </select>

            <div class="flex flex-col items-center">
                <input name="values" type="hidden" :value="selectedValues" />
                <div class="relative z-20 inline-block w-full">
                    <div class="relative flex flex-col items-center">
                        <div @click="open" class="w-full">
                            <div
                                class="mb-2 flex rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                <div class="flex flex-auto flex-wrap gap-3">
                                    <template v-for="index in selected" :key="index">
                                        <div
                                            class="my-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray px-2.5 py-1.5 text-sm font-medium dark:border-strokedark dark:bg-white/30">
                                            <div class="max-w-full flex-initial">{{ index.name }}</div>
                                            <div class="flex flex-auto flex-row-reverse">
                                                <div @click="remove(index)"
                                                    class="cursor-pointer pl-2 hover:text-danger">
                                                    <svg class="fill-current" role="button" width="12" height="12"
                                                        viewBox="0 0 12 12" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                                            d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                                                            fill="currentColor"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </template>

                                    <div v-show="selected.length === 0" class="flex-1">
                                        <input placeholder="Select an option"
                                            class="h-full w-full appearance-none bg-transparent p-1 px-2 outline-none"
                                            :value="selectedValues" />
                                    </div>
                                </div>
                                <div class="flex w-8 items-center py-1 pl-1 pr-1">
                                    <button @click="open" type="button"
                                        class="h-6 w-6 cursor-pointer outline-none focus:outline-none"
                                        :class="isOpen() ? 'rotate-180' : ''">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <g opacity="0.8">
                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                    fill="#637381"></path>
                                            </g>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="w-full px-4">
                            <div v-show="isOpen()" ref="target"
                                class="max-h-select absolute left-0 top-full z-40 w-full overflow-y-auto rounded bg-white shadow dark:bg-form-input">
                                <div class="flex w-full flex-col">
                                    <div v-for="(option, index) in options" :key="index">
                                        <div v-if="options[index]" @click="select(index, $event)"
                                            class="w-full cursor-pointer rounded-t border-b border-stroke hover:bg-primary/5 dark:border-form-strokedark">
                                            <div :class="[
                                                'relative flex w-full items-center border-l-2 border-transparent p-2 pl-2',
                                                option.selected ? 'border-primary' : ''
                                            ]">
                                                <div class="flex w-full items-center">
                                                    <div class="mx-2 leading-6">{{ option.name }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
