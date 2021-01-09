<script>
	// Super pour les filtres :	
	// https://medium.com/@tylerburdsall/building-a-dynamic-filter-with-es6-javascript-71dfeb50c371
	// et éventuellement https://medium.com/better-programming/creating-a-multi-filter-function-to-filter-out-multiple-attributes-javascript-react-rails-5aad8e272142
	// A l'air très sympa : 
	// https://svelte-query.vercel.app/
	// Toutes les implémentations GraphQL
	// https://graphql.org/code/#javascript
	// Exemples d'organisation
	// https://blog.eleven-labs.com/fr/commencer-avec-apollojs/
	// GraphQL avec Express 
	// https://httptoolkit.tech/blog/simple-graphql-server-without-apollo/

	import { QueryClientProvider } from '@sveltestack/svelte-query';
	import Simple from './Simple.svelte';

	import wNumb from 'wnumb';

	import Result from './Result.svelte';
	import FilterReminder from './Filter-reminder.svelte';
	import FilterForm from './Filter-form.svelte';
	import FilterSlider from './Filter-slider.svelte';

	import {selectedFilters} from './store.js';
	import {selectedBudget} from './store.js';
	import {countFilters} from './store.js';
	import {results} from './store.js';
	import {debug} from './store.js';

	import {filterPrice, setStart, setRange} from './store.js';	

	export let name;


	import { onMount } from 'svelte';	

	const apiURL = 'http://localhost:5000/results.json';
	let data = [];
	// let results = [];



	
    onMount(async function() {
        const response = await fetch(apiURL);
		data = await response.json();
		$results = data;

		// Return Set of unique filter values		
		function getSetFromFilter(filterName) {
			let filterSet = [];
			filterSet[filterName] = new Set();
			data.forEach( item => {
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

		const uniqueFilterPrice = getUniqueArrayFromFilter('price');
		console.log(uniqueFilterPrice);
		$filterPrice.min = Math.min(...uniqueFilterPrice);
		$filterPrice.max = Math.max(...uniqueFilterPrice);

		function checkIfAllValuesAreNumber(array) {
			return array.every(x => typeof x == "number");
		}
		function checkIfAllValuesAreString(array) {
			return array.every(x => typeof x == "string");
		}

	});

	const stars = [
		{value: 1, label: '1 étoile'},
		{value: 2, label: '2 étoiles'},
		{value: 3, label: '3 étoiles'},
		{value: 4, label: '4 étoiles'},
		{value: 5, label: '5 étoiles'},
	];
	// let selectedStars = [];
	// $: filterXXX = filterByStar(selectedStars);

	// function filterByStar() {
	// 	let test = Array.from(selectedStars);
	// 	// return results = results.filter(result => result.star == 5);
	// 	if(test.length) {
	// 		return $results = data.filter(result => Array.from(selectedStars).includes(result.star));
	// 	} else {
	// 		return $results = data;
	// 	}		
	// }

	const types = [
		{value: 'type_1', label: 'Mobil-home'},
		{value: 'type_2', label: 'Hébergement insolite'},
		{value: 'type_3', label: 'Hébergement toilé'},
	];
	// let selectedTypes = [];
	// $: filterYYY = filterByType(selectedTypes);

	// function filterByType() {
	// 	let test = Array.from(selectedTypes);
	// 	// return results = results.filter(result => result.star == 5);
	// 	if(test.length) {
	// 		return $results = data.filter(result => Array.from(selectedTypes).includes(result.type));
	// 	} else {
	// 		return $results = data;
	// 	}		
	// }


	// En cours de test
	// $: if($countFilters.all > 0) {
	// 	console.log($results);		
	// 	filterResults();		
	// 	console.log($results);
	// } else {
	// 	$results = data;
	// }
	
	// function filterResults() {
	// 	const filters = Object.keys($selectedFilters);
	// 	filters.forEach(filterName => {
	// 		if($countFilters[filterName]) {
	// 			$results = data.filter(result => Object.values($selectedFilters[filterName]).includes(result[filterName]));
	// 		}			
	// 	});
	// 	console.log('ici');
	// 	console.log($results);
	// }

	

	function buildFilter(filter) {
		let query = {};
		for (let keys in filter) {
			if (filter[keys].constructor === Array && filter[keys].length > 0) {
				query[keys] = filter[keys];
			}
		}
		return query;
	}	

	function filterData(data, query, budget) {
		if (!budget.min) { budget.min = $setRange.min} // ajout pour gérer le budget
		if (!budget.max) { budget.max = $setRange.max;} // ajout pour gérer le budget
		const filteredData = data.filter( (item) => {
			if ((item.price < budget.min) || (item.price > budget.max)) {  // ajout pour gérer le budget				
				return false;				
			}
			for (let key in query) {
				if (item[key] === undefined || !query[key].includes(item[key])) {
					return false;
				}
			}
			return true;
		});
		return filteredData;

		// const filteredData = data.filter( (item) => {
		// 	console.log(budget.min + ' ' + budget.max);
		// 	if ((item.price < budget.min) || (item.price > budget.max)) {				
		// 		return false;				
		// 	}
		// 	return true;
		// });
		// return filteredData;
	};

	$: {		
		const query = buildFilter($selectedFilters);
		$results= filterData(data, query, $selectedBudget);
	}


	// Formattage eu Euros
	// Remplacé par wnumb car nécessaire pour nouislider
	// function moneyFormatted(money) {
	// 	return new Intl.NumberFormat("fr-FR", {
	// 		minimumFractionDigits: 0,
	// 		style: "currency",
	// 		currency: "EUR",
	// 	}).format(money);
	// }
	// console.log(moneyFormatted(money));

	let moneyFormat = wNumb({
		mark: ',',
		decimals: 0,
		thousand: ' ',
		prefix: '',
		suffix: ' €'
	});

	// const selectedBudgetChange = event => {
	// 	console.log(event);
	// 	alert('cliked');
	// }
	function selectedBudgetChange(event) {
		$selectedBudget.min = event.detail.values[0];
		$selectedBudget.max = event.detail.values[1];
	}
	
</script>

<main>
	<h1>Hello {name} !</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<h2>{$results.length} offres d'hébergement</h2>

<div class="filter-reminder">
	<FilterReminder filter={stars} selectedFilter={'star'} />
	<FilterReminder filter={types} selectedFilter={'type'} />
</div>

{#if $debug}
<p>Nombre de filtres totaux : {Object.values($selectedFilters).flat().length}</p>
{/if}

<div class="container">
	<div class="row">
		<div class="col-4">

			<legend>Nombre d'étoiles</legend>			
			<FilterForm filters={stars} filterName={'star'} />

			<legend>Type de logement</legend>
			<FilterForm filters={types} filterName={'type'} />	

			<legend>Budget</legend>
			{#if ($filterPrice.min && $filterPrice.max)}
			<FilterSlider start={$setStart} step={10} range={$setRange} margin={50} tooltips={[moneyFormat, moneyFormat]} on:set={selectedBudgetChange} padding={0} />
			{/if}

			{#if $debug}
			<ul>Budget sélectionné dans le slider
				<li>selectedBudget (min) : {$selectedBudget.min}</li>
				<li>selectedBudget (max) : {$selectedBudget.max}</li>
			</ul>
			<ul>Prix min et max issus des résultats de recherche
				<li>filterPrice.min {$filterPrice.min}</li>
				<li>filterPrice.max {$filterPrice.max}</li>
			</ul>
			{/if}

		</div>
		<div class="col-8">
			{#each $results as result}
			<Result {...result}/>
			{/each}
		</div>
	</div>
</div>



<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

</style>