interface SubscriptionRequestDto {
    name: string;
    email: string;
    invitedBySubscriberId: string | null;
}

export default SubscriptionRequestDto;