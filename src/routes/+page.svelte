<script>
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
  import { onMount } from 'svelte';
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

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
  <div class="card-container">
    <Card.Root class="w-[350px]">
      <Card.Header>
        <Card.Title>Manage Cluster</Card.Title>
        <Card.Description>Manage your clusters nodepool in one-click.</Card.Description>
      </Card.Header>
      <Card.Content>
        <form>
          <div class="grid w-full items-center gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="resourceGroupName">Resource Group Name</Label>
              <Input id="resourceGroupName" bind:value={resourceGroupName} placeholder="Name of the AKS cluster resource group" />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="clusterName">Cluster Name</Label>
              <Input id="clusterName" bind:value={clusterName} placeholder="Name of the AKS cluster" />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="nodePoolName">NodePool Name</Label>
              <Input id="nodePoolName" bind:value={nodePoolName} placeholder="Name of the AKS cluster nodepool" />
            </div>
          </div>
        </form>
      </Card.Content>
      <Card.Footer class="flex justify-between">
        <Button variant="outline" on:click={startNodePool} disabled={startLoading || stopLoading}>
          {startLoading ? 'Starting...' : 'Start Node Pool'}
        </Button>

        <Button variant="destructive" on:click={stopNodePool} disabled={startLoading || stopLoading}>
          {stopLoading ? 'Stopping...' : 'Stop Node Pool'}
        </Button>
      </Card.Footer>
    </Card.Root>
  </div>
  {#if message}
    <p>{message}</p>
  {/if}
</section>

<style>
  section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
