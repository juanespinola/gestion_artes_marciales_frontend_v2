<script>
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import StepItem from 'primevue/stepitem';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import Button from 'primevue/button';
import CardComponent from '@/components/Card/CardComponent.vue';
import ProfileAthleteFormComponent from './components/ProfileAthleteFormComponent.vue';
import ContactAthleteFormComponent from './components/ContactAthleteFormComponent.vue';
import BeltAthleteFormComponent from './components/BeltAthleteFormComponent.vue';
import { ref, computed, onMounted, watch } from 'vue'
import useData from '@/composables/useData';
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notification';

export default {
    components: {
        Stepper,
        StepList,
        StepPanels,
        StepItem,
        Step,
        StepPanel,
        Button,
        CardComponent,
        ProfileAthleteFormComponent,
        ContactAthleteFormComponent,
        BeltAthleteFormComponent,
    },
    setup(){
        const notificationStore = useNotificationStore()
        const router = useRouter()
        const { update, create, fetchAll } = useData();
        const collection = 'athlete/register'
        const obj = ref({
            name: '',
            email: '',
            password: '',
            birthdate: '',
            document: '',
            gender: '',
            country_id: '',
            type_document_id: '',
            city_id: '',
            academy_id: '',
            belt_id: '',
            phone: '',
            federation_id: '',
            association_id: '',
        })
        

        const saveData = async () => {
            try {
                const response = await create(collection, obj.value);
                if(!response.success){
                        Object.keys(response?.message).forEach((key) => {
                            console.log(response?.message[key][0])
                            notificationStore.error("Error!",response?.message[key][0])
                        });
                    return;
                }
                notificationStore.success("Correcto!",response?.data?.messages)
                router.push({ name: "Login" }); // Redirige a la lista después de guardar
               
            } catch (err) {
                console.error('Error al guardar el registro:', err.message);
            }
        };

        return {
            obj,
            saveData
        }
    }
}
</script>

<template>
    <div class="flex items-center justify-center">
        <div class="relative flex overflow-y-auto overflow-x-hidden">
            <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <CardComponent>
                    <div v-if="isLoading">Loading...</div>
                    <div v-if="error">Error: {{ error }}</div>
                    
                    <div
                        class="w-full px-4 sm:px-12.5 flex items-center justify-center border-stroke dark:border-strokedark xl:border-l-2">
                        <div class="w-full py-17.5">
                            <Stepper value="1">
                                <StepList>
                                    <Step value="1">Información Personal</Step>
                                    <Step value="2">Contacto y Residencia</Step>
                                    <Step value="3">Federación y Cinturón</Step>
                                </StepList>
                                <StepPanels >
                                    <StepPanel v-slot="{ activateCallback }" value="1">
                                        <ProfileAthleteFormComponent :obj="obj"/>

                                        <div class="flex pt-6 justify-end">
                                            <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                                                @click="activateCallback('2')" />
                                        </div>
                                    </StepPanel>
                                    <StepPanel v-slot="{ activateCallback }" value="2">

                                        <ContactAthleteFormComponent :obj="obj"/>
                                        <div class="flex pt-6 justify-between">
                                            <Button label="Atras" severity="secondary" icon="pi pi-arrow-left"
                                                @click="activateCallback('1')" />
                                            <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                                                @click="activateCallback('3')" />
                                        </div>
                                    </StepPanel>
                                    <StepPanel v-slot="{ activateCallback }" value="3">
                                        <BeltAthleteFormComponent :obj="obj" />
                                        <div class="flex pt-6 justify-between">
                                            <Button label="Atras" severity="secondary" icon="pi pi-arrow-left"
                                                @click="activateCallback('2')" />
                                            <Button label="Finalizar" iconPos="right" icon="pi pi-arrow-right"
                                                @click="saveData()" />
                                        </div>
                                    </StepPanel>
                                </StepPanels>
                            </Stepper>
                        </div>
                    </div>
                </CardComponent>
            </div>
        </div>
    </div>

</template>