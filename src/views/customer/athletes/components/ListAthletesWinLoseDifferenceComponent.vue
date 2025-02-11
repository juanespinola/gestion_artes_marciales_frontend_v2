<script>
export default {
    props: {
        data: {
            type: Array,
            required: true
        }
    },
    setup(props){


        return {
            props
        }
    }
}
</script>

<template>
    <div
            class="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                <div class="my-4">
                    <h3 class="mb-5 text-2xl font-medium text-black dark:text-white">Ganadas / Perdidas Diferencia</h3>
                    <div class="w-full rounded-md border border-stroke py-2.5 dark:border-strokedark">
                        <div class="flex flex-col">

                            <div
                                class="flex items-center justify-between p-4.5 hover:bg-[#F9FAFB] dark:hover:bg-meta-4"
                                v-for="athlete of props.data">
                                <div class="flex items-center">
                                    <div class="mr-4 h-[50px] overflow-hidden rounded-full w-full max-w-13 h-13">
                                        <img :src="athlete.profile_images ? athlete.profile_images:'https://i.pinimg.com/550x/a8/0e/36/a80e3690318c08114011145fdcfa3ddb.jpg'" alt="user" class="rounded-full object-cover object-center">
                                    </div>
                                    <div class="text-start">
                                        <h5 class="font-sm text-black dark:text-white">{{ athlete.name }}</h5>
                                        <span class="inline-flex rounded-full px-4 min-w-15 justify-center text-sm font-medium hover:bg-opacity-90 text-white" style="background-color: rgb(99, 115, 129);">
                                            {{ athlete.difference > 0 ?  `+${athlete.difference}` : athlete.difference  }} 
                                        </span>
                                        <span class="text-sm">
                                            Ganadas {{ athlete.wins }} / Perdidas {{ athlete.losses }}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>