<script setup>
// import { defineProps, watch, onMounted } from 'vue';

// export default {
//     components: {},
//     props: {
//         node: {
//             type: Object,
//             required: true
//         }
//     },
//     setup(props) {


//         const formatAthlete = (athlete) => {
//             return athlete ? athlete.name : 'Libre';
//         }

//         const getCircleClass = (match, athleteId) => {
//             if (!athleteId) return '';
//             if (match.athlete_id_winner === athleteId) return 'bg-green-500';
//             if (match.athlete_id_loser === athleteId) return 'bg-red-500';
//             return '';
//         }

//         onMounted(() => {
//             console.log(props);
//         });

//         watch(() => props.node, (newVal) => {
//             console.log('Node updated:', newVal);
//         }, { immediate: true });

//         return {
//             formatAthlete,
//             getCircleClass,
//             node: props.node
//         };
//     }
// }

import { onMounted, watch, computed } from 'vue';

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['openMatchModal'])


const formatAthlete = (athlete) => {
  return athlete?.name;
};

const getCircleClass = (match, athleteId) => {
  if (!athleteId) return '';
  if (match.athlete_id_winner === athleteId) return 'bg-green-500';
  if (match.athlete_id_loser === athleteId) return 'bg-red-500';
  return '';
};

onMounted(() => {
  console.log(props.node);
});

watch(() => props.node, (newVal) => {
}, { immediate: true });


const groupedByPhase = computed(() => {
  const result = {};

  const traverse = (node) => {
    if (!node) return;
    const phase = node.phase || 'Sin fase';

    if (!result[phase]) result[phase] = [];
    result[phase].push(node);

    if (node.children && node.children.length) {
      node.children.forEach(traverse);
    }
  };

  traverse(props.node);
  console.log(Object.entries(result).reverse())
  return Object.entries(result).reverse();
});

const checkFromBye = (phase, athlete) => {
  if (!athlete) return false;
  return groupedByPhase.value.some(bracket =>
    bracket.number_phase === phase + 1 &&
    bracket.matches.some(match => match.athlete_one?.id === athlete.id || match.athlete_two?.id === athlete.id)
  );
}

const connectBracketFather = (fatherId, childrenFatherId) => {
  // console.log('fatherId', fatherId, 'childrenFatherId', childrenFatherId);
  if (fatherId !== childrenFatherId)
    return "no-show";
}

const openMatchModal = (data) => {
  emit('openMatchModal', data);
}

const isPreviousEven = (index) => {
  if (index <= 0) return true; // Primera fase o índice inválido → default a `true`
  const previousEntry = groupedByPhase[index - 1];
  if (!previousEntry) return true;

  const previousMatches = previousEntry[1];
  return previousMatches.length % 2 === 0;
};


</script>

<template>
  <div class="flex p-2">
    <div v-for="([phase, matches], index) in groupedByPhase" :key="phase" :aria-labelledby="`round-${index + 1}`"
      class="flex flex-1 flex-col m-5 h-auto min-h-[300px] round">

      <!-- Título de fase -->
      <h2 :id="`round-${index + 1}`" class="text-center font-bold mb-2">
        {{ phase }}
      </h2>

      <div class="flex h-full justify-center">
        <ol class="space-y-6 w-full matchbracket flex flex-col justify-around " 
          :class="{
            'justify-center': isPreviousEven(index),
            'justify-around': !isPreviousEven(index)
          }"> 
          <li v-for="(node, idx) in matches" :key="idx" class="match-container">
              
              <!-- Conectores izquierdos (de fases anteriores) -->

              <div v-if="node?.children?.length % 2 == 0"
                class="connector connector-top-left connector-top connector-left"
                :class="connectBracketFather(node?.match?.id, node?.children?.[0]?.parent.id)"></div>
              <div v-if="node?.children?.length % 2 == 0"
                class="connector connector-bottom-left connector-bottom connector-left"
                :class="connectBracketFather(node?.match?.id, node?.children?.[1]?.parent.id ? node?.children?.[1]?.parent.id : node?.parent?.id)">
              </div>

              <div v-if="node?.children?.length % 2 != 0"
                class="connector connector-bottom-left connector-bottom connector-left"
                :class="connectBracketFather(node?.match?.id, node?.children?.[0]?.parent.id)"></div>



              <div @click="openMatchModal(node?.match)"
                class="group cursor-pointer p-2  text-black dark:bg-gray-800 dark:text-white rounded shadow  relative">

                <!-- Tooltip -->
                <div class="absolute left-full top-1/2 -translate-y-1/2 ml-2 p-3 max-w-xs min-w-[150px] w-auto
               bg-gray-300 text-black rounded shadow-md hidden group-hover:flex flex-col space-y-1 z-50">

                  <!-- Flecha del tooltip -->
                  <div class="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-full w-0 h-0 
                 border-t-8 border-b-8 border-r-8 border-transparent border-r-gray-300">
                  </div>

                  <span class="font-semibold">Combate #{{ node?.match?.id }}</span>
                  <span>
                    <label class="font-semibold">Estado: </label>{{ node?.match?.bracket.status }}
                  </span>
                  <span>
                    <label class="font-semibold">Puntaje:</label>
                    {{ node?.match?.score_one_athlete ?? 0 }} - {{ node?.match?.score_two_athlete ?? 0 }}
                  </span>
                  <span v-if="node?.match?.bracket.status == 'finalizado'">
                    <label class="font-semibold">Ganador:</label>
                    {{ node?.match?.athlete_id_winner === node?.match?.athlete_one.id
                      ? node?.match?.athlete_one.name
                      : node?.match?.athlete_two.name }}
                  </span>
                  <span class="text-sm text-gray-600">{{ node?.match?.bracket.match_time }}</span>
                </div>

                <!-- Participantes -->
                <div class="border-b border-stroke flex items-center py-1">
                  <span class="w-6 h-6 mx-1 inline-block rounded-full bg-gray-300"></span>
                  {{ formatAthlete(node?.match?.athlete_one) || 'Esperando competidor' }}
                </div>
                <div class="flex items-center py-1">
                  <span class="w-6 h-6 mx-1 inline-block rounded-full bg-gray-300"></span>
                  {{ formatAthlete(node?.match?.athlete_two) || 'Esperando competidor' }}
                </div>
              </div>


              <!-- Conectores derechos (hacia la siguiente fase) -->
              <!-- <div class="connector connector-top-right connector-top connector-right"
                        :class="connectBracketChildren(node?.children?.length, index+1, groupedByPhase.length)"></div>
                        <div class="connector connector-bottom-right connector-bottom connector-right"
                        :class="connectBracketChildren(node?.children?.length, index+1, groupedByPhase.length)"></div> -->

              <div class="connector connector-line"></div>
            
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --connector-width: 20px;
  /* Ancho de las líneas */
  --connector-border-style: 2px solid #ccc;
  /* Estilo de las líneas */
  --connector-radius: 12px;
  /* Bordes redondeados */
  --prev-match-center: 0%;
  /* Posición relativa para conectar con el match anterior */
}

