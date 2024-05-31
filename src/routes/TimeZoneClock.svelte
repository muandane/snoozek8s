<script>
  import { onMount, onDestroy } from 'svelte';

  export let timezone = 'UTC'; // Default timezone

  let currentTime = '';

  const updateTime = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
    currentTime = formatter.format(now);
  };

  /**
	 * @type {string | number | NodeJS.Timeout | undefined}
	 */
  let intervalId;

  onMount(() => {
    intervalId = setInterval(updateTime, 1000); // Update every second
  });

  onDestroy(() => {
    clearInterval(intervalId); // Clean up on destroy
  });
</script>

<div class="clock">
  Current Time ({timezone}): {currentTime}
</div>

<style>
.clock {
    font-size: 24px;
    padding: 20px;
    background-color: #f0f0f0;
    border-radius: 10px;
  }
</style>
