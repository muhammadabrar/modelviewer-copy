import axios from "axios";

const Instance = axios.create({
    // baseURL: "http://localhost:4000/api/v1/",
    baseURL : process.env.Backend
})


const getModelByQuery = async (id) => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        const res = await Instance({
            url: `model/query/${id}`,
            method: "GET",
        })
        resolved.data = res.data
        // console.log(res);
    } catch (err) {
        if (err?.response?.data?.message) {
            resolved.error = err.response.data.message
        } else {
            resolved.error = "SomeThing Went Wrong"
        }
    }
    return resolved
}

const GetDemoModel = async (id) => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        const res = await Instance({
            url: `tasks/viewer/${id}`,
            method: "GET",
        })
        resolved.data = res.data
        // console.log(res);
    } catch (err) {
        if (err?.response?.data?.message) {
            resolved.error = err.response.data.message
        } else {
            resolved.error = "SomeThing Went Wrong"
        }
    }
    return resolved
}

const GetSampleModel = async (id) => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        const res = await Instance({
            url: `model/sample/${id}`,
            method: "GET",
        })
        resolved.data = res.data
        // console.log(res);
    } catch (err) {
        if (err?.response?.data?.message) {
            resolved.error = err.response.data.message
        } else {
            resolved.error = "SomeThing Went Wrong"
        }
    }
    return resolved
}

export { getModelByQuery, GetDemoModel, GetSampleModel }