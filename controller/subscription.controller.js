import Subscription from '../models/subscription.model.js';



export const createSubscription = async (req, res, next) => {
    try {

        const subscription = await Subscription.create({ ... 
            req.body,
            user: req.user._id,
        });

        await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subcription/reminder`,
            body,
            headers,
            workflowRunId,
            retries
        });

        res.status(201).json({ success: true, data: subscription });

    } catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        // check if user is same one as loged in by token
        if (!req.user.id !== req.params.id) {
            const error = new Error('Your arent the owner of this account.');
            error.statusCode = 401;
            throw error;            
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
}
