<script>
import CustomerLayout from '@/layouts/CustomerLayout.vue';
import CardComponent from '@/components/Card/CardComponent.vue';
import { useUserStore } from '@/stores/user';

export default {
    components: {
        CustomerLayout,
        CardComponent
    },
    setup() {
        const userStore = useUserStore()
        return {
            userStore
        }
    }
}
</script>

<template>
    <CustomerLayout>
        <CardComponent>
          
        </CardComponent>

        <h2 class="mt-10 mb-7.5 text-title-md2 font-bold text-black dark:text-white">Noticias</h2>
        <div class="grid grid-cols-1 gap-7.5 sm:grid-cols-2 xl:grid-cols-3">
            <CardComponent>
                <div class="border-b border-stroke p-5 px-7.5 dark:border-strokedark">
                    <h4 class="text-xl font-semibold text-black dark:text-white"><a aria-current="page"
                            href="/ui-elements/cards#" class="router-link-active router-link-exact-active">Card
                            Title here</a></h4>
                </div>
                <div class="px-7.5 pt-6 pb-9">
                    <p class="font-medium">Lorem ipsum dolor sit amet, vehiculaum ero felis loreum fitiona fringilla
                        goes scelerisque Interdum et.</p>
                </div>
            </CardComponent>
        </div>
    </CustomerLayout>
</template>