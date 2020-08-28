<script type="ts">
  import timer from './timer'

  const a: number = 42
  $: sum = a + $timer
</script>

<main>
  <h1>Count is {$timer}</h1>
  <h2>Meaning of life: {a}</h2>
  <h3>And Life goes on, bro. {sum}</h3>
</main>
