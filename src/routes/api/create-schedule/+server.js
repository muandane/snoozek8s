// @ts-nocheck
import { json } from '@sveltejs/kit';
import cron from 'node-cron';
import { ContainerServiceClient } from '@azure/arm-containerservice';
import { DefaultAzureCredential } from '@azure/identity';

// Function to start a node pool
async function startNodePool(resourceGroupName, clusterName, nodePoolName) {

	const credential = new DefaultAzureCredential();
	const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;

	// @ts-ignore
	const client = new ContainerServiceClient(credential, subscriptionId);

	try {
		const nodePool = await client.agentPools.get(resourceGroupName, clusterName, nodePoolName);

		const updatedNodePool = {
			...nodePool,
			powerState: {
				code: 'Running'
			}
		};

		await client.agentPools.beginCreateOrUpdateAndWait(
			resourceGroupName,
			clusterName,
			nodePoolName,
			updatedNodePool
		);
		console.log(
			`Node pool '${nodePoolName}' in cluster '${clusterName}' (resource group '${resourceGroupName}') started successfully.`
		);
		return json({ message: 'Node pool started successfully' });
	} catch (error) {
		console.error('Error starting node pool:', error);
		// @ts-ignore
		const errorMessage = error.body?.error?.message || error.message;
		// @ts-ignore
		const errorCode = error.body?.error?.code || 'UnknownError';
		return json(
			{ message: `Error starting node pool: ${errorMessage}`, code: errorCode },
			{ status: 500 }
		);
	}
}

// Function to stop a node pool
async function stopNodePool(resourceGroupName, clusterName, nodePoolName) {

	const credential = new DefaultAzureCredential();
	const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;

	// @ts-ignore
	const client = new ContainerServiceClient(credential, subscriptionId);

	try {
		const nodePool = await client.agentPools.get(resourceGroupName, clusterName, nodePoolName);

		const updatedNodePool = {
			...nodePool,
			powerState: {
				code: 'Stopped'
			}
		};

		await client.agentPools.beginCreateOrUpdateAndWait(
			resourceGroupName,
			clusterName,
			nodePoolName,
			updatedNodePool
		);

		console.log(
			`Node pool '${nodePoolName}' in cluster '${clusterName}' (resource group '${resourceGroupName}') stopped successfully.`
		);
		return json({ message: 'Node pool stopped successfully' });
	} catch (error) {
		console.error('Error stopping node pool:', error);
		// @ts-ignore
		const errorMessage = error.body?.error?.message || error.message;
		// @ts-ignore
		const errorCode = error.body?.error?.code || 'UnknownError';
		console.error(`Error details: Code - ${errorCode}, Message - ${errorMessage}`);
		return json(
			{ message: `Error stopping node pool: ${errorMessage}`, code: errorCode },
			{ status: 500 }
		);
	}
}

// Function to create a schedule
export async function POST({ request }) {
	try {
		const { resourceGroupName, clusterName, nodePoolName, startSchedule, stopSchedule } = await request.json();
		
		// Schedule the start task
		cron.schedule(startSchedule, async () => {
			await startNodePool(resourceGroupName, clusterName, nodePoolName);
			console.log('Scheduled start task completed.');
		}, {
			scheduled: true,
			timezone: "Africa/Algiers" // Adjust the timezone as needed
		});

		// Schedule the stop task
		cron.schedule(stopSchedule, async () => {
			await stopNodePool(resourceGroupName, clusterName, nodePoolName);
			console.log('Scheduled stop task completed.');
		}, {
			scheduled: true,
			timezone: "Africa/Algiers" // Adjust the timezone as needed
		});

		return json({ message: 'Schedules created successfully' });

	} catch (error) {
		console.error('Error creating schedules:', error);
		return json(
			{ message: `Error creating schedules: ${error.message}`, code: 'ScheduleCreationError' },
			{ status: 500 }
		);
	}
}