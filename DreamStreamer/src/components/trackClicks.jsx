
export const trackClick = async (entityType, entityId) => {
    try {
        const response = await fetch(
            'https://kyldp9nld9.execute-api.us-east-1.amazonaws.com/dev/clicks',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entity_type: entityType, entity_id: entityId }),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to record click');
        }

        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error('Error recording click:', error);
    }
};
