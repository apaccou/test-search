<script>

    import {selectedFilters} from './store.js';
    import {results} from './store.js';
    import {countFilters} from './store.js';
    import {debug} from './store.js';

    export let filterName;
    export let filters;

    $selectedFilters[filterName] = [];
    
    // $: if($countFilters[all] > 0) {
    //     $results = data.filter(result => [1,2,5].includes(result[filterName]));
    // } else {
    //     $results = data;
    // }
    
</script>

<script context="module">
    // $: if($selectedFilters[filterName].length > 0) {
    //     // $results = data.filter(result => $selectedFilters[filterName].includes(result.filterName));
    //     $results = data.filter(result => [1,2,5].includes(result.star));
    //     console.log(filterName);
    // } else {
    //     $results = data;
    // }
</script>

{#if $debug}
<p>Nombre de filtres {filterName} {$countFilters[filterName]}</p>
<p>{Object.values($selectedFilters[filterName])}</p>
{/if}

<ul class="list-unstyled">
{#each filters as filter}
    <li>
        <input class="form-check-input" id="filter_offers_{filters}_{filter.value}" value="{filter.value}" bind:group="{$selectedFilters[filterName]}" type="checkbox">
        <label class="form-check-label" for="filter_offers_{filters}_{filter.value}">
            <span class="filter__label">{filter.label}</span>
            <span class="filter__value">{$results.filter(result => result[filterName] == filter.value).length}</span>
        </label>
    </li>    
{/each}
</ul>


<!-- <li>
    <input class="form-check-input" type="checkbox" bind:group="{$selectedStars}" id="filter_offers_stars_{star.value}" name="filter_offers[stars][]" value="{star.value}" checked="checked">
    <label  class="form-check-label" for="filter_offers_stars_{star.value}">
        <span class="filter__label">{star.label}</span>
        <span class="filter__value">{results.filter(result => result.star == star.value).length}</span>
    </label>
</li> -->