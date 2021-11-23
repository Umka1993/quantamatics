export default function pendoInitialize(user) {
    if (pendo) {
        pendo.initialize({
            visitor: {
                    id: user.id,
                    name: user.firstName,
                    surname: user.lastName,
                    email: user.email,
                },
            });
    }
}
