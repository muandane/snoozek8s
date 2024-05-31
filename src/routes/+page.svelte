<script>
	import { onMount } from 'svelte';
	import Clock from './Clock.svelte';
	import TimezoneClock from './TimeZoneClock.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Popover from '$lib/components/ui/popover';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	// biome-ignore lint/style/useConst: <explanation>
	let resourceGroupName = import.meta.env.VITE_AZURE_RESOURCE_GROUP || '';
	// biome-ignore lint/style/useConst: <explanation>
	let clusterName = import.meta.env.VITE_AZURE_CLUSTER_NAME || '';
	// biome-ignore lint/style/useConst: <explanation>
	let nodePoolName = import.meta.env.VITE_AZURE_NODE_POOL_NAME || '';
	// biome-ignore lint/style/useConst: <explanation>
	let startSchedule = import.meta.env.VITE_AZURE_NODE_POOL_NAME || '';
	// biome-ignore lint/style/useConst: <explanation>
	let stopSchedule = import.meta.env.VITE_AZURE_NODE_POOL_NAME || '';

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
	const createSchedule = async () => {
    try {
        const response = await fetch('/api/create-schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                resourceGroupName,
                clusterName,
                nodePoolName,
                startSchedule,
                stopSchedule
            })
        });

        const result = await response.json();

        if (response.ok) {
            message = result.message;
        } else {
            console.error('Error creating schedule:', result);
            message = `Error: ${result.message} (Code: ${result.code})`;
        }
    } catch (error) {
        console.error('Unexpected error creating schedule:', error);
        message = 'Unexpected error creating schedule';
    }
	};

</script>

<!-- <svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head> -->

<section>
	<h1>Manage Node Pool</h1>
	<Clock />
	<TimezoneClock timezone="Africa/Algiers" />
	<div class="card-container">
		<Tabs.Root value="manual" class="w-[400px]">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="manual">Manual</Tabs.Trigger>
				<Tabs.Trigger value="cron">Cron</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="manual">
				<Card.Root>
					<Card.Header>
						<Card.Title>Manual Management</Card.Title>
						<Card.Description>Manage your clusters nodepool in one-click.</Card.Description>
					</Card.Header>
					<Card.Content>
						<form>
							<div class="grid w-full items-center gap-4">
								<div class="flex flex-col space-y-1.5">
									<Label for="resourceGroupName">Resource Group Name</Label>
									<Input
										id="resourceGroupName"
										bind:value={resourceGroupName}
										placeholder="Name of the AKS cluster resource group"
									/>
								</div>
								<div class="flex flex-col space-y-1.5">
									<Label for="clusterName">Cluster Name</Label>
									<Input
										id="clusterName"
										bind:value={clusterName}
										placeholder="Name of the AKS cluster"
									/>
								</div>
								<div class="flex flex-col space-y-1.5">
									<Label for="nodePoolName">NodePool Name</Label>
									<Input
										id="nodePoolName"
										bind:value={nodePoolName}
										placeholder="Name of the AKS cluster nodepool"
									/>
								</div>
							</div>
						</form>
					</Card.Content>
					<Card.Footer class="flex justify-between">
						<Button
							variant="outline"
							on:click={startNodePool}
							disabled={startLoading || stopLoading}
						>
							{startLoading ? 'Starting...' : 'Start Node Pool'}
						</Button>
						<Button
							variant="destructive"
							on:click={stopNodePool}
							disabled={startLoading || stopLoading}
						>
							{stopLoading ? 'Stopping...' : 'Stop Node Pool'}
						</Button>
					</Card.Footer>
				</Card.Root>
			</Tabs.Content>
			<Tabs.Content value="cron">
				<Card.Root>
					<Card.Header>
						<Card.Title>Cron Managed Clusters</Card.Title>
						<Card.Description>
							Create a Cron schedule to manage your clusters nodepool in one-click.
						</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-2">
						<form>
							<div class="grid w-full items-center gap-4">
								<div class="flex flex-col space-y-1.5">
									<Label for="resourceGroupName">Resource Group Name</Label>
									<Input
										id="resourceGroupName"
										bind:value={resourceGroupName}
										placeholder="Name of the AKS cluster resource group"
									/>
								</div>
								<div class="flex flex-col space-y-1.5">
									<Label for="clusterName">Cluster Name</Label>
									<Input
										id="clusterName"
										bind:value={clusterName}
										placeholder="Name of the AKS cluster"
									/>
								</div>
								<div class="flex flex-col space-y-1.5">
									<Label for="nodePoolName">NodePool Name</Label>
									<Input
										id="nodePoolName"
										bind:value={nodePoolName}
										placeholder="Name of the AKS cluster nodepool"
									/>
								</div>
							</div>
						</form>
						<Popover.Root>
							<Popover.Trigger asChild let:builder>
								<Button builders={[builder]} variant="outline">Set Cron</Button>
							</Popover.Trigger>
							<Popover.Content class="w-80">
								<div class="grid gap-4">
									<div class="space-y-2">
										<h4 class="font-medium leading-none">Cron Timer</h4>
										<p class="text-sm text-muted-foreground">
											Set the Cron schedule for Starting and Stopping the clusters
										</p>
									</div>
									<div class="grid gap-2">
										<div class="grid grid-cols-3 items-center gap-4">
											<Label for="startSchedule">Starting Schedule</Label>
											<Input
												id="startSchedule"
												bind:value={startSchedule}
												placeholder="45 6 * * 1-5"
												class="col-span-2 h-8"
											/>
										</div>
										<div class="grid grid-cols-3 items-center gap-4">
											<Label for="stopSchedule">Stopping Schedule</Label>
											<Input
												id="stopSchedule"
												bind:value={stopSchedule}
												placeholder="5 19 * * 1-5"
												class="col-span-2 h-8"
											/>
										</div>
									</div>
								</div>
							</Popover.Content>
						</Popover.Root>
					</Card.Content>
					<Card.Footer>
						<Button on:click={createSchedule} disabled={startLoading || stopLoading}>
							{stopLoading ? 'Creating the Schedule...' : 'Create Schedule'}
						</Button>
					</Card.Footer>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
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
