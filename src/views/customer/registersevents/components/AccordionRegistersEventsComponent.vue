<script>
export default {
    props: {
        title: String,
        content: String,
        isOpen: Boolean,
        entry_athlete: Array,
    },
    setup(props){
        const isAvailableEntryCategory = (entrycategory) => {    
            return props.entry_athlete.some(entry => entry.id === entrycategory.id);
        };

        return {
            isAvailableEntryCategory,
        };
    }
}
</script>

<template>
    <div class="rounded-md border border-stroke p-4 shadow-9 dark:border-strokedark dark:shadow-none sm:p-6" >
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
                    <div v-for="(entrycategory, index) of content" :key="index" 
                    :class="{'disabled:cursor-default disabled:bg-whiter dark:focus:border-primary dark:disabled:bg-black opacity-50': !isAvailableEntryCategory(entrycategory) }">
                        <div class="relative flex items-center pt-0.5" @click="isAvailableEntryCategory(entrycategory) && $emit('selectEntryCategory', entrycategory)" >
                            <input :id="`taskCheckbox_${index}`" type="checkbox" class="taskCheckbox sr-only">
                            <div
                                class="box mr-3 flex h-5 w-5 items-center justify-center dark:bg-boxdark-2">
                                <span class="text-white">
                                    <svg class="cursor-pointer fill-gray-700 hover:fill-error-500 dark:fill-gray-400 dark:hover:fill-error-500" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.2502 4.99951C9.2502 4.5853 9.58599 4.24951 10.0002 4.24951C10.4144 4.24951 10.7502 4.5853 10.7502 4.99951V9.24971H15.0006C15.4148 9.24971 15.7506 9.5855 15.7506 9.99971C15.7506 10.4139 15.4148 10.7497 15.0006 10.7497H10.7502V15.0001C10.7502 15.4143 10.4144 15.7501 10.0002 15.7501C9.58599 15.7501 9.2502 15.4143 9.2502 15.0001V10.7497H5C4.58579 10.7497 4.25 10.4139 4.25 9.99971C4.25 9.5855 4.58579 9.24971 5 9.24971H9.2502V4.99951Z" fill="">
                                        </path>
                                    </svg>
                                </span>
                            </div>
                            <p>{{ entrycategory.name }} | - {{ entrycategory.max_weight ? entrycategory.max_weight :
                                "Sin Limites" }} Kg |
                                {{ entrycategory.gender == 'masculino' ? "Masculino" : "Femenino" }} |
                                - {{ entrycategory.max_age }} Años |
                                {{ entrycategory.clothes }} </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>