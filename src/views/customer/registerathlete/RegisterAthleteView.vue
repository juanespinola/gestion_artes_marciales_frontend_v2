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
        })

        return {
            obj
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
                    {{ obj }}
                    <div
                        class="w-full px-4 sm:px-12.5 flex items-center justify-center border-stroke dark:border-strokedark xl:border-l-2">
                        <div class="w-full py-17.5">
                            <Stepper value="1">
                                <StepList>
                                    <Step value="1">Información Personal</Step>
                                    <Step value="2">Contacto y Residencia</Step>
                                    <Step value="3">Federación y Cinturón</Step>
                                </StepList>
                                <StepPanels>
                                    <StepPanel v-slot="{ activateCallback }" value="1">
                                        <ProfileAthleteFormComponent :obj="obj"/>

                                        <div class="flex pt-6 justify-end">
                                            <Button label="Next" icon="pi pi-arrow-right" iconPos="right"
                                                @click="activateCallback('2')" />
                                        </div>
                                    </StepPanel>
                                    <StepPanel v-slot="{ activateCallback }" value="2">

                                        <ContactAthleteFormComponent />
                                        <div class="flex pt-6 justify-between">
                                            <Button label="Back" severity="secondary" icon="pi pi-arrow-left"
                                                @click="activateCallback('1')" />
                                            <Button label="Next" icon="pi pi-arrow-right" iconPos="right"
                                                @click="activateCallback('3')" />
                                        </div>
                                    </StepPanel>
                                    <StepPanel v-slot="{ activateCallback }" value="3">
                                        <BeltAthleteFormComponent />
                                        <div class="flex pt-6 justify-between">
                                            <Button label="Back" severity="secondary" icon="pi pi-arrow-left"
                                                @click="activateCallback('2')" />
                                            <div></div>
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