import { json } from '@sveltejs/kit';
import { ContainerServiceClient } from '@azure/arm-containerservice';
import { DefaultAzureCredential } from '@azure/identity';

export async function POST({ request }) {
  const { resourceGroupName, clusterName, nodePoolName } = await request.json();

  const credential = new DefaultAzureCredential();
  const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;

  const client = new ContainerServiceClient(credential, subscriptionId);

  try {
    const nodePool = await client.agentPools.get(resourceGroupName, clusterName, nodePoolName);
    await client.agentPools.beginCreateOrUpdateAndWait(resourceGroupName, clusterName, nodePoolName, nodePool);
    return json({ message: 'Node pool started successfully' });
  } catch (error) {
    console.error('Error starting node pool:', error);
    const errorMessage = error.body?.error?.message || error.message;
    const errorCode = error.body?.error?.code || 'UnknownError';
    return json({ message: `Error starting node pool: ${errorMessage}`, code: errorCode }, { status: 500 });
  }
}
