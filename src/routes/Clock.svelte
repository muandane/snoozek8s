<script>
  import { onMount, onDestroy } from 'svelte';

  let currentTime = new Date().toLocaleTimeString();

  const updateTime = () => {
    currentTime = new Date().toLocaleTimeString();
  };

  // @ts-ignore
  let intervalId;

  onMount(() => {
    intervalId = setInterval(updateTime, 1000); // Update every second
  });

  onDestroy(() => {
    // @ts-ignore
    clearInterval(intervalId); // Clean up on destroy
  });
</script>

<div class="clock">
  Current Time: {currentTime}
</div>

<style>
 .clock {
    font-size: 24px;
    padding: 20px;
    background-color: #f0f0f0;
    border-radius: 10px;
  }
</style>
