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
	import LoadCampingList from './Load-camping-list.svelte';

	import wNumb from 'wnumb';
	
	import FilterReminder from './Filter-reminder.svelte';
	import FilterForm from './Filter-form.svelte';
	import FilterSlider from './Filter-slider.svelte';

	import {selectedFilters} from './store.js';
	import {selectedBudget} from './store.js';
	import {countFilters} from './store.js';
	import {data, results} from './store.js';
	import {debug} from './store.js';

	import {filterPrice, setStart, setRange} from './store.js';	

	export let name;

	const stars = [
		{value: 1, label: '1 étoile'},
		{value: 2, label: '2 étoiles'},
		{value: 3, label: '3 étoiles'},
		{value: 4, label: '4 étoiles'},
		{value: 5, label: '5 étoiles'},
	];

	const types = [
		{value: 'type_1', label: 'Mobil-home'},
		{value: 'type_2', label: 'Hébergement insolite'},
		{value: 'type_3', label: 'Hébergement toilé'},
	];	

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
		$results= filterData($data, query, $selectedBudget);
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
			<QueryClientProvider>
				<LoadCampingList />
			</QueryClientProvider>
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