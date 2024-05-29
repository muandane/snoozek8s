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
        code: "Stopped"
      }
    };

    await client.agentPools.beginCreateOrUpdateAndWait(resourceGroupName, clusterName, nodePoolName, updatedNodePool);

    console.log(`Node pool '${nodePoolName}' in cluster '${clusterName}' (resource group '${resourceGroupName}') stopped successfully.`);
    return json({ message: 'Node pool stopped successfully' });
  } catch (error) {
    console.error('Error stopping node pool:', error);
    // @ts-ignore
    const errorMessage = error.body?.error?.message || error.message;
    // @ts-ignore
    const errorCode = error.body?.error?.code || 'UnknownError';
    console.error(`Error details: Code - ${errorCode}, Message - ${errorMessage}`);
    return json({ message: `Error stopping node pool: ${errorMessage}`, code: errorCode }, { status: 500 });
  }
}
