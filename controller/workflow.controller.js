import { createRequire } from 'module'
import dayjs from 'dayjs';
import Subscription from '../models/subscription.model.js';

const require = createRequire(import.meta.url)

const { serve } = require ('@upstash/workflow/express')

const REMINDERS = [7, 5, 2, 1]


export const sendReminders = serve (async (context) => {
    
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== 'active') return;
    
    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription, ${subscriptionId}, Stopping workflow.`);
        return;
    }
    
    for(const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'days');

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }
        
        await triggerReminder(context, `Reminder ${daysBefore} dats before`);
    }   

});

const fetchSubscription = async (context, subscriptionId) => {

    return await context.run('get subscription', async () => {

        return Subscription.findById(subscriptionId).populate('user','name email');       
    });
}

const sleepUntilReminder = async (context, label, date) => {

    console.log(`Sleeping until ${label} at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label) => {

    return await context.run(label, () => {

        console.log(`Triggered ${label} reminder`);
        //send email, sms, push, etc.

    });
}