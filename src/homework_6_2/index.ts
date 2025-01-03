type CreateUserAction = {
    type: 'CREATE_USER';
    payload: {
        name: string;
        age: number;
    };
};

type DeleteUserAction = {
    type: 'DELETE_USER';
    payload: {
        userId: number;
    };
};

type UpdateUserAction = {
    type: 'UPDATE_USER';
    payload: {
        userId: number;
        name?: string;
        age?: number;
    };
};

type BlockUserAction = {
    type: 'BLOCK_USER';
    payload: {
        userId: number;
        reason: string;
    };
};

type Action =
    | CreateUserAction
    | DeleteUserAction
    | UpdateUserAction
    | BlockUserAction;

function handleAction(action: Action): void {
    switch (action.type) {
        case 'CREATE_USER':
            console.log(
                `Creating new user: ${action.payload.name}, age: ${action.payload.age}`
            );
            break;

        case 'DELETE_USER':
            console.log(
                `User with ID ${action.payload.userId} has been deleted`
            );
            break;

        case 'UPDATE_USER':
            const updates: string[] = [];
            if (action.payload.name !== undefined) {
                updates.push(`name to "${action.payload.name}"`);
            }
            if (action.payload.age !== undefined) {
                updates.push(`age to ${action.payload.age}`);
            }

            console.log(
                `Updating user ${action.payload.userId}: ${
                    updates.length > 0
                        ? updates.join(" and ")
                        : "no fields updated"
                }`
            );
            break;

        case 'BLOCK_USER':
            console.log(
                `User ${action.payload.userId} has been blocked. Reason: ${action.payload.reason}`
            );
            break;

        default:
            const exhaustiveCheck = (action: never): never => {
                throw new Error(`Unhandled action type: ${(action as Action).type}`);
            };
            return exhaustiveCheck(action);
    }
}

function demonstrateActions() {
    const createAction: Action = {
        type: 'CREATE_USER',
        payload: {
            name: 'John Doe',
            age: 25
        }
    };
    handleAction(createAction);

    const updateAction: Action = {
        type: 'UPDATE_USER',
        payload: {
            userId: 1,
            name: 'John Smith'
        }
    };
    handleAction(updateAction);

    const updateAgeAction: Action = {
        type: 'UPDATE_USER',
        payload: {
            userId: 1,
            age: 26
        }
    };
    handleAction(updateAgeAction);

    const deleteAction: Action = {
        type: 'DELETE_USER',
        payload: {
            userId: 1
        }
    };
    handleAction(deleteAction);

    const blockAction: Action = {
        type: 'BLOCK_USER',
        payload: {
            userId: 2,
            reason: 'Violation of terms of service'
        }
    };
    handleAction(blockAction);
}

demonstrateActions();
