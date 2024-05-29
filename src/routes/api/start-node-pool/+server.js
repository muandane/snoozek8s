import { json } from '@sveltejs/kit';
import { ContainerServiceClient } from '@azure/arm-containerservice';
import { DefaultAzureCredential } from '@azure/identity';

// @ts-ignore
export async function POST({ request }) {
  const { resourceGroupName, clusterName, nodePoolName } = await request.json();

  const credential = new DefaultAzureCredential();
  const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;

  // @ts-ignore
  const client = new ContainerServiceClient(credential, subscriptionId);

  try {
    const nodePool = await client.agentPools.get(resourceGroupName, clusterName, nodePoolName);

    const updatedNodePool = {
      ...nodePool,
      powerState: {
        code: "Running"
      }
    };

    await client.agentPools.beginCreateOrUpdateAndWait(resourceGroupName, clusterName, nodePoolName, updatedNodePool);

    return json({ message: 'Node pool started successfully' });
  } catch (error) {
    console.error('Error starting node pool:', error);
    // @ts-ignore
    const errorMessage = error.body?.error?.message || error.message;
    // @ts-ignore
    const errorCode = error.body?.error?.code || 'UnknownError';
    return json({ message: `Error starting node pool: ${errorMessage}`, code: errorCode }, { status: 500 });
  }
}
