import axios from 'axios';

export const trackClick = async (entityType, entityId) => {
    try {
        const response = await axios.post(
            'https://kyldp9nld9.execute-api.us-east-1.amazonaws.com/dev/clicks',
            {
                entity_type: entityType,
                entity_id: entityId,
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );

        console.log(response.data.message);
    } catch (error) {
        console.error('Error recording click:', error);
    }
};
