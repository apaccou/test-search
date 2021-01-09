<script>
    // Nom de variable à changer car également le nom d'une fonction filtre
    export let filter;
    export let filterValue;    
</script>

<button on:click class="badge bg-primary">{filter.find(item => item.value == filterValue).label} <i class="fas fa-times"></i></button>