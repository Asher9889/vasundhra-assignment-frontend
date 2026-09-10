const apiEndPoints = {
    auth: {
        login: {
            url: '/auth/login',
            method: 'POST'
        },
        me: {
            url: "/auth/me",
            method: "GET"
        },
        logout: {
            url: "/auth/logout",
            method: "POST"
        },

    },
    users: {
        list: {
            url: "/users",
            method: "GET"
        },
        create: {
            url: "/users",
            method: "POST"
        },
        updateStatus: (id: string) => ({
            url: `/users/${id}/status`,
            method: "PATCH"
        }),
    },
    datasets: {
        upload: {
            url: "/datasets",
            method: "POST"
        },
    },
}    

export default apiEndPoints;