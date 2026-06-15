import db from '../models/db/index.js';
import {recommendations} from '../models/db/schema.js';
import {eq} from 'drizzle-orm';

export const migrateGuestToUser = async (guestId, userId) =>{
    try {
        if (!guestId){
            return;
        }

        await db.transaction(async (tx) => {
            await tx.update(recommendations)
                .set({ userId: userId, guestId: null })
                .where(eq(recommendations.guestId, guestId));
        });
        return { message: 'Guest data successfully migrated to user account' };
    } catch (error) {
        console.error('Error migrating guest data to user account:', error);
        return { message: 'Internal server error' };
    }
}