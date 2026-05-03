import { retrieveCertainUsers } from "./users.repository.js";


export const retrieveRefundedUsers = async () => {
    try {
        return await retrieveCertainUsers('refunded');
    } catch (error) {
        console.log("Error happened in retrieveRefundedUsers query");
        console.error(error);
    }
}

export const retrievePendingUsers = async () => {
    try {
        return await retrieveCertainUsers('pending');
    } catch (error) {
        console.log("Error happened in retrievePendingUsers query");
        console.error(error);
    }
}

export const retrievePaidUsers = async () => {
    try {
        return await retrieveCertainUsers('paid');
    } catch (error) {
        console.log("Error happened in retrievePaidUsers query");
        console.error(error);
    }
}

export const retrievePaidUsersWithCreditCard = async () => {
    try {
        return await retrieveCertainUsers('paid', 'credit_card');
    } catch (error) {
        console.log("Error happened in retrievePaidUsersWithCreditCard query");
        console.error(error);
    }
}

export const retrievePaidUsersWithCash = async () => {
    try {
        return await retrieveCertainUsers('paid', 'cash');
    } catch (error) {
        console.log("Error happened in retrievePaidUsersWithCash query");
        console.error(error);
    }
}

