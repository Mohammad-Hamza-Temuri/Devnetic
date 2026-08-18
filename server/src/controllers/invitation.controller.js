import { createInvitationService, respondToInvitationService, getMyInvitationService } from "../services/invitation.service.js";


export async function createInvitation(req, res, next){
    try {
        const userId = req.userId;
        const projectId = req.params.id;
        const invitedUserId = req.body.invitedUserId;

        const invitation = await createInvitationService(projectId, userId, invitedUserId);
        res.status(201).json(invitation);

    } catch (error) {
        next(error);
    }
};

export async function respondToInvitation(req, res, next){
    try {
        const incomingInviteId = req.params.id;
        const userId = req.userId;

        const { status } = req.body;
        const incomingInvite = await respondToInvitationService(incomingInviteId, userId, status);

        res.json(incomingInvite);
        
    } catch (error) {
        next(error);
    }
};


export async function getMyInvitation(req, res, next){
    try {
        const invitedUserId = req.userId;
        const invitationDoc = await getMyInvitationService(invitedUserId);

        res.json(invitationDoc);
    } catch (error) {
        next(error)
    }
}