/* Contenedor base para cada conector */
.connector {
  position: absolute;
  width: var(--connector-width);
  height: 50%;
  box-sizing: border-box;
  background: transparent;
  pointer-events: none;
}


/* Posicionamiento base para conectores de arriba */
.connector-top {
  top: 0;
}

/* Posicionamiento base para conectores de abajo */
.connector-bottom {
  bottom: 0;
}

/* Posicionamiento base para conectores a la izquierda */
.connector-left {
  left: 0;
}

/* Posicionamiento base para conectores a la derecha */
.connector-right {
  right: 0;
}

/* Conector esquina superior izquierda (línea vertical + horizontal) */
.connector-top-left {
  top: var(--prev-match-center);
  bottom: 50%;
  left: calc(var(--connector-width) * -1);
  border-bottom: var(--connector-border-style);
  border-left: var(--connector-border-style);
  border-bottom-left-radius: var(--connector-radius);
}

/* Conector esquina inferior izquierda */
.connector-bottom-left {
  top: 50%;
  bottom: var(--prev-match-center);
  left: calc(var(--connector-width) * -1);
  border-top: var(--connector-border-style);
  border-left: var(--connector-border-style);
  border-top-left-radius: var(--connector-radius);
}

/* Conector esquina superior derecha */
.connector-top-right {
  top: var(--connector-radius);
  bottom: 50%;
  right: calc(var(--connector-width) * -1);
  border-bottom: var(--connector-border-style);
  border-right: var(--connector-border-style);
  border-bottom-right-radius: var(--connector-radius);
}

/* Conector esquina inferior derecha */
.connector-bottom-right {
  top: 50%;
  bottom: var(--connector-radius);
  right: calc(var(--connector-width) * -1);
  border-top: var(--connector-border-style);
  border-right: var(--connector-border-style);
  border-top-right-radius: var(--connector-radius);
}

/* Ocultar conectores de la primera columna a la izquierda */
.round:first-child .connector-top-left,
.round:first-child .connector-bottom-left {
  display: none;
  height: 100%;
}

/* Ocultar conectores de la última columna a la derecha */
.round:last-child .connector-top-right,
.round:last-child .connector-bottom-right,
.round:last-child .connector-line {
  display: none;

}



/* Ocultar conector inferior derecho para partidas en posiciones impares */
/* .match-container:nth-child(even) .connector-bottom-right {
  display: none;
} */

/* Ocultar conector superior derecho para partidas en posiciones pares */
/* .match-container:nth-child(odd) .connector-top-right {
  display: none;
} */

/* Opcional: Ajustes para que el contenedor de cada partido sea relativo */
.match-container {
  position: relative;
}

.no-show {
  display: none;
}

.connector-line {
  top: 50%;
  right: calc(var(--connector-width) * -1);
  border-top: var(--connector-border-style);
}
</style>
