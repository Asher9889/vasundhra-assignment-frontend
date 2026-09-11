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
        forgotPassword: {
            url: "/auth/forgot-password",
            method: "POST"
        },
        resetPassword: {
            url: "/auth/reset-password",
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
        list: {
            url: "/datasets",
            method: "GET"
        },
        detail: (id: string) => ({
            url: `/datasets/${id}`,
            method: "GET"
        }),
        publicList: {
            url: "/datasets/public",
            method: "GET"
        },
        publicDetail: (id: string) => ({
            url: `/datasets/public/${id}`,
            method: "GET"
        }),
        upload: {
            url: "/datasets/upload",
            method: "POST"
        },
        create: {
            url: "/datasets",
            method: "POST"
        },
        updateStatus: (id: string) => ({
            url: `/datasets/${id}/status`,
            method: "PATCH"
        }),
        update: (id: string) => ({
            url: `/datasets/${id}`,
            method: "PATCH"
        }),
    },
}    

export default apiEndPoints;