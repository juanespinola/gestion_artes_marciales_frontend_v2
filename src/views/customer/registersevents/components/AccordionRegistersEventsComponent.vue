<script>
export default {
    props: {
        title: String,
        content: String,
        isOpen: Boolean,
    },
}
</script>

<template>
    <div class="rounded-md border border-stroke p-4 shadow-9 dark:border-strokedark dark:shadow-none sm:p-6">
        <button @click="$emit('toggle')" class="flex w-full items-center gap-1.5 sm:gap-3 xl:gap-6">
            <div
                class="flex h-10.5 w-full max-w-10.5 items-center justify-center rounded-md bg-[#F3F5FC] dark:bg-meta-4">
                <svg :class="{ 'rotate-180': isOpen }"
                    class="duration-200 ease-in-out fill-primary stroke-primary dark:fill-white dark:stroke-white"
                    width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M8.28882 8.43257L8.28874 8.43265L8.29692 8.43985C8.62771 8.73124 9.02659 8.86001 9.41667 8.86001C9.83287 8.86001 10.2257 8.69083 10.5364 8.41713L10.5365 8.41721L10.5438 8.41052L16.765 2.70784L16.771 2.70231L16.7769 2.69659C17.1001 2.38028 17.2005 1.80579 16.8001 1.41393C16.4822 1.1028 15.9186 1.00854 15.5268 1.38489L9.41667 7.00806L3.3019 1.38063L3.29346 1.37286L3.28467 1.36548C2.93287 1.07036 2.38665 1.06804 2.03324 1.41393L2.0195 1.42738L2.00683 1.44184C1.69882 1.79355 1.69773 2.34549 2.05646 2.69659L2.06195 2.70196L2.0676 2.70717L8.28882 8.43257Z"
                        fill="" stroke=""></path>
                </svg>
            </div>
            <div>
                <h4 class="text-left text-title-xsm font-medium text-black dark:text-white">
                    Cinturón: {{ title }}
                </h4>
            </div>
        </button>
        <div v-show="isOpen" class="mt-5 ml-16.5 duration-200 ease-in-out">
            <div>
                <h5 class="mb-4 text-lg font-medium text-black dark:text-white">Categoría</h5>
                <div class="flex flex-col gap-2" >
                    <label :for="`taskCheckbox_${index}`" class="cursor-pointer" v-for="(entrycategory,index) of content" :key="index" >
                        <div class="relative flex items-center pt-0.5" @click="$emit('selectEntryCategory', entrycategory)">
                            <input :id="`taskCheckbox_${index}`" type="checkbox" class="taskCheckbox sr-only">
                            <div
                                class="box mr-3 flex h-5 w-5 items-center justify-center rounded border border-stroke dark:border-strokedark dark:bg-boxdark-2">
                                <span class="text-white opacity-0"><svg class="fill-current" width="10" height="7"
                                        viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M9.70685 0.292804C9.89455 0.480344 10 0.734667 10 0.999847C10 1.26503 9.89455 1.51935 9.70685 1.70689L4.70059 6.7072C4.51283 6.89468 4.2582 7 3.9927 7C3.72721 7 3.47258 6.89468 3.28482 6.7072L0.281063 3.70701C0.0986771 3.5184 -0.00224342 3.26578 3.785e-05 3.00357C0.00231912 2.74136 0.10762 2.49053 0.29326 2.30511C0.4789 2.11969 0.730026 2.01451 0.992551 2.01224C1.25508 2.00996 1.50799 2.11076 1.69683 2.29293L3.9927 4.58607L8.29108 0.292804C8.47884 0.105322 8.73347 0 8.99896 0C9.26446 0 9.51908 0.105322 9.70685 0.292804Z"
                                            fill=""></path>
                                    </svg>
                                </span>
                            </div>
                            <p>{{ entrycategory.name }} | - {{ entrycategory.max_weight ? entrycategory.max_weight :
                                "Sin Limites" }} Kg |
                                {{ entrycategory.gender == 'masculino' ? "Masculino" : "Femenino" }} |
                                - {{ entrycategory.max_age }} Años |
                                {{ entrycategory.clothes }} </p>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>