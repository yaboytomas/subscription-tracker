import Subscription from '../models/subscription.model.js';
import { workflowClient } from '../config/upstash.js';
import { SERVER_URL } from '../config/env.js';

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        const body = {
            subscriptionId: subscription._id,
        };

        const headers = {
            'Content-Type': 'application/json',
        };

        await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body,
            headers,
            // Define workflowRunId and retries if needed
            // workflowRunId: 'your-workflow-run-id', // Replace with actual workflowRunId if needed
            // retries: 3, // Replace with actual retries if needed
        });

        res.status(201).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
};

export const getUserSubscriptions = async (req, res, next) => {
    try {
        // check if user is same one as logged in by token
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account.');
            error.statusCode = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
};