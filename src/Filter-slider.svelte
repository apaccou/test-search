<script>
    // Slider :
	// https://refreshless.com/nouislider/
    // https://github.com/Woden-app/svelte-nouislider
    
    import { onMount, createEventDispatcher } from 'svelte'
    import noUiSlider from 'nouislider';
    import 'nouislider/distribute/nouislider.css';
    import {debug} from './store.js';
    
    let slider;
    const dispatch = createEventDispatcher();

    export let start
    export let connect = false
    export let margin
    export let limit
    export let padding
    export let step
    export let orientation = 'horizontal'
    export let direction = 'ltr'
    export let tooltips = false
    export let animate = true
    export let animationDuration = 300
    export let keyboardSupport = true
    export let range = {
        min: 0,
        max: 3000
    }
    export let behaviour = 'tap'
    
    export const set = value => slider.noUiSlider.set(value)
    export const getApi = () => slider.noUiSlider

    onMount(() => {
        noUiSlider.create(slider, {
            start,
            connect,
            margin,
            limit,
            padding,
            step,
            orientation,
            direction,
            tooltips,
            animate,
            animationDuration,
            keyboardSupport,
            behaviour,
            range
        })

        slider.noUiSlider.on(
            'update',
            (values, handle, unencoded, tap, positions) =>
                dispatch('update', { values, handle, unencoded, tap, positions })
        )
        slider.noUiSlider.on(
            'slide',
            (values, handle, unencoded, tap, positions) =>
                dispatch('slide', { values, handle, unencoded, tap, positions })
        )
        slider.noUiSlider.on(
            'set',
            (values, handle, unencoded, tap, positions) =>
                dispatch('set', { values, handle, unencoded, tap, positions })
        )
        slider.noUiSlider.on(
            'change',
            (values, handle, unencoded, tap, positions) =>
                dispatch('change', { values, handle, unencoded, tap, positions })
        )
        slider.noUiSlider.on(
            'start',
            (values, handle, unencoded, tap, positions) =>
                dispatch('start', { values, handle, unencoded, tap, positions })
        )
        slider.noUiSlider.on(
            'end',
            (values, handle, unencoded, tap, positions) =>
                dispatch('end', { values, handle, unencoded, tap, positions })
        )
    }) 

        // slider.noUiSlider.set([null, 54]);

</script>

<div class="slider" bind:this={slider}></div>

{#if slider && $debug}
<p>Start Min : {start[0]} </p>
<p>Start Max : {start[1]}</p>
<p>Budget Min : {getApi().get()[0]}</p>
<p>Budget Max : {getApi().get()[1]}</p>
{/if}

<style>
    div :global(.noUi-handle) {
        cursor: pointer;        
    }
</style>