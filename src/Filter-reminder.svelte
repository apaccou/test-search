<script>
    import FilterReminderButton from "./Filter-reminder-button.svelte";
    import {selectedFilters} from './store.js';

    export let filter;
    export let selectedFilter;

    // function deleteFilter(filterValue) {
    //     // Recherche la position de la valeur dans le tableau pour la supprimer
	// 	const index = selectedFilters.indexOf(filterValue);
	// 	if (index > -1) {
	// 		selectedFilters.splice(index, 1);
	// 		$selectedStars = selectedFilters;
    //     }		
    // }

    function deleteFilter(filterValue) {
        const index = $selectedFilters[selectedFilter].indexOf(filterValue);
        if (index > -1) {
            $selectedFilters[selectedFilter].splice(index, 1);
            $selectedFilters = $selectedFilters;
        }
    }

    let filters = [];
    $: if($selectedFilters[selectedFilter] !== undefined ) {
        filters = Object.values($selectedFilters[selectedFilter]);
    }

</script>

{#each  filters as filterValue}
    <FilterReminderButton {filterValue} {filter} on:click={() => deleteFilter(filterValue)} />	
{/each}



<!--
export let filter;
Tableau complet des value / label pour le filtre
const stars = [
    {value: 1, label: '1 étoile'},
    {value: 2, label: '2 étoiles'},
    {value: 3, label: '3 étoiles'},
    {value: 4, label: '4 étoiles'},
    {value: 5, label: '5 étoiles'},
];

export let selectedFilters;
Tableau des value sélectionnées pour le filtre
-->