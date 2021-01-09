import { readable, writable, derived } from 'svelte/store';

export const debug = readable(false);
export const results = writable([]);
export const selectedFilters = writable([]);
export const selectedBudget = writable([]);


// Compte le nombre de valeurs pour chaque filtre 
// countFilters.all > nombre de filtres au total
// countFilters.star nombre de filtres star par exemple
export const countFilters = derived(selectedFilters, ($selectedFilters) => {

    let obj = {};
    obj.all = Object.values($selectedFilters).flat().length;

    const filters = Object.keys($selectedFilters);
    filters.forEach(filter => {
        obj[filter] = $selectedFilters[filter].flat().length;
    });
    return obj;
});


// export const countFilters = derived(selectedFilters, ($selection) => filterByName($selection));
// // https://tj.ie/derived-stores-with-svelte/
// // https://devlinduldulao.pro/svelte-in-a-nutshell-with-store-code-sample/
// function filterByName(a) {
//     console.log(Object.keys(a));
//     console.log(Object.values(a));
//     console.log(Object.entries(a));
//     return Object.values(a).flat().length;   
// }


// Setup Filters

export const filterPrice = writable({});
export const setStart = derived(filterPrice, ($filterPrice) => {
    let startMin = $filterPrice.min - 10; // on enlève le step, actuellement de 10
    if ( startMin < 0) {
        startMin = 0;
    }
    // Return Array
    return [startMin, $filterPrice.max]
});
export const setRange = derived(filterPrice, ($filterPrice) => {
    // Return Object
    return {
		min: 0,
		max: $filterPrice.max
	}
});

// const stars = [
//     {value: 0, label: '0 étoile'},
//     {value: 1, label: '1 étoile'},
//     {value: 2, label: '2 étoiles'},
//     {value: 3, label: '3 étoiles'},
//     {value: 4, label: '4 étoiles'},
//     {value: 5, label: '5 étoiles'},
// ];

// let filterOptions;
// filterOptions.star = [
//     {value: 0, label: '0 étoile'},
//     {value: 1, label: '1 étoile'},
//     {value: 2, label: '2 étoiles'},
//     {value: 3, label: '3 étoiles'},
//     {value: 4, label: '4 étoiles'},
//     {value: 5, label: '5 étoiles'},
// ];

// filterOptions.forEach( filter =>
//     console.log(filter)
// );