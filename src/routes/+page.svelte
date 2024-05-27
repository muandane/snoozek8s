<script>
  import Icon from '@smui/textfield/icon';
  import HelperText from '@smui/textfield/helper-text';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
  import { onMount } from 'svelte';

  // biome-ignore lint/style/useConst: <explanation>
  let resourceGroupName = import.meta.env.VITE_AZURE_RESOURCE_GROUP || '';
  // biome-ignore lint/style/useConst: <explanation>
  let clusterName = import.meta.env.VITE_AZURE_CLUSTER_NAME || '';
  // biome-ignore lint/style/useConst: <explanation>
  let nodePoolName = import.meta.env.VITE_AZURE_NODE_POOL_NAME || '';

  let startLoading = false;
  let stopLoading = false;
  let message = '';

  const startNodePool = async () => {
    startLoading = true;
    message = '';
    try {
      const response = await fetch('/api/start-node-pool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceGroupName, clusterName, nodePoolName })
      });
      const result = await response.json();
      if (response.ok) {
        message = result.message;
      } else {
        console.error('Error starting node pool:', result);
        message = `Error: ${result.message} (Code: ${result.code})`;
      }
    } catch (error) {
      console.error('Unexpected error starting node pool:', error);
      message = 'Unexpected error starting node pool';
    } finally {
      startLoading = false;
    }
  };

  const stopNodePool = async () => {
    stopLoading = true;
    message = '';
    try {
      const response = await fetch('/api/stop-node-pool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceGroupName, clusterName, nodePoolName })
      });
      const result = await response.json();
      if (response.ok) {
        message = result.message;
      } else {
        console.error('Error stopping node pool:', result);
        message = `Error: ${result.message} (Code: ${result.code})`;
      }
    } catch (error) {
      console.error('Unexpected error stopping node pool:', error);
      message = 'Unexpected error stopping node pool';
    } finally {
      stopLoading = false;
    }
  };
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>Manage Node Pool</h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcome_fallback} alt="Welcome" />
			</picture>
		</span> 
  <div class="columns margins">
    <div>
      <Textfield
        class="shaped-outlined"
        variant="outlined"
        bind:value={resourceGroupName}
        label="Resource Group Name"
      >
      </Textfield>
    </div>
    <div>
      <Textfield
        class="shaped-outlined"
        variant="outlined"
        bind:value={clusterName}
        label="Cluster Name"
      >
      </Textfield>
    </div>
    <div>
      <Textfield
        class="shaped-outlined"
        variant="outlined"
        bind:value={nodePoolName}
        label="Node Pool Name"
      >
      </Textfield>
    </div>
  </div>
  <button on:click={startNodePool} disabled={startLoading || stopLoading}>
    {startLoading ? 'Starting...' : 'Start Node Pool'}
  </button>
  <button on:click={stopNodePool} disabled={startLoading || stopLoading}>
    {stopLoading ? 'Stopping...' : 'Stop Node Pool'}
  </button>
  {#if message}
    <p>{message}</p>
  {/if}
	<h1>

	<!-- <h2>
		try editing <strong>src/routes/+page.svelte</strong>
	</h2> -->

	<!-- <Counter /> -->
</section>

<style>
  *
    :global(
      .shaped-outlined .mdc-notched-outline .mdc-notched-outline__leading
    ) {
    border-radius: 28px 0 0 28px;
    width: 28px;
  }
  *
    :global(
      .shaped-outlined .mdc-notched-outline .mdc-notched-outline__trailing
    ) {
    border-radius: 0 28px 28px 0;
  }
  * :global(.shaped-outlined .mdc-notched-outline .mdc-notched-outline__notch) {
    max-width: calc(100% - 28px * 2);
  }
  *
    :global(
      .shaped-outlined.mdc-text-field--with-leading-icon:not(
          .mdc-text-field--label-floating
        )
        .mdc-floating-label
    ) {
    left: 16px;
  }
  * :global(.shaped-outlined + .mdc-text-field-helper-line) {
    padding-left: 32px;
    padding-right: 28px;
  }
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
	/* main {
    text-align: center;
    padding: 2em;
  } */
  button {
    margin: 1em;
    padding: 1em;
    font-size: 1em;
  }
	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
