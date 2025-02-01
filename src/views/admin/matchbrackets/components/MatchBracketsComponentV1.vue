<script>
import CardComponent from "@/components/Card/CardComponent.vue";
import { ref, computed, onMounted, watch } from 'vue';
import useData from '@/composables/useData';

export default {
    components: {
        CardComponent
    },
    props: {
        eventid: {
            type: String,
            required: true,
        },
        entrycategoryid: {
            type: String,
            required: true,
        }
    },
    setup(props) {
        const collection = 'matchbracket';
        const data = ref([]);
        const { isLoading, error, create } = useData();
        const obj = ref({
            entry_category_id: '',
            event_id: '',
        })

        const fetchData = async () => {
            const response = await create(collection, obj.value);
            if (response.success) {
                data.value = response.data;
            }
        };


        onMounted(() => {
            obj.value.event_id = props.eventid
            obj.value.entry_category_id = props.entrycategoryid

            fetchData()
        })

        return {
            data
        }

    }
}
</script>


<template>
    <CardComponent>
        <div class="flex mr-3 mt-16">
            <ol class="flex flex-1 flex-col justify-around mr-5 round">
                <li class="m-2 p-1 leading-relaxed bg-gray-600 text-gray-300 rounded-full relative with-connector">
                    <div>
                        <div>
                            <span class="w-6 h-6 ml-1 mr-1 inline-block bg-gray-300 rounded-full"></span>
                            Competitor
                        </div>
                        <div>
                            <span class="w-6 h-6 ml-1 mr-1 inline-block bg-gray-300 rounded-full"></span>
                            Competitor
                        </div>
                    </div>
                </li>

                <li class="m-2 p-1 leading-relaxed bg-gray-600 text-gray-300 rounded-full relative with-connector">
                    <div>
                        <div>
                            <span class="w-6 h-6 ml-1 mr-1 inline-block bg-gray-300 rounded-full"></span>
                            Competitor
                        </div>
                        <div>
                            <span class="w-6 h-6 ml-1 mr-1 inline-block bg-gray-300 rounded-full"></span>
                            Competitor
                        </div>
                    </div>
                </li>

                <li class="m-2 p-1 leading-relaxed bg-gray-600 text-gray-300 rounded-full relative with-connector with-bye">
                    <div>
                        <div>
                            <span class="w-6 h-6 ml-1 mr-1 inline-block bg-gray-300 rounded-full"></span>
                            Competitor
                        </div>
                        <div>
                            <span class="w-6 h-6 ml-1 mr-1 inline-block bg-gray-300 rounded-full"></span>
                            Competitor
                        </div>
                    </div>
                </li>
            </ol>

            <ol class="flex flex-1 flex-col justify-around mr-5 ml-5 round">
                <li class="m-2 p-1 leading-relaxed bg-gray-600 text-gray-300 rounded-full relative with-connector">
                    <div>
                        <div>
                            <span class="w-6 h-6 ml-1 mr-1 inline-block bg-gray-300 rounded-full"></span>
                            Competitor
                        </div>
                        <div>
                            <span class="w-6 h-6 ml-1 mr-1 inline-block bg-gray-300 rounded-full"></span>
                            Competitor
                        </div>
                    </div>
                </li>

                <li class="m-2 p-1 leading-relaxed bg-gray-600 text-gray-300 rounded-full relative from-bye with-connector">
                    <div>
                        <div>
                            <span class="w-6 h-6 ml-1 mr-1 inline-block bg-gray-300 rounded-full"></span>
                            Competitor
                        </div>
                        <div>
                            <span class="w-6 h-6 ml-1 mr-1 inline-block bg-gray-300 rounded-full"></span>
                            Competitor
                        </div>
                    </div>
                </li>
            </ol>
            
            <ol class="flex flex-1 flex-col justify-around mr-5 ml-5 round round-winner">
                <li
                    class="flex items-center m-2 p-1 leading-relaxed bg-gray-600 text-gray-300 rounded-full relative with-connector">
                    <div>
                        <div>
                            <span class="w-6 h-6 ml-1 mr-1 inline-block bg-gray-300 rounded-full"></span>
                            Competitor
                        </div>
                    </div>
                </li>
            </ol> 
        </div>
    </CardComponent>


</template>


<style>
.with-connector:after {
    content: ' ';
    position: absolute;
    left: calc(100% + 0.5rem);
    /* participant size (includes margin) */
    width: 1.25rem;
    /* round margin-right */
    border: 2px solid #e2e8f0;
    border-left: none;
}

.with-connector:nth-child(odd):after {
    top: 50%;
    border-bottom: none;
}

.with-connector:nth-child(even):after {
    bottom: 50%;
    border-top: none;
}


.round:nth-child(1) .with-connector:after {
    height: 45px;
}

.round:nth-child(2) .with-connector:after {
    height: 80px;
}

.round.round-winner .with-connector:after {
    width: 0;
}

/*
  Incoming connector
 */
.round+.round .with-connector:before {
    content: ' ';
    position: absolute;
    left: -1.75rem;
    top: 60%;
    width: 1.25rem;
    border-top: 2px solid #e2e8f0;
}

/* 
  Byes
*/

.with-connector.with-bye {
    margin-top: 37px;
    margin-bottom: 37px;
}

.round .with-connector.with-bye:after {
    height: 0;
}

.with-connector.with-bye+.with-connector {
    display: none;
}

</style>