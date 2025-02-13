import './assets/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';

import App from './App.vue'
import router from './router'

import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import "vue3-toastify/dist/index.css";

const app = createApp(App)
const pinia = createPinia()
const MyPreset = definePreset(Aura, {
    components: {
        datatable: {
            header: { 
                background: 'dark:bg-boxdark bg-white'
            },
            headerCell: { 
                background: 'dark:bg-boxdark bg-white'
            },
            footer: { 
                background: 'dark:bg-boxdark bg-white'
            },
            footerCell: { 
                background: 'dark:bg-boxdark bg-white'
            },
            row: { 
                background: 'dark:bg-boxdark bg-white'
            }, 
        },
        paginator: { 
            root: {
                background: 'dark:bg-boxdark bg-white'
            }
        },
        select: {
            root: {
                 background: 'dark:bg-boxdark bg-white'
            }
        },
        inputtext: {
            // root: {
            //     background: 'dark:bg-meta-4 bg-gray',
            // }
            colorScheme: {
                light: {
                    root: {
                        background: '#EFF4FB',
                    },
                },
                dark: {
                    root: {
                        background: '#313D4A',
                    },
                }
            }
        },
        editor: {
            colorScheme: {
                light: {
                    content: {
                        background: '#EFF4FB',
                    },
                },
                dark: {
                    content: {
                        background: '#313D4A',
                    },
                }
            }
        }
        // w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary
    },
})
console.log(MyPreset.components)


app.use(pinia)
app.use(router)
app.use(PrimeVue, {
    unstyled: false,
    theme: {
        // preset: Aura,
        preset: MyPreset,
        options: {
            prefix: 'p',
            darkModeSelector: '.dark',
            cssLayer: false
        }
    },
    // css: ({ dt }) => `
    // .p-datatable.p-datatable-table.p-datatable-thead {
    //     background: '#24303F'
    // }
    // `,
})

app.use(
    Vue3Toastify,
    {
      autoClose: 2000,
      style: {
        opacity: '1',
        userSelect: 'initial',
      },
    } as ToastContainerOptions,
  );

app.mount('#app')
