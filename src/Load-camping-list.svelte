<script>
    import {useQuery} from '@sveltestack/svelte-query';
    import Result from './Result.svelte';
    import {data, results} from './store.js';
    import {filterPrice} from './store.js';	

    const queryResult =  useQuery('repoData', () => {
        return fetch (
            'http://localhost:5000/results.json'
        ).then(res => res.json())
    })

    // Met à jour les résultats à chaque nouvelle requête
    $: if ($queryResult.isSuccess) {
        initDatas();
        console.log('ICI');
    }

    function initDatas() {
        $data = $queryResult.data;
        $results = $queryResult.data;

        const uniqueFilterPrice = getUniqueArrayFromFilter('price');
        console.log(uniqueFilterPrice);
        $filterPrice.min = Math.min(...uniqueFilterPrice);
        $filterPrice.max = Math.max(...uniqueFilterPrice);

    }

    function checkIfAllValuesAreNumber(array) {
			return array.every(x => typeof x == "number");
		}
    function checkIfAllValuesAreString(array) {
        return array.every(x => typeof x == "string");
    }

    // Return Set of unique filter values		
    function getSetFromFilter(filterName) {
        let filterSet = [];
        filterSet[filterName] = new Set();
        $data.forEach( item => {
            filterSet[filterName].add(item[filterName]);
        });
        return filterSet[filterName];
    }

    // Return Sorted Array of unique filter values
    // To get array instead of Set : [...filterSet[filterName]] ou Array.from()
    function getUniqueArrayFromFilter(filterName) {
        const uniqueArray = Array.from(getSetFromFilter(filterName));
        if(checkIfAllValuesAreString(uniqueArray)) {
            uniqueArray.sort();
        }
        if(checkIfAllValuesAreNumber(uniqueArray)) {
            uniqueArray.sort((a, b) => a - b);
        }
        return uniqueArray;
    }
        
</script>

{#if $queryResult.isLoading}
    Loading...
{:else if $queryResult.isError}
    An error has occurred:
    {$queryResult.error.message}
{:else}
    {#each $results as result}
    <Result {...result}/>
    {/each}
{/if